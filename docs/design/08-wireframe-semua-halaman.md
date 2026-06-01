# Wireframe Low-Fidelity — SEMUA Halaman Tersisa

> Status: **DRAFT** · 2026-06-01
> Lanjutan `04-wireframes.md` (yang baru memuat 8 layar). Di sini: **semua sisanya** + state kosong/error/loading + frame mobile.
> Fokus: **struktur, hierarki, alur** — BUKAN warna/visual (ikut `06` token). Notasi sama `04`:
> `[ ]` tombol · `( )` input · `▢` media/gambar · `•` teks/item · `≡` drag/menu · `▶` play · `◍` avatar · `☾` toggle tema · `🔔` notifikasi (ikon Lucide saat implementasi, bukan emoji).

---

## 0. Pustaka State (template WAJIB tiap layar)

```
LOADING   : skeleton sesuai bentuk (kartu/tabel/player) — bukan spinner penuh layar.
EMPTY     : ikon brand (kalong/pelita) + 1 kalimat hangat + 1 aksi.   (voice 00 §6)
ERROR     : penyebab singkat + jalan keluar ([Coba lagi]/[Hubungi]) — tidak menyalahkan.
SUCCESS   : toast halus / inline; momen selesai materi → doa ringan secukupnya.
PARTIAL   : sebagian gagal (mis. 1 dari 3 kartu) → retry per-item.
PERMISSION: 403 → "Anda tidak punya akses" + jalan kembali.
DESTRUKTIF: hapus → undo-toast 5 dtk SEBELUM hard-delete; atau konfirmasi eksplisit.
KELUAR FORM: form panjang belum tersimpan → dialog "Perubahan belum disimpan?"
```
Setiap layar inti **wajib punya pasangan mobile** (sheet/drawer/bottom-nav), bukan sekadar catatan.

---

## 1. Auth & Onboarding

### 1.1 Masuk (default mode malam/dark — identitas brand)
```
┌──────────── ◑ SantriKalong ────────────┐
│  • eyebrow: "Selamat datang kembali"     │
│  H2 Masuk                                │
│  ( email / no. HP )                      │
│  ( kata sandi )            • Lupa sandi? │
│  [          Masuk          ]             │
│  ──────────  atau  ──────────            │
│  [ ◎ Lanjut dengan Google ]              │
│  • Belum punya akun?  Daftar             │
└──────────────────────────────────────────┘
States: error kredensial (inline, tidak menyalahkan: "Email atau sandi belum cocok") ·
        loading (tombol spinner, lebar tetap) · akun DISUSPEND (pesan + [Hubungi Admin] + jalur banding) ·
        rate-limit ("Coba lagi dalam 30 dtk").
```

### 1.2 Daftar
```
( nama ) ( email / no. HP ) ( kata sandi ) ( konfirmasi sandi )
☐ Saya setuju Kebijakan & Ketentuan (link)
[        Daftar        ]   ·   [ ◎ Google ]   ·   • Sudah punya akun? Masuk
State: validasi sandi lemah (helper), email sudah terdaftar (inline + tawaran Masuk).
```

### 1.3 Verifikasi OTP
```
• "Kode dikirim ke a***@mail.com"
( _ )( _ )( _ )( _ )( _ )( _ )       ← 6 kotak (komponen 02 §5)
[ Verifikasi ]   • Kirim ulang dalam 0:58   • Ganti nomor/email
State: kode salah (kotak merah, sisa percobaan) · kedaluwarsa (minta kirim ulang) · sukses → 1.4
```

### 1.4 Onboarding Santri (stepper 3 langkah, bisa Lewati)
```
● Minat ─── ○ Tampilan ─── ○ Mulai          [Lewati]
Langkah 1: pilih kategori minat (chips multi-select)
Langkah 2: pilih tampilan (ThemeToggle terang/gelap + 1-2 tema)
Langkah 3: 1 kelas rekomendasi  → [Mulai Belajar] / [Ke Beranda]
State: stepper selalu tampil (recognition>recall); back/next; progress tersimpan.
```

### 1.5 Lupa & Reset Sandi
```
(a) ( email )  [ Kirim tautan ]  → (b) "Cek email Anda" (empty-ish, hangat)
(c) via token: ( sandi baru )( konfirmasi ) [ Simpan ] → sukses → Masuk
State: token kedaluwarsa/invalid → "Tautan tidak berlaku" + [Minta ulang].
```

**Mobile:** kartu auth full-width, padding lega, logo atas. Onboarding = 1 langkah per layar + progress dots.

---

