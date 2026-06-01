# Design System — Token & Fondasi Visual

> Status: **DRAFT** · 2026-06-01 · **Diperbarui oleh `06-sistem-tema.md`**
> Semua nilai di sini = sumber kebenaran. Mengacu ke konsep di `00-design-language.md`.
>
> ⚠️ **Penting (multi-tema):** Palet di §1 kini berstatus **primitive** (warna mentah). Komponen **tidak** memakainya langsung — mereka memakai **token peran** (`--brand`, `--surface`, `--text`, dst) yang nilainya berganti per tema×mode. Daftar **kontrak token wajib**, shadow/glow/grain sebagai token, dan arsitektur lengkap ada di **`06-sistem-tema.md`** (kanonik). "Pelita Malam" = nama tema flagship dari palet di sini.

---

## 1. Palet Warna

Filosofi: **base malam yang pekat + permukaan perkamen hangat + satu cahaya emas (pelita)**. Hijau zaitun yang diredam jadi sekunder, dipakai hemat. Semua netral diberi rona hangat (bukan abu-abu dingin).

### 1.1 Brand / Cahaya — **Pelita** (aksen utama, "satu cahaya")
| Token | Hex | Pakai untuk |
|-------|-----|-------------|
| `pelita-50`  | `#FBF3E2` | bg highlight sangat lembut |
| `pelita-100` | `#F6E6C4` | bg badge |
| `pelita-300` | `#E7C277` | hover terang |
| `pelita-400` | `#DCAE54` | aksen di dark mode |
| `pelita-500` | `#CE9A33` | **warna brand utama** |
| `pelita-600` | `#B5811F` | tombol primary (light) |
| `pelita-700` | `#8F6315` | tekan/active |

### 1.2 Sekunder — **Zaitun** (hijau diredam, dipakai hemat)
| Token | Hex | Pakai untuk |
|-------|-----|-------------|
| `zaitun-400` | `#5E9C86` | aksen sekunder, ikon |
| `zaitun-600` | `#2F7A64` | tag kategori, link tenang |
| `zaitun-800` | `#1C4C40` | permukaan gelap bernuansa |

### 1.3 Netral Malam — **Malam** (base gelap, hangat-kehijauan)
| Token | Hex | Pakai untuk |
|-------|-----|-------------|
| `malam-950` | `#0A1311` | background paling dalam |
| `malam-900` | `#0E1A17` | bg dark default |
| `malam-800` | `#15251F` | surface/card dark |
| `malam-700` | `#1E332B` | border/garis di dark |
| `malam-600` | `#2C463C` | hover surface dark |
| `malam-400` | `#6E847B` | teks sekunder di dark |
| `malam-300` | `#9DB0A7` | teks redup di dark |

### 1.4 Netral Kertas — **Kertas** (permukaan terang, hangat)
| Token | Hex | Pakai untuk |
|-------|-----|-------------|
| `kertas-50`  | `#FAF6EF` | **bg light default (perkamen)** |
| `kertas-100` | `#F2EBDD` | surface alt |
| `kertas-200` | `#E6DCC8` | border halus (light) |
| `kertas-300` | `#D4C6AC` | divider |
| `tinta-700`  | `#3B352B` | teks sekunder (light) |
| `tinta-900`  | `#211D16` | **teks utama (light), seperti tinta** |

### 1.5 Semantik
| Peran | Light | Dark |
|-------|-------|------|
| Sukses | `#2F7A64` | `#5E9C86` |
| Peringatan | `#B5811F` | `#DCAE54` |
| Bahaya | `#B23A3A` | `#E08585` |
| Info | `#2F6F8F` | `#7FB6CE` |
| Live (rekaman/siaran) | `#C2410C` | `#F97316` |

> **Aturan cahaya:** dalam satu layar, hanya elemen **paling penting** yang boleh memakai `pelita`. Kalau semua menyala, tidak ada yang menyala.

---

## 2. Tipografi

Pasangan: **serif berkarakter untuk judul (suara scholarly) + sans humanis untuk body (keterbacaan)** + **Arabic khusus**.

| Peran | Font | Catatan |
|-------|------|---------|
| Display / Heading | **Fraunces** (atau Lora / Source Serif 4) | serif hangat, sedikit "old-style", berjiwa |
| Body / UI | **Plus Jakarta Sans** (atau Hanken Grotesk) | humanis, buatan ID, bersih |
| Arab (umum) | **Noto Naskh Arabic** | RTL, teks Arab non-mushaf |
| Qur'an / mushaf | **Amiri Quran** / KFGQPC | untuk kutipan ayat |
| Mono (kode/angka teknis) | **JetBrains Mono** | invoice no., kode |

