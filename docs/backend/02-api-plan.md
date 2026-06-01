# 02 — Rencana API & Server Actions (Final)

> Status: **FINAL** · 2026-06-01
> Mengadopsi aturan **SA vs RH** dari proposal Backend/API Architect sebagai standar tim.

## 1. Prinsip arsitektur (non-negosiable)

1. **SA & RH tipis**. Keduanya hanya: parse input → `requirePermission` → panggil **service layer** `src/server/<modul>` → bungkus respons. Business logic & otorisasi **tidak boleh** hidup di action/handler. Tujuan: satu logic `enroll()` dipanggil dari webhook (RH) maupun manual-enroll admin (SA).
2. **`lib/` = util murni** (db client, crypto, zod schema bersama). **`server/` = service layer** (business logic + transaksi DB). Adapter pembayaran di `server/payment/providers/` (punya secret & logic, bukan util).
3. **Bounded context** (9 modul): `identity, rbac, catalog, media, live, assessment, enrollment, payment, payroll` (+ `ai`). Lintas-modul hanya lewat service publik, bukan repository internal. `payment → payroll` **selalu async** via OutboxEvent.

## 2. Kapan Server Action vs Route Handler

**Server Action (SA)** — mutasi dari UI internal user terautentikasi, hasil re-render:
- CRUD panel ustadz/admin (kelas, modul, materi, RBAC).
- `submitQuizAttempt`, `markLessonComplete`.
- `requestPayout`, `uploadManualProof`.

**Route Handler (RH)** `app/api/...`:
- **Semua webhook** masuk/keluar (gateway, Mux/CF, disbursement).
- **Signed-URL / streaming token** (perlu kontrol header & cache).
- **Cron/job trigger**.
- **Upload presign**.
- **Endpoint non-browser** (mobile/PWA nanti).
- **Katalog publik** yang butuh ISR/cache JSON & search incremental.

**Endpoint sensitif tetap RH** + rate limiter eksplisit: `auth`, `otp`, login. Untuk SA sensitif (`requestPayout`, `confirmManualPayment`) wajib dibungkus guard rate-limit (SA tetap endpoint publik via action id).

## 3. Error envelope & paginasi

**Semua service & action mengembalikan discriminated union** (bukan throw mentah ke client):
```ts
type Result<T> =
  | { ok: true; data: T }
  | { ok: false; code: ErrorCode; message: string; fieldErrors?: Record<string,string[]> };
```
Route Handler memetakan ke HTTP: `400 VALIDATION`, `401 UNAUTHENTICATED`, `403 FORBIDDEN`, `404 NOT_FOUND`, `409 CONFLICT/STATE`, `429 RATE_LIMITED`, `5xx INTERNAL`. Untuk webhook: balas `200` kalau sudah/akan diproses (idempotent), `401` kalau signature gagal.

`ErrorCode` enum stabil: `VALIDATION | UNAUTHENTICATED | FORBIDDEN | NOT_FOUND | CONFLICT | STATE_INVALID | RATE_LIMITED | GATEWAY_ERROR | INTERNAL`.

**Paginasi** = cursor-based untuk list panjang:
`{ items, nextCursor }`, param `?cursor=&limit=` (default 20, max 100). Katalog publik boleh offset+ISR.

## 4. Versioning & rate limit

- **Webhook**: path berversi `/api/webhooks/v1/{provider}` (provider tak bisa ganti URL mudah → versi di path).
- **API publik/non-browser**: prefix `/api/v1/...`. SA internal tidak diversi (digandeng deploy).
- **Rate limit** (Redis/Upstash sliding window): `otp.request` 3/menit/identifier; `auth.login` 10/menit/IP; `media.url` 60/menit/user; `ai.generate` 10/jam/user + budget cap (05); webhook 600/menit/provider (lindungi dari retry storm). Helper `rateLimit(key, policy)`.

## 5. Kontrak endpoint per modul

> Notasi: **SA** = Server Action, **RH** = Route Handler. Setiap baris memanggil service + `requirePermission`.

