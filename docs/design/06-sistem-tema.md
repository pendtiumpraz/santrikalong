# Sistem Multi-Tema (Theme Engine)

> Status: **DRAFT** · 2026-06-01
> Hasil **diskusi 2 agent** (UI/UX Designer + Frontend Architect) + sintesis. Ini dokumen kanonik untuk theming. Mengubah `00`, `01`, `02`, `05` di bagian terkait.

---

## 0. Ringkasan Keputusan

Requirement: **light & dark mode, masing-masing punya beberapa template UI yang bisa dipilih user sesuai mood, plus tema default.**

Sintesis: **"Cahaya di Keheningan Malam" naik pangkat** dari "satu desain" menjadi **DNA brand + tema flagship**. Yang berubah per-tema hanya **palet (warna permukaan & aksen)** dan intensitas efek; **struktur tetap sama** (komponen, spacing, radius, motion, type-scale). Konsekuensinya: nambah tema = **murah** (cukup 1 set token), asalkan komponen disiplin pakai **token peran**, bukan warna brand langsung.

### Sudah DIKUNCI (konsensus 2 agent)
1. **Model 2 dimensi ortogonal:** `data-theme` (mood) × `data-mode` (light/dark) di `<html>`. Bukan `class="dark"`, bukan satu atribut gabungan.
2. **Token 3 lapis:** primitive (palet mentah) → **semantic/peran** (berubah per tema) → component. Komponen **hanya** boleh menyentuh token peran.
3. **Kontrak token wajib** (daftar di §3) — semua tema mengisi token yang sama. Termasuk token yang sebelumnya hilang: `--on-accent`, status, shadow-rona, glow, grain.
4. **Shadow & glow jadi token** (ikut berganti per tema), tidak lagi nilai literal di Tailwind config.
5. **Anti-FOUC via cookie + SSR** (baca di root layout, set atribut sebelum paint) + inline script kecil hanya untuk mode `system`. Root tetap Server Component.
6. **Persistensi:** cookie = sumber kebenaran runtime; DB profil = sumber lintas-device untuk user login.
7. **Prioritas resolusi tema (deterministik):** pilihan user > default per-route > `prefers-color-scheme` > default global (`default` + dark untuk first-touch landing).
8. **Theme switcher 2 titik:** quick toggle light/dark di navbar + pemilih tema penuh di Pengaturan (galeri preview live).
9. **Kontras = gate rilis:** setiap tema×mode wajib lolos tabel kontras AA sebelum publish.
10. **MVP kirim 2 tema penuh, arsitektur disiapkan untuk 5.**

### Masih TERBUKA (keputusan produk — lihat §7)
- D-A: Set & jumlah tema rilis pertama.
- D-B: Aksesibilitas (lansia/low-vision) sebagai **dimensi ortogonal** (`data-contrast` + skala teks) — **rekomendasi 2 agent: YA** — atau sebagai tema terpisah ("Tinta Jelas").
- D-C: Apakah **font berbeda per tema**? Rekomendasi: **tidak** (atau hanya display dari pool kecil) demi performa.
- D-D: Trade-off **SSG marketing vs no-flash** (boleh landing dynamic demi nol-flash?).

---

## 1. Konsep Tema (dari UI/UX)

Brand DNA (tetap di semua tema): serif scholarly + sans humanis + nuansa tenang + disiplin "satu aksen dominan per layar". Yang berbeda per tema: **warna cahaya & permukaan + intensitas tekstur**.

Usulan **5 tema** (semua punya light+dark; tiap tema punya *default mode* sendiri):

