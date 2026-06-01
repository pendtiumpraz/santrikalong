# Daftar Fitur Lengkap

> Status: **DRAFT** · 2026-06-01
> Legend prioritas: 🟢 MVP · 🟡 Fase 2 · 🔵 Nanti

## 1. Autentikasi & Akun
- 🟢 Register/login email + password
- 🟢 OTP / verifikasi email
- 🟡 Login OAuth (Google)
- 🟢 Reset password
- 🟢 Profil pengguna (foto, bio, kontak)
- 🟡 2FA untuk admin/ustadz

## 2. Katalog & Kelas
- 🟢 Katalog kelas (filter: kategori, gratis/berbayar, live/on-demand, level)
- 🟢 Halaman detail kelas (silabus, pengajar, harga, preview)
- 🟢 Pencarian kelas
- 🟡 Rating & review kelas
- 🔵 Rekomendasi kelas

## 3. Struktur Konten
- 🟢 Kelas → **Modul/Section** → **Materi (Lesson)**
- 🟢 Tipe materi:
  - 🟢 Video (upload / streaming / embed YouTube-Vimeo)
  - 🟢 Audio
  - 🟢 PDF viewer (inline)
  - 🟢 PPT/PPTX viewer (inline — konversi ke gambar/PDF atau embed)
  - 🟡 HTML PPT (reveal.js / slide HTML interaktif)
  - 🟡 Teks/artikel (rich text)
  - 🔵 Lampiran download (worksheet, dll)
- 🟢 Urutan materi & penguncian progres (materi B terbuka setelah A selesai) — opsional per kelas
- 🟢 Tandai selesai / progress per materi

### Catatan teknis viewer
- **PDF**: render via `pdf.js`.
- **PPT/PPTX**: opsi (a) konversi server-side ke PDF/gambar (LibreOffice headless), atau (b) embed Office viewer. Konversi lebih aman & konsisten.
- **HTML PPT**: simpan bundel HTML, tampilkan via iframe sandbox / reveal.js.

## 4. Live Streaming & Dauroh
- 🟢 Jadwal kelas live (kalender, reminder)
- 🟢 Halaman ruang live (player + chat + Q&A)
- 🟢 Rekaman otomatis → jadi VOD setelah selesai
- 🟡 Absensi / kehadiran live
- 🟡 Dauroh sebagai **event** (kuota peserta, periode, harga khusus, sertifikat)
- 🔵 Breakout / sesi tanya jawab terstruktur

### Opsi teknologi live
- Pihak ketiga (cepat): **Mux**, **Cloudflare Stream**, **Agora**, **100ms**, **Zoom SDK**, atau YouTube Live (gratis tapi kurang terkontrol).
- Self-host (kompleks): SRS / Ant Media + HLS.
- Rekomendasi MVP: pakai provider managed (mis. Cloudflare Stream/Mux untuk broadcast + chat custom).

## 5. Quiz & Penilaian
- 🟢 Tipe soal: pilihan ganda, benar/salah
- 🟡 Isian singkat, menjodohkan, essay (manual grading)
- 🟢 Bank soal per kelas/modul
- 🟢 Pengaturan: batas waktu, jumlah attempt, acak soal, nilai lulus (KKM)
- 🟢 Auto-grading untuk objektif; 🟡 manual untuk essay
- 🟢 Hasil & pembahasan
- 🔵 Quiz live (kahoot-style) saat sesi streaming

## 6. Progress, Sertifikat & Gamifikasi
- 🟢 Dashboard progres santri (per kelas, % selesai)
- 🟡 Sertifikat penyelesaian (PDF, verifiable/QR)
- 🔵 Badge / poin / leaderboard
- 🔵 Streak belajar

## 7. Pembayaran & Enrollment
- 🟢 Beli kelas (one-time)
- 🟢 Multi gateway: **Midtrans, Tripay, Xendit, Transfer Manual** (toggle dari superadmin)
- 🟡 Langganan / membership (bulanan)
- 🟡 Kupon / voucher diskon
- 🟢 Riwayat transaksi & invoice
- 🔵 Bagi hasil ustadz (revenue share + payout)
- (detail di `04-pembayaran.md`)

## 8. Komunikasi & Engagement
- 🟢 Notifikasi in-app (kelas baru, live mulai, hasil quiz)
- 🟢 Notifikasi email
- 🟡 Notifikasi WhatsApp (mis. via gateway WA) / push
- 🟡 Diskusi / forum per kelas (Q&A ke ustadz)
- 🔵 Komentar per materi

## 9. Panel Ustadz
- 🟢 Buat & kelola kelas, modul, materi
- 🟢 Upload materi multi-format
- 🟢 Buat quiz
- 🟢 Jadwalkan & host live
- 🟢 Lihat daftar santri & progres
- 🟡 Analitik kelas (penonton, completion rate, pendapatan)
- 🟡 Tanya jawab / moderasi diskusi

## 10. Panel Superadmin/Admin
- 🟢 RBAC management (role & permission)
- 🟢 Approve/reject/suspend ustadz
- 🟢 Toggle & konfigurasi gateway pembayaran
- 🟢 Kelola kategori kelas
- 🟢 Moderasi konten & user
- 🟢 Laporan keuangan & transaksi
- 🟡 Pengaturan situs (branding, halaman statis, banner)
- 🟡 Broadcast pengumuman
- 🟢 Audit log

## 11. Non-fungsional
- 🟢 Mobile-first, responsif
- 🟢 SEO untuk halaman katalog/landing
- 🟡 Multi-bahasa (ID/EN/AR) — minimal dukungan teks Arab (RTL) di konten
- 🟢 Keamanan: rate limit, proteksi konten berbayar (signed URL video)
- 🟡 PWA / aplikasi (later)
