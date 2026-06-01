# Taste-Skill Brief — Redesign Mockup (acuan agen)

> Sumber: github.com/Leonxlnx/taste-skill (design-taste-frontend v2). Status: AKTIF untuk redesign `prototype/`.
> Tujuan: redesign mockup HTML agar lolos checklist anti-slop, lalu dikonversi ke Next.js.

## 0. Brief one-liner
"LMS Islami untuk santri dewasa pekerja & remaja, bahasa tenang-scholarly-modern, condong ke sistem token kustom (multi-tema gelap/terang)."

## Dials
- **DESIGN_VARIANCE = 6** (variatif terkontrol — ≥4 keluarga layout per 8 section; hindari zigzag berulang).
- **MOTION_INTENSITY = 3** (hover + reveal halus; reduced-motion dihormati; tanpa scroll-hijack berlebih).
- **VISUAL_DENSITY = 5** (marketing lega; app/dashboard boleh lebih padat).

## 1. Keputusan brand (hasil kesepakatan, override sebagian aturan skill)
- **Font display: `Bricolage Grotesque`** (sans berkarakter) + body `Plus Jakarta Sans` + Arab `Amiri` (kutipan ayat). Serif Fraunces DIBUANG.
- **Aksen tunggal per tema** (Pelita Malam = emas; Kertas Subuh = biru). Jangan tambah warna baru — pakai token `var(--brand)` dsb.
- **Brand art tetap** (bulan sabit, lentera, lengkung mihrab, ornamen/segel sertifikat) sebagai inline SVG — ini identitas, bukan "hand-rolled icon" yang dilarang.
- **Multi-tema gelap/terang** dipertahankan (data-theme × data-mode).

## 2. Aturan WAJIB (dari skill)
- ❌ **Em-dash `—` DILARANG total** (judul, copy, alt, caption). Ganti `:`, `,`, atau `·`.
- ❌ **Tanpa Inter**, tanpa AI-purple gradient/neon glow norak, tanpa "tiga kartu fitur seragam" generik, tanpa nama "John Doe"/"Acme", tanpa kata slop ("Elevate/Seamless/Unleash/Revolutionize"), tanpa fake screenshot dari div, tanpa label versi di hero, tanpa eyebrow bernomor ("001 · ..."), tanpa strip lokasi/jam/cuaca, tanpa cue "scroll", tanpa status-dot dekoratif.
- ✅ **Ikon = Lucide** via CDN: `<i data-lucide="NAME" class="ico"></i>` (app.js memanggil `lucide.createIcons()`). Bukan `<svg><use>` sprite lagi.
- ✅ **Gambar nyata** (faceless) dari Unsplash, terkompres (`auto=format&w=...&q=55`), `loading="lazy"`, `alt` deskriptif (tanpa em-dash). Tanpa SVG dekoratif acak sebagai default.
- ✅ **Hero**: muat 1 viewport, **maks 4 elemen teks**, padding atas ≤ setara `pt-24` (≈6rem), skala font direncanakan ke imagery.
- ✅ **Eyebrow** (uppercase tracking) maks `ceil(jumlahSection / 3)`.
- ✅ **Nav** 1 baris, tinggi ≤ 80px.
- ✅ **CTA**: tak ada label ganda semakna; tak wrap 2 baris di desktop; kontras AA.
- ✅ **Motion**: setiap animasi punya alasan; reduced-motion → statis. Tanpa `window.addEventListener('scroll')` (pakai IntersectionObserver — sudah disiapkan app.js).
- ✅ **Layout**: ≥4 keluarga layout berbeda di 8 section; hindari "headline kiri + penjelas kecil kanan"; hindari 3+ zigzag gambar-teks beruntun; bento N item → N sel (tanpa sel kosong).