| Tema | Mood / Persona | Aksen kunci (light/dark) | Signature mode | Tekstur |
|------|----------------|--------------------------|----------------|---------|
| **Pelita Malam** ⭐ (default) | Khusyuk, scholarly, hangat. Santri pekerja, belajar selepas Isya. | emas `#CE9A33` / `#DCAE54` | **dark** | glow + grain (penuh) |
| **Kertas Subuh** | Bersih, modern-minimalis, jernih. Profesional muda. | biru teduh `#2F6F8F` / `#7FB6CE` | **light** | minim |
| **Tanah Liat** | Hangat-cozy, membumi. Suka suasana "rumah". | terakota `#B45A3C` / `#D98A6A` | light/dark | grain hangat |
| **Zaitun** | Klasik, tradisional, "pesantren". | hijau `#2F7A64` / `#5E9C86` (emas jadi sekunder) | light/dark | motif Islami hemat |
| **Tinta Jelas** † | Keterbacaan maksimal. **Lansia / low-vision.** | hijau gelap `#1A5C46` / kuning `#F4C542` | light/dark (high-contrast) | tanpa tekstur |

† Lihat D-B: kemungkinan **bukan tema**, melainkan dimensi aksesibilitas yang berlaku di semua tema.

> **Aturan penting (resolusi diskusi):** prinsip "satu cahaya" (`00 §3.1`) tetap berlaku — hanya **warna cahayanya** yang berbeda per tema. Tema membuktikan bahwa aksen **tidak harus emas** (Zaitun pakai hijau sebagai bintang, emas jadi pemanis) → inilah ujian apakah token peran benar-benar lepas dari warna brand.

---

## 2. Arsitektur Token (dari Frontend)

### 2.1 Dua atribut ortogonal
```html
<html data-theme="pelita-malam" data-mode="dark">
```
- `data-theme` = mood (ganti tanpa kehilangan light/dark).
- `data-mode` = `light | dark` (ganti tanpa kehilangan mood).
- Skalabel: bisa tambah `data-contrast="high"` untuk aksesibilitas (lihat D-B) tanpa rewrite.

Selector CSS jadi simetris & mudah di-review:
```css
[data-theme="pelita-malam"][data-mode="light"] { … }
[data-theme="pelita-malam"][data-mode="dark"]  { … }
```

### 2.2 Tailwind: util di-generate sekali, nilai dari CSS var
Kunci anti-bloat: **Tailwind hanya tahu token peran** (`bg-surface`, `text-fg`, `bg-brand`…). Tidak ada prefix `theme-x:`. Util digenerate sekali; nilainya ikut cascade CSS var.
```ts
// tailwind.config.ts (inti)
darkMode: ['selector', '[data-mode="dark"] &'],  // 'dark' = saat data-mode=dark
const rgb = (v) => `rgb(var(${v}) / <alpha-value>)`;
colors: {
  bg: rgb('--bg'), surface: rgb('--surface'), 'surface-alt': rgb('--surface-alt'),
  border: rgb('--border'), divider: rgb('--divider'),
  fg: rgb('--text'), muted: rgb('--text-muted'),
  brand: rgb('--brand'), 'brand-hover': rgb('--brand-hover'), 'brand-fg': rgb('--brand-fg'),
  ring: rgb('--ring'),
  success: rgb('--success'), warning: rgb('--warning'), danger: rgb('--danger'),
  info: rgb('--info'), live: rgb('--live'),
},
boxShadow: {  // shadow/glow kini token-able
  e1: '0 1px 2px rgb(var(--shadow-color) / calc(var(--shadow-strength)*.75))',
  e2: '0 4px 16px rgb(var(--shadow-color) / var(--shadow-strength))',
  e3: '0 12px 40px rgb(var(--shadow-color) / calc(var(--shadow-strength)*3))',
  glow: '0 0 24px rgb(var(--glow-color) / var(--glow-strength))',
},
```
> Catatan: format CSS var memakai **channel RGB tanpa `rgb()`** (`--bg: 250 246 239`) agar `<alpha-value>` Tailwind bekerja (`bg-surface/40`). Ini sudah benar di `05`.

