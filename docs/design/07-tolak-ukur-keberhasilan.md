# Tolok Ukur Keberhasilan Desain — Metrics, QA & Definition of Done

> Status: **DRAFT** · 2026-06-01
> Melengkapi (bukan menimpa) `00 §7` (yang masih kualitatif) dan `05 §10` (DoD visual).
> Tujuan: ubah "rasa berhasil" jadi **angka + cara ukur + gate rilis**. Kalau tidak bisa diukur, tidak masuk DoD.

---

## 0. Cara pakai dokumen ini
- **§1–§4** = KPI/metrik (apa target, cara ukur, cadence).
- **§5** = Design QA Checklist (review manual per layar sebelum merge).
- **§6** = Definition of Done visual yang DIPERLUAS (gabungan 05 §10 + a11y + performa + feel).
- **§7** = Gate CI yang **blocking** (PR tidak boleh merge bila merah).
- **§8** = Glossary microcopy (istilah baku, untuk konsistensi copy lintas tim).

---

## 1. Usability / Task Success

| Tugas inti | Metrik | Target | Cara ukur |
|---|---|---|---|
| Temukan → beli → mulai belajar | Task success rate | ≥ 90% | Moderated test n≥5/peran + funnel analitik |
| Beranda → "mulai belajar" | Jumlah klik | ≤ 3 klik (prinsip `03 §2.1`) | Click-path analytics |
| Lanjutkan belajar (return) | Time-to-resume dari dashboard | < 5 dtk | Event timing (`resume_clicked` → `lesson_ready`) |
| Ustadz buat 1 kelas + 1 materi | Completion tanpa bantuan | ≥ 80% | Studio onboarding test |
| Checkout | Drop-off (mulai → bayar) | < 30% | Funnel `checkout_open` → `payment_success` |
| Umum | SUS (System Usability Scale) | ≥ 80 (grade A) | Survei pasca-test tiap milestone |
| Umum | Error rate per tugas | < 1 error kritis/sesi | Observasi test |

**Instrumen analitik (event names baku — pakai konsisten):**
`page_view`, `catalog_filter_applied`, `course_view`, `checkout_open`, `payment_method_selected`, `payment_success`, `enroll_start`, `resume_clicked`, `lesson_ready`, `lesson_complete`, `quiz_submit`, `cert_issued`, `studio_class_create`, `studio_material_upload`, `payout_claim`. Setiap event wajib `role`, `theme`, `mode`.

---

## 2. Aksesibilitas (ringkas — detail di `09`)
- **Gate rilis: WCAG 2.2 AA.** Detail acceptance criteria & cara test ada di `09-aksesibilitas.md`.
- Ringkas target: kontras teks ≥ 4.5:1 / UI ≥ 3:1 (diuji otomatis tiap tema×mode, lihat `06 §5`); **0 violation kritis** axe-core; Lighthouse a11y ≥ 95 per halaman utama; 100% alur inti tuntas keyboard; reflow 200% tanpa horizontal scroll.

---

## 3. Performance Budget (per route class)

| Metrik | Marketing/Katalog | App (belajar/admin) |
|---|---|---|
| LCP | < 2.0s | < 2.5s |
| INP | < 200ms | < 200ms |
| CLS | < 0.1 | < 0.1 |
| TTFB | < 0.8s | < 1.0s |
| JS awal (gzip) | < 180 KB | < 220 KB |
| Font awal | ≤ 2 family, `display:swap`, subset latin; Arab/quran on-demand |

- Player/PDF/PPT/Chart = **dynamic import** (`05 §7`) → tidak dihitung budget awal.
- **Cara ukur:** Lighthouse CI (lab) + RUM (field, web-vitals) per route-class. `@next/bundle-analyzer` di pipeline; bila melewati budget → **blocking** (§7).
- CLS guard: semua media punya rasio tetap (16:9 thumbnail, A4 sertifikat) — wajib di DoD.

---

## 4. Mengukur "Feel" / Kepuasan (3 lapis)

**Lapis 1 — Atribut perasaan terukur**
- Micro-survey 1 pertanyaan pasca-sesi belajar: *"Seberapa tenang & fokus sesi tadi?"* (1–5). Target rata ≥ **4.2**.
- **Desirability test** (Microsoft Product Reaction Cards): kata positif ("tenang/terpercaya/hangat/khusyuk") ≥ **80%**; kata negatif ("ramai/dingin/murahan/template") < **10%**.

**Lapis 2 — Proxy perilaku** (bukti "ingin tinggal belajar")
- Session duration di Ruang Belajar, completion rate materi, return rate H+7, rasio penggunaan mode terang/gelap (sinyal kenyamanan baca).

**Lapis 3 — Kepuasan relasional**
- NPS platform ≥ **40**; CSAT support ≥ **4/5**.

**Brand-fidelity (anti-slop) — review desainer wajib:** setiap layar dinilai terhadap `00 §4`. Target **100% layar lolos** "tidak terlihat seperti template AI". Masuk DoD (§6) & QA (§5).

> **Cadence:** usability test tiap milestone besar · analitik mingguan · survei feel bulanan · a11y+perf+kontras di CI tiap PR.

---

## 5. Design QA Checklist (review manual per layar sebelum merge)

**A. Brand & anti-slop (`00 §4`)**
- [ ] Tidak ada emoji di chrome UI (hanya Lucide / ikon brand).
- [ ] Tidak ada gradient norak / shadow abu tebal / warna default Tailwind mentah.
- [ ] Heading serif (`font-display`), body sans, Arab pakai font Arab + `dir="rtl"`.
- [ ] Maks **1** elemen `pelita`/`brand` dominan per viewport; maks 1 primary per section.
- [ ] Whitespace lega (gap antar-section ≥ 64); densitas tidak sesak.

