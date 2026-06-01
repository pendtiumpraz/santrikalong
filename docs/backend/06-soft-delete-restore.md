# 06 — Soft Delete, Restore & Retensi (Final)

> Status: **FINAL** · 2026-06-01 · Owner: Database & Security Engineer
> Melengkapi gap yang belum dibahas proposal rekan. Berlaku untuk entitas konten & user; **bukan** untuk ledger/log immutable.

## 1. Pola dasar

- Kolom **`deletedAt DateTime?`** (null = aktif) + opsional `deletedBy String?`.
- **Soft delete** = `UPDATE ... SET deletedAt=now, deletedBy=actor`. **Restore** = `SET deletedAt=NULL`.
- Berlaku untuk: `User, Course, Module, Lesson, LessonAsset, Category, Quiz, Question, DaurohEvent, Coupon, Enrollment, Role` (entitas yang bisa "dipulihkan").
- **TIDAK soft-delete (append-only / immutable):** `AuditLog, PaymentLog, OutboxEvent, Earning, PayoutRequest, TaxWithholdingRecord, AiUsageLog, Invoice`. Catatan finansial & jejak audit tidak boleh hilang/diubah.

## 2. Query default (Prisma)

- Gunakan **Prisma Client Extension** (`$allModels.findMany` dll) yang otomatis menambah `where: { deletedAt: null }` untuk model ber-soft-delete. Hindari lupa filter di tiap query.
- Sediakan **bypass eksplisit** `prismaRaw` / flag `includeDeleted: true` untuk panel admin (lihat trash, restore, audit).
- Relasi: saat memuat relasi, filter soft-deleted juga (mis. `Course.modules` hanya yang `deletedAt=null`).

## 3. Dampak ke UNIQUE constraint (penting)

Soft delete merusak unik biasa (baris "terhapus" masih menempati slug/email). Solusi (PostgreSQL):
- **Partial unique index**: `CREATE UNIQUE INDEX ... ON "Course"(tenantId, slug) WHERE deleted_at IS NULL;`. Slug bebas dipakai ulang setelah delete.
- Sudah dipatok di `01-erd.md` untuk: `User.email/phone`, `Course.slug`, `Category.slug`, `DaurohEvent.slug`, `Coupon.code`, `Role.name`, `Enrollment(userId,courseId)`.
- Alternatif jika tak mau partial index: kolom komposit (`slug + deletedAt`), tapi partial index lebih bersih.

## 4. Dampak ke relasi & cascade

- **Soft delete tidak cascade otomatis.** Pilih kebijakan per relasi:
  - Hapus `Course` → soft-delete `Module`/`Lesson` turunannya **dalam satu transaksi** (cascade manual) agar konsisten.
  - `Enrollment` ke `Course` yang terhapus → tetap tampil di riwayat user (jangan ikut hilang), tapi akses materi diblokir karena lesson terhapus.
- **Hard FK tetap utuh**: jangan hapus baris terkait di DB; hanya tandai. FK constraint tetap valid.
- **Akses konten**: signed-URL handler (03 §2) menolak aset yang `deletedAt != null`.

## 5. Restore

- `restore(entity, id)` (perm admin, tulis AuditLog): set `deletedAt=NULL`. 
- **Cek konflik unik saat restore**: jika slug/email sudah dipakai entitas aktif lain → tolak dengan `CONFLICT`, minta rename dulu.
- Restore parent → tawarkan restore turunan (cascade restore opsional, eksplisit).

## 6. Retensi & hard-delete terjadwal

- **Window retensi default 90 hari** (configurable) di status soft-deleted → masih bisa restore.
- **Cron hard-delete** (`/api/cron/v1/purge-soft-deleted`): hapus permanen baris `deletedAt < now-90d` + objek storage terkait (R2/S3) dalam batch. Tulis ringkasan ke AuditLog.
- **Pengecualian hukum/finansial**: baris yang tertaut transaksi (Order/Earning) tidak di-hard-delete walau parent konten dihapus — pertahankan integritas pelaporan pajak.
- **GDPR/hak hapus user**: `deleteUser` = anonimisasi PII (nama/email/phone/avatar → null/hash) + soft delete + revoke Session, **bukan** hapus baris Order/Earning (anonim tapi tetap ada untuk audit). `User.status=DELETED`.

## 7. Audit

- Setiap soft-delete, restore, hard-delete dicatat di `AuditLog` (`action`, `targetType/Id`, `actor`, `meta`). Hard-delete terjadwal dicatat agregat (jumlah + rentang).

## 8. Checklist implementasi
- [ ] Tambah `deletedAt` (+`deletedBy`) ke model ber-soft-delete; jangan ke ledger/log.
- [ ] Ganti semua UNIQUE jadi **partial unique** `WHERE deleted_at IS NULL`.
- [ ] Prisma extension auto-filter `deletedAt: null` + bypass admin.
- [ ] Cascade manual soft-delete dalam transaksi.
- [ ] Restore cek konflik unik.
- [ ] Cron purge 90 hari + hapus storage, kecuali baris finansial.
- [ ] deleteUser = anonimisasi PII + soft delete, pertahankan record finansial.
