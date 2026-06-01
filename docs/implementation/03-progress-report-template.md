# Template Laporan Progress & Tracking — LMS santrikalong.com

> Status: DRAFT · 2026-06-01

Dokumen ini berisi template laporan **mingguan** dan **per milestone**, panduan **tracking status & burndown**, serta **contoh terisi (mock)** untuk satu minggu Fase 1. Semua template siap salin-tempel.

## Definisi Status Fase

| Status | Arti | Konsekuensi |
|--------|------|-------------|
| 🟢 **Hijau** | Semua exit criteria fase **lulus** | Boleh lanjut / rilis |
| 🟡 **Kuning** | Ada item **tertunda** tetapi **tidak memblokir** progres lain | Lanjut dengan catatan; pantau ketat |
| 🔴 **Merah** | Ada **gate CI / finansial gagal** | **TIDAK RILIS** sampai pulih |

> Aturan keras: **satu** item Merah → status fase = Merah. Tidak ada Merah tapi ada Kuning → Kuning. Semua lulus → Hijau.

---

# BAGIAN 1 — Template Laporan Progress MINGGUAN

> Salin blok di bawah setiap akhir minggu. Ganti `<...>`.

```markdown
# Laporan Mingguan — Fase <N> · Minggu <ke-N> (<tgl awal> s/d <tgl akhir>)

> Status Fase: 🟢/🟡/🔴 · Disusun oleh: <nama> · Tanggal: <YYYY-MM-DD>

## 1. Ringkasan Eksekutif
- <2–4 kalimat: apa yang dicapai, apa yang terhambat, keputusan yang dibutuhkan.>

## 2. Status Fase & Exit-Criteria Tracker
**Status keseluruhan: 🟢/🟡/🔴**

| # | Exit Criteria | Target | Aktual | Status | Catatan |
|---|---------------|--------|--------|--------|---------|
| 1 | <kriteria> | <target> | <aktual> | 🟢/🟡/🔴 | <catatan> |
| 2 | ... | ... | ... | ... | ... |

## 3. KPI Mingguan (dari Event Analitik)
Funnel checkout (event: `checkout_open` → `payment_pending` → `payment_success`):

| Tahap Funnel | Event | Jumlah | Konversi dari Tahap Sebelumnya |
|--------------|-------|--------|-------------------------------|
| Buka checkout | `checkout_open` | <n> | — |
| Mulai bayar | `payment_pending` | <n> | <%> |
| Bayar sukses | `payment_success` | <n> | <%> |
| Bayar gagal | `payment_failed` | <n> | <%> |

**KPI turunan:**
| Metrik | Target | Aktual | Status |
|--------|--------|--------|--------|
| Konversi checkout end-to-end (`checkout_open`→`payment_success`) | ≥ <x>% | <y>% | 🟢/🟡/🔴 |
| Error rate aplikasi (5xx + JS error / total request) | < <x>% | <y>% | 🟢/🟡/🔴 |
| Error rate pembayaran (`payment_failed` / `payment_pending`) | < <x>% | <y>% | 🟢/🟡/🔴 |
| Aktivasi pengguna baru (signup→enroll pertama) | ≥ <x>% | <y>% | 🟢/🟡/🔴 |

## 4. Status Gate CI
| Gate | Threshold | Hasil Terakhir | Status |
|------|-----------|----------------|--------|
| Build | Sukses | <pass/fail> | 🟢/🔴 |
| Unit test | 100% lulus | <x/y> | 🟢/🔴 |
| Coverage | ≥ <x>% | <y>% | 🟢/🟡/🔴 |
| Lint / typecheck | 0 error | <n> error | 🟢/🔴 |
| E2E (checkout happy path) | Lulus | <pass/fail> | 🟢/🔴 |
| Security scan (deps) | 0 high/critical | <n> | 🟢/🔴 |

## 5. PR Throughput
| Metrik | Minggu Ini | Minggu Lalu | Tren |
|--------|-----------|-------------|------|
| PR dibuka | <n> | <n> | ↑/↓/→ |
| PR di-merge | <n> | <n> | ↑/↓/→ |
| PR ditolak/ditutup | <n> | <n> | ↑/↓/→ |
| Rata-rata lead time (buka→merge) | <jam/hari> | <jam/hari> | ↑/↓/→ |
| PR menunggu review > 48 jam | <n> | <n> | ↑/↓/→ |

## 6. Blocker Register
| ID | Blocker | Dampak | Owner | Sejak | Target Resolusi | Status |
|----|---------|--------|-------|-------|-----------------|--------|
| B-<n> | <deskripsi> | 🔴/🟡 | <nama> | <tgl> | <tgl> | Open/In-Progress/Closed |

## 7. Risiko Aktif
| ID | Risiko | Likelihood | Impact | Mitigasi | Owner |
|----|--------|-----------|--------|----------|-------|
| R-<n> | <deskripsi> | H/M/L | H/M/L | <aksi mitigasi> | <nama> |

## 8. Rencana Minggu Depan
- [ ] <item 1 — owner, target>
- [ ] <item 2 — owner, target>
- [ ] <item 3 — owner, target>

## 9. Keputusan yang Dibutuhkan
- <keputusan dari stakeholder, deadline>
```

