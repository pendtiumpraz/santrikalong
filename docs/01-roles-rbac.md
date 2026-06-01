# Peran Pengguna & RBAC

> Status: **DRAFT** · 2026-06-01

## 1. Daftar Peran (Roles)

| Role | Deskripsi |
|------|-----------|
| **Superadmin** | Akses penuh. Atur RBAC, gateway pembayaran, approve ustadz, kelola seluruh platform. |
| **Admin** | Operasional harian: moderasi konten, support, lihat laporan. Hak dibatasi superadmin. |
| **Ustadz / Pengajar** | Bikin & kelola kelas, upload materi, live streaming, bikin quiz, lihat santri & progres. Wajib **di-approve** dulu. |
| **Santri / Member** | Daftar kelas, belajar, ikut live, kerjakan quiz, dapat sertifikat. |
| **Guest** | Lihat katalog kelas & preview materi gratis. |

> Catatan: bisa ditambah role seperti **Asisten Ustadz** / **Moderator Live** kalau perlu.

## 2. Konsep RBAC

Pendekatan **Role + Permission** (bukan sekadar role kaku), supaya fleksibel:

- **Permission** = unit hak terkecil, mis. `class.create`, `class.publish`, `user.approve`, `payment.gateway.toggle`, `quiz.grade`.
- **Role** = kumpulan permission.
- **Superadmin** bisa bikin role baru & atur permission per role lewat panel (dynamic RBAC).

### Contoh pemetaan permission

| Permission | Superadmin | Admin | Ustadz | Santri |
|-----------|:--:|:--:|:--:|:--:|
| `user.approve` (approve ustadz) | ✅ | ⚙️ | ❌ | ❌ |
| `rbac.manage` | ✅ | ❌ | ❌ | ❌ |
| `payment.gateway.toggle` | ✅ | ❌ | ❌ | ❌ |
| `class.create` | ✅ | ✅ | ✅ | ❌ |
| `class.publish` | ✅ | ✅ | ⚙️ | ❌ |
| `material.upload` | ✅ | ✅ | ✅ | ❌ |
| `live.host` | ✅ | ✅ | ✅ | ❌ |
| `quiz.create` | ✅ | ✅ | ✅ | ❌ |
| `quiz.attempt` | ❌ | ❌ | ❌ | ✅ |
| `enrollment.purchase` | ✅ | ✅ | ✅ | ✅ |

> ✅ = default ada · ⚙️ = opsional/diatur superadmin · ❌ = tidak ada

## 3. Alur Pendaftaran & Approval Ustadz

```
Ustadz daftar  →  isi profil + dokumen (CV, sanad/ijazah opsional)
              →  status: PENDING
              →  Superadmin/Admin review
                   ├─ APPROVED  → role ustadz aktif, bisa bikin kelas
                   └─ REJECTED  → diberi alasan, bisa daftar ulang
```

- Notifikasi ke ustadz saat status berubah (email + in-app).
- Superadmin bisa **suspend / nonaktifkan** ustadz kapan saja.
- Histori approval tercatat (audit log).

## 4. Alur Pendaftaran Santri

- Daftar mandiri (email / no HP / OAuth Google).
- Verifikasi email/OTP.
- Langsung bisa jelajah katalog & beli kelas.

## 5. Audit Log

Catat aksi sensitif: approve/reject ustadz, ubah RBAC, toggle gateway, refund, hapus konten. Penting untuk akuntabilitas (amanah).

## 6. Pertanyaan Terbuka

- Apakah perlu **multi-tenant** (mis. lembaga/yayasan punya sub-portal sendiri)? → lihat `07-pertanyaan-terbuka.md`.
- Apakah ustadz dapat **bagi hasil (revenue share)** otomatis dari penjualan kelasnya?
