# Wireframe Low-Fidelity

> Status: **DRAFT** · 2026-06-01
> Fokus: **struktur, hierarki, alur** — BUKAN warna/visual. Visual ikut `00`–`02`.
> Notasi: `[ ]` tombol · `( )` input · `▢` media/gambar · `•` teks/item · `≡` menu · `▶` play.

---

## 1. Beranda (Landing) — tema MALAM (dark)

```
┌───────────────────────────────────────────────────────────────┐
│ ◑ SantriKalong      Katalog  Dauroh  Live  Pengajar   ☾  [Masuk][Daftar] │  ← navbar transparan di atas hero
├───────────────────────────────────────────────────────────────┤
│                                                                 │
│   (latar: langit malam + pola bintang halus + vignette)         │
│                                                                 │
│   • eyebrow: "Ilmu adalah cahaya"                               │
│   ┌─────────────────────────────┐    ▢ kartu cahaya:           │
│   │  H1 (serif, 2 baris)        │      ▶ cuplikan kajian        │
│   │  "Menuntut ilmu di          │      • Ust. ... ● LIVE        │
│   │   keheningan malam"         │                               │
│   │  • subjudul 1 kalimat       │                               │
│   │  [ Jelajahi Kelas ]  [Jadwal Live]                          │
│   │  • 120 kelas · 35 ustadz · 8.5rb santri (stat tenang)       │
│   └─────────────────────────────┘                               │
├───────────────────────────────────────────────────────────────┤
│  KATEGORI (4 kartu sejajar, ikon kustom — bukan emoji)          │
│  [ Bahasa Arab ] [ Tahsin ] [ Dauroh ] [ Fiqih & Aqidah ]       │
├───────────────────────────────────────────────────────────────┤
│  "Kelas Pilihan"                              lihat semua →      │
│  ▢▢▢  (3 CourseCard)                                            │
├───────────────────────────────────────────────────────────────┤
│  "Sedang & Akan Live"   → strip kartu live + countdown          │
├───────────────────────────────────────────────────────────────┤
│  Banner ajakan jadi pengajar (1 baris, tenang)   [ Daftar ]     │
├───────────────────────────────────────────────────────────────┤
│  FOOTER: brand · Belajar · Platform · Bantuan                   │
└───────────────────────────────────────────────────────────────┘
```
Niat: hero menyampaikan **satu ide** (cahaya di malam) + 1 aksi utama. Tidak ramai.

---

## 2. Katalog

```
┌───────────────────────────────────────────────────────────────┐
│ navbar (solid)                                                  │
├──────────────┬────────────────────────────────────────────────┤
│ FILTER (kiri)│  Katalog Kelas          ( cari kelas… 🔍 )      │
│ • Kategori   │  Chips: [Semua][Live][Rekaman][Gratis][Dauroh]  │
│   ☐ Bahasa   │  urut: [Terbaru ▾]              123 hasil       │
│   ☐ Tahsin   ├────────────────────────────────────────────────┤
│   ☐ Fiqih    │  ▢ Card   ▢ Card   ▢ Card                       │
│ • Level      │  ▢ Card   ▢ Card   ▢ Card                       │
│   ☐ Pemula   │  ▢ Card   ▢ Card   ▢ Card                       │
│ • Harga      │                                                 │
│   ◉ Semua    │  [ Muat lebih banyak ]                          │
│ [Reset]      │                                                 │
└──────────────┴────────────────────────────────────────────────┘
Mobile: filter jadi tombol [Filter] → sheet dari bawah. Grid 1 kolom.
```

---

## 3. Detail Kelas

```
┌───────────────────────────────────────────────────────────────┐
│ navbar · breadcrumb: Katalog / Bahasa Arab / Nama Kelas         │
├───────────────────────────────────────┬───────────────────────┤
│  • tag kategori · status                │  ┌── KARTU BELI ──┐   │ ← sticky
│  H1: Judul Kelas (serif)                │  │ ▢ thumbnail     │   │
│  • rating · santri · durasi · materi    │  │ Harga (besar)   │   │
│  • ◍ Ustadz — kredensial singkat        │  │ [ Beli & Mulai ]│   │
│                                         │  │ [ + Keranjang ] │   │
│  ▢ PREVIEW (▶ putar)                    │  │ ✓ akses selamanya│  │
│                                         │  │ ✓ 32 materi     │   │
│  "Yang dipelajari" (grid ceklis 2 kol)  │  │ ✓ kuis & sertif │   │
│                                         │  └─────────────────┘   │
│  "Silabus" (accordion per bab)          │                       │
│   ▸ Bab 1 — 5 materi                    │                       │
│     • Video · • PDF(preview) · • Kuis    │                       │
│   ▸ Bab 2 — 🔒 terkunci                  │                       │
│                                         │                       │
│  "Tentang Ustadz" · "Ulasan"            │                       │
└───────────────────────────────────────┴───────────────────────┘
Mobile: kartu beli jadi BAR sticky di bawah (harga + [Beli]).
```

---

## 4. Checkout (sheet/modal)

```
        ┌──────────────── Pembayaran ───────────────[✕]┐
        │ Ringkasan                                     │
        │  • Nama Kelas .................. Rp 149.000   │
        │  • Biaya layanan ............... Rp   2.500   │
        │  ─────────────────────────────────────────    │
        │  Total ......................... Rp 151.500   │
        │                                               │
        │ Pilih metode (hanya gateway AKTIF tampil)     │
        │  ◉ ▢ Virtual Account / QRIS   — Midtrans      │
        │  ○ ▢ E-Wallet                 — Xendit        │
        │  ○ ▢ Retail / Bank lain       — Tripay        │
        │  ○ ▢ Transfer Manual (upload bukti)           │
        │                                               │
        │            [    Bayar Sekarang    ]           │
        │  🔒 transaksi aman                            │
        └───────────────────────────────────────────────┘
Setelah bayar: layar status → (LUNAS) → [ Mulai Belajar ]
```