**B. Token & konsistensi (`06`)**
- [ ] Hanya token peran (`bg-surface`, `text-fg`, `text-brand`, `ring-ring`, `text-success`…). Tidak ada `pelita-`/`malam-`/hex inline (kecuali aset brand).
- [ ] Spacing dari skala 4px; satu sistem radius; shadow `e1/e2/e3` & `glow` via token.
- [ ] Rapi di **light DAN dark**, dan di ≥ 2 tema rilis (Pelita Malam + Kertas Subuh).

**C. State lengkap (`08 §State`)**
- [ ] Loading = skeleton sesuai bentuk (bukan spinner layar penuh).
- [ ] Empty = ikon brand + 1 kalimat hangat + 1 aksi (voice `00 §6`).
- [ ] Error = penyebab singkat + jalan keluar, tidak menyalahkan.
- [ ] Success = toast halus / inline; momen selesai materi boleh doa ringan secukupnya.
- [ ] Aksi destruktif (hapus modul/soal/kelas) punya **undo-toast 5s** ATAU konfirmasi eksplisit.
- [ ] Form panjang (editor kelas/kuis): konfirmasi "Perubahan belum disimpan?" saat keluar.

**D. Copy (lihat glossary §8)**
- [ ] Istilah konsisten (mis. "kajian" vs "kelas" sesuai konteks; "santri" bukan "user").
- [ ] Tidak ada placeholder lorem / "Lorem ipsum" / teks debug.

**E. Responsif & a11y (ringkas, detail `09`)**
- [ ] Frame mobile ada (sheet/drawer/bottom-nav), bukan tabel mengecil.
- [ ] Keyboard tuntas + focus ring terlihat; ikon-only button punya `aria-label`.
- [ ] Kontras lolos; reflow 200% tanpa scroll horizontal.

---

## 6. Definition of Done — Visual (gabungan & diperluas)

> Menggantikan checklist `05 §10` sebagai versi lengkap. Layar dianggap **DONE** jika SEMUA terpenuhi:

**Visual & token**
- [ ] Hanya token semantik (lolos lint anti-slop `05 §4`).
- [ ] Heading serif, body sans, Arab pakai font Arab.
- [ ] Maks 1 cahaya `brand` dominan; komposisi tenang.
- [ ] Rapi di light & dark + ≥ 2 tema rilis.

**Fungsional state**
- [ ] Punya state: loading / kosong / error / sukses (+ partial & 403 bila relevan).
- [ ] Aksi destruktif punya undo/konfirmasi.

**Aksesibilitas (gate)**
- [ ] axe-core: **0 violation kritis/serius**.
- [ ] Lighthouse a11y ≥ 95.
- [ ] Keyboard 100% alur inti; focus order logis.
- [ ] Caption tersedia untuk video (field di editor materi); transkrip audio (target).
- [ ] Reflow 200% OK; reduced-motion dihormati.

**Performa (gate)**
- [ ] Route lolos budget §3 (LCP/INP/CLS/bundle).
- [ ] Media berat dynamic import; rasio media tetap (no CLS).

**Feel & copy**
- [ ] Lolos brand-fidelity review (`00 §4`).
- [ ] Copy sesuai glossary §8 & voice `00 §6`.

---

## 7. Gate CI (blocking — PR merah tidak boleh merge)

| Gate | Tool | Ambang |
|---|---|---|
| Lint anti-slop | ESLint custom (`06 §6.1`) | 0 pelanggaran token/hex |
| Kontras tema | Skrip kontras (`06 §5`) | semua pasangan kritikal lolos AA, **tiap tema×mode** |
| Aksesibilitas | axe-core (Playwright) per halaman utama | 0 critical/serious |
| Lighthouse | LHCI (a11y + perf) | a11y ≥ 95; perf sesuai budget §3 |
| Bundle size | `@next/bundle-analyzer` + size-limit | ≤ budget §3 per route-class |
| Token kontrak | Validator build-time (`06 §5`) | semua token kontrak terisi light+dark |

> Non-blocking (warning): RUM web-vitals tren, SUS/NPS (manual, milestone).

---

## 8. Glossary Microcopy (istilah baku — kunci konsistensi copy)

| Konteks | PAKAI | HINDARI |
|---|---|---|
| Konten berbayar terstruktur (modul+materi) | **Kelas** | course, kursus |
| Sesi keilmuan (umum/marketing/live) | **Kajian** | webinar, meeting |
| Event terjadwal multi-sesi | **Dauroh** | seminar, bootcamp |
| Pengguna pembelajar | **Santri** | user, member, pelanggan |
| Pengajar | **Ustadz** (atau "Pengajar" netral di admin) | guru, mentor, kreator |
| Unit belajar (video/PDF/dll) | **Materi** | konten, lesson (di copy user) |
| Kelompok materi | **Modul** / **Bab** | section, chapter |
| Beli akses kelas | **Daftar** / **Beli & Mulai** | checkout (di copy user), order |
| Saldo ustadz | **Saldo** | balance, dompet (kecuali label "Wallet" internal) |
| Klaim saldo ke rekening | **Klaim Payout** | withdraw, tarik tunai |
| Verifikasi sertifikat | **Sertifikat sah/tidak ditemukan** | valid/invalid |
| Doa/apresiasi | **"Baarakallahu fiik"** (secukupnya) | berlebihan/di setiap aksi |

> Aturan tone (`00 §6`): santun, hangat, tidak menyalahkan, tidak lebay. Error selalu menawarkan jalan keluar.
