# Rencana Implementasi & Manajemen Proyek — LMS santrikalong.com

> Status: **DRAFT** · 2026-06-01

Dokumen ini adalah rencana eksekusi tunggal (single source of truth) untuk pengembangan LMS santrikalong.com. Acuan fase selaras dengan `docs/06-roadmap.md` dan peran selaras dengan `docs/01-roles-rbac.md`.

## Prinsip Eksekusi
1. **Bangun alur uang & akses dulu.** Enrollment + pembayaran + proteksi konten adalah jalur paling berisiko; selesaikan dan kunci lebih awal.
2. **Provider managed untuk video & live.** Hindari jebakan infra di awal (adapter agar tidak lock-in).
3. **Beta sebelum publik.** Internal → beta tertutup → beta terbuka terbatas → publik, dengan gate finansial 0 toleransi.
4. **CI gate sejak Fase 0.** Kualitas, a11y, dan anti-slop dijaga otomatis, bukan manual di akhir.
5. **Semua fitur baru di balik feature flag** (default off) + kill-switch untuk jalur kritikal.

---

## 1. Milestone & Fase

| Fase | Milestone | Fokus | Definisi Selesai (Exit Criteria) |
|------|-----------|-------|-----------------------------------|
| **F0** | Fondasi siap | Repo + CI, Prisma schema/ERD, Auth dasar, design token light/dark + 2 tema, deploy staging | Migrasi DB jalan; auth `register → verifikasi → login` dengan **DB session yang revocable**; CI gate **blocking** (lint anti-slop, kontras tema, axe-core, LHCI a11y ≥95 & perf budget, bundle size); validator design token aktif |
| **F1** | MVP On-demand + Pembayaran — **GATE BETA TERTUTUP** | Santri bisa daftar → beli → belajar kelas on-demand | RBAC penuh; approval ustadz + `teacher_agreement`; consent ToS/Privacy/marketing; CRUD kelas→modul→materi; viewer PDF + player video/audio via **signed URL**; enrollment + progress; checkout Midtrans + Manual (toggle); quiz objektif auto-grade; panel superadmin inti; notifikasi. Lihat **§5 Kriteria Rilis** untuk gate beta lengkap |
| **F2** | Live & Penyempurnaan — **GATE BETA TERBUKA** | Live, event, monetisasi tambahan | Live e2e (`jadwal → host → santri terenroll → VOD`) + attendance; rekaman → VOD; Dauroh event; PPT viewer (worker konversi PDF stabil + HTML PPT sandbox); sertifikat dengan `verifyCode` + endpoint verifikasi; gateway Tripay & Xendit **lulus uji kontrak adapter + idempotensi**; kupon; rating/review; analitik ustadz |
| **F3** | Skala & Engagement — **GATE PAYROLL** | Monetisasi lanjutan, keuangan ustadz, engagement | Membership; revenue share + payout + pajak; anti-fraud ledger; gamifikasi; forum; WA/push; multi-bahasa & RTL; quiz live; PWA. Gate payroll: lihat **§5.4** |

### Status Kesehatan Fase
- **Hijau** — semua exit criteria fase lulus → boleh lanjut/rilis.
- **Kuning** — ada item tertunda namun **non-blocking** → lanjut bersyarat dengan catatan.
- **Merah** — ada gate atau item **finansial** gagal → **TIDAK rilis**, fokus remediasi.

---

## 2. Dependensi Antar Fase

```
F0 Fondasi
  └─(auth, RBAC base, CI gate, signed-URL infra, design token)─┐
                                                               ▼
F1 MVP + Pembayaran  ── alur uang utuh + state machine order + outbox ──┐
                                                                        ▼
F2 Live & Penyempurnaan ── adapter gateway teruji + worker konversi ────┐
                                                                        ▼
F3 Skala ── ledger keuangan (butuh order/refund F1 + gateway F2) + payout
```

| Dependensi | Penjelasan |
|-----------|------------|
| F1 → butuh F0 | Auth revocable, RBAC base, signed-URL infra, dan CI gate harus ada sebelum membangun enrollment & pembayaran. |
| F2 → butuh F1 | VOD dari rekaman live mewarisi proteksi konten (signed URL) F1; gateway tambahan reuse **state machine order** & idempotensi webhook F1. |
| F3 → butuh F1 + F2 | Ledger & payout bergantung pada `Order`/`refund` (F1) dan settlement multi-gateway (F2). Pajak bergantung pada data `UstadzYearlyRevenue` berjalan. |
| Lintas fase | **Adapter pattern** gateway diperkenalkan di F1 (Midtrans/Manual) dan wajib dipakai konsisten di F2 (Tripay/Xendit) untuk hindari lock-in. |

---

## 3. RACI Ringkas

Peran: **Superadmin/Owner**, **PM**, **Dev** (termasuk QA Lead engineering), **QA**, **Desainer**.
R = Responsible (mengerjakan) · A = Accountable (penanggung jawab akhir, 1 orang) · C = Consulted · I = Informed.

