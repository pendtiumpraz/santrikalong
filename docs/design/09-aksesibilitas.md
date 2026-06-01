# Aksesibilitas — Acceptance Criteria yang Bisa Di-test

> Status: **DRAFT** · 2026-06-01
> Menaikkan a11y dari "daftar niat" (`03 §5`, `05 §8`) jadi **kriteria terukur + cara test**.
> Target gate rilis: **WCAG 2.2 AA**. Setiap kriteria di sini = bisa dibuktikan otomatis atau manual.

---

## 1. Prinsip & Target
- **Gate rilis:** WCAG 2.2 AA. Tidak lolos = tidak rilis.
- **Otomatis (CI, blocking):** axe-core 0 critical/serious; Lighthouse a11y ≥ 95; kontras tiap tema×mode (`06 §5`).
- **Manual (per milestone):** screen reader, keyboard tuntas, reflow 200%, RTL.
- Persona dampak besar: **santri pekerja dewasa / lansia / presbiopia** (banyak user 40+) → kontras & ukuran teks bukan opsional.

---

## 2. Kontras & Warna
| Kriteria | Ambang | Cara test |
|---|---|---|
| Teks normal vs bg | ≥ 4.5:1 | Skrip kontras (`06 §5`) tiap tema×mode |
| Teks besar (≥24px / ≥19px bold) & komponen UI/ikon | ≥ 3:1 | idem |
| `--brand-fg` di atas `--brand` (teks tombol) | ≥ 4.5:1 | validator token |
| `--ring` vs `--surface` (focus ring) | ≥ 3:1 | validator token |
- **Warna bukan satu-satunya pembawa makna** (status pakai badge+ikon+teks, bukan warna saja).
- **Mode kontras tinggi** (`data-contrast=high`, `06 D-B`): dimensi ortogonal, berlaku di semua tema; wajib lolos pada zoom 200%.

---

## 3. Keyboard & Fokus
- **100% alur inti tuntas tanpa mouse:** auth, katalog→checkout, ruang belajar (player & kuis), studio (editor), live, admin.
- Focus order logis; **focus-visible ring** (`ring-ring`) selalu terlihat (`02 §1`).
- Tidak ada keyboard trap; modal/drawer/sheet: fokus terkurung di dalam, `Esc` menutup, fokus kembali ke pemicu.
- Skip-link "Lewati ke konten" di awal halaman.
- Touch/hit target ≥ **44×44px** (`02 §1`).
- Player video: play/pause/seek/volume/caption/fullscreen semua keyboard-operable.
- Kuis: navigasi soal, pilih opsi, submit — keyboard penuh; timeout→auto-submit umumkan via live region.

---

## 4. Form & Pesan
- Setiap field punya `<label>` terkait (bukan placeholder sebagai label).
- Error: `aria-describedby` ke pesan; **fokus pindah ke error pertama** saat submit gagal; `aria-invalid`.
- Grup (radio/checkbox/OTP): `fieldset`+`legend` atau `role=group` + label.
- Tombol ikon-only → `aria-label` deskriptif.
- Required ditandai teks/`aria-required`, bukan hanya warna.

---

## 5. Konten Dinamis, Media, Tabel
- **Live region:** chat live `aria-live="polite"` (jangan spam — batch); toast `role="status"`; error kritis `role="alert"`.
- **Caption WAJIB** untuk video (jadi field di editor materi `08 §3.4`); **transkrip** untuk audio (target).
- **Reduced motion:** `prefers-reduced-motion` → matikan animasi non-esensial; transisi tema hanya `background-color`/`color` (`06 §6.7`), bukan `all`.
- **Tabel admin:** `<th scope>`; mobile → kartu dengan label eksplisit per nilai (bukan tabel mengecil, `03 §6`).
- **Gambar/ikon:** alt bermakna; ikon dekoratif `aria-hidden`.
- **PDF/PPT viewer:** sediakan unduh + (idealnya) teks alternatif; jangan jadi satu-satunya jalur konten kritis.

---

## 6. Reflow, Teks, RTL
- **Reflow (WCAG 1.4.10):** zoom 200% / viewport 320px tanpa scroll horizontal & tanpa kehilangan konten/fungsi.
- **Text spacing (1.4.12):** layout tidak rusak saat line-height 1.5× / letter/word spacing dinaikkan.
- **Skala teks pengguna** (Pengaturan `08 §7`): slider ukuran berfungsi tanpa overflow.
- **RTL (Arab):** konten Arab `dir="rtl"` + `font-arabic`/`font-quran`; campur LTR/RTL inline (mufradat di tengah kalimat Indonesia) wajib diuji nyata — mirroring ikon arah (panah next/prev) saat RTL.
- Konten baca dibungkus `max-w-[680px]` + `leading-relaxed` (`05 §4.8`).

---

## 7. Screen Reader Smoke Test (manual, tiap milestone)
Uji **NVDA (Win) + VoiceOver (mac/iOS)** untuk alur: navigasi global, form auth, player+caption, kuis, tabel admin, live chat. Kriteria lulus: semua kontrol terbaca dengan nama+peran+state; tidak ada "clickable" tanpa nama; landmark (`header/nav/main/footer`) ada.

---

## 8. Komponen baru — catatan a11y (prasyarat sebelum hi-fi)
Komponen yang diminta layar `08` tapi belum ada di `02` harus memenuhi pola ARIA standar saat dibuat:
- **Stepper/Wizard:** `aria-current="step"`, status langkah terbaca.
- **Combobox/multi-select (RBAC):** pola ARIA combobox; keyboard penuh.
- **DatePicker/TimePicker (jadwal):** input teks alternatif + grid keyboard-navigable.
- **Drag-reorder (kurikulum/soal):** sediakan alternatif keyboard (pindah naik/turun) — drag bukan satu-satunya cara.
- **OTP input:** auto-advance tidak menjebak; tempel kode utuh didukung.
- **Command palette (Ctrl-K admin):** dialog modal ber-fokus, hasil `aria-activedescendant`.
- **Currency input (IDR):** umumkan nilai terformat; jangan halangi pengetikan angka.

---

## 9. Ceklis a11y per-PR (ringkas, masuk DoD `07 §6`)
- [ ] axe 0 critical/serious · Lighthouse a11y ≥ 95.
- [ ] Keyboard tuntas + focus terlihat + Esc/escape modal benar.
- [ ] Label form + error `aria-describedby` + fokus ke error pertama.
- [ ] Kontras lolos di tema×mode yang disentuh.
- [ ] Reflow 200% OK; reduced-motion dihormati.
- [ ] Caption ada (video) / transkrip (audio, target).
- [ ] RTL benar bila ada konten Arab.