## 3. Catatan lingkup
Skill ini untuk **marketing surfaces**. Halaman **app (dashboard/tabel/form)** — `studio`, `admin`, `dashboard`, `checkout`, `belajar`, `profil` — tetap fungsional; terapkan hanya: font/ikon/em-dash, ritme spacing, hierarki, kontras, reduced-motion. JANGAN paksa estetika marketing ke tabel/form.

## 4. Konvensi fondasi (WAJIB di setiap halaman)
`<head>` harus berisi (urut):
```html
<script>(function(){try{var e=document.documentElement,t=localStorage.getItem('sk_theme'),m=localStorage.getItem('sk_mode'),s=localStorage.getItem('sk_text');e.dataset.theme=t||'pelita-malam';e.dataset.mode=m||'dark';if(s==='large')e.dataset.textsize='large';}catch(_){var x=document.documentElement;x.dataset.theme='pelita-malam';x.dataset.mode='dark';}})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Amiri:wght@400;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/app.css">
```
Sebelum `</body>`: `<script src="assets/app.js"></script>`
- **Tombol ganti mode** (navbar): `<button class="icon-btn" id="sk-mode-toggle" aria-label="Ganti mode"></button>` (app.js mengisi ikonnya).
- Pakai **kelas yang sudah ada di app.css** (btn, ccard, card, tag, grid-c, sidebar, tabs, table, dst). JANGAN bikin sistem warna/komponen baru; redesign = perbaiki layout/spacing/hierarki/motion/copy di dalam sistem ini.
- Komponen interaktif pakai atribut yang sudah didukung app.js: `data-tabgroup/data-tab/data-panel`, `data-view/data-pane`, `data-open="#id"/data-close`, `.overlay/.drawer`.

## 5. Mapping ikon (sprite lama → Lucide `data-lucide`)
moon, sun, layers, radio (broadcast), book-open (book), book-marked (quran), arrow-right (arrow), arrow-left (arrow-l), chevron-right, chevron-down, star, clock, play, search, bell, shopping-cart (cart), user, users, settings, shield-check (shield), credit-card (card), wallet, receipt, layout-grid (grid), plus, pencil (edit), trash-2 (trash), check, x, menu, upload, file-text (doc), headphones, type (text), palette, bar-chart-3 (chart), award, flag, lock.
Brand (TETAP inline SVG): bulan sabit (logo), lentera, lengkung mihrab, ornamen & segel sertifikat.

## 6. Pre-Flight Checklist (tiap halaman wajib lolos)
- [ ] 0 em-dash di mana pun.
- [ ] Font Bricolage (display) + Jakarta (body) ter-link; bukan serif/Inter.
- [ ] Ikon Lucide (`data-lucide`), brand art inline tetap.
- [ ] 1 aksen tema konsisten; 1 sistem radius.
- [ ] Hero ≤4 elemen teks, muat 1 viewport, padding atas ≤6rem (khusus halaman marketing).
- [ ] Eyebrow ≤ ceil(section/3).
- [ ] ≥4 keluarga layout di 8 section (marketing); tanpa zigzag 3+; tanpa header "kiri besar + kanan kecil".
- [ ] Gambar nyata faceless + alt deskriptif; tanpa fake screenshot div.
- [ ] Nav 1 baris ≤80px; CTA tak wrap, kontras AA.
- [ ] Mobile: `max-w` + padding mobil + grid collapse (sudah via app.css media query, pastikan tetap rapi).
- [ ] Reduced-motion aman; tanpa scroll-listener.
- [ ] Tak ada anti-tell (lihat §2).

## 7. Pembagian halaman (untuk fan-out agen)
1. `index.html` (landing — flagship, paling taste-heavy)
2. `katalog.html`
3. `kelas.html` (detail + keranjang drawer + checkout modal)
4. `checkout.html`
5. `dashboard.html`
6. `belajar.html`
7. `live.html` (3 state: pra-live/live/rekaman-Fathom)
8. `sertifikat.html` + `404.html`
9. `profil.html` + `onboarding-otp.html`
10. `studio.html` + `admin.html` (app surfaces — polish, bukan estetika marketing)