## 2. Dashboard Santri
```
┌── topbar: "Malam, Abdullah"                         ☾  🔔  ◍ ──┐
│ "Lanjutkan Belajar"                                            │
│   ▢ KARTU BESAR: materi terakhir · sisa durasi · [Lanjut →]    │ ← resume
├────────────────────────────────────────────────────────────────┤
│ Kelas Saya (3 aktif)                              lihat semua → │
│   ▢(ring 38%) ▢(ring 12%) ▢(ring 80%)                          │
├────────────────────────────────────────────────────────────────┤
│ Live Mendatang   • "Fiqih Muamalah" · besok 20:00 · [Ingatkan] │
├────────────────────────────────────────────────────────────────┤
│ Rekomendasi   ▢ ▢ ▢                                            │
├────────────────────────────────────────────────────────────────┤
│ Ringkas:  • Sertifikat baru (1)    • Transaksi terakhir: LUNAS │
└────────────────────────────────────────────────────────────────┘
EMPTY (santri baru): hero hangat "Belum mulai. Pilih kajian pertamamu." + [Jelajahi Katalog].
LOADING: skeleton kartu resume + grid ring. ERROR: "Gagal memuat" + [Coba lagi].
Mobile: bottom-nav (Beranda·Kelas·Live·Saya); kartu "Lanjutkan" paling atas.
```

---

## 3. Studio Ustadz

### 3.1 Dashboard Ustadz
```
[Stat: Santri][Pendapatan bln ini][Rating rata][Saldo belum klaim]
▢ Grafik penjualan (1 warna)        | Kelas Saya: status Draft/Review/Published
"Perlu tindakan":  • 2 kelas DITOLAK review (lihat alasan)  • 5 diskusi belum dijawab
EMPTY (ustadz baru): "Buat kelas pertama Anda" + [+ Kelas Baru].
```

### 3.2 Editor Kelas — shell + tab
```
← Kelas: "Nahwu Dasar"        status:[Draft ▾]      [Pratinjau] [Submit Review]
Tabs:  Info | Kurikulum | Harga & Akses | Sertifikat | Pengaturan
─ INFO:
  ( judul ) ( slug ) ( kategori ▾ ) ( level ▾ )
  ▢ thumbnail (16:9, drop-zone)      ▢ video preview
  ( deskripsi — editor )             • "Yang dipelajari" (list editable, + tambah)
State: autosave "tersimpan ✓" / "menyimpan…" · banner REJECTED (alasan admin) di atas ·
       checklist validasi sebelum Submit (min 1 modul · thumbnail · harga ditetapkan).
```

### 3.3 Tab Kurikulum (modul + materi, drag-reorder)
```
Kurikulum                                                  [+ Modul]
≡ ▸ Modul 1 — Pengenalan                      (3 materi)        [⋯]
     ≡ • Video: Muqaddimah          ✎   👁 preview   [⋯ hapus]
     ≡ • PDF: Ringkasan             ✎                [⋯]
     ≡ • Kuis: Bab 1                ✎                [⋯]
     [+ Materi ▾]  → (Video · Audio · PDF · PPT · HTML-PPT · Kuis)
≡ ▸ Modul 2 — Huruf & Harakat                                  [⋯]
≡ = drag handle.  EMPTY: "Belum ada modul. Mulai susun kurikulum." + [+ Modul]
DESTRUKTIF: hapus modul/materi → undo-toast 5s.
```

### 3.4 Editor Materi (drawer per tipe)
```
Materi: Video                                       [Simpan] [Hapus]
( judul )   • durasi auto-deteksi    ☑ Gratis (preview publik)
▢ Upload / pilih video → STATE: mengunggah 62% / memproses (Stream) / siap / GAGAL [ulang]
( deskripsi )    + Lampiran (PDF/audio)    ( Caption/Subtitle — WAJIB a11y )  ( Transkrip )
— Tipe lain —
  PDF/PPT : drop-zone + preview halaman.   HTML-PPT: ( embed/URL ) + nota iframe sandbox.
  Audio   : upload + waveform.
  Semua tipe punya: upload/processing/error/replace.
```

### 3.5 Editor Kuis
```
Kuis: Bab 1   Pengaturan: ( durasi mnt ) ( nilai lulus % ) ( acak soal ☑ ) ( boleh ulang ☑ / x kali )
≡ Soal 1   [Pilihan Ganda ▾]
   ( pertanyaan )   + media (opsional)
   ◉ opsi A  (kunci)    ○ opsi B    ○ opsi C    [+ opsi]
   ( pembahasan )
≡ Soal 2   [Benar/Salah ▾] …
Tipe soal: PG · Multi-jawab · Benar/Salah · Isian singkat · Esai (nilai manual).
[+ Soal]  ·  [Pratinjau sisi-santri]
State: validasi tiap soal punya kunci (kecuali esai) sebelum simpan; drag-reorder soal.
```
**Mobile Studio:** tab → dropdown; kurikulum tetap drag (long-press); editor materi = full-screen sheet.