### Skala tipe (type scale — rasio ~1.25)
| Token | Size / Line | Pakai |
|-------|-------------|-------|
| `display` | 48–60 / 1.05 | hero |
| `h1` | 36 / 1.15 | judul halaman |
| `h2` | 28 / 1.2 | section |
| `h3` | 22 / 1.3 | sub-section / judul kartu |
| `body-lg` | 18 / 1.6 | teks materi (baca nyaman) |
| `body` | 16 / 1.6 | default |
| `sm` | 14 / 1.5 | meta, caption |
| `xs` | 12 / 1.4 | label kecil |

Aturan: heading pakai serif (`Fraunces`), berat 500–600. Body sans 400–500. **Hindari berat 800/black** kecuali angka statistik. Line-height teks baca minimal 1.6.

---

## 3. Spacing (skala 4px)

`0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96`

- Padding kartu: 20–24
- Gap antar section: 64–96 (lega = tenang)
- Gap dalam grup form: 12–16
- Container max-width: **1200px**; konten baca (artikel/materi): **680px** (lebar nyaman baca).

> **Whitespace adalah fitur.** Jangan padatkan. Keheningan visual = rasa khusyuk.

---

## 4. Radius, Border, Elevasi

- **Radius:** `sm 6px` (badge/input), `md 10px` (tombol/kartu kecil), `lg 16px` (kartu/panel), `xl 24px` (modal/hero), `full` (avatar). **Satu sistem, taat.**
- **Border:** 1px. Light: `kertas-200`. Dark: `malam-700`. Border lebih sering dipakai daripada shadow.
- **Elevasi (shadow hangat, bukan abu dingin):**
  - `e1`: `0 1px 2px rgba(33,29,22,.06)` — kartu diam
  - `e2`: `0 4px 16px rgba(33,29,22,.08)` — hover
  - `e3`: `0 12px 40px rgba(10,19,17,.24)` — modal/popover
  - Dark: ganti rona ke `rgba(0,0,0,..)` + sedikit glow `pelita` pada elemen aktif.

---

## 5. Cahaya & Tekstur (signature look)

- **Glow pelita:** elemen aktif/penting di dark mode boleh punya halo lembut warna pelita (mis. tombol primary, indikator live). Sangat halus — seperti nyala lampu, bukan neon.
- **Grain perkamen:** overlay noise super tipis (opacity ~3%) pada permukaan kertas besar agar tidak "flat digital".
- **Pola bintang/geometris Islami:** hanya di area besar (hero, footer, empty state), opacity rendah, sebagai tekstur — bukan dekorasi ramai.
- **Vignette malam:** hero dark diberi gelap di tepi agar fokus ke tengah (efek pelita di kegelapan).

> Semua efek di atas: **hemat & halus**. Begitu terasa "rame", berarti salah.

---

## 6. Ikonografi

- Set utama: **Lucide** (garis, stroke 1.75px, konsisten).
- Ikon kustom brand: **bulan sabit**, **pelita/lentera**, **kalong (siluet kelelawar yang elegan/geometris)**, **kitab terbuka**, **bintang**. Dipakai sebagai aksen identitas (loader, empty state, badge level).
- Ukuran ikon: 16 / 20 / 24. Sejajarkan optik dengan teks.
- ❌ Tidak ada emoji di chrome UI.

---

## 7. Motion

| Token | Durasi | Easing | Pakai |
|-------|--------|--------|-------|
| `quick` | 120ms | ease-out | hover, tap feedback |
| `base` | 240ms | cubic-bezier(.2,.0,.0,1) | transisi umum, modal |
| `slow` | 400ms | ease-out | masuk halaman, reveal |

- Filosofi: **meredup & menyala seperti lampu**, fade + sedikit translate (4–8px). Tidak ada bounce/spring.
- Hormati `prefers-reduced-motion`.

---

## 8. Grid & Responsif

- Breakpoint: `sm 640 · md 768 · lg 1024 · xl 1280`.
- **Mobile-first** (mayoritas santri di HP).
- Grid katalog: 1 kol (mobile) → 2 (md) → 3 (xl).
- Navigasi mobile: bottom-bar untuk area belajar (Beranda, Kelas, Live, Saya).

---

## 9. Token → Tailwind (ringkas)

```js
// tailwind.config — extend.colors (lihat 05-frontend-guidelines.md untuk lengkap)
colors: {
  pelita: { 50:'#FBF3E2',100:'#F6E6C4',300:'#E7C277',400:'#DCAE54',500:'#CE9A33',600:'#B5811F',700:'#8F6315' },
  zaitun: { 400:'#5E9C86',600:'#2F7A64',800:'#1C4C40' },
  malam:  { 300:'#9DB0A7',400:'#6E847B',600:'#2C463C',700:'#1E332B',800:'#15251F',900:'#0E1A17',950:'#0A1311' },
  kertas: { 50:'#FAF6EF',100:'#F2EBDD',200:'#E6DCC8',300:'#D4C6AC' },
  tinta:  { 700:'#3B352B',900:'#211D16' },
}
```

> Disarankan pakai **CSS variables + tema** agar light/dark tinggal tukar nilai token (lihat frontend guidelines).
