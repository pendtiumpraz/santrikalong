# Komponen UI — Inventory & Spesifikasi

> Status: **DRAFT** · 2026-06-01 · **Perlu retrofit token (lihat `06-sistem-tema.md §6`)**
> Acuan: token di `01-design-system.md`. Tujuan: konsistensi & bisa langsung jadi komponen React.
>
> ⚠️ **Multi-tema:** Di bawah ini sebagian warna masih ditulis konkret (mis. "bg `pelita-600`", "aktif = `pelita`", pasangan "light … / dark …"). Itu **akan diganti ke token peran** (`bg-brand`, `text-fg`, `border-border`, `ring-ring`, `text-success`, dst) agar komponen otomatis benar di semua tema×mode. **Anggap setiap sebutan warna brand di dokumen ini = token peran**, bukan nilai tetap. Retrofit ini = blocker #1 sebelum hi-fi. Aturan & contoh `cva` ada di `06 §6` dan `05`.

---

## 1. Prinsip Komponen
- Setiap komponen punya **varian terbatas** (jangan kebanyakan opsi).
- State wajib lengkap: `default · hover · active · focus(ring) · disabled · loading`.
- **Focus ring** selalu terlihat (aksesibilitas): ring `pelita` 2px + offset.
- Touch target minimal **44×44px**.

---

## 2. Button
Varian:
| Varian | Tampilan | Pakai |
|--------|----------|-------|
| `primary` | bg `pelita-600` (light) / `pelita-500` + glow halus (dark), teks gelap | aksi utama (1 per area) |
| `secondary` | bg transparan, border 1px, teks ink | aksi sekunder |
| `ghost` | tanpa border, hover bg lembut | aksi tersier/ikon |
| `danger` | teks/garis merah, fill merah hanya saat konfirmasi | hapus, tolak |
| `link` | teks `zaitun-600` bergaris-bawah saat hover | navigasi inline |

- Ukuran: `sm (h36)`, `md (h44)`, `lg (h52)`. Radius `md`.
- Loading: spinner + label tetap (jangan ganti lebar). Disabled: opacity 50%, kursor not-allowed.
- Ikon kiri/kanan opsional (Lucide), gap 8px.

---

## 3. Card (Kartu)
Anatomi dasar: `[media?] · [konten: eyebrow/tag · judul · meta · deskripsi] · [footer: harga/aksi]`.
- Surface: light `kertas-50` + border `kertas-200`; dark `malam-800` + border `malam-700`.
- Radius `lg`, padding 20. Hover: naik ke `e2`, border menghangat ke `pelita-300/40%`.
- Jangan pakai shadow tebal saat diam (cukup border).

### CourseCard (khusus)
- Thumbnail 16:9 dengan overlay tag kiri-atas (kategori) & kanan-atas (status: Live / Rekaman / Gratis / Dauroh).
- Baris meta: rating · jumlah materi · level (ikon Lucide, bukan emoji).
- Footer: harga (serif/medium) + tombol/spanduk. Badge "Live" pakai titik berkedip halus warna `live`.

---

## 4. Badge / Tag
- `tag` (kategori): bg `zaitun` 10%, teks `zaitun-600`, radius `sm`.
- `status`: Live (`live`), Gratis (`zaitun`), Pending (`pelita`), Selesai (`sukses`).
- `level`: Pemula/Menengah/Lanjutan — ikon titik bertingkat.
- Ukuran kecil, teks `xs` 500.

---

## 5. Input & Form
- Field: tinggi 44, radius `md`, border 1px, bg surface. Label di atas (`sm`, 500). Helper text `xs`.
- Focus: border `pelita-500` + ring lembut. Error: border `bahaya` + pesan `xs` merah.
- Select, Textarea, Checkbox/Radio (accent `pelita`), Toggle/Switch (track abu → `pelita` saat on).
- **OTP input**: 6 kotak terpisah.
- File upload (bukti transfer, dokumen ustadz): drop-zone bergaris putus-putus + preview.

---

