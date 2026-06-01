# Urutan Pengembangan Modul — santrikalong.com

> Status: DRAFT · 2026-06-01

LMS berbasis **Next.js App Router + TypeScript + Tailwind + PostgreSQL/Prisma + Auth.js**.

## Aturan Emas

1. **Modul hilir tidak dibangun sebelum service publik modul hulu stabil.** Komunikasi lintas-modul HANYA lewat *service publik* (mis. `enrollment.enroll()`), **bukan** repository/Prisma client internal modul lain.
2. **Kolom defensif sejak hari-0** di semua model: `tenantId?` (multi-tenant ready), `deletedAt` (soft delete), `permVersion` (invalidasi cache RBAC).
3. **Append-only untuk jejak audit/uang/consent**: `ConsentRecord`, `PaymentLog`, `WalletEntry`, `WithholdingRecord` tidak pernah di-UPDATE/DELETE.
4. **Idempotency wajib** di semua titik integrasi eksternal (webhook, payout, AI).
5. Setiap aksi auth → `getAuthContext()`. Setiap CRUD → `requirePermission()`.

---

## Diagram Dependensi

```mermaid
graph TD
  subgraph L0["LAPIS 0 · Platform"]
    M1[1. Infra + Prisma Schema]
    M2[2. Identity / Auth]
    M3[3. RBAC]
  end
  subgraph L1["LAPIS 1 · Konten & Akses (MVP)"]
    M4[4. Consent]
    M5[5. Approval Ustadz]
    M6[6. Catalog]
    M7[7. Media]
    M8[8. Enrollment]
  end
  subgraph L2["LAPIS 2 · Uang"]
    M9[9. Payment]
    M10[10. Assessment]
  end
  subgraph L3["LAPIS 3 · Live (F2)"]
    M11[11. Live]
  end
  subgraph L4["LAPIS 4 · Skala (F3)"]
    M12[12. Payroll + Anti-Fraud]
    M13[13. Pelengkap]
  end
  AI[[AI · lintas-modul, async, budget]]

  M1 --> M2 --> M3
  M3 --> M4 & M5 & M6 & M8
  M4 --> M5
  M5 --> M6
  M6 --> M7
  M6 --> M8
  M7 --> M8
  M8 --> M9
  M9 -. order.paid .-> M8
  M3 --> M10
  M6 & M8 & M7 --> M11
  M9 == OutboxEvent (async) ==> M12
  M3 --> M13
  M6 & M10 -.-> AI
  M11 -.-> AI
```

**Urutan kritis:** `1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9` (10 paralel) `→ 11 → 12 → 13`. AI menyilang, bukan jalur kritis.

---

## LAPIS 0 — Platform

Fondasi yang tidak boleh berubah belakangan. Semua lapis di atasnya menumpu di sini.

### 1. Infra + Skema Prisma

- **Depends-on:** — (akar).
- **Alasan urutan:** Schema dan kolom defensif harus benar sejak awal; migrasi kolom `tenantId`/`deletedAt`/`permVersion` di tabel besar belakangan itu mahal dan berisiko.
- **Cakupan:** Setup repo, CI, env, koneksi PostgreSQL, Prisma init. Konvensi base model: `id`, `tenantId?`, `createdAt`, `updatedAt`, `deletedAt?`. Helper query global yang otomatis memfilter `deletedAt IS NULL`.
- **Selesai berarti:** `prisma migrate dev` jalan; base schema + kolom defensif ter-commit; CI hijau; seed minimal jalan; query helper soft-delete tersedia.

### 2. Identity / Auth

- **Depends-on:** (1).
- **Alasan urutan:** Semua aksi butuh `getAuthContext()`; tidak ada modul yang bisa otorisasi tanpa identitas.
- **Cakupan:** Model `User`, `Session` (DB-backed, **revocable**), `Account`, `VerificationToken`, `TwoFactor`. Auth.js dengan strategi session di DB (bukan JWT murni) agar bisa revoke. Verifikasi email + 2FA opsional. Fungsi `getAuthContext()` (user + session + tenant) dipakai semua server action/route handler.
- **Selesai berarti:** Register/login/logout/verify-email jalan; session bisa di-revoke dari DB; 2FA enroll & challenge jalan; `getAuthContext()` stabil dan ter-dokumentasi sebagai service publik.

### 3. RBAC