### 2.3 Contoh blok tema (placeholder — nilai final perlu approval kontras)
```css
:root { /* global non-tema: radius, easing, font default */ }

[data-theme="pelita-malam"][data-mode="light"]{
  --bg:250 246 239; --surface:255 255 255; --surface-alt:242 235 221;
  --border:230 220 200; --divider:212 198 172;
  --text:33 29 22; --text-muted:59 53 43;
  --brand:181 129 31; --brand-hover:143 99 21; --brand-fg:255 255 255; --ring:206 154 51;
  --success:47 122 100; --warning:181 129 31; --danger:178 58 58; --info:47 111 143; --live:194 65 12;
  --shadow-color:33 29 22; --shadow-strength:.08; --glow-color:206 154 51; --glow-strength:0; --grain-opacity:.03;
}
[data-theme="pelita-malam"][data-mode="dark"]{
  --bg:14 26 23; --surface:21 37 31; --surface-alt:30 51 43;
  --border:30 51 43; --divider:44 70 60;
  --text:250 246 239; --text-muted:157 176 167;
  --brand:220 174 84; --brand-hover:231 194 119; --brand-fg:14 26 23; --ring:220 174 84;
  --success:94 156 134; --warning:220 174 84; --danger:224 133 133; --info:127 182 206; --live:249 115 22;
  --shadow-color:0 0 0; --shadow-strength:.35; --glow-color:206 154 51; --glow-strength:.25; --grain-opacity:.04;
}
/* Kertas Subuh, Zaitun, dst → blok serupa, ISI kontrak token yang sama */
```

---

## 3. Kontrak Token Wajib

Setiap tema **WAJIB** mendefinisikan semua token ini untuk **light DAN dark**. Build-time validator memastikan tak ada yang kurang (gagal CI bila bolong).

| Grup | Token |
|------|-------|
| Permukaan | `--bg` `--surface` `--surface-alt` `--border` `--divider` |
| Teks | `--text` `--text-muted` |
| Aksen | `--brand` `--brand-hover` `--brand-active` `--brand-fg` (**= on-accent, sebelumnya hilang**) `--brand-subtle` (bg highlight) `--ring` |
| Aksen sekunder | `--accent-2` (mis. zaitun di Pelita Malam) |
| Status | `--success` `--warning` `--danger` `--info` `--live` |
| Efek | `--shadow-color` `--shadow-strength` `--glow-color` `--glow-strength` `--grain-opacity` |
| Font (opsional) | `--font-display` `--font-body` (kosong = pakai default global) |

**Tetap GLOBAL, bukan per-tema** (jaminan "bukan bikin ulang"): spacing 4px, radius scale, motion/easing, breakpoint/grid, type-scale, container max-width.

---

## 4. Anti-FOUC, Persistensi & Resolusi (dari Frontend)

### 4.1 Root layout (Server Component, baca cookie → nol flash)
```tsx
// app/layout.tsx — TANPA "use client"
const jar = await cookies();
const { theme, mode } = resolveTheme({
  cookieTheme: jar.get('sk_theme')?.value,
  cookieMode:  jar.get('sk_mode')?.value,
  routeDefaultMode: 'dark', // diisi per segment layout (marketing=dark, read=light)
});
return (<html data-theme={theme} data-mode={mode} suppressHydrationWarning> … </html>);
```
- Membaca cookie → HTML SSR sudah membawa atribut tema yang benar = **FOUC hilang**.
- Inline script kecil di `<head>` hanya untuk menyelesaikan `mode="system"` dari OS sebelum paint.

### 4.2 Persistensi
- **Cookie** `sk_theme`/`sk_mode` (`SameSite=Lax`, ~1 thn, dapat dibaca JS untuk inline script) = sumber kebenaran render.
- **DB profil** (`preferredTheme`, `preferredMode`) untuk user login = sumber lintas-device. Saat login → tulis DB ke cookie. Saat ganti tema → tulis keduanya (cookie via Server Action, DB async).
- Ganti tema **optimistik di klien** (set atribut DOM langsung, tanpa reload) lalu persist via Server Action.

### 4.3 Prioritas resolusi (deterministik)
1. Pilihan eksplisit user (cookie/DB) — **selalu menang**.
2. Default per-route (marketing/live = dark; baca/dashboard/admin = light).
3. `prefers-color-scheme` OS.
4. Default global: `pelita-malam` + dark.

