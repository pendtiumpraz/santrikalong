# Strategi QA — LMS santrikalong.com

> Status: DRAFT · 2026-06-01

Dokumen ini adalah acuan tunggal strategi pengujian kualitas (QA) untuk platform LMS santrikalong.com. Stack: Next.js + TypeScript + Prisma; e2e menggunakan Playwright. Dokumen bersifat actionable: setiap bagian dapat langsung diturunkan menjadi tiket kerja, test case, dan gate CI.

---

## 1. Piramida Tes & Cakupan

Filosofi: banyak tes cepat & deterministik di bawah, sedikit tes mahal & rapuh di atas. Logika bisnis kritikal (uang, akses, pajak) wajib diuji pada level terendah yang masih representatif.

```
            /\
           /  \   E2E Playwright (alur inti, blocking)  ~10%
          /----\
         /      \  Integrasi (state-machine, idempotensi,
        /        \ gating, concurrency/race)            ~30%
       /----------\
      /            \ Unit (service layer, util, kalkulasi) ~60%
     /--------------\
```

### 1.1 Lapisan Unit — Service Layer

Sasaran: fungsi murni & service layer tanpa I/O nyata (DB & gateway di-mock atau pakai in-memory).

- Kalkulasi: pajak per bracket, potongan non-NPWP, pembulatan, agregasi wallet.
- Validator: input webhook, signature parsing, schema DTO.
- Reducer state-machine: transisi status pembayaran/payout/enrollment (fungsi murni `next(state, event)`).
- Util: signed URL builder, token TTL, verifyCode generator.

Target coverage: **service layer ≥ 80% line + ≥ 75% branch**. Modul uang/pajak/akses (`payment`, `payout`, `tax`, `rbac`, `content-access`) wajib **≥ 90% branch**.

### 1.2 Lapisan Integrasi

Sasaran: interaksi nyata service ↔ DB (Prisma di atas Postgres via Testcontainers) dan ↔ API route (supertest).

- **State-machine end-to-end DB**: transisi tersimpan benar, transisi ilegal ditolak & tidak mengubah state.
- **Idempotensi**: pemrosesan event yang sama dua kali tidak menggandakan efek (saldo, klaim, enrollment).
- **Gating**: query akses konten benar-benar memfilter berdasarkan enrollment aktif.
- **Concurrency/race (payout & wallet)**: dua transaksi paralel pada saldo/klaim yang sama tidak menyebabkan double-spend, saldo negatif, atau klaim ganda. Diuji dengan `Promise.all` request bersamaan + assertion invariant saldo.

Target coverage: jalur kritikal (pembayaran, payout, wallet, RBAC, gating) **wajib punya minimal 1 happy path + ≥ 2 jalur kegagalan/edge** masing-masing.

### 1.3 Lapisan E2E — Playwright (Blocking)

Alur inti yang **wajib hijau** sebelum rilis (jika merah → rilis diblokir):

1. Registrasi → enroll → bayar (sandbox sukses) → akses konten terbuka.
2. Pembayaran expire/gagal → konten tetap terkunci.
3. Tutor menyelesaikan kelas → klaim payout → status payout berubah → bukti PDF tersedia.
4. Admin RBAC: user tanpa permission tidak dapat membuka halaman/aksi terlarang.
5. Live session: join dengan token valid, reconnect setelah putus, rekaman muncul sebagai VOD.
6. Consent: setujui → cabut → status & marketing list terupdate.

Target: 100% alur inti di atas tercakup & blocking. Smoke subset (alur 1, 4) berjalan di setiap PR; full suite di pre-merge ke `main` & nightly.

---

## 2. Tooling

| Kebutuhan | Tool | Catatan |
|---|---|---|
| Unit & integrasi runner | **Vitest** (default; Jest diterima bila modul legacy) | cepat, ESM-native, cocok Next/TS |
| API route / handler testing | **supertest** | uji HTTP handler tanpa browser |
| DB nyata terisolasi | **Testcontainers + Postgres** | container per suite, migrasi Prisma dijalankan saat setup |
| E2E browser | **Playwright** | multi-browser, trace on failure, retry 1x di CI |
| Aksesibilitas | **axe-core** (`@axe-core/playwright`) | dijalankan di dalam tes Playwright halaman kritikal |
| Performa web | **Lighthouse CI (LHCI)** | budget & assertion di CI |
| Mock gateway/webhook | MSW / nock untuk unit; sandbox gateway untuk integrasi/e2e | signature ditandatangani dengan secret sandbox |
| Coverage report | c8/istanbul via Vitest | diunggah ke CI, gate threshold |

