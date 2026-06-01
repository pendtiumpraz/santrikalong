# Consent / Persetujuan & List Marketing

> Status: **DRAFT** · 2026-06-01
> Pelengkap `01-roles-rbac.md`. Fokus: persetujuan saat daftar (santri & ustadz), bisa diubah, + daftar kontak marketing (WA/email) di superadmin. Detail tabel final mengikuti ERD di `docs/backend/`.

## 1. Tujuan
- Mengumpulkan **persetujuan yang sah & terbukti** saat pendaftaran.
- Memisahkan consent **wajib** (syarat layanan) dari consent **marketing** (opsional).
- Memungkinkan user **mengubah/mencabut** consent kapan saja.
- Menyediakan **list kontak (WA/email)** untuk bahan iklan — hanya yang menyetujui, real-time.

## 2. Jenis Consent

| Tipe | Untuk | Wajib? | Berversi? |
|------|-------|:--:|:--:|
| `tos` (Syarat & Ketentuan) | semua | ✅ | ✅ |
| `privacy` (Kebijakan Privasi) | semua | ✅ | ✅ |
| `teacher_agreement` (Perjanjian/Akad Pengajar) | ustadz | ✅ | ✅ |
| `marketing_email` | semua | ❌ (opt-in) | — |
| `marketing_wa` | semua | ❌ (opt-in) | — |

- **Perjanjian Pengajar** memuat: bagi hasil, kepemilikan & lisensi konten, tanggung jawab pajak, kode etik, ketentuan payout. Disetujui sebelum status ustadz aktif (nyambung ke alur approval di `01`).
- Consent marketing **granular & terpisah** (boleh setuju email tapi tolak WA).

## 3. Sifat Consent
- **Berversi**: simpan **versi dokumen** yang disetujui + waktu + IP + user-agent + sumber (web/app). Saat ToS/Privasi naik versi → tampilkan **re-consent** saat login berikutnya.
- **Append-only (riwayat)**: setiap perubahan = record baru (granted/withdrawn), **tidak menimpa**. Consent aktif = record terbaru per (user, tipe). Ini bukti hukum bila ada sengketa.
- **Bisa diubah/dicabut** kapan saja di **Pengaturan → Privasi & Notifikasi**. Pencabutan consent wajib (mis. privacy) → berdampak ke akses layanan (jelaskan ke user).

## 4. Alur Singkat
```
Daftar santri  → centang ToS + Privasi (wajib)  → opsi opt-in marketing (email/WA)
Daftar ustadz  → ToS + Privasi + Akad Pengajar (wajib) → opsi opt-in marketing
Kapan saja     → Pengaturan → ubah/cabut consent (tercatat di riwayat)
Versi berubah  → re-consent saat login
```

## 5. Superadmin: List Marketing (Bahan Iklan)
- Menu **Pengguna → Kontak Marketing**.
- **Filter**: tipe kanal (WA / email), peran (santri/ustadz), kategori minat, tanggal daftar.
- Menampilkan **hanya user dengan consent marketing AKTIF saat ini** (real-time dari record terbaru). Yang sudah mencabut **otomatis tidak muncul** — jangan pakai snapshot lama.
- **Export CSV** untuk campaign. Setiap export tercatat di audit log (siapa, kapan, filter apa).
- (Opsional lanjutan) integrasi broadcast WA/email langsung dengan **unsubscribe link** otomatis yang mencabut consent.

## 6. Entitas (ringkas; final di ERD)
```
ConsentDefinition
  id, type, version, title, bodyText(/url), required(bool), locale, effectiveAt

ConsentRecord            // append-only
  id, userId, type, version
  granted(bool), grantedAt, withdrawnAt
  ip, userAgent, source
  // consent aktif = record TERBARU per (userId, type)
```
- **Marketing list query**: user yang record terbaru `marketing_email`/`marketing_wa` = `granted=true`.

## 7. Kepatuhan & Etika
- Patuhi prinsip perlindungan data (persetujuan jelas, mudah dicabut, tujuan terbatas).
- Marketing hanya ke yang **opt-in**; sediakan **unsubscribe** di setiap pesan.
- Jangan campur data consent wajib dengan marketing (pisahkan tujuan).
- Audit log untuk perubahan consent & ekspor data.

## 8. Pertanyaan Terbuka
- Apakah perlu consent terpisah untuk **notifikasi transaksional** (selalu boleh) vs **promosi** (opt-in)? (umumnya transaksional tidak butuh opt-in)
- Minimal usia / wali untuk santri di bawah umur?
- Retensi data kontak setelah akun nonaktif?
