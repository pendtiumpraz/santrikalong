# Frontend Guidelines — Implementasi Desain

> Status: **DRAFT** · 2026-06-01
> Menerjemahkan `00`–`04` jadi disiplin kode. Stack: Next.js (App Router) + TypeScript + Tailwind.

---

## 1. Stack Frontend
- **Next.js App Router** + **TypeScript**.
- **Tailwind CSS** dengan token kustom (bukan kelas default mentah).
- **shadcn/ui** sebagai basis komponen headless → **di-restyle** ke design system kita (jangan biarkan default look-nya = itu sumber "slop").
- **Lucide** untuk ikon (+ ikon kustom SVG brand).
- **next/font** untuk memuat Fraunces, Plus Jakarta Sans, Noto Naskh Arabic, Amiri.
- Animasi: CSS/Tailwind + **Framer Motion** seperlunya (hormati reduced-motion).

---

## 2. Token sebagai Single Source of Truth

Pakai **CSS variables** untuk tema (light/dark tinggal tukar), lalu map ke Tailwind via `<alpha-value>`.

```css
/* globals.css */
:root {                      /* tema KERTAS (light) */
  --bg: 250 246 239;         /* kertas-50 */
  --surface: 255 255 255;
  --border: 230 220 200;     /* kertas-200 */
  --text: 33 29 22;          /* tinta-900 */
  --text-muted: 59 53 43;    /* tinta-700 */
  --brand: 181 129 31;       /* pelita-600 */
  --brand-fg: 33 29 22;      /* teks di atas pelita */
  --ring: 206 154 51;        /* pelita-500 */
}
.dark {                      /* tema MALAM */
  --bg: 14 26 23;            /* malam-900 */
  --surface: 21 37 31;       /* malam-800 */
  --border: 30 51 43;        /* malam-700 */
  --text: 250 246 239;
  --text-muted: 157 176 167; /* malam-300 */
  --brand: 220 174 84;       /* pelita-400 */
  --brand-fg: 14 26 23;
  --ring: 220 174 84;
}
```

```js
// tailwind.config.ts (ringkas)
extend: {
  colors: {
    bg: 'rgb(var(--bg) / <alpha-value>)',
    surface: 'rgb(var(--surface) / <alpha-value>)',
    border: 'rgb(var(--border) / <alpha-value>)',
    fg: 'rgb(var(--text) / <alpha-value>)',
    muted: 'rgb(var(--text-muted) / <alpha-value>)',
    brand: 'rgb(var(--brand) / <alpha-value>)',
    'brand-fg': 'rgb(var(--brand-fg) / <alpha-value>)',
    // + palet absolut pelita/zaitun/malam/kertas dari 01-design-system
  },
  fontFamily: {
    display: ['var(--font-fraunces)', 'serif'],
    sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
    arabic: ['var(--font-naskh)', 'serif'],
    quran: ['var(--font-amiri)', 'serif'],
  },
  borderRadius: { sm:'6px', md:'10px', lg:'16px', xl:'24px' },
  boxShadow: {
    e1:'0 1px 2px rgb(33 29 22 / .06)',
    e2:'0 4px 16px rgb(33 29 22 / .08)',
    e3:'0 12px 40px rgb(10 19 17 / .24)',
    glow:'0 0 24px rgb(206 154 51 / .25)',   /* nyala pelita */
  },
  transitionTimingFunction: { calm:'cubic-bezier(.2,0,0,1)' },
}
```

> **Aturan:** komponen pakai token semantik (`bg-surface`, `text-fg`, `text-brand`) — **bukan** `bg-emerald-500`. Ini yang bikin light/dark konsisten & tidak slop.

---

## 3. Struktur Komponen (frontend)

```
src/
├── styles/globals.css            # CSS vars + base
├── lib/fonts.ts                  # next/font loaders
├── components/
│   ├── ui/                       # primitif (Button, Card, Input, Badge, Dialog…)
│   ├── course/                   # CourseCard, SyllabusAccordion, PriceBox
│   ├── learn/                    # VideoPlayer, DocViewer, SlideViewer, LessonList, QuizCard
│   ├── live/                     # LiveStage, LiveChat, Countdown
│   ├── admin/                    # StatCard, DataTable, GatewayCard, PayrollTable
│   ├── brand/                    # Logo, ikon kustom (Kalong, Pelita, Crescent)
│   └── layout/                   # Navbar, BottomNav, Sidebar, Footer, ThemeToggle
└── app/...                       # halaman (lihat 03-arsitektur-teknis.md)
```

