# Commit & PR Breakdown — santrikalong.com LMS

> Status: DRAFT · 2026-06-01

Dokumen ini memecah seluruh pekerjaan implementasi LMS santrikalong.com menjadi PR/commit granular dari **Fase 0** hingga **Fase 3** (proyek selesai), dikelompokkan per fase dan per modul. Setiap item checklist adalah **satu PR kecil yang reviewable**.

---

## 1. Konvensi Commit

Mengikuti [Conventional Commits 1.0.0](https://www.conventionalcommits.org/).

**Format:**

```
<type>(<scope>): <subjek imperatif>

<body: apa & kenapa, opsional>

<footer: BREAKING CHANGE / refs, opsional>
```

**Aturan subjek:**

- Imperatif, present tense: "add", "fix", "create" — bukan "added"/"adds".
- Maksimal **72 karakter**, tanpa titik di akhir.
- Lowercase setelah `type(scope):`.

**Type yang dipakai:**

| Type | Penggunaan |
|---|---|
| `feat` | Fitur baru yang terlihat user/konsumen API |
| `fix` | Perbaikan bug |
| `migrate` | Migrasi/perubahan skema DB (selalu PR terpisah) |
| `refactor` | Perubahan struktur tanpa ubah perilaku |
| `test` | Penambahan/perubahan test saja |
| `chore` | Tooling, deps, config, CI |
| `docs` | Dokumentasi |
| `perf` | Optimasi performa |
| `style` | Formatting (no logic) |

**Scope** = nama modul/domain: `infra`, `auth`, `rbac`, `consent`, `ustadz`, `catalog`, `media`, `enrollment`, `payment`, `assessment`, `admin`, `notif`, `live`, `vod`, `dauroh`, `ppt`, `coupon`, `rating`, `analytics`, `payroll`, `wallet`, `payout`, `tax`, `gamification`, `forum`, `membership`, `i18n`, `pwa`, `flag`.

**Atomik:** satu commit = satu perubahan logis yang kompilabel & lulus test. Jangan campur refactor dengan fitur.

---

## 2. Aturan PR

Setiap PR **WAJIB**:

1. **1 perubahan logis** — satu layer, satu modul, satu tujuan. PR migrasi DB **selalu terpisah** dari kode yang memakainya, dan **selalu reversible** (punya `down`/rollback teruji).
2. **Pisah per layer**, urutan merge: `migrate (skema)` → `service + unit test` → `action/route (API)` → `UI`.
3. **Deskripsi** mengandung:
   - **Apa**: ringkas perubahan.
   - **Kenapa**: konteks/kebutuhan, link issue.
   - **Checklist DoD** (lihat bawah).
   - **Cara test**: langkah manual + perintah test otomatis.
   - **Rollback**: cara membatalkan (revert PR, `prisma migrate resolve`, matikan flag).
4. **Fitur berisiko** (`payment`, `payout`, `disbursement`, gateway) dikembangkan **di belakang feature flag** (default OFF). Aktivasi flag = **PR terpisah** (`feat(flag): ...`) setelah QA lulus di staging.
5. Ukuran target: < 400 baris diff non-generated. PR lebih besar harus dipecah.

**Definition of Done (DoD) checklist per PR:**

- [ ] Lulus CI (lint, typecheck, unit, e2e gate fase terkait).
- [ ] Coverage area baru ≥ ambang fase.
- [ ] Migrasi reversible & teruji (`migrate` + `migrate reset` di CI).
- [ ] Tidak menurunkan a11y / Lighthouse budget.
- [ ] Secrets tidak ter-commit; flag berisiko default OFF.
- [ ] Deskripsi apa/kenapa/cara test/rollback terisi.

---

## 3. Fase 0 — Infrastruktur & Fondasi

> Tujuan: repo siap kerja, CI hijau, auth dasar jalan, design token tersedia. Tidak ada fitur bisnis.

### 3.1 Infra & Tooling

- [ ] chore(infra): bootstrap Next.js App Router + TypeScript strict — (init project, tsconfig strict, struktur folder)
- [ ] chore(infra): add ESLint + Prettier + import sorting — (lint config + scripts)
- [ ] chore(infra): add Husky + lint-staged + commitlint — (enforce conventional commits & pre-commit)
- [ ] chore(infra): setup env schema validation with zod — (validasi `process.env` saat boot)
- [ ] chore(infra): add Docker Compose for local Postgres — (db lokal reproducible)

### 3.2 CI/CD

- [ ] chore(infra): add CI pipeline lint+typecheck — (GitHub Actions job dasar)
- [ ] chore(infra): add CI job unit test with coverage gate — (Vitest/Jest + threshold)
- [ ] chore(infra): add CI job prisma migrate reset check — (verifikasi migrasi up/down bersih)
- [ ] chore(infra): add Playwright e2e scaffold + CI job — (smoke e2e di CI, headless)
- [ ] chore(infra): add preview deploy + Lighthouse budget — (gate perf/a11y per PR)

### 3.3 Prisma & DB Fondasi

- [ ] chore(infra): init Prisma + datasource + client singleton — (setup tanpa model bisnis)
- [ ] migrate(infra): create base User & Session schema — (model auth inti, reversible)
- [ ] test(infra): add db test harness + seed helpers — (factory + truncate antar test)

### 3.4 Auth

- [ ] feat(auth): add Auth.js (NextAuth) config + adapter — (provider credential + OAuth dasar)
- [ ] feat(auth): add session middleware + route protection — (guard server actions/route)
- [ ] feat(auth): add login & logout UI — (form + halaman)
- [ ] feat(auth): add email verification flow — (token + verifikasi)
- [ ] test(auth): add e2e login/logout/verify happy path — (smoke gate)

### 3.5 Design Token & UI Kit

- [ ] feat(infra): add Tailwind config + design tokens — (warna, spacing, radius, font dari brand)
- [ ] feat(infra): add base UI primitives (Button/Input/Card) — (komponen + variants)
- [ ] feat(infra): add layout shell + theming (light/dark) — (app shell, provider tema)
- [ ] test(infra): add component test + a11y baseline — (render + axe)

### 3.6 Gate Fase 0

- [ ] chore(infra): enforce branch protection + required checks — (CI hijau wajib sebelum merge)
- [ ] test(infra): add CI gate F0 (lint+type+unit+e2e smoke) — (kumpulan gate fase 0)

---

## 4. Fase 1 — Core LMS (MVP Berbayar)

> Tujuan: santri bisa daftar, ustadz disetujui, kursus dijual, dibayar (Midtrans + Manual), dinilai, dikelola admin, dinotifikasi.

### 4.1 RBAC

- [ ] migrate(rbac): create Role, Permission, UserRole schema — (model RBAC, reversible)
- [ ] feat(rbac): add role/permission service + policy check — (service `can()` + unit test)
- [ ] test(rbac): add unit tests for policy matrix — (cek tiap peran×aksi)
- [ ] feat(rbac): add authorize() guard for actions/routes — (wrapper server action/route)
- [ ] feat(rbac): add role management UI for admin — (assign/revoke peran)

### 4.2 Consent (Persetujuan/Privasi)

- [ ] migrate(consent): create ConsentRecord schema — (jejak persetujuan ToS/privasi)
- [ ] feat(consent): add consent service + versioning — (rekam versi & timestamp + test)
- [ ] feat(consent): add consent route/action capture — (endpoint simpan persetujuan)
- [ ] feat(consent): add consent gate UI on signup — (modal/checkbox wajib)

### 4.3 Approval Ustadz

- [ ] migrate(ustadz): create UstadzProfile & ApplicationStatus — (profil + state pengajuan)
- [ ] feat(ustadz): add application state machine + service — (draft→submitted→approved/rejected + test)
- [ ] feat(ustadz): add application submit action — (route ajukan + validasi dokumen)
- [ ] feat(ustadz): add admin review action (approve/reject) — (transisi state + alasan)
- [ ] feat(ustadz): add ustadz application form UI — (form pengajuan + unggah berkas)
- [ ] feat(ustadz): add admin approval queue UI — (daftar + detail review)
- [ ] test(ustadz): add e2e apply→approve→reject flow — (gate)

### 4.4 Catalog (Kursus/Kelas)

- [ ] migrate(catalog): create Course, Module, Lesson schema — (struktur konten, reversible)
- [ ] migrate(catalog): create Category & CoursePricing schema — (kategori + harga)
- [ ] feat(catalog): add course CRUD service + validation — (service + unit test)
- [ ] feat(catalog): add publish/unpublish state machine — (draft→review→published + test)
- [ ] feat(catalog): add course CRUD actions/routes — (API author)
- [ ] feat(catalog): add public catalog listing route — (query + filter + pagination)
- [ ] feat(catalog): add course authoring UI (ustadz) — (editor modul/lesson)
- [ ] feat(catalog): add public catalog & detail UI — (listing + halaman detail)
- [ ] test(catalog): add unit+e2e author→publish→browse — (gate)

### 4.5 Media (Upload/Storage)

- [ ] migrate(media): create MediaAsset schema — (metadata file, owner, status)
- [ ] feat(media): add storage adapter (S3-compatible) — (signed upload/download + test)
- [ ] feat(media): add presigned upload route — (validasi tipe/ukuran)
- [ ] feat(media): add media processing webhook handler — (status transcode/scan)
- [ ] feat(media): add media library UI + uploader — (komponen unggah + progress)
- [ ] test(media): add upload + access-control tests — (signed url, kepemilikan)

### 4.6 Enrollment

- [ ] migrate(enrollment): create Enrollment & Progress schema — (relasi user×course + progres)
- [ ] feat(enrollment): add enrollment service + rules — (cegah dobel, prasyarat + test)
- [ ] feat(enrollment): add progress tracking service — (mark lesson, persen + test)
- [ ] feat(enrollment): add enroll/unenroll actions — (route + guard akses berbayar)
- [ ] feat(enrollment): add learner dashboard UI — (kursus saya + progres)
- [ ] feat(enrollment): add lesson player + progress UI — (penanda selesai)
- [ ] test(enrollment): add e2e enroll→progress→complete — (gate)

### 4.7 Payment — Midtrans + Manual (di belakang flag)

> Semua PR payment **default flag OFF**. Aktivasi flag = PR terpisah di akhir modul.

- [ ] migrate(payment): create Order, Payment, Invoice schema — (entitas transaksi, reversible)
- [ ] migrate(payment): create PaymentEvent ledger schema — (audit event gateway, append-only)
- [ ] feat(payment): add order/payment state machine — (pending→paid→failed→refunded + test)
- [ ] feat(payment): add pricing & order calculation service — (subtotal, pajak, total + test)
- [ ] feat(flag): add feature-flag service + config — (registry flag default OFF + test)
- [ ] feat(payment): add Midtrans gateway adapter (flagged) — (create transaction + verify signature)
- [ ] feat(payment): add Midtrans webhook handler (flagged) — (idemponten + verifikasi notifikasi)
- [ ] feat(payment): add Manual transfer flow (flagged) — (instruksi + bukti transfer)
- [ ] feat(payment): add manual payment review action (admin) — (approve/reject + transisi state)
- [ ] feat(payment): add checkout action wiring to enrollment — (paid→auto enroll)
- [ ] feat(payment): add checkout & payment status UI (flagged) — (pilih metode, instruksi, status)
- [ ] feat(payment): add admin manual-payment review UI — (antrian bukti transfer)
- [ ] test(payment): add unit tests gateway + state machine — (signature, idempoten, transisi)
- [ ] test(payment): add e2e checkout (Midtrans sandbox + manual) — (gate, sandbox)
- [ ] feat(flag): enable payment in staging — (aktifkan flag setelah QA, PR terpisah)
- [ ] feat(flag): enable payment in production — (aktivasi prod terkendali, PR terpisah)

### 4.8 Assessment (Kuis/Tugas)

- [ ] migrate(assessment): create Quiz, Question, Submission schema — (struktur penilaian)
- [ ] migrate(assessment): create Grade & Attempt schema — (nilai + percobaan)
- [ ] feat(assessment): add quiz authoring service — (CRUD soal + validasi + test)
- [ ] feat(assessment): add grading/scoring service — (auto-grade + manual + test)
- [ ] feat(assessment): add attempt/submit actions — (route kerjakan + batas attempt)
- [ ] feat(assessment): add quiz authoring UI (ustadz) — (editor soal)
- [ ] feat(assessment): add quiz taking & result UI (santri) — (pengerjaan + hasil)
- [ ] test(assessment): add e2e author→take→grade — (gate)

### 4.9 Panel Admin

- [ ] feat(admin): add admin layout + nav guard — (shell admin + RBAC)
- [ ] feat(admin): add users management UI — (list/cari/suspend)
- [ ] feat(admin): add courses moderation UI — (review/publish/takedown)
- [ ] feat(admin): add orders & payments overview UI — (monitoring transaksi)
- [ ] feat(admin): add audit log viewer — (jejak aksi sensitif)
- [ ] test(admin): add e2e admin core flows — (gate)

### 4.10 Notifikasi (Email/in-app)

- [ ] migrate(notif): create Notification & Template schema — (pesan + status baca)
- [ ] feat(notif): add notification service + dispatcher — (queue + retry + test)
- [ ] feat(notif): add email provider adapter — (transaksional + template render)
- [ ] feat(notif): add event subscribers (enroll/pay/approve) — (trigger domain → notif)
- [ ] feat(notif): add in-app notification UI — (bell + daftar)
- [ ] test(notif): add unit dispatcher + e2e in-app — (gate)

### 4.11 Gate Fase 1

- [ ] test(infra): add CI gate F1 e2e suite — (rangkaian e2e MVP berbayar)
- [ ] chore(infra): raise coverage threshold for F1 modules — (naikkan ambang)

---

## 5. Fase 2 — Live, Konten Lanjutan & Komersial

> Tujuan: kelas live + rekaman, dauroh, PPT viewer, gateway tambahan, kupon, rating, analitik.

### 5.1 Live Class

- [ ] migrate(live): create LiveSession & Attendance schema — (jadwal + kehadiran)
- [ ] feat(live): add live provider adapter (token/room) — (integrasi penyedia + test)
- [ ] feat(live): add session scheduling service — (buat/ubah/batal + bentrok + test)
- [ ] feat(live): add join token route + attendance mark — (guard enrolled + catat hadir)
- [ ] feat(live): add live scheduling UI (ustadz) — (form jadwal)
- [ ] feat(live): add live room & join UI (santri) — (lobby + join)
- [ ] test(live): add e2e schedule→join→attendance — (gate)

### 5.2 Rekaman / VOD

- [ ] migrate(vod): create Recording & VodAsset schema — (relasi sesi→rekaman)
- [ ] feat(vod): add recording ingest service — (dari live/manual upload + test)
- [ ] feat(vod): add VOD streaming route (signed) — (akses terkontrol enrollment)
- [ ] feat(vod): add VOD library & player UI — (daftar + pemutar resume)
- [ ] test(vod): add access-control + playback e2e — (gate)

### 5.3 Dauroh (Event/Program Intensif)

- [ ] migrate(dauroh): create Dauroh & Registration schema — (event + pendaftaran)
- [ ] feat(dauroh): add dauroh service + capacity rules — (kuota, waitlist + test)
- [ ] feat(dauroh): add registration actions (+payment hook) — (daftar, reuse payment flagged)
- [ ] feat(dauroh): add dauroh listing & registration UI — (detail + daftar)
- [ ] feat(dauroh): add admin dauroh management UI — (kelola peserta)
- [ ] test(dauroh): add e2e register→capacity→confirm — (gate)

### 5.4 PPT Viewer

- [ ] migrate(ppt): create SlideDeck schema — (metadata deck + halaman)
- [ ] feat(ppt): add deck conversion service — (PPT→gambar/PDF pages + test)
- [ ] feat(ppt): add deck pages route (signed) — (akses terkontrol)
- [ ] feat(ppt): add slide viewer UI — (navigasi + sinkron lesson)
- [ ] test(ppt): add conversion + viewer e2e — (gate)

### 5.5 Gateway Tambahan — Tripay / Xendit (di belakang flag)

- [ ] feat(payment): add Tripay gateway adapter (flagged) — (create+verify + test)
- [ ] feat(payment): add Tripay webhook handler (flagged) — (idempoten + signature)
- [ ] feat(payment): add Xendit gateway adapter (flagged) — (create+verify + test)
- [ ] feat(payment): add Xendit webhook handler (flagged) — (idempoten + signature)
- [ ] feat(payment): add gateway selection in checkout UI — (pilih provider terdaftar)
- [ ] test(payment): add gateway adapters unit + sandbox e2e — (gate)
- [ ] feat(flag): enable Tripay in staging then prod — (aktivasi bertahap, PR terpisah)
- [ ] feat(flag): enable Xendit in staging then prod — (aktivasi bertahap, PR terpisah)

### 5.6 Kupon / Diskon

- [ ] migrate(coupon): create Coupon & Redemption schema — (aturan + redemption log)
- [ ] feat(coupon): add coupon validation & apply service — (validitas, batas, stacking + test)
- [ ] feat(coupon): add apply-coupon action in checkout — (hitung ulang total)
- [ ] feat(coupon): add coupon management UI (admin) — (CRUD + batas pakai)
- [ ] feat(coupon): add coupon input UI in checkout — (input + feedback)
- [ ] test(coupon): add unit edge cases + e2e redeem — (gate)

### 5.7 Rating & Review

- [ ] migrate(rating): create Review & Rating schema — (ulasan + skor)
- [ ] feat(rating): add review service + eligibility — (hanya enrolled/complete + test)
- [ ] feat(rating): add submit/moderate review actions — (post + moderasi admin)
- [ ] feat(rating): add rating display + submit UI — (bintang + form)
- [ ] test(rating): add eligibility + aggregation e2e — (gate)

### 5.8 Analitik

- [ ] migrate(analytics): create EventLog & Metric schema — (event mentah + agregat)
- [ ] feat(analytics): add event tracking service — (capture + batch + test)
- [ ] feat(analytics): add aggregation job + queries — (rollup harian + test)
- [ ] feat(analytics): add admin analytics dashboard UI — (kursus, revenue, retensi)
- [ ] test(analytics): add aggregation correctness tests — (gate)

### 5.9 Gate Fase 2

- [ ] test(infra): add CI gate F2 e2e suite — (live/vod/dauroh/payment/coupon)
- [ ] chore(infra): add load test smoke for live/vod — (batas konkurensi)

---

## 6. Fase 3 — Monetisasi Pengajar, Komunitas & Platform

> Tujuan: payroll lengkap (wallet→earning→payout→tax→dokumen→disbursement→rekonsiliasi), gamifikasi, forum, membership, WA/push, i18n/RTL, PWA.

### 6.1 Payroll — Wallet & Ledger (di belakang flag)

> Modul finansial paling berisiko. Semua **flag OFF**, ledger **append-only & double-entry**, aktivasi bertahap.

- [ ] migrate(wallet): create Wallet & LedgerEntry schema — (double-entry, append-only, reversible)
- [ ] migrate(wallet): add ledger constraints & indexes — (balance integrity, idempoten key)
- [ ] feat(wallet): add ledger posting service (double-entry) — (debit/kredit seimbang + test)
- [ ] feat(wallet): add balance projection service — (saldo dari ledger + test)
- [ ] test(wallet): add ledger invariants property tests — (sum=0, no negative tanpa izin)

### 6.2 Payroll — Earning

- [ ] migrate(payroll): create EarningRule & Earning schema — (skema bagi hasil + entri)
- [ ] feat(payroll): add earning calculation service — (dari order paid → earning + test)
- [ ] feat(payroll): add earning accrual subscriber — (post ke ledger saat settle + test)
- [ ] feat(payroll): add ustadz earnings view UI — (rincian pendapatan)
- [ ] test(payroll): add earning calc correctness tests — (pembagian, pembulatan)

### 6.3 Payroll — Payout State Machine

- [ ] migrate(payout): create Payout & PayoutItem schema — (batch + item, reversible)
- [ ] feat(payout): add payout state machine service — (requested→approved→processing→paid/failed + test)
- [ ] feat(payout): add payout request action (ustadz) — (validasi saldo minimum)
- [ ] feat(payout): add payout approval action (admin) — (review + hold)
- [ ] feat(payout): add payout request & status UI — (riwayat + status)
- [ ] test(payout): add state machine transition tests — (semua transisi & guard)

### 6.4 Payroll — Tax

- [ ] migrate(tax): create TaxProfile & TaxWithholding schema — (NPWP, tarif, potongan)
- [ ] feat(tax): add tax calculation service — (PPh, dengan/tanpa NPWP + test)
- [ ] feat(tax): add tax withholding posting to ledger — (potong saat payout + test)
- [ ] feat(tax): add tax profile UI (ustadz) — (input NPWP + status)
- [ ] test(tax): add tax calc + withholding tests — (skenario tarif)

### 6.5 Payroll — DocumentRecord (PDF)

- [ ] migrate(payroll): create DocumentRecord schema — (slip/bukti potong, hash, versi)
- [ ] feat(payroll): add PDF generation service — (slip payout + bukti pajak + test)
- [ ] feat(payroll): add document download route (signed) — (akses pemilik/admin)
- [ ] feat(payroll): add documents list & download UI — (riwayat dokumen)
- [ ] test(payroll): add PDF content + access tests — (gate)

### 6.6 Payroll — Disbursement (di belakang flag)

- [ ] feat(payout): add disbursement adapter (bank/gateway, flagged) — (transfer keluar + verify)
- [ ] feat(payout): add disbursement webhook handler (flagged) — (idempoten, update payout state)
- [ ] feat(payout): add disbursement execution action (admin) — (eksekusi batch, flagged)
- [ ] feat(payout): add disbursement monitoring UI — (status per item)
- [ ] test(payout): add disbursement idempotency + failure tests — (retry, partial fail)
- [ ] feat(flag): enable payroll+disbursement in staging — (aktivasi setelah QA, PR terpisah)
- [ ] feat(flag): enable payroll+disbursement in production — (aktivasi prod terkendali, PR terpisah)

### 6.7 Payroll — Rekonsiliasi

- [ ] migrate(payroll): create ReconciliationRecord schema — (cocokkan ledger×bank×gateway)
- [ ] feat(payroll): add reconciliation service — (match, deteksi selisih + test)
- [ ] feat(payroll): add reconciliation import route — (mutasi bank/gateway statement)
- [ ] feat(payroll): add reconciliation dashboard UI (admin) — (selisih + resolusi)
- [ ] test(payroll): add reconciliation matching tests — (gate keuangan)

### 6.8 Gamifikasi

- [ ] migrate(gamification): create Badge, Point, Streak schema — (entitas reward)
- [ ] feat(gamification): add points/badge rule engine — (trigger event→reward + test)
- [ ] feat(gamification): add award subscriber — (dari progres/quiz/forum)
- [ ] feat(gamification): add leaderboard & badges UI — (profil + papan)
- [ ] test(gamification): add rule engine + award e2e — (gate)

### 6.9 Forum / Diskusi

- [ ] migrate(forum): create Thread, Post, Reaction schema — (struktur diskusi)
- [ ] feat(forum): add thread/post service + moderation — (CRUD + flag/report + test)
- [ ] feat(forum): add post/reply/react actions — (route + RBAC + rate limit)
- [ ] feat(forum): add forum listing & thread UI — (daftar + detail diskusi)
- [ ] feat(forum): add moderation UI (admin) — (hapus/sembunyikan/ban)
- [ ] test(forum): add e2e post→reply→moderate — (gate)

### 6.10 Membership / Langganan

- [ ] migrate(membership): create Plan & Subscription schema — (paket + status langganan)
- [ ] feat(membership): add subscription state machine — (active→past_due→canceled + test)
- [ ] feat(membership): add recurring billing service (flagged) — (reuse gateway + test)
- [ ] feat(membership): add subscribe/cancel actions — (route + entitlement)
- [ ] feat(membership): add entitlement gate for content — (akses berbasis plan)
- [ ] feat(membership): add plans & manage subscription UI — (pilih/kelola)
- [ ] test(membership): add lifecycle + entitlement e2e — (gate)
- [ ] feat(flag): enable recurring billing staging→prod — (aktivasi bertahap, PR terpisah)

### 6.11 WhatsApp / Push

- [ ] migrate(notif): create PushSubscription & Channel schema — (kanal WA/push)
- [ ] feat(notif): add WhatsApp provider adapter — (template message + test)
- [ ] feat(notif): add Web Push adapter (VAPID) — (subscribe + kirim + test)
- [ ] feat(notif): add channel routing in dispatcher — (pilih kanal per preferensi)
- [ ] feat(notif): add notification preferences UI — (opt-in/out per kanal)
- [ ] test(notif): add multi-channel dispatch tests — (gate)

### 6.12 i18n / RTL

- [ ] feat(i18n): add i18n framework + locale routing — (id/en + struktur pesan)
- [ ] feat(i18n): extract & translate core strings — (kunci pesan modul inti)
- [ ] feat(i18n): add RTL support + logical CSS — (dir=rtl, properti logis Tailwind)
- [ ] feat(i18n): add locale switcher UI — (pilih bahasa, persist)
- [ ] test(i18n): add locale render + RTL snapshot tests — (gate)

### 6.13 PWA

- [ ] feat(pwa): add manifest + icons + meta — (installable)
- [ ] feat(pwa): add service worker + offline shell — (cache strategy + test)
- [ ] feat(pwa): add offline content & sync for lessons — (cache lesson, sync progres)
- [ ] feat(pwa): add install prompt & offline UI — (banner + indikator offline)
- [ ] test(pwa): add SW + offline e2e — (gate)

### 6.14 Gate Fase 3 (Rilis Final)

- [ ] test(infra): add CI gate F3 full regression suite — (seluruh modul e2e)
- [ ] test(payroll): add financial reconciliation gate — (invariants ledger wajib hijau)
- [ ] chore(infra): add a11y + Lighthouse final budget gate — (perf/a11y rilis)
- [ ] chore(infra): add security scan + dependency audit gate — (SAST + audit deps)
- [ ] docs(infra): finalize runbook + rollback playbook — (operasional rilis)

---

## 7. Catatan Eksekusi

- **Urutan merge per modul** selalu: `migrate` → `service+test` → `action/route` → `UI`. Jangan merge UI sebelum service+test hijau.
- **Flag berisiko** (payment, payout, disbursement, recurring billing) selalu OFF saat dikembangkan; aktivasi adalah PR `feat(flag)` terpisah dengan bukti QA staging.
- **Migrasi DB** tidak pernah digabung dengan kode pemakainya dan wajib lulus `migrate reset` (up+down) di CI.
- **Setiap fase** ditutup dengan PR gate testing + penyesuaian ambang coverage sebelum lanjut fase berikutnya.