Prinsip: DB di-mock hanya di lapisan unit; lapisan integrasi & e2e memakai Postgres nyata (Testcontainers/sandbox env) agar constraint, partial-unique index, dan transaksi teruji sungguhan.

---

## 3. QA Checklist per Fitur Kritikal

Setiap kasus uji ditulis sebagai: **Given–When–Then**. Status target: semua kasus "Wajib" hijau sebelum rilis fitur.

### 3.1 Pembayaran

| ID | Kasus uji | Ekspektasi | Level |
|---|---|---|---|
| PAY-01 | Webhook valid pertama kali | Pembayaran `PAID`, enrollment aktif, saldo/ledger tercatat 1x | Integrasi |
| PAY-02 | **Replay/duplikat webhook** (event id sama dikirim 2–3x) | Idempoten: status & ledger tidak berubah pada pengiriman ke-2/3, respon 200 | Integrasi |
| PAY-03 | **Signature palsu/diubah** | Ditolak (401/400), tidak ada perubahan state, dicatat di audit log | Integrasi |
| PAY-04 | Webhook tanpa header signature | Ditolak, tidak diproses | Integrasi |
| PAY-05 | **Expire**: invoice lewat batas waktu, lalu webhook `PAID` datang terlambat | Transisi `EXPIRED`→`PAID` ditolak oleh state-machine; konten tetap terkunci; alert rekonsiliasi | Integrasi |
| PAY-06 | **State machine**: transisi ilegal (`PAID`→`PENDING`, `EXPIRED`→`PENDING`) | Ditolak, state utuh | Unit + Integrasi |
| PAY-07 | **Manual proof** (bukti transfer di-upload) | Status `WAITING_REVIEW`; hanya admin ber-permission yang dapat approve/reject; approve memicu enrollment | Integrasi + E2E |
| PAY-08 | Manual proof ditolak admin | Status `REJECTED`, enrollment tidak aktif, user dapat unggah ulang | Integrasi |
| PAY-09 | Webhook untuk invoice yang tidak ada / mismatch amount | Ditolak, dicatat, tidak mengubah state lain | Integrasi |
| PAY-10 | Pembayaran sukses E2E sandbox | Akses konten terbuka segera | E2E |

### 3.2 RBAC

| ID | Kasus uji | Ekspektasi | Level |
|---|---|---|---|
| RBAC-01 | User tanpa permission membuka halaman/aksi admin | Ditolak (403/redirect), tidak ada data bocor | Integrasi + E2E |
| RBAC-02 | **Privilege escalation**: user memodifikasi role/permission dirinya via request langsung | Ditolak; perubahan role hanya oleh permission `manage:roles` | Integrasi |
| RBAC-03 | **Permission cache + permVersion**: admin mencabut permission user | `permVersion` naik, cache invalidasi, request berikut langsung ditolak (tidak menunggu TTL) | Integrasi |
| RBAC-04 | Token lama dengan permVersion usang | Ditolak/diminta refresh; akses sesuai permission terbaru | Integrasi |
| RBAC-05 | Penambahan permission baru | Berlaku segera setelah permVersion naik | Integrasi |
| RBAC-06 | Akses lintas-tenant/lintas-kelas (IDOR) | Ditolak; resource difilter berdasarkan kepemilikan | Integrasi |

### 3.3 Payout & Pajak