- **Depends-on:** (1), (2).
- **Alasan urutan:** Semua CRUD butuh `requirePermission()`; harus ada sebelum modul apa pun menulis data.
- **Cakupan:** Model `Role`, `Permission`, `UserRole`. `requirePermission(ctx, perm)`. Cache permission `perm:user:{id}` divalidasi dengan `permVersion` (bump `permVersion` user → cache invalid). Seed role inti: `superadmin`, `admin`, `ustadz`, `student`.
- **Selesai berarti:** `requirePermission()` enforce di server side; cache hit + invalidasi via `permVersion` terbukti; matriks role-permission seed tersedia; helper teruji.

---

## LAPIS 1 — Konten & Akses (MVP)

Inti produk: ustadz bisa publish materi, santri bisa akses.

### 4. Consent

- **Depends-on:** (3).
- **Alasan urutan:** Hidup **bareng registrasi**; `teacher_agreement` adalah **prasyarat** approval ustadz (5), jadi harus ada lebih dulu.
- **Cakupan:** `ConsentDefinition` (versi + tipe: ToS, privacy, `teacher_agreement`) dan `ConsentRecord` (**append-only**, simpan versi + timestamp + IP). Hook saat registrasi dan saat aksi yang butuh consent baru.
- **Selesai berarti:** Definisi consent berversi; pencatatan consent append-only saat register; query "apakah user X sudah setuju definisi Y versi Z" tersedia sebagai service publik.

### 5. Approval Ustadz

- **Depends-on:** (3), (4).
- **Alasan urutan:** **Gerbang** `createCourse` — hanya ustadz approved boleh bikin course; butuh `teacher_agreement` dari consent (4).
- **Cakupan:** `UstadzProfile` (status: pending/approved/rejected), service `approveUstadz()`. Cek consent `teacher_agreement` sebelum approve. Admin review flow.
- **Selesai berarti:** Pengajuan → review → approve/reject jalan; `approveUstadz()` menolak tanpa `teacher_agreement`; status approved memberi permission `course:create`.

### 6. Catalog

- **Depends-on:** (3), (5).
- **Alasan urutan:** Wadah konten; `createCourse` butuh ustadz approved (5). Modul media & enrollment menumpu di sini.
- **Cakupan:** `Category`, `Course`, `Module`, `Lesson`. CRUD ber-`requirePermission`. State publish (draft/published). Service publik: `getCourse()`, `listLessons()`, `createCourse()`.
- **Selesai berarti:** Ustadz approved bisa CRUD course→module→lesson; publish/unpublish jalan; service publik catalog stabil & dipakai modul lain.

### 7. Media

- **Depends-on:** (6).
- **Alasan urutan:** Aset menempel pada `Lesson` (6); enrollment (8) butuh tahu ada aset untuk gating akses.
- **Cakupan:** `LessonAsset`. **Presign upload** (langsung ke storage). **Signed-URL on-the-fly** saat playback (TTL pendek, tidak menyimpan URL publik). Provider video: **Mux / Cloudflare Stream** (abstraksi provider). Tidak ada URL aset yang bocor tanpa otorisasi.
- **Selesai berarti:** Upload via presign jalan; signed-URL playback dibuat per-request dan expired; provider video ter-abstraksi; service `getAssetPlaybackUrl(ctx, assetId)` cek akses.

### 8. Enrollment

- **Depends-on:** (6), (7).
- **Alasan urutan:** **Gerbang akses materi**; dipanggil oleh payment (9) saat order lunas. Harus stabil sebelum uang masuk.
- **Cakupan:** `Enrollment`, `LessonProgress`. Service publik `enroll(ctx, userId, courseId)` (idempoten) dan `hasAccess(ctx, userId, lessonId)`. Media (7) memanggil `hasAccess` untuk gating signed-URL. Progress tracking per lesson.
- **Selesai berarti:** `enroll()` idempoten & teruji; gating akses materi enforce lewat `hasAccess()`; progress tersimpan; kontrak service publik siap dipanggil payment.

---

## LAPIS 2 — Uang

Monetisasi. Payment memanggil enrollment; assessment paralel & tidak memblok.

### 9. Payment