- Komponen kecil & terkomposisi. Hindari satu komponen "raksasa".
- Varian via **cva (class-variance-authority)** + `tailwind-merge`.
- Semua teks lewat layer i18n sejak awal (siap ID/EN/AR) — minimal struktur dictionary.

---

## 4. Aturan Styling (disiplin anti-slop)
1. **Tidak ada warna hex/utility mentah** di JSX selain token semantik. (Lint: larang `emerald-`, `indigo-`, hex inline.)
2. **Spacing hanya dari skala** Tailwind (4px). Jangan `mt-[13px]`.
3. **Satu radius** per peran komponen (lihat token).
4. **Heading wajib `font-display`** (serif). Body `font-sans`.
5. **Maks 1 elemen `text-brand`/`bg-brand` dominan** per layar.
6. **Shadow hangat** (`e1/e2/e3`) — jangan shadow default abu.
7. **Ikon = Lucide/SVG**, ukuran 16/20/24. **Dilarang emoji di UI chrome.**
8. Konten baca dibungkus `max-w-[680px]` + `leading-relaxed`.
9. State lengkap: setiap interaktif punya hover/focus-visible/disabled.

---

## 5. Tema (Multi-Tema: Dark/Light × banyak mood)
> **DIGANTIKAN oleh `06-sistem-tema.md` (kanonik).** Ringkasan di sini disesuaikan agar tidak salah arah:
- **Model 2 dimensi:** `data-theme="..."` (mood) × `data-mode="light|dark"` di `<html>` — **bukan** sekadar class `dark`.
- **Tailwind `darkMode`:** `['selector', '[data-mode="dark"] &']` agar `dark:` aktif saat `data-mode=dark` (lepas dari tema).
- **Anti-FOUC:** root layout (Server Component) baca **cookie** → set `data-theme`/`data-mode` di SSR (nol flash) + inline script kecil hanya untuk `mode=system`. Jangan andalkan `localStorage` di `useEffect` (memicu flash).
- **Persistensi:** cookie (runtime) + DB profil (lintas-device untuk user login). Ganti tema optimistik di klien lalu persist via Server Action.
- **Default per-route** (marketing/live=dark, baca/dashboard=light) hanya berlaku bila user belum memilih; **pilihan user selalu menang**.
- `ThemeToggle` (quick light/dark) di navbar + **pemilih tema penuh** (galeri preview live) di Pengaturan.
- **Shadow/glow/grain = token** (`--shadow-color`, `--glow-strength`, dst), ikut berganti per tema.
- Lihat `06` untuk: kontrak token wajib, contoh blok tema, resolver prioritas, validator build-time, halaman `/dev/theme-gallery`.

---

## 6. Tipografi praktis
- Muat font via `next/font/google` (Fraunces, Plus Jakarta Sans) & `next/font` lokal untuk Amiri/Naskh bila perlu, dengan `display:'swap'`.
- Set CSS var dari loader (`--font-fraunces`, dst).
- Teks Arab: bungkus dengan `dir="rtl"` + `font-arabic`/`font-quran`.

---

## 7. Performa
- **next/image** untuk semua gambar (thumbnail kelas, avatar) + lazy.
- Video/PDF/PPT viewer = **dynamic import** (jangan bebani bundle awal).
- Skeleton untuk daftar; hindari layout shift (CLS) → tetapkan rasio media (16:9).
- Route belajar/admin: client component seperlunya; utamakan Server Components untuk data.
- Pola loading: streaming + `loading.tsx` per segment.

---

## 8. Aksesibilitas (wajib)
- `focus-visible` ring `brand` di semua interaktif.
- Kontras AA (uji pelita-on-malam & tinta-on-kertas).
- Ikon-only button → `aria-label`.
- Form: `<label>` terkait, pesan error `aria-describedby`.
- Player: kontrol keyboard, caption.
- `prefers-reduced-motion` → matikan animasi non-esensial.

---

## 9. Konvensi
- Nama file komponen `PascalCase.tsx`; util `camelCase.ts`.
- Props eksplisit + TypeScript ketat.
- Tidak ada nilai ajaib; angka desain ambil dari token.
- Tulis komponen agar **match gaya sekitarnya** (lihat komponen tetangga sebelum bikin baru).

---

## 10. Definition of Done (visual)
Sebuah layar dianggap "selesai" jika:
- [ ] Pakai hanya token semantik (lolos lint anti-slop).
- [ ] Heading serif, body sans, Arab pakai font Arab.
- [ ] Maks 1 cahaya `pelita` dominan.
- [ ] Punya state: loading / kosong / error / sukses.
- [ ] Responsif (mobile-first) sesuai perilaku di `03`.
- [ ] Lolos cek kontras & keyboard.
- [ ] Light & dark dua-duanya rapi.
```