| Aktivitas | Superadmin/Owner | PM | Dev | QA | Desainer |
|-----------|:---:|:---:|:---:|:---:|:---:|
| Prioritas fitur & scope fase | A | R | C | C | C |
| Desain UX/UI & design token/tema | C | C | C | I | **R/A** |
| Arsitektur teknis & ERD/skema | I | C | **R/A** | C | I |
| Implementasi fitur | I | I | **R/A** | C | C |
| CI gate (lint/a11y/perf/bundle) | I | C | R | **A** | C |
| Pengujian (fungsional, e2e, a11y, usability) | I | C | C | **R/A** | C |
| Verifikasi exit criteria per fase | A | R | C | **R** | C |
| Keputusan rilis (naik tahap beta/publik) | **A** | R | C | C | I |
| Toggle feature flag & kill-switch (produksi) | **A/R** | C | R | I | I |
| Konfigurasi gateway pembayaran & mode | **A/R** | I | C | C | I |
| Approval ustadz & RBAC produksi | **A/R** | I | C | I | I |
| Insiden finansial (pembekuan, rekonsiliasi) | **A** | C | R | R | I |
| Manajemen risiko & risk register | C | **A/R** | C | C | I |
| Komunikasi stakeholder & status report | C | **A/R** | I | I | I |

---

## 4. Risk Register

Skala dampak/likelihood: **T**inggi · **S**edang · **R**endah.

| ID | Risiko | Dampak | Likelihood | Mitigasi | Owner |
|----|--------|:------:|:----------:|----------|-------|
| **R1** | Webhook pembayaran ganda/telat/hilang | T | S | `UNIQUE(provider, eventId)` + state machine order + cron rekonsiliasi + expire pesanan tergantung | Dev |
| **R2** | Signature webhook palsu / replay attack | T | S | Verifikasi signature **wajib** (gagal → 401) + rate limit + simpan `payloadRaw` untuk audit | Dev |
| **R3** | Kebocoran konten (video/PDF di-share) | T | S | Signed URL **on-the-fly** + cek enrollment tiap akses + rate limit + URL expired | Dev |
| **R4** | Double-claim payout ustadz | T | S | Ledger `WalletEntry` + transaction lock + `idempotencyKey` + **partial-unique 1 klaim aktif** + nominal dihitung server + status HOLD | Dev |
| **R5** | Klaim saldo atas penjualan yang lalu di-refund | T | S | Refund-window + tunggu settle + `REVERSAL` entry + clawback | Dev |
| **R6** | Disbursement (pencairan) dobel | T | R | Idempotency reference ke gateway + rekonsiliasi harian + alarm selisih | Dev |
| **R7** | Account takeover lalu ganti rekening | T | R | Tahan payout X hari setelah ubah rekening + verifikasi rekening + approval manual | Superadmin/Owner |
| **R8** | Pemalsuan dokumen (sertifikat/bukti potong) | S | S | PDF di-generate server-side, **bernomor** + `verifyCode` + QR + `contentHash` tamper-evident | Dev |
| **R9** | Aturan pajak berubah | S | S | `TaxSetting`/`TaxBracket` configurable + `effectiveDate` (tidak recompute history) + `UstadzYearlyRevenue` berjalan | PM |
| **R10** | Live streaming tidak stabil | S | S | Provider managed + token akses + auto-reconnect + fallback ke VOD + feature flag `live` | Dev |
| **R11** | Lock-in ke satu provider pembayaran | S | R | Adapter pattern + dukung multi-gateway sejak desain F1 | Dev |
| **R12** | Biaya AI membengkak | S | S | `AiUsageLog` + budget cap + rate limit + output selalu status **DRAFT** (manusia approve) | PM |
| **R13** | Pelanggaran consent / kebocoran PII | T | R | `ConsentRecord` append-only + status marketing real-time + audit log + **PII tidak pernah dikirim ke LLM** | Superadmin/Owner |
| **R14** | Kesulitan migrasi ke multi-tenant kelak | S | R | Tambahkan `tenantId?` defensif sejak awal (nullable, tidak dipakai di MVP) | Dev |
| **R15** | Scope creep antar fase | S | T | Exit criteria ketat + semua fitur baru di balik feature flag + gate per fase | PM |
| **R16** | CI gate memperlambat tim | R | S | Gate diberlakukan sejak F0 agar jadi kebiasaan; paralelisasi job; cache build | QA |

---

## 5. Kriteria Rilis (Beta Tertutup → Publik)

Tahapan rilis: **Internal → Beta Tertutup → Beta Terbuka Terbatas → Publik.**
Akses tahap beta dikontrol via permission **`beta.access`** (beta gating).

### 5.1 Beta Tertutup — di akhir **F1**
Audiens: ustadz & santri **terkurasi**, transaksi **nominal kecil** + lingkungan **sandbox** gateway.