### Identity
- `RH POST /api/auth/*` (Auth.js, DB session).
- `RH POST /api/v1/auth/otp/request|verify` (rate-limited).
- `SA updateProfile(input)` · `SA registerUstadz({ documents[] })` · `SA enroll2FA()` / `SA verify2FA(code)`.

### RBAC / Admin (semua tulis AuditLog)
- `SA upsertRole` · `SA setRolePermissions` · `SA assignUserRole` / `revokeUserRole` (bump `permVersion`).
- `SA approveUstadz(id, decision, reason?)` · `SA suspendUser(id)` (juga revoke Session).
- `SA togglePaymentGateway(id, active)` · `SA upsertGatewayCredentials(id, creds)` (perm `payment.gateway.toggle`).

### Catalog (read-heavy, SEO)
- Server Component fetch langsung `catalog.listCourses(filter)` — **tanpa JSON API untuk SSR**.
- `RH GET /api/v1/catalog/search?q=&cat=&type=&level=` — pencarian incremental client, nanti hybrid (keyword+vector, lihat 05).
- `SA createCourse | updateCourse | submitForReview | publishCourse` (perm `class.*` + ownership, lihat 03).
- `SA upsertModule | upsertLesson | reorderLessons`.

### Media
- `RH POST /api/v1/media/presign` → `{ uploadUrl, fileKey }` (perm `material.upload` + ownership kelas).
- `RH GET /api/v1/media/[assetId]/url` → `{ url, expiresAt }` (cek enrollment + signed URL, lihat 03).
- `RH GET /api/v1/live/[id]/token` → playback/ingest token (cek enrollment / host).

### Assessment
- `SA createQuiz | upsertQuestion | publishQuiz`.
- `SA startQuizAttempt(quizId)` · `SA submitQuizAttempt(attemptId, answers)` (auto-grade objektif).
- `SA gradeEssay(answerId, points)` (perm `quiz.grade` + ownership).
- `SA requestAiQuizDraft(lessonId)` → enqueue (async, output draft AI, lihat 05).

### Enrollment & belajar
- `SA markLessonComplete(lessonId)` (validasi gating `gateOnPrevious`).
- `SA manualEnroll(userId, courseId)` (admin, perm `enrollment.*`).
- `SA issueCertificate(enrollmentId)` (atau auto saat 100%).
- Service publik `enrollment.enroll(userId, item, source)` dipanggil juga oleh payment.

### Payment
- `SA createOrder({ itemType, itemId, gateway, couponCode? })` → `{ orderId, redirectUrl|vaNumber|qris }`.
- `RH POST /api/webhooks/v1/{midtrans|tripay|xendit}` → verifyWebhook → ledger → state machine → outbox (lihat 03 §5).
- `RH POST /api/webhooks/v1/{mux|cf-stream}` → asset.ready → trigger transkrip.
- `RH POST /api/webhooks/v1/disbursement` → update PayoutRequest.
- `SA uploadManualProof(orderId, fileKey)` · `SA confirmManualPayment(orderId)` / `rejectManualPayment` (perm `payment.manual.verify`).
- `RH POST /api/cron/v1/expire-orders` · `RH POST /api/cron/v1/reconcile` (poll getStatus; webhook bukan satu-satunya sumber).

### Payroll
- `SA requestPayout(amount, bankProfileId)` (validasi saldo + minimum + lock wallet, lihat 03).
- `SA processPayout(payoutId, action)` (perm `payout.process`).
- `RH POST /api/cron/v1/release-earnings` (refund window lewat → `PENDING`→`AVAILABLE`).
- `RH POST /api/cron/v1/reset-yearly-revenue` (awal tahun pajak).

## 6. Auth context tiap request

```ts
getAuthContext(): { userId, tenantId, permissions: Set<string> } | null
```
- Permissions di-resolve sekali/request (cache Redis `perm:user:{id}` + `permVersion`). Middleware Edge hanya baca cookie session untuk coarse gating route group `(admin)`/`(ustadz)` — **tanpa query Prisma**. Keputusan final selalu di service.