- **Depends-on:** (8) (memanggil `enrollment.enroll()`).
- **Alasan urutan:** Tidak boleh ada uang sebelum gating akses (8) stabil; saat `order.paid` harus memberi akses secara andal.
- **Cakupan:**
  - `PaymentGateway` (toggle aktif + kredensial **terenkripsi**).
  - `Order` dengan **state machine compare-and-set** (cegah double-transition).
  - `PaymentLog` **append-only**, **idempotency** `UNIQUE(provider, eventId)`.
  - Webhook handler idempoten → saat `order.paid` panggil `enrollment.enroll()`.
  - `OutboxEvent` (publish `order.paid` untuk konsumen async, mis. payroll).
  - `ManualPaymentProof`, `Invoice`.
  - Cron: expire order kedaluwarsa + rekonsiliasi dengan provider.
  - **MVP provider: Midtrans + Manual.**
- **Selesai berarti:** Checkout→pay→`order.paid`→enroll otomatis jalan end-to-end; webhook idempoten (replay aman); manual proof + invoice jalan; cron expire/reconcile aktif; `OutboxEvent` `order.paid` ter-emit.

### 10. Assessment

- **Depends-on:** (3); (6) untuk relasi ke lesson. **Paralel** dengan (9) — tidak memblok uang.
- **Alasan urutan:** Pelengkap pembelajaran; bisa dikerjakan bersamaan dengan payment karena tak ada dependensi uang.
- **Cakupan:** `Quiz`, `Question`, `Attempt`, `Answer` dengan **auto-grade**. Relasi quiz ke `Lesson`/`Module`.
- **Selesai berarti:** Buat quiz, attempt, submit, auto-grade, lihat skor jalan; tidak ada coupling ke modul payment.

---

## LAPIS 3 — Live (F2)

### 11. Live

- **Depends-on:** (6) catalog, (8) enrollment, (7) media.
- **Alasan urutan:** Sesi live terikat course (6), aksesnya dijaga enrollment (8), rekaman jadi VOD lewat media (7).
- **Cakupan:** `LiveSession`, `LiveAttendance`. Token **ingest** (host) & **playback** (peserta). Rekaman → **VOD** (masuk pipeline media). `DaurohEvent` (acara/kajian). Sertifikat kehadiran.
- **Selesai berarti:** Jadwal sesi → ingest → peserta join (gated enrollment) → absensi tercatat → rekaman jadi VOD → sertifikat terbit.

---

## LAPIS 4 — Skala (F3)

### 12. Payroll + Anti-Fraud

- **Depends-on:** (9) — konsumsi `order.paid` via `OutboxEvent` **async**.
- **Alasan urutan:** Butuh **data transaksi nyata** dulu (tidak ada yang dibayar tanpa order lunas). Dibangun setelah arus uang stabil; konsumsi event async agar tidak memperlambat checkout.
- **Cakupan:**
  - `Wallet` (**optimistic lock**), `WalletEntry` (**ledger append-only**).
  - `Earning` (dihitung dari `order.paid` via Outbox consumer idempoten).
  - `PayoutRequest`: state machine + `idempotencyKey` + status **HOLD** (anti-fraud).
  - Pajak: `TaxSetting`, `TaxBracket`, `WithholdingRecord` (append-only).
  - `DocumentRecord` (PDF bukti potong/slip).
  - Disbursement ke provider + rekonsiliasi.
- **Selesai berarti:** `order.paid` → earning ter-kredit ke wallet (ledger seimbang); payout request lewat HOLD/approve→disburse idempoten; pemotongan pajak + dokumen PDF terbit; rekonsiliasi disbursement jalan.

### 13. Pelengkap

- **Depends-on:** (3); masing-masing fitur menumpu modul terkait.
- **Alasan urutan:** Nilai tambah, bukan jalur kritis MVP/monetisasi.
- **Cakupan:** Gamifikasi, forum, membership, WA-push notifikasi, multi-bahasa (i18n), PWA.
- **Selesai berarti:** Tiap fitur terkirim independen di belakang permission, tanpa mengubah kontrak service publik modul inti.

---

## AI (Lintas-Modul)

- **Sifat:** Menyilang banyak modul; **layanan async ber-budget**; **bukan jalur kritis**.
- **Cakupan:** Generasi quiz (quiz-gen, konsumsi catalog/assessment), transkrip video (konsumsi media/live). Semua pemakaian dicatat di `AiUsageLog` dengan kuota/budget per tenant/user.
- **Aturan:** Async (job/queue), gagal AI tidak boleh menggagalkan alur inti; akses modul lain tetap lewat service publik. Budget enforce sebelum panggil provider.
- **Selesai berarti:** Job AI berjalan async, `AiUsageLog` mencatat token/biaya, budget cap enforce, kegagalan AI ter-degrade dengan baik (tidak memblok pengguna).