| ID | Kasus uji | Ekspektasi | Level |
|---|---|---|---|
| PO-01 | **Double-claim race**: 2 request klaim payout bersamaan untuk earning sama | Hanya 1 klaim berhasil; yang lain gagal/no-op; saldo tidak berkurang ganda (uji `Promise.all`) | Integrasi (concurrency) |
| PO-02 | **idempotencyKey** dikirim ulang untuk klaim yang sama | Mengembalikan hasil klaim pertama, tidak membuat klaim/transfer baru | Integrasi |
| PO-03 | **Partial-unique: 1 klaim aktif per tutor** | DB partial-unique index mencegah >1 klaim berstatus aktif; pelanggaran ditolak rapi (bukan 500) | Integrasi |
| PO-04 | **Refund-window/clawback**: refund terjadi setelah payout diklaim dalam window | Earning di-clawback; saldo disesuaikan; ledger negatif tercatat; payout pending dibatalkan | Integrasi |
| PO-05 | Refund setelah window selesai | Clawback tidak menyentuh payout yang sudah final; ditangani via jalur penyesuaian terpisah | Integrasi |
| PO-06 | **Rekonsiliasi**: saldo internal vs total ledger vs status transfer gateway | Job rekonsiliasi mendeteksi & melaporkan selisih; invariant `saldo = Σ(kredit) − Σ(debit)` | Integrasi |
| PO-07 | **Pajak per bracket** (penghasilan masuk beberapa lapisan) | Potongan dihitung berlapis sesuai bracket; pembulatan benar; uji boundary tepat di batas bracket | Unit |
| PO-08 | **Non-NPWP** | Tarif lebih tinggi (mis. +20% surcharge) diterapkan; NPWP valid → tarif normal | Unit |
| PO-09 | **Bukti PDF + verifyCode** | PDF berisi nominal, potongan pajak, dan `verifyCode`; endpoint verifikasi mengonfirmasi keaslian; verifyCode acak/unik & tidak dapat ditebak | Integrasi + E2E |
| PO-10 | Klaim saat saldo < minimum payout | Ditolak dengan pesan jelas | Integrasi |

### 3.4 Proteksi Konten

| ID | Kasus uji | Ekspektasi | Level |
|---|---|---|---|
| CP-01 | **No-enrollment = no-akses**: user belum enroll/lunas mengakses konten | Ditolak (403); tidak ada signed URL diterbitkan | Integrasi + E2E |
| CP-02 | **Signed URL expired** | Akses ditolak setelah TTL lewat; URL tidak dapat dipakai ulang | Integrasi |
| CP-03 | Signed URL milik konten lain / tanda tangan dimodifikasi | Ditolak | Integrasi |
| CP-04 | **Share-link gagal**: user A membagikan URL/token ke user B tanpa enrollment | User B ditolak (URL terikat sesi/user atau ber-TTL pendek) | Integrasi + E2E |
| CP-05 | Akses setelah enrollment dicabut/refund | Akses langsung tertutup | Integrasi |

### 3.5 Live

| ID | Kasus uji | Ekspektasi | Level |
|---|---|---|---|
| LV-01 | **Token akses**: join dengan token valid milik peserta enroll | Berhasil masuk room | E2E |
| LV-02 | Join tanpa token / token kadaluarsa / token user lain | Ditolak | Integrasi |
| LV-03 | **Reconnect**: koneksi putus lalu tersambung lagi | Kembali ke room tanpa kehilangan sesi/identitas | E2E |
| LV-04 | **Rekaman → VOD**: sesi live selesai | Rekaman diproses & muncul sebagai VOD, hanya untuk peserta ber-enrollment | E2E |
| LV-05 | Non-peserta mencoba akses VOD rekaman | Ditolak (mengikuti aturan proteksi konten) | Integrasi |

### 3.6 Consent

| ID | Kasus uji | Ekspektasi | Level |
|---|---|---|---|
| CN-01 | **Tercatat + versi**: user menyetujui consent | Tersimpan dengan timestamp, user, dan **versi dokumen** yang disetujui | Integrasi |
| CN-02 | **Cabut consent** | Status menjadi dicabut; efek terkait (mis. pemrosesan terkait) berhenti | Integrasi |
| CN-03 | **Re-consent** saat versi dokumen berubah | User diminta menyetujui ulang; versi lama tetap tercatat (audit trail) | Integrasi + E2E |
| CN-04 | **Marketing list real-time**: cabut consent marketing | User keluar dari marketing list segera (real-time), tidak menunggu batch | Integrasi |
| CN-05 | Opt-in marketing | Masuk list segera | Integrasi |

---

## 4. Gate Aksesibilitas & Performa (Blocking)

Gate berikut **memblokir merge** bila gagal pada halaman kritikal (login, katalog, halaman pembayaran, player konten, dashboard tutor).

### 4.1 Aksesibilitas (axe-core)

- **0 violation severity `critical` & `serious`** pada halaman kritikal → blocking.
- Violation `moderate`/`minor` → warning (dicatat sebagai tiket, tidak memblokir).
- Wajib: kontras teks, label form, focus order, alt text, navigasi keyboard player.

### 4.2 Performa (Lighthouse CI)

Budget pada halaman kritikal (median 3 run, profil mobile):