---

## 4. Ruang Live — Host (ustadz)
```
┌ ← Sesi: "Kajian Fiqih"   ● SIAP / ● LIVE 00:12:04        ◍ 312 ─────┐
│ ▢ PRATINJAU KAMERA / LAYAR              │  Panel Host                │
│ [🎙 mute][📷 cam][🖥 share][⚙]          │  Tab: [Chat][Q&A][Peserta] │
│ [● Mulai Siaran] / [■ Akhiri]           │  • Q&A ter-upvote di atas  │
│ • status koneksi/bitrate (tenang)       │  • moderasi: hapus / pin   │
│                                          │  • [Sematkan] pesan        │
└──────────────────────────────────────────┴────────────────────────────┘
State: PRA-LIVE checklist perangkat (kamera/mic OK) · LIVE · GANGGUAN koneksi (banner) ·
       AKHIRI → ringkasan sesi + toggle "Jadikan rekaman VOD?".
```
Ruang Live **peserta** sudah di `04 §6` — tambahan state yang harus ada: gabung-di-tengah ·
host belum mulai (countdown) · chat kena rate-limit · sesi berakhir → [Tonton Rekaman].

---

## 5. Panel Admin (melengkapi `04 §7–8`)

### 5.1 Approval Ustadz
```
List:  filter [Pending ③][Disetujui][Ditolak]   tabel: Nama · Tgl · Dokumen · [Tinjau]
Detail (drawer): profil + ▢ viewer dokumen (CV, sanad/ijazah) · catatan internal · histori
   [Setujui]   [Tolak → (alasan WAJIB)]        → notifikasi + audit log
EMPTY: "Tidak ada permohonan."
```

### 5.2 RBAC & Roles
```
Roles (list)               [+ Role]  │  Permission Matrix (role × permission)
• Superadmin (terkunci 🔒)            │  grup: Kelas / User / Pembayaran / RBAC / …
• Admin            [edit]             │  ☑/☐ per permission · ( cari permission )
• Ustadz           [edit]             │  [Simpan] → konfirmasi (aksi sensitif → audit)
Role baru: ( nama ) ( duplikat-dari ▾ ) + pilih permission (combobox/multi-select).
State: simpan gagal (toast) · konfirmasi sebelum cabut permission sensitif.
```

### 5.3 Gateway Pembayaran
```
Kartu per provider: Midtrans · Tripay · Xendit · Manual
┌──────────────────────────────────────────────┐
│ [logo] Midtrans      status:[Aktif ●]  mode:[Sandbox ▾] │
│ ( server key — ••••• [reveal] )  ( client key )         │
│ ( webhook URL — readonly [salin] )                      │
│ [Uji Koneksi] → ✓ / ✗     [Simpan]                      │
└──────────────────────────────────────────────┘
≡ urutan tampil di checkout (drag).  State: uji gagal (pesan) · disimpan (toast).
```

### 5.4 Transaksi & Laporan
```
Filter ( tanggal ) ( status ▾ ) ( gateway ▾ ) ( kelas ▾ )      [Export CSV]
Tabel: Invoice · Santri · Kelas · Metode · Jumlah(rata-kanan) · Status(badge) · [detail]
Detail (drawer): timeline pembayaran · bukti (manual transfer) · [Refund → konfirmasi+alasan → audit]
EMPTY: "Belum ada transaksi pada rentang ini."  Mobile: tabel → kartu bertumpuk.
```

### 5.5 Moderasi Konten (kelas pending review)
```
List kelas REVIEW → buka [Pratinjau kelas] → [Publikasikan] / [Minta revisi → (alasan)]
```

### 5.6 Audit Log
```
Filter ( tanggal )( aktor )( aksi ▾ )   ( cari )
Tabel (read-only): Waktu · Aktor · Aksi · Objek · Diff(ekspand)
```

### 5.7 Pengaturan Situs
```
Tabs: Identitas | Kategori | Kebijakan | Tema Default | Pajak (link 08-penggajian)
Identitas: nama situs, logo, kontak.  Kategori: CRUD + reorder.
Tema Default: pilih tema/mode default global (override-able user).  Pajak: tarif PPh final (configurable).
```

---