---

## 5. Ruang Belajar (Lesson Viewer) — MODE FOKUS

```
┌───────────────────────────────────────────────────────────────┐
│ ← Judul Kelas        [▮▮▮▮▯▯ 38%]                      ◍ santri │ ← bar tipis, no nav global
├──────────────────────────────────────────────┬────────────────┤
│                                                │ KONTEN KELAS   │
│            ▢  PLAYER / VIEWER                  │ Bab 1          │
│        (video / audio / PDF / PPT / HTML)      │ ▶ Materi 1  ●  │ ← aktif
│                                                │ ✓ Materi 2     │
│                                                │ ✓ Materi 3     │
├──────────────────────────────────────────────┤ ○ Kuis Bab 1   │
│ Judul materi · durasi · ustadz                 │ Bab 2          │
│        [← Sebelumnya] [Tandai Selesai ✓] [→]   │ ○ ...          │
├──────────────────────────────────────────────┤                │
│ Tabs: Materi Pendukung | Kuis | Catatan | Diskusi              │
│ ┌── konten tab ───────────────────────────────┐ ┌── LIVE ────┐ │
│ │ ▢ DocViewer PDF (toolbar zoom/unduh)         │ │ sesi besok │ │
│ │ • Audio.mp3 [▶]   • Slide HTML [buka]        │ │ [ingatkan] │ │
│ └──────────────────────────────────────────────┘ └────────────┘ │
└──────────────────────────────────────────────┴────────────────┘
Mobile: video di atas; silabus & tab di bawah (drawer). Tanpa sidebar.
```
Niat: distraksi minimal, sidebar silabus = peta, tombol "Tandai Selesai" jelas.

---

## 6. Ruang Live

```
┌───────────────────────────────────────────────────────────────┐
│ ← Judul Sesi          ● LIVE · 03:14:22       ◍ 312 menonton    │
├──────────────────────────────────────────────┬────────────────┤
│                                                │  Chat / Q&A    │
│              ▢  STREAM (besar)                 │ • user: ...    │
│                                                │ • Ust ★: ...   │ ← badge pengajar
│           [▶ ⏸  🔊  ⚙ kualitas  ⛶]            │ • user: ...    │
│                                                │ ──── tab ────  │
│                                                │ [Chat][Q&A]    │
│ Judul · Ustadz · deskripsi singkat             │ ( tulis…)  [→] │
└──────────────────────────────────────────────┴────────────────┘
Sebelum mulai: layar COUNTDOWN tenang + [Ingatkan Saya].
Sesudah: [ Tonton Rekaman ] (jadi VOD).
```

---

## 7. Admin — Dashboard

```
┌─────────────┬─────────────────────────────────────────────────┐
│  SIDEBAR    │  Dashboard                          ☾  🔔  ◍     │
│  ◑ brand    ├─────────────────────────────────────────────────┤
│  Umum       │  [Stat]  [Stat]  [Stat]  [Stat]                  │
│  • Dashboard│  Pendapatan · Santri · Ustadz(3 pending) · Saldo │
│  • Konten   ├──────────────────────────────┬──────────────────┤
│  Pengguna   │  ▢ Grafik penjualan (1 warna) │ Aktivitas        │
│  • Approval③│                               │ • ✓ ustadz...    │
│  • RBAC     │                               │ • 💳 bayar...    │
│  Keuangan   │                               │ • 💰 payout...   │
│  • Gateway  ├───────────────────────────────┴──────────────────┤
│  • Penggajian│  Perlu Tindakan: 3 approval · 4 klaim payout     │
│  • Pajak    │                                                  │
│  • Transaksi│                                                  │
└─────────────┴──────────────────────────────────────────────────┘
```

---

## 8. Admin — Penggajian Ustadz

```
│ [Stat: Pendapatan ustadz][Pajak dipotong][Saldo belum klaim][Klaim ⏳] │
├────────────────────────────────────────────────────────────────┤
│ Rekap Juni 2026         [Export CSV] [Proses Payout Massal]      │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ Ustadz        Terjual  Bruto    Bagi70%   Pajak   Net/Saldo │ │
│ │ ◍ Abdullah ✓npwp  84   12,5jt   8,76jt   −62rb   8,69jt  •  │ │ ← status badge
│ │ ◍ Fatimah  ✓npwp  61    9,1jt   6,40jt   −45rb   6,35jt  ⏳ │ │
│ │ ◍ Hamzah   ✗npwp  39    3,8jt   2,70jt   −16rb   2,68jt  saldo│ │
│ └────────────────────────────────────────────────────────────┘ │
│ ⓘ Pajak otomatis dari Pengaturan Pajak. Saldo tak diklaim = carry-over │
├────────────────────────────────────────────────────────────────┤
│ Klaim Menunggu:  ◍ Fatimah  Rp6,35jt  BSI ...  [Setujui&Transfer][Tolak] │
```

---

## 9. Catatan untuk Hi-Fi berikutnya
- Wireframe ini menetapkan **tata letak & prioritas**. Saat naik ke hi-fi, terapkan token `01` + komponen `02`.
- Yang belum di-wireframe (fase berikutnya): Studio Ustadz (editor kelas & kuis), Dashboard Santri, RBAC detail, Sertifikat, Auth/Onboarding.
```
```