- Performance score **≥ 0.85** → blocking.
- LCP **≤ 2.5s**, TBT **≤ 200ms**, CLS **≤ 0.1** → blocking.
- Best Practices & SEO **≥ 0.90** → warning.

Konfigurasi disimpan di `lighthouserc.js`; assertion `error` untuk metrik blocking, `warn` untuk sisanya.

---

## 5. Data Uji & Lingkungan

### 5.1 Lingkungan

| Env | Tujuan | DB | Gateway |
|---|---|---|---|
| `local` | dev & unit | mock / SQLite-Prisma opsional | mock (MSW) |
| `ci-integration` | integrasi | **Postgres via Testcontainers** (ephemeral, migrasi otomatis) | sandbox gateway + secret sandbox |
| `staging` | e2e & rilis kandidat | Postgres staging | **sandbox gateway** (uang tidak nyata) |

- **Gateway sandbox**: gunakan kredensial & webhook secret sandbox. Signature webhook ditandatangani memakai secret sandbox agar PAY-02/PAY-03 dapat diuji deterministik. Skenario gateway (sukses, expire, gagal) dipicu via amount/flag khusus sandbox.
- **Tidak ada data produksi** di lingkungan tes. Tidak ada kredensial produksi di repo/CI.

### 5.2 Seed

Seed deterministik (`prisma/seed.ts` mode test) menyediakan:

- Role & permission lengkap (admin, tutor, student, role tanpa permission untuk uji RBAC).
- 1 kelas berbayar + 1 gratis; user enrolled & non-enrolled.
- Tutor dengan earning siap-klaim (untuk PO-01..PO-09), termasuk skenario refund-window.
- Data pajak: profil ber-NPWP & non-NPWP; penghasilan yang melintasi batas bracket (boundary test).
- Dokumen consent versi N dan N+1 (untuk re-consent).

Setiap suite integrasi mereset DB ke seed (truncate + reseed atau transaksi rollback) untuk isolasi & determinisme.

---

## 6. Definisi Severity Bug & Alur Triage

### 6.1 Severity

| Severity | Definisi | Contoh | SLA perbaikan |
|---|---|---|---|
| **S1 — Critical** | Kehilangan/kebocoran uang atau data, akses ilegal, blocker rilis, data corruption | Double-payout, double-spend wallet, akses konten tanpa enrollment, signature palsu diterima, escalation RBAC | Hotfix segera (≤ 24 jam), blokir rilis |
| **S2 — Major** | Fungsi inti rusak tanpa workaround, tapi bukan kebocoran uang/akses | Klaim payout gagal total, webhook valid tidak diproses, live tidak bisa join | ≤ 3 hari kerja |
| **S3 — Minor** | Fungsi terganggu, ada workaround | Reconnect lambat, label salah, a11y moderate | Sprint berikutnya |
| **S4 — Trivial** | Kosmetik, tidak mempengaruhi fungsi | Typo, spacing UI, a11y minor | Backlog |

Catatan: bug pada modul uang/akses (payment, payout, wallet, RBAC, content-protection) **minimal S2**, dan **S1 bila menyangkut kebocoran nilai atau akses**.

### 6.2 Alur Triage

1. **Intake**: bug dibuat dengan langkah reproduksi, env, severity usulan, dan trace/log (Playwright trace untuk e2e).
2. **Triage harian** (QA Lead + Eng owner): konfirmasi severity, assign owner, tentukan apakah blocking rilis.
3. **S1** → eskalasi langsung, freeze rilis terkait area, buat tes regresi sebelum/segera setelah fix.
4. **Regression guard**: setiap bug S1/S2 wajib disertai tes baru (unit/integrasi/e2e sesuai level akar masalah) sebelum ditutup.
5. **Verifikasi**: QA memverifikasi di staging dengan sandbox sebelum status `Closed`.
6. **Post-mortem ringkas** untuk setiap S1 (akar masalah, gap deteksi, perbaikan gate CI).

### 6.3 Definition of Done (per fitur kritikal)

- Semua kasus "Wajib" di checklist Bagian 3 hijau.
- Coverage memenuhi target Bagian 1 (service ≥ 80%, modul uang/akses ≥ 90% branch).
- Alur e2e inti terkait hijau & masuk suite blocking.
- Gate a11y & performa lulus pada halaman terdampak.
- Tidak ada bug S1/S2 terbuka pada area fitur.