Gate (semua wajib lulus):
- **Alur uang utuh:** `Daftar → Beli & Mulai → enrollment via outbox → akses signed URL` berjalan end-to-end.
- **Idempotensi webhook terbukti:** `UNIQUE(provider, eventId)` + partial-unique `(userId, courseId)`.
- **State machine order** lengkap (transisi status valid, tidak ada state ilegal).
- **Proteksi konten:** tanpa enrollment = tanpa akses; signed URL benar-benar expired.
- **Consent:** tercatat, dapat dicabut, dan re-consent berfungsi.
- **Metrik UX:** task success ≥ **90%**, checkout drop-off < **30%**.
- **DoD** (Definition of Done) tiap item F1 lengkap; status fase **Hijau**.

### 5.2 Beta Terbuka Terbatas — di akhir **F2**
- Semua gate F1 tetap **Hijau** dan stabil di produksi.
- Live e2e + attendance lulus; VOD dari rekaman aman (signed URL).
- Gateway tambahan (Tripay/Xendit) lulus **uji kontrak adapter + idempotensi**.
- Sertifikat dengan endpoint verifikasi publik berfungsi.
- PPT→PDF worker stabil; HTML PPT ter-sandbox.
- Kapasitas/kuota peserta dibatasi (terbuka **terbatas**).

### 5.3 Publik
- **KPI F1 stabil** sepanjang periode beta terbuka (task success ≥90%, checkout drop-off <30%).
- **0 insiden finansial** (tidak ada double-charge, double-payout, selisih rekonsiliasi tak terjelaskan).
- Semua kill-switch & monitoring/alarm aktif dan teruji.
- Runbook insiden finansial & privasi tersedia.

### 5.4 Gate Payroll — bagian dari **F3** (prasyarat aktivasi `payout`)
- `saldo == SUM(WalletEntry)` selalu konsisten.
- **Anti double-claim** teruji: race test, `idempotencyKey` ganda, partial-unique (hanya 1 klaim aktif).
- Earning **claimable** hanya setelah refund-window lewat **dan** settle.
- Refund → entry `REVERSAL` + clawback otomatis.
- Disbursement **idempoten**.
- Rekonsiliasi harian: `SUM(ledger) == SUM(payout) + saldo == settlement gateway`; **selisih → alarm + bekukan payout**.
- Pajak: `effectiveDate` configurable, **tidak** me-recompute history.
- Bukti potong + `DocumentRecord` **bernomor** & tamper-evident.

---

## 6. Feature Flags & Kill-Switch

### 6.1 Feature Flags (default **OFF**)
Flag aplikasi: `live`, `dauroh`, `payout`, `gamifikasi`, `membership`, `coupon`, `ai_quiz`.
- Diaktifkan bertahap mengikuti kelulusan exit criteria fase terkait.
- Toggle dilakukan oleh **Superadmin/Owner** (RACI §3).

### 6.2 Toggle Gateway
- Per-gateway via `PaymentGateway.isActive` + `mode` (sandbox/production).
- Memungkinkan rollout/rollback gateway tanpa deploy ulang.

### 6.3 Beta Gating
- Akses fitur tahap beta dibatasi via permission **`beta.access`** (di-grant ke audiens terkurasi).

### 6.4 Kill-Switch (matikan cepat saat insiden)
| Kill-switch | Pemicu | Efek |
|-------------|--------|------|
| `payment` | Anomali transaksi / kebocoran gateway | Setop seluruh proses pembayaran masuk |
| `payout` | Alarm rekonsiliasi / dugaan fraud | **Bekukan** semua pencairan saldo ustadz |
| `ai.generate` | Budget cap terlampaui | Setop generasi AI (output tetap DRAFT) |
| `live` | Provider live tidak stabil | Setop sesi live, fallback ke VOD |

> Kill-switch finansial (`payment`, `payout`) berstatus **Accountable: Superadmin/Owner** dan setiap pemicuan dicatat di audit log.

---

## 7. Cadence & Tata Kelola

- **Sprint:** 1–2 minggu.
- **Daily async standup** (tertulis, tidak memblok).
- **Weekly review** terhadap exit criteria + KPI fase berjalan.
- **Demo + retro** tiap akhir sprint.
- **Usability test** tiap milestone (verifikasi metrik task success & drop-off).
- **Status fase** dilaporkan dengan kode warna Hijau/Kuning/Merah (lihat §1) di tiap weekly review.

---

## 8. Referensi Dokumen Terkait
- `docs/06-roadmap.md` — roadmap & filosofi fase.
- `docs/01-roles-rbac.md` — peran & RBAC.
- `docs/04-pembayaran.md` — desain pembayaran & gateway.
- `docs/05-data-model.md` — model data.
- `docs/08-penggajian-ustadz-pajak.md` — penggajian & pajak ustadz.
- `docs/09-keamanan-payout-bukti.md` — keamanan payout & bukti.
- `docs/10-consent-marketing.md` — consent & marketing.
- `docs/backend/03-security-schema.md`, `docs/backend/04-prompt-guarding.md`, `docs/backend/05-ai-usage.md` — keamanan, prompt guarding, AI usage.