## 6. Sertifikat & Verifikasi Publik
```
Santri "Sertifikat Saya":  grid kartu  → [Lihat] [Unduh PDF] [Bagikan]
Preview: A4 landscape (komponen 02 §11), rasio tetap → tombol Unduh/Print.
Halaman PUBLIK /verify/[kode]  (tanpa login):
   ✓ "Sertifikat SAH"  · nama · kelas · tanggal · penerbit
   ✗ "Sertifikat tidak ditemukan"  + [Kembali ke Beranda]
Sumber QR di sertifikat → halaman /verify ini.  EMPTY (santri): "Selesaikan kelas untuk sertifikat pertamamu."
```

---

## 7. Profil & Pengaturan
```
Tabs: Profil | Keamanan | Tampilan/Tema | Notifikasi | (Ustadz: Rekening/Payout)
Profil    : ◍ avatar · nama · bio · kontak.
Keamanan  : ganti sandi · 2FA · Sesi Aktif [logout semua perangkat] · Akun terhubung (Google) · Hapus akun (konfirmasi ketik).
Tampilan  : ThemeToggle + GALERI TEMA (preview live tiap tema×mode, 06 §0.8) +
            skala teks (slider) + ☑ kontras tinggi (06 D-B) → optimistik, persist.
Notifikasi: matriks kanal (Email / In-app) × jenis (Live · Transaksi · Diskusi · Sistem).
State: simpan optimistik + toast; gagal → revert + pesan.
```

---

## 8. Halaman Pendukung

### 8.1 Wishlist (rekomendasi) / Keranjang (alternatif — lihat open question)
```
Wishlist: grid kelas tersimpan → [Beli & Mulai] / [Hapus].
Keranjang (jika dipertahankan): list item + total + [Checkout].  EMPTY: "Belum ada simpanan" + [Jelajahi].
```

### 8.2 Notifikasi Center
```
Dikelompok: "Hari ini" / "Sebelumnya"   [Tandai semua dibaca]
• 🔔 "Pembayaran LUNAS — Nahwu Dasar"  → deep-link
• 🔔 "Live mulai 5 menit lagi"          → deep-link
EMPTY: "Tidak ada notifikasi."  (titik belum-dibaca = brand)
```

### 8.3 Dauroh — Detail (event)
```
H1 Judul Dauroh   • tanggal/waktu · lokasi/online · kuota (sisa 12)
▢ poster   ( deskripsi )   "Jadwal Sesi" (list)   [ Daftar ]  (sticky bar mobile)
State: kuota habis → [Daftar antrean] / tombol nonaktif + alasan; sudah terdaftar → [Lihat detail].
```

### 8.4 Pencarian Global + Hasil
```
( cari kelas/ustadz/dauroh… )  → tab hasil: [Kelas][Ustadz][Dauroh]
EMPTY: "Tidak ditemukan untuk 'xyz'." + saran kategori populer.
LOADING: skeleton list.  (Admin: command palette Ctrl-K — lihat open question token.)
```

### 8.5 Bantuan/FAQ · Kebijakan · Tentang
```
Konten statis terstruktur (accordion FAQ; daftar isi kebijakan). Tooltip "?" kontekstual
untuk istilah teknis (RBAC/Gateway/Pajak) menautkan ke bagian Bantuan terkait.
```

### 8.6 Halaman Sistem
```
404  : ikon brand + "Halaman tidak ditemukan" + [Beranda] [Katalog]
500  : "Ada gangguan di sisi kami" + [Coba lagi] + kode ref
403  : "Anda tidak punya akses" + jalan kembali (sesuai role)
OFFLINE / MAINTENANCE: pesan tenang + perkiraan / [Coba lagi]
Semua: nada hangat, tidak menyalahkan (00 §6).
```

---

## 9. Wallet & Klaim Payout — sisi Ustadz (melengkapi `04 §8` yang hanya sisi admin)
```
[Stat: Saldo tersedia][Pending (refund window)][Total diklaim]
Riwayat:  Bulan · Bruto · Bagi 70% · Pajak · Net   (tabular-nums)
Saldo carry-over lintas bulan ditandai jelas.
[ Klaim Payout ] → ( pilih/verifikasi rekening ) → status: REQUESTED → (admin) PAID
State: rekening belum diisi → wizard isi rekening · klaim < minimum → pesan.
```

---

## 10. Catatan untuk Hi-Fi
- Wireframe ini menetapkan tata letak & state. Saat hi-fi: terapkan token `06` + komponen `02`.
- Beberapa layar butuh **komponen yang belum ada di `02`** (stepper, datepicker, combobox, drag-handle, currency IDR, wallet card, command palette, OTP-resend timer). Lihat `09 §6` & open questions — itu prasyarat sebelum hi-fi Studio/Admin.