---

# BAGIAN 2 — Template Laporan PER MILESTONE

> Diisi saat sebuah milestone/fase ditutup. Fokus: kelulusan exit criteria + hasil usability test.

```markdown
# Laporan Milestone — Fase <N>: <nama milestone>

> Status Milestone: 🟢/🟡/🔴 · Periode: <tgl> s/d <tgl> · Disusun oleh: <nama>

## 1. Ringkasan Pencapaian
- <Tujuan milestone dan apakah tercapai. 3–5 kalimat.>

## 2. Exit-Criteria Final (Hijau/Kuning/Merah)
| # | Exit Criteria | Target | Aktual | Status | Bukti / Link |
|---|---------------|--------|--------|--------|--------------|
| 1 | SUS (System Usability Scale) | ≥ 80 | <skor> | 🟢/🟡/🔴 | <link laporan UT> |
| 2 | Task success rate | ≥ 90% | <x>% | 🟢/🟡/🔴 | <link> |
| 3 | Konversi checkout e2e | ≥ <x>% | <y>% | 🟢/🟡/🔴 | <link dashboard> |
| 4 | Error rate pembayaran | < <x>% | <y>% | 🟢/🟡/🔴 | <link> |
| 5 | Semua gate CI lulus | 100% | <status> | 🟢/🔴 | <link CI> |
| 6 | Rekonsiliasi finansial (settlement vs order) | 0 selisih | <selisih> | 🟢/🔴 | <link> |

**Keputusan Rilis:** ✅ RILIS / ⛔ TAHAN (alasan: <...>)
> Catatan: bila baris CI atau finansial = 🔴 → keputusan otomatis ⛔ TAHAN.

## 3. Hasil Usability Test
- **Metode:** <moderated / unmoderated>, **Peserta:** <n> (profil: <santri/pengajar/admin>)
- **Skenario diuji:** <daftar tugas>

| Tugas | Success Rate | Avg Time | Error / Friksi | Catatan |
|-------|-------------|----------|----------------|---------|
| <T1: daftar & login> | <x>% | <dtk> | <n> | <observasi> |
| <T2: pilih kelas & checkout> | <x>% | <dtk> | <n> | <observasi> |
| <T3: bayar & akses materi> | <x>% | <dtk> | <n> | <observasi> |

**SUS:**
| Metrik | Nilai |
|--------|-------|
| Skor SUS rata-rata | <skor>/100 |
| Interpretasi | <Excellent ≥80 / Good 68–79 / Poor <68> |

**Temuan Utama (prioritas):**
1. 🔴 <temuan kritis> → aksi: <...>
2. 🟡 <temuan sedang> → aksi: <...>
3. 🟢 <temuan minor> → backlog

## 4. Metrik Teknik & Kualitas
| Metrik | Target | Aktual | Status |
|--------|--------|--------|--------|
| Coverage | ≥ <x>% | <y>% | 🟢/🟡/🔴 |
| Bug terbuka (Critical/High) | 0 | <n> | 🟢/🔴 |
| Defect escape rate | < <x>% | <y>% | 🟢/🟡 |

## 5. Carry-over ke Fase Berikutnya
| Item | Alasan tidak selesai | Status (🟡 boleh lanjut?) | Owner |
|------|---------------------|---------------------------|-------|
| <...> | <...> | 🟡/🔴 | <...> |

## 6. Lessons Learned
- **Berjalan baik:** <...>
- **Perlu diperbaiki:** <...>
```

