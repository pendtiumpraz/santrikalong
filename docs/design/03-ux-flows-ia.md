# UX — Information Architecture & User Flows

> Status: **DRAFT** · 2026-06-01

---

## 1. Peta Situs (Information Architecture)

```
PUBLIK
├─ Beranda (landing)
├─ Katalog
│   ├─ Filter: kategori · live/rekaman · gratis/berbayar · level
│   └─ Detail Kelas → Checkout
├─ Dauroh (event)
├─ Jadwal Live
├─ Jadi Pengajar (info + daftar)
├─ Tentang / Bantuan / Kebijakan
└─ Masuk · Daftar

SANTRI (setelah login)
├─ Dashboard "Lanjut Belajar"
├─ Kelas Saya  → Ruang Belajar (lesson viewer)
├─ Live  → Ruang Live
├─ Sertifikat
├─ Transaksi & Invoice
├─ Notifikasi
└─ Profil & Pengaturan (tema, keamanan)

USTADZ (Studio) — setelah approved
├─ Dashboard (santri, pendapatan, rating)
├─ Kelas Saya → Editor Kelas (modul, materi, kuis)
├─ Jadwal & Live (host)
├─ Penghasilan & Saldo → Klaim Payout
└─ Profil pengajar

ADMIN / SUPERADMIN
├─ Dashboard
├─ Kelas & Konten (moderasi)
├─ Approval Ustadz
├─ RBAC & Roles
├─ Gateway Pembayaran
├─ Penggajian Ustadz + Pengaturan Pajak
├─ Transaksi & Laporan
└─ Pengaturan Situs · Audit Log
```

---

## 2. Prinsip UX
1. **3 klik ke belajar.** Dari beranda → kelas → mulai materi.
2. **Selalu ada "Lanjutkan".** Santri yang kembali langsung disodori materi terakhir.
3. **Mode fokus saat belajar.** Sembunyikan navigasi global; hanya konten + silabus.
4. **Transparan soal uang.** Harga, total, metode jelas sebelum bayar. Status pembayaran real-time.
5. **Gagal dengan anggun.** Setiap empty/error punya jalan keluar.

---

## 3. Flow Inti

### 3.1 Santri: Temukan → Beli → Belajar
```
Beranda/Katalog
  → Detail Kelas (preview gratis, silabus, ustadz)
  → [Beli]  → Checkout (pilih gateway aktif)
            → Bayar (VA/QRIS/e-wallet) atau Manual (upload bukti)
            → Status: menunggu → LUNAS (via webhook)
  → Enrollment aktif → Ruang Belajar
  → Tonton/baca materi → tandai selesai → Kuis → Progress naik
  → Selesai 100% → Sertifikat
```
Titik kritis: setelah bayar, **langsung arahkan ke "Mulai Belajar"** (jangan biarkan menggantung).

### 3.2 Santri: Ikut Live / Dauroh
```
Jadwal Live → Detail sesi → [Daftar/Ingatkan]
  → (saat mulai) Ruang Live: tonton + chat + Q&A
  → Sesi selesai → rekaman jadi VOD di Kelas Saya
```

### 3.3 Ustadz: Daftar → Approve → Buat Kelas
```
Daftar pengajar → isi profil + unggah dokumen → status PENDING
  → Admin review → APPROVED (notifikasi)
  → Studio → Buat Kelas → tambah Modul → unggah Materi (video/audio/PDF/PPT/HTML)
  → Susun Kuis → Submit untuk review → PUBLISHED
```

### 3.4 Ustadz: Penghasilan → Klaim Payout
```
Penjualan kelas → Earning (pending → available setelah refund window)
  → Saldo bertambah
  → [Klaim] → isi/verifikasi rekening → REQUESTED
  → Admin setujui & transfer → PAID
  (tidak diklaim → tetap jadi saldo, carry-over)
```

### 3.5 Admin: Approval Ustadz
```
Daftar PENDING → buka detail → cek dokumen
  → [Setujui] → role ustadz aktif + notifikasi
  → [Tolak] → wajib isi alasan → notifikasi (boleh daftar ulang)
  (semua tercatat di Audit Log)
```

### 3.6 Admin: Aktifkan Gateway
```
Gateway Pembayaran → pilih provider → isi kredensial (enc) → pilih mode (sandbox/prod)
  → [Aktifkan toggle] → muncul di checkout santri
```

---

## 4. State Penting per Layar (jangan dilupakan)
- **Loading** (skeleton), **kosong** (empty state hangat), **error** (jalan keluar), **sukses**.
- Katalog: hasil filter kosong → saran reset filter.
- Ruang Belajar: materi terkunci → ajakan daftar/lanjut.
- Checkout: gateway down → tawarkan metode lain.
- Live: belum mulai → countdown; sudah selesai → tombol tonton rekaman.

---

## 5. Aksesibilitas (a11y)
- Kontras teks min **WCAG AA** (cek pelita-di-gelap & tinta-di-kertas).
- Navigasi keyboard penuh + focus ring jelas.
- Label/aria pada ikon-only button.
- Caption/subtitle untuk video; transkrip untuk audio (target).
- Dukungan **RTL** untuk konten Arab.
- Hormati `prefers-reduced-motion` & `prefers-color-scheme`.

---

## 6. Responsif (perilaku kunci)
- **Ruang Belajar:** desktop = konten + sidebar silabus; mobile = konten penuh, silabus jadi sheet/drawer bawah.
- **Admin tabel:** mobile = kartu bertumpuk (bukan tabel mengecil).
- **Checkout:** mobile = full-screen sheet.
- **Live:** mobile = video atas, chat tab bawah.
