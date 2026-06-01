# Mockup HTML — SantriKalong LMS

Mockup statis **HTML + Tailwind CSS (via CDN)**, mobile-first, siap di-convert ke komponen Next.js + Tailwind.

## Cara buka
Buka file `.html` langsung di browser (double click), atau jalankan server statis:
```bash
npx serve mockups
```

## Halaman

| File | Halaman | Isi |
|------|---------|-----|
| [`index.html`](./index.html) | Landing & Katalog | Hero, kategori, katalog kelas (live/rekaman/gratis/dauroh), CTA pengajar |
| [`detail-kelas.html`](./detail-kelas.html) | Detail Kelas & Checkout | Silabus, preview, kartu beli, **modal checkout multi-gateway** (Midtrans/Tripay/Xendit/Manual) |
| [`ruang-belajar.html`](./ruang-belajar.html) | Ruang Belajar (Lesson Viewer) | Player video, viewer PDF/PPT/audio/slide HTML, **kuis**, catatan, diskusi, sidebar silabus, info sesi live |
| [`admin.html`](./admin.html) | Panel Superadmin | Dashboard, **approval ustadz**, **RBAC**, **toggle gateway**, **penggajian ustadz + pajak**, transaksi |

## Catatan konversi ke Next.js
- Struktur kelas Tailwind dipakai apa adanya → tinggal pecah jadi komponen React.
- Interaksi (tab, modal, navigasi panel) di mockup pakai JS inline sederhana → ganti dengan state React.
- Warna brand: `emerald` (`brand` di config). Font: Plus Jakarta Sans.
- Tailwind di sini via CDN; di produksi pakai Tailwind build (PostCSS) sesuai setup Next.js.

> Catatan: angka pajak di `admin.html` (PPh Final 0,5%, tarif Pasal 17, dst) hanya ilustrasi sesuai rangkuman PP 20/2026 — **dibuat configurable**, bukan hardcoded. Lihat `docs/08-penggajian-ustadz-pajak.md`.