## 6. Navigation
- **Top Navbar (publik):** logo (lockup kalong+wordmark) · menu · toggle tema · masuk/daftar. Sticky, blur, border bawah tipis. Transparan di atas hero dark → solid saat scroll.
- **Bottom Nav (mobile, area belajar):** Beranda · Kelas · Live · Notifikasi · Saya. Ikon + label `xs`. Aktif = `pelita`.
- **Sidebar (admin/ustadz):** grup berlabel, item aktif fill `pelita` lembut + indikator kiri.
- **Breadcrumb:** `sm`, separator `/`, item akhir non-link.
- **Tabs:** garis bawah `pelita` untuk tab aktif (dipakai di lesson viewer).

---

## 7. Media & Pembelajaran (komponen khas LMS)
- **VideoPlayer:** kontrol kustom (play, timeline, kecepatan, kualitas, subtitle, PiP). Tema gelap. Tombol besar play di tengah. Hemat distraksi (mode fokus).
- **AudioPlayer:** baris ramping — waveform/progress, kecepatan, durasi.
- **DocViewer (PDF):** toolbar (zoom, halaman, unduh bila diizinkan), render via pdf.js.
- **SlideViewer (PPT / HTML PPT):** kontrol prev/next, fullscreen, indikator slide. HTML PPT via iframe sandbox.
- **LessonList (sidebar silabus):** grup per bab, item dengan status ikon (selesai ✓ / berjalan ▶ / belum ○ / terkunci 🔒-ikon Lucide). Item aktif = strip `pelita` di kiri.
- **ProgressBar / Ring:** tipis, warna `pelita`. Ring untuk % penyelesaian kelas.
- **QuizCard:** progress soal, kartu pertanyaan, opsi sebagai kartu pilihan (radio besar), timer, navigasi soal. State benar/salah saat pembahasan (sukses/bahaya, halus).

---

## 8. Live Streaming
- **LiveStage:** player besar + badge "● LIVE" berkedip + jumlah penonton.
- **LiveChat:** panel kanan/bawah, pesan ringkas, sapaan ustadz ditandai badge "Pengajar" (`pelita`).
- **QnA / Raise hand:** daftar pertanyaan bisa di-upvote.
- **Countdown:** untuk sesi yang akan datang (jam:menit:detik), nada tenang.

---

## 9. Feedback & Overlay
- **Modal/Dialog:** radius `xl`, elevasi `e3`, overlay malam 50% + blur. Maks lebar sesuai konten (checkout ~480).
- **Toast:** muncul dari atas/bawah, halus, auto-dismiss. Varian semantik.
- **Empty state:** ikon kustom (kalong/pelita) + 1 kalimat hangat + 1 aksi. Tidak kosong-dingin.
- **Loading:** skeleton (bukan spinner penuh layar) untuk daftar/kartu; spinner kecil untuk aksi.
- **Confirm berbahaya** (hapus/tolak): butuh konfirmasi eksplisit, tombol danger.

---

## 10. Data Display (admin/ustadz)
- **Table:** header `xs` uppercase `malam-400`, baris divider tipis, angka rata kanan & `tabular-nums`. Hover baris bg lembut. Status pakai badge.
- **StatCard:** label `sm` · angka besar (serif/tabular) · delta kecil (hijau/merah).
- **Chart:** garis/area minimalis, satu warna `pelita`/`zaitun`, grid sangat tipis. Tanpa 3D, tanpa warna-warni.
- **Filter chips:** chip aktif fill `pelita` lembut.

---

## 11. Sertifikat (komponen output)
- Layout cetak (A4 landscape), bingkai geometris Islami halus, kaligrafi nama kelas, nama santri (serif), QR verifikasi, tanda tangan/cap. Palet kertas + emas. Tampil & ekspor PDF.

---

## 12. Aturan Komposisi
- Maks **1 tombol primary** per layar/section.
- Maks **1 elemen "menyala" `pelita`** yang dominan per viewport.
- Konsistenkan jarak vertikal antar blok (skala spacing).
- Saat ragu: **kurangi**. Tenang > ramai.