---

# BAGIAN 3 — Cara Tracking Status & Burndown (Sederhana)

## 3.1 Sumber data
| Data | Sumber | Cara ambil |
|------|--------|-----------|
| KPI funnel | Event analitik (`checkout_open`, `payment_pending`, `payment_success`, `payment_failed`) | Query dashboard analitik per minggu |
| Error rate | Log aplikasi + APM | Hitung (5xx+JS error)/total request |
| Gate CI | Pipeline CI | Ambil status run terakhir di branch utama |
| PR throughput | Repo Git | Hitung PR per status & lead time |
| Burndown | Board task (issue tracker) | Sisa task vs hari tersisa |

## 3.2 Tabel Burndown (per fase, harian/mingguan)
Cara hitung **Ideal Tersisa** = `Total Task × (Hari Tersisa / Total Hari)`.

| Hari/Minggu | Total Task | Selesai (kumulatif) | Sisa Aktual | Ideal Tersisa | Selisih (Aktual−Ideal) | Status |
|-------------|-----------|---------------------|-------------|---------------|------------------------|--------|
| M1 | 40 | 6 | 34 | 32 | +2 | 🟡 sedikit lambat |
| M2 | 40 | 15 | 25 | 24 | +1 | 🟢 on-track |
| M3 | 40 | 28 | 12 | 16 | −4 | 🟢 lebih cepat |
| M4 | 40 | 40 | 0 | 0 | 0 | 🟢 selesai |

**Aturan baca burndown:**
- Selisih ≤ 0 → 🟢 (on-track/lebih cepat)
- Selisih +1..+10% dari total → 🟡 (waspada)
- Selisih > 10% dari total **atau** menyentuh gate Merah → 🔴

## 3.3 Status board ringkas (papan harian)
| Kolom | Definisi "selesai" |
|-------|--------------------|
| Backlog | Belum dikerjakan |
| In Progress | Sedang dikerjakan (WIP limit ≤ 3 per orang) |
| Review | PR dibuka, menunggu review |
| Done | PR merged + gate CI hijau + deployed ke staging |

## 3.4 Ritme pelaporan
- **Harian:** update board + burndown (5 menit, async).
- **Mingguan:** isi Laporan Mingguan (Bagian 1), kirim Senin pagi untuk minggu sebelumnya.
- **Per milestone:** isi Laporan Milestone (Bagian 2) + sesi keputusan rilis.

---

# BAGIAN 4 — CONTOH TERISI (MOCK): Fase 1 · Minggu ke-2

# Laporan Mingguan — Fase 1 · Minggu ke-2 (2026-05-25 s/d 2026-05-31)

> Status Fase: 🟡 · Disusun oleh: Tim Inti santrikalong · Tanggal: 2026-06-01

## 1. Ringkasan Eksekutif
Funnel checkout sudah berfungsi end-to-end di staging dan E2E happy path lulus. Konversi `checkout_open`→`payment_success` masih di bawah target (62% vs 70%) karena drop tinggi di langkah pembayaran (banyak `payment_failed` dari satu kanal e-wallet). Tidak ada gate CI/finansial yang Merah, sehingga status fase **Kuning** — boleh lanjut sambil menutup blocker pembayaran.

## 2. Status Fase & Exit-Criteria Tracker
**Status keseluruhan: 🟡**

| # | Exit Criteria | Target | Aktual | Status | Catatan |
|---|---------------|--------|--------|--------|---------|
| 1 | Konversi checkout e2e | ≥ 70% | 62% | 🟡 | Drop di `payment_failed` e-wallet X |
| 2 | Error rate pembayaran | < 5% | 6,1% | 🟡 | Terkonsentrasi 1 kanal |
| 3 | E2E checkout happy path lulus | Lulus | Lulus | 🟢 | — |
| 4 | Rekonsiliasi finansial | 0 selisih | 0 selisih | 🟢 | 318/318 order cocok |
| 5 | Coverage modul checkout | ≥ 75% | 78% | 🟢 | — |

## 3. KPI Mingguan (dari Event Analitik)

| Tahap Funnel | Event | Jumlah | Konversi dari Tahap Sebelumnya |
|--------------|-------|--------|-------------------------------|
| Buka checkout | `checkout_open` | 512 | — |
| Mulai bayar | `payment_pending` | 401 | 78,3% |
| Bayar sukses | `payment_success` | 318 | 79,3% |
| Bayar gagal | `payment_failed` | 83 | 20,7% |