> **Revisi `00 §5`:** aturan "baca selalu light" **bukan paksaan**. Jadi *saran kontekstual* (toast sekali: "Mau mode terang untuk baca lama?"). Pilihan user tidak pernah di-override diam-diam.

---

## 5. Menambah Tema Baru (murah) & Penjaga Kualitas

**Target: tambah tema = tambah 2 blok CSS var (light+dark) + 1 entri di array `THEMES`. Nol perubahan komponen.**

Penjaga agar tema baru tak bocor:
- **Validator build-time**: parse tiap blok `[data-theme]`, pastikan semua token kontrak terisi (light & dark). Gagal CI bila kurang.
- **Halaman `/dev/theme-gallery`**: render semua komponen `02` dalam grid `THEMES × MODES` untuk review sekali jalan.
- **Uji kontras otomatis** untuk pasangan kritikal (`--text`/`--bg`, `--brand-fg`/`--brand`, `--ring`/`--surface`) tiap tema.

---

## 6. Implikasi ke Komponen (`02`) — WAJIB sebelum hi-fi

Ini **blocker #1** menurut kedua agent.

1. **Larang warna non-token di komponen.** ESLint blok kelas `^(pelita|zaitun|malam|kertas|tinta)-` dan hex inline di `components/ui|course|learn|live|admin`. Palet absolut hanya untuk aset brand (logo/ilustrasi).
2. **Hapus pasangan light/dark hardcoded di spesifikasi `02`.** Contoh lama: *"Surface: light kertas-50 + border kertas-200; dark malam-800…"* → ganti **satu kalimat token**: *"Surface `bg-surface`, border `border-border`."* Komponen tak lagi peduli light/dark/tema.
3. **Badge/status pakai token** (`text-success`, `bg-warning/10`, `text-live`) — bukan `zaitun-600`/`pelita`.
4. **Focus ring** `ring-ring` (bukan `pelita`). Pastikan kontras ring di tiap tema.
5. **Glow/shadow** via util token (`shadow-glow`, `shadow-e2`). Komponen tak menulis rgba sendiri.
6. **cva** memilih *token mana*, bukan *warna mana* (contoh Button di `05`). Otomatis benar di semua tema×mode.
7. **Transisi warna halus** saat ganti tema: hanya transisikan `background-color`/`color` di `body` (jangan `all` → jank), hormati `prefers-reduced-motion`.

---

## 7. Keputusan Produk yang Masih Terbuka

| ID | Pertanyaan | Rekomendasi 2 agent |
|----|-----------|---------------------|
| **D-A** | Tema apa saja di rilis pertama? | **Pelita Malam + Kertas Subuh** (flagship dark + clean light). Arsitektur siap 5. |
| **D-B** | Aksesibilitas: dimensi ortogonal (`data-contrast=high` + skala teks, berlaku di semua tema) atau tema "Tinta Jelas" terpisah? | **Dimensi ortogonal** — lebih kuat (tema apa pun bisa high-contrast/teks besar), lebih melayani lansia. |
| **D-C** | Font beda per tema? | **Tidak** (atau hanya display dari pool kecil). Alasan: performa (tiap font 30–150 KB). Bedakan tema lewat warna/tekstur/density. |
| **D-D** | SSG marketing vs no-flash | Pisahkan: marketing boleh static (default per-route + inline script); area app dynamic (sudah semestinya). |

---

## 8. Bagaimana ini mengubah dokumen lain
- `00 §5` — aturan default light/dark direvisi (lihat §4.3): pilihan user menang, dark hanya first-touch.
- `01 §1.5, §4, §5` — palet jadi **primitive**; tambah lapisan **semantic/peran** + kontrak token (§3); shadow/glow/grain jadi token.
- `02` (semua) — referensi warna → token peran (§6). Edit terbesar.
- `05 §2, §5, §7` — theme-engine 2 dimensi, anti-FOUC, persistensi, font pool.