**KPI turunan:**
| Metrik | Target | Aktual | Status |
|--------|--------|--------|--------|
| Konversi checkout e2e (`checkout_open`→`payment_success`) | ≥ 70% | 62,1% | 🟡 |
| Error rate aplikasi (5xx + JS error / total request) | < 1% | 0,4% | 🟢 |
| Error rate pembayaran (`payment_failed`/`payment_pending`) | < 5% | 20,7% | 🔴* |
| Aktivasi pengguna baru (signup→enroll pertama) | ≥ 60% | 64% | 🟢 |

> *Catatan: error rate pembayaran 20,7% melebihi ambang, namun **bukan gate rilis Fase 1** (gate finansial = rekonsiliasi 0 selisih, yang lulus). Karena tidak memblokir, ditandai sebagai blocker prioritas, bukan Merah fase. Bila tetap di atas ambang saat penutupan milestone → menjadi 🔴 milestone.

## 4. Status Gate CI
| Gate | Threshold | Hasil Terakhir | Status |
|------|-----------|----------------|--------|
| Build | Sukses | pass | 🟢 |
| Unit test | 100% lulus | 214/214 | 🟢 |
| Coverage | ≥ 75% | 78% | 🟢 |
| Lint / typecheck | 0 error | 0 | 🟢 |
| E2E (checkout happy path) | Lulus | pass | 🟢 |
| Security scan (deps) | 0 high/critical | 0 | 🟢 |

## 5. PR Throughput
| Metrik | Minggu Ini | Minggu Lalu | Tren |
|--------|-----------|-------------|------|
| PR dibuka | 14 | 11 | ↑ |
| PR di-merge | 12 | 9 | ↑ |
| PR ditolak/ditutup | 1 | 2 | ↓ |
| Rata-rata lead time (buka→merge) | 11 jam | 19 jam | ↓ (membaik) |
| PR menunggu review > 48 jam | 1 | 3 | ↓ |

## 6. Blocker Register
| ID | Blocker | Dampak | Owner | Sejak | Target Resolusi | Status |
|----|---------|--------|-------|-------|-----------------|--------|
| B-07 | E-wallet X menolak ~25% transaksi (timeout callback) | 🔴 | Backend Pay | 2026-05-27 | 2026-06-04 | In-Progress |
| B-08 | Pesan error pembayaran tidak jelas → user tak retry | 🟡 | Frontend | 2026-05-29 | 2026-06-03 | Open |

## 7. Risiko Aktif
| ID | Risiko | Likelihood | Impact | Mitigasi | Owner |
|----|--------|-----------|--------|----------|-------|
| R-03 | Ketergantungan 1 kanal e-wallet menekan konversi | H | H | Tambah fallback kanal + retry otomatis | Backend Pay |
| R-04 | Beban naik saat promo akhir bulan belum diuji load | M | M | Load test sebelum penutupan Fase 1 | QA |

## 8. Rencana Minggu Depan
- [ ] Tutup B-07: implement retry + fallback kanal pembayaran — Backend Pay, target 2026-06-04
- [ ] Tutup B-08: perbaiki UX pesan error & tombol "coba lagi" — Frontend, target 2026-06-03
- [ ] Load test funnel checkout (target 3x trafik puncak) — QA, target 2026-06-05
- [ ] Siapkan sesi usability test untuk penutupan milestone Fase 1 — UX, target 2026-06-06

## 9. Keputusan yang Dibutuhkan
- Persetujuan menambah kanal pembayaran cadangan (biaya integrasi) — Product Owner, deadline 2026-06-03.

## (Lampiran) Burndown Fase 1 — sampai Minggu ke-2
| Minggu | Total Task | Selesai (kumulatif) | Sisa Aktual | Ideal Tersisa | Selisih | Status |
|--------|-----------|---------------------|-------------|---------------|---------|--------|
| M1 | 40 | 6 | 34 | 30 | +4 | 🟡 |
| M2 | 40 | 18 | 22 | 20 | +2 | 🟡 |

Interpretasi: progres sedikit di belakang ideal (+2 task, ~5% dari total) → 🟡, masih dapat dikejar bila B-07/B-08 ditutup minggu depan.
