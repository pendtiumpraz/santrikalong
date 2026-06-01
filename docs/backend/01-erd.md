# 01 — ERD & Skema Data (Final)

> Status: **FINAL untuk implementasi** · 2026-06-01 · Owner: Database & Security Engineer
> Dibangun dari `docs/05-data-model.md`, diselaraskan dengan `docs/04` & `docs/08`.
> Konvensi: PK = `id` (cuid/uuid). Semua tabel punya `createdAt`, `updatedAt`, dan (kecuali ledger/log immutable) `deletedAt` (lihat `06-soft-delete-restore.md`). Penamaan kolom Prisma camelCase, kolom DB snake_case (`@map`).

## 0. Keputusan lintas-dokumen yang dipatok di sini

- **Multi-tenant defensif**: entitas inti punya `tenantId String?` (nullable, default `null` = tenant tunggal). **Tidak diaktifkan di MVP** (tanpa RLS, tanpa filter wajib) — tujuannya menghindari retrofit mahal. Aktivasi penuh = keputusan terbuka (lihat akhir dok).
- **DB Session** (revocable) dipakai, bukan JWT-only → tabel `Session`.
- **Idempotency ledger**: `PaymentLog` punya `UNIQUE(provider, eventId)`. Side-effect async via `OutboxEvent`.
- **Soft delete**: kolom `deletedAt`; unik di-handle via **partial unique index** `WHERE deleted_at IS NULL`.

---

## 1. Diagram Relasi (teks / mermaid)

```mermaid
erDiagram
  User ||--o{ UserRole : has
  Role ||--o{ UserRole : grants
  Role ||--o{ RolePermission : has
  Permission ||--o{ RolePermission : in
  User ||--o| UstadzProfile : profile
  User ||--o{ Session : sessions
  User ||--o{ Account : oauth
  User ||--o{ AuditLog : actor

  Category ||--o{ Category : parent
  Category ||--o{ Course : categorizes
  User ||--o{ Course : teaches
  Course ||--o{ Module : has
  Module ||--o{ Lesson : has
  Lesson ||--o{ LessonAsset : has
  Course ||--o{ Quiz : has
  Lesson ||--o| Quiz : has

  Quiz ||--o{ Question : has
  Question ||--o{ QuestionOption : has
  Quiz ||--o{ QuizAttempt : has
  QuizAttempt ||--o{ Answer : has

  Course ||--o{ LiveSession : schedules
  User ||--o{ LiveSession : hosts
  LiveSession ||--o{ LiveAttendance : logs
  DaurohEvent ||--o{ LiveSession : includes

  User ||--o{ Enrollment : enrolls
  Course ||--o{ Enrollment : target
  DaurohEvent ||--o{ Enrollment : target
  Enrollment ||--o{ LessonProgress : tracks
  Enrollment ||--o| Certificate : earns

  User ||--o{ Order : buys
  Order ||--o{ PaymentLog : logs
  Order ||--o| Invoice : invoice
  Order ||--o| ManualPaymentProof : proof
  PaymentGateway ||--o{ Order : via
  Coupon ||--o{ Order : applied

  Order ||--o{ Earning : generates
  User ||--o| Wallet : wallet
  User ||--o{ Earning : ustadz
  User ||--o{ PayoutRequest : requests
  User ||--o| UstadzPayoutProfile : payoutProfile
  User ||--o{ UstadzYearlyRevenue : revenueAcc
  Earning ||--o| TaxWithholdingRecord : withholding

  OutboxEvent }o--|| Order : emitted_by
  AiUsageLog }o--|| User : by
  Notification }o--|| User : to
```

---

## 2. Identity, Sesi & RBAC

```
User
  id PK
  tenantId?          -> Tenant (nullable, MVP=null)
  name, email UNIQUE(partial), phone?, passwordHash?
  avatar?, bio?
  status             enum UserStatus  // ACTIVE | SUSPENDED | DELETED
  emailVerifiedAt?
  twoFactorSecret?   (enkripsi, lihat 03)  twoFactorEnabledAt?
  permVersion        int default 0   // bump → invalidasi cache izin user
  deletedAt?
  INDEX(tenantId), INDEX(status)
  PARTIAL UNIQUE(email) WHERE deleted_at IS NULL
  PARTIAL UNIQUE(phone) WHERE deleted_at IS NULL AND phone IS NOT NULL

Session                       // DB session (revocable) — Auth.js adapter
  id PK, userId FK, sessionToken UNIQUE, expires
  ip?, userAgent?, createdAt
  INDEX(userId)

Account                       // OAuth (Auth.js) provider link
  id PK, userId FK, provider, providerAccountId
  UNIQUE(provider, providerAccountId)

VerificationToken             // OTP / verifikasi email / reset password
  identifier, token UNIQUE, type enum(OTP|EMAIL_VERIFY|PASSWORD_RESET), expires
  INDEX(identifier)

Role
  id PK, tenantId?, name, description?, isSystem bool
  PARTIAL UNIQUE(tenantId, name) WHERE deleted_at IS NULL

Permission
  id PK, key UNIQUE   // "class.create", "class.edit.any", "payment.manual.verify", "rbac.manage"
  description?

RolePermission (Role x Permission)  PK(roleId, permissionId)
UserRole (User x Role)              PK(userId, roleId)
  INDEX(roleId)

UstadzProfile
  id PK, userId FK UNIQUE
  status enum UstadzStatus  // PENDING | APPROVED | REJECTED | SUSPENDED
  bio?, specialization?, documents JSONB   // CV, sanad/ijazah (lihat 04: PII, jangan kirim ke LLM)
  reviewedBy? FK->User, reviewedAt?, rejectionReason?
  INDEX(status)

AuditLog                      // IMMUTABLE — tanpa deletedAt, append-only
  id PK, tenantId?, actorId? FK->User
  action, targetType, targetId?
  meta JSONB, ip?, userAgent?
  createdAt
  INDEX(actorId, createdAt), INDEX(targetType, targetId)
```

**Enum izin penting (samakan dengan docs/01):** `class.create`, `class.edit`, `class.edit.any`, `class.publish`, `material.upload`, `live.host`, `quiz.create`, `quiz.grade`, `quiz.attempt`, `enrollment.purchase`, `user.approve`, `rbac.manage`, `payment.gateway.toggle`, `payment.manual.verify`, `payout.process`, `ai.generate`. Sufiks `.any` = bypass ownership (admin).

---

## 3. Katalog & Kurikulum

```
Category
  id PK, tenantId?, name, slug, parentId? FK->Category
  PARTIAL UNIQUE(tenantId, slug) WHERE deleted_at IS NULL
  INDEX(parentId)

Course
  id PK, tenantId?, title, slug, description?, thumbnail?
  categoryId FK, ustadzId FK->User (owner)
  type enum CourseType   // ON_DEMAND | LIVE
  level enum             // PEMULA | MENENGAH | LANJUTAN
  price int default 0 (IDR, minor unit), isFree bool
  revenueSharePct?       // override global (lihat payroll)
  status enum CourseStatus  // DRAFT | PENDING_REVIEW | PUBLISHED | ARCHIVED
  publishedAt?, deletedAt?
  PARTIAL UNIQUE(tenantId, slug) WHERE deleted_at IS NULL
  INDEX(status, type), INDEX(categoryId), INDEX(ustadzId)

Module
  id PK, courseId FK, title, order int
  INDEX(courseId, order)

Lesson
  id PK, moduleId FK, title, order int
  contentType enum LessonType  // VIDEO | AUDIO | PDF | PPT | HTML_PPT | TEXT
  isPreview bool default false
  duration int? (detik)
  gateOnPrevious bool default false   // kunci progres B setelah A (opsional per kelas)
  INDEX(moduleId, order)

LessonAsset
  id PK, lessonId FK
  kind enum AssetKind  // SOURCE | CONVERTED | ATTACHMENT | TRANSCRIPT | EMBEDDING_SRC
  storageKey, mimeType, sizeBytes?, meta JSONB
  // provider video: providerAssetId, playbackId di meta
  INDEX(lessonId, kind)
```
> Catatan: **`url` signed TIDAK disimpan** di DB — selalu di-generate on-the-fly (lihat 03). Kolom `url` lama di docs/05 dibuang.

---

## 4. Live & Dauroh

```
DaurohEvent
  id PK, tenantId?, title, slug, description?
  periodStart, periodEnd, quota?, price int, isFree bool
  certificateEnabled bool
  status enum DaurohStatus  // DRAFT | OPEN | CLOSED | FINISHED
  PARTIAL UNIQUE(tenantId, slug) WHERE deleted_at IS NULL

LiveSession
  id PK, tenantId?, courseId? FK, daurohId? FK, hostId FK->User
  title, scheduledAt, startedAt?, endedAt?
  status enum LiveStatus   // SCHEDULED | LIVE | ENDED | CANCELED
  provider enum            // CLOUDFLARE | MUX | AGORA | YOUTUBE
  ingestKey? (enkripsi), playbackId?, recordingAssetId? FK->LessonAsset
  INDEX(scheduledAt, status), INDEX(hostId)

LiveAttendance
  id PK, liveSessionId FK, userId FK, joinedAt, leftAt?
  UNIQUE(liveSessionId, userId)   // 1 baris ringkas; durasi diakumulasi
```

---

## 5. Quiz & Penilaian

```
Quiz
  id PK, courseId? FK, lessonId? FK   // salah satu
  title, timeLimit?, maxAttempts default 1, passingScore int, shuffle bool
  source enum QuizSource default MANUAL  // MANUAL | AI_GENERATED (lihat 04/05 AI)
  status enum QuizStatus default DRAFT   // DRAFT | PUBLISHED  (AI draft tetap DRAFT)
  INDEX(courseId), INDEX(lessonId)

Question
  id PK, quizId FK, type enum QuestionType  // MCQ | TRUE_FALSE | SHORT | ESSAY | MATCH
  text, points int, order int
  aiGenerated bool default false
  INDEX(quizId, order)

QuestionOption
  id PK, questionId FK, text, isCorrect bool, order int

QuizAttempt
  id PK, quizId FK, userId FK
  startedAt, submittedAt?, score?, status enum AttemptStatus // IN_PROGRESS | SUBMITTED | GRADED
  INDEX(quizId, userId)

Answer
  id PK, attemptId FK, questionId FK
  response JSONB, isCorrect?, awardedPoints?
  UNIQUE(attemptId, questionId)
```

---

## 6. Enrollment, Progress & Sertifikat

```
Enrollment
  id PK, tenantId?, userId FK
  itemType enum EnrollItemType  // COURSE | DAUROH | SUBSCRIPTION
  courseId? FK, daurohId? FK
  source enum EnrollSource      // PURCHASE | MANUAL | FREE
  status enum EnrollStatus      // ACTIVE | EXPIRED | REVOKED
  orderId? FK->Order            // jejak pembelian
  enrolledAt, expiresAt?
  PARTIAL UNIQUE(userId, courseId) WHERE deleted_at IS NULL AND courseId IS NOT NULL
  PARTIAL UNIQUE(userId, daurohId) WHERE deleted_at IS NULL AND daurohId IS NOT NULL
  INDEX(userId, status)

LessonProgress
  id PK, enrollmentId FK, lessonId FK
  status enum ProgressStatus  // NOT_STARTED | IN_PROGRESS | COMPLETED
  progressPct int, lastPositionSec int, completedAt?
  UNIQUE(enrollmentId, lessonId)

Certificate
  id PK, userId FK, courseId? FK, daurohId? FK
  number UNIQUE, verifyCode UNIQUE, fileKey?, issuedAt
  INDEX(userId)
```

---

## 7. Pembayaran (dengan idempotensi)

```
PaymentGateway
  id PK, tenantId?, provider enum  // MIDTRANS | TRIPAY | XENDIT | MANUAL
  isActive bool, mode enum(SANDBOX|PRODUCTION)
  credentialsEnc bytea       // envelope-encrypted (lihat 03), JSON di dalam
  keyVersion int             // untuk rotasi KEK
  displayName, feeNote?, sortOrder int
  UNIQUE(tenantId, provider)

Order
  id PK, tenantId?, userId FK
  itemType enum  // COURSE | DAUROH | SUBSCRIPTION
  itemId
  amount int, currency default 'IDR'
  couponId? FK, discountAmount int default 0
  status enum OrderStatus
    // PENDING | PAID | EXPIRED | FAILED | WAITING_CONFIRMATION | REJECTED | REFUNDED
  gatewayProvider, reference?, paymentUrl?, vaNumber?, qrString?
  paidAt?, expiresAt?
  INDEX(userId, status), INDEX(status, expiresAt), INDEX(reference)

PaymentLog                     // IDEMPOTENCY LEDGER + jejak webhook (append-only)
  id PK, orderId? FK, provider
  eventId         // dari payload; jika kosong, derive (reference+status+sigHash)
  event, payloadRaw JSONB, signatureValid bool, createdAt
  UNIQUE(provider, eventId)    // <-- kunci idempotensi
  INDEX(orderId)

Invoice
  id PK, orderId FK UNIQUE, number UNIQUE, fileKey?, issuedAt

ManualPaymentProof
  id PK, orderId FK UNIQUE, fileKey, uploadedAt
  verifiedBy? FK->User, verifiedAt?

Coupon
  id PK, tenantId?, code, type enum(PERCENT|FIXED), value int
  quota?, usedCount int default 0, validUntil?
  PARTIAL UNIQUE(tenantId, code) WHERE deleted_at IS NULL

OutboxEvent                    // transactional outbox — pemicu side-effect async
  id PK, aggregateType, aggregateId   // mis. ('Order', orderId)
  type            // 'order.paid', 'order.refunded', 'earning.create'
  payload JSONB
  status enum OutboxStatus default PENDING  // PENDING | PROCESSING | DONE | FAILED
  attempts int default 0, availableAt, processedAt?, lastError?
  INDEX(status, availableAt)
```

**Transisi Order yang sah (state machine, ditegakkan di service — lihat 03):**
`PENDING → PAID | EXPIRED | FAILED`; manual: `PENDING → WAITING_CONFIRMATION → PAID | REJECTED`; `PAID → REFUNDED`. Semua transisi pakai compare-and-set `UPDATE ... WHERE status = <expected>`.

---

## 8. Payroll & Pajak

```
UstadzPayoutProfile
  id PK, userId FK UNIQUE
  bankName, accountNumber (enkripsi), accountHolder
  npwp? (enkripsi), nik? (enkripsi)
  taxModeOverride? enum, revenueSharePctOverride?
  npwpVerified bool, bankVerified bool

Wallet
  id PK, userId FK UNIQUE
  availableBalance bigint default 0, pendingBalance bigint default 0
  currency default 'IDR'
  version int default 0          // OPTIMISTIC LOCK (anti-race payout vs earning)

Earning
  id PK, ustadzId FK, orderId FK, courseId FK
  grossAmount, platformFee, gatewayFee
  taxMode enum, taxableBase, taxAmount, netAmount
  status enum EarningStatus  // PENDING | AVAILABLE | PAID_OUT | REVERSED
  availableAt, createdAt
  UNIQUE(orderId, courseId)     // 1 earning per item terjual (idempotensi dari outbox)
  INDEX(ustadzId, status)

PayoutRequest
  id PK, ustadzId FK, amount bigint, bankSnapshot JSONB
  status enum PayoutStatus  // REQUESTED | PROCESSING | PAID | REJECTED
  taxWithheldTotal, disbursementRef?, proofRef?, note?
  requestedAt, processedAt?
  INDEX(ustadzId, status)

UstadzYearlyRevenue            // AKUMULASI omzet berjalan (anti recompute history)
  id PK, ustadzId FK, year int
  grossYtd bigint default 0     // untuk ambang 500jt bebas & cap 4,8M
  UNIQUE(ustadzId, year)

TaxSetting (global)            // mode, finalRatePct, customRatePct,
                               // nonNpwpSurchargePct, pkpThresholdYearly,
                               // brutoCapYearly, effectiveDate, note
TaxBracket                     // Pasal 17 progresif: id, lowerBound, upperBound?, ratePct, order
TaxWithholdingRecord           // bukti potong: id, earningId? / payoutId?,
                               // mode, base, rate, amount, period, npwp?
```
> Konsistensi finansial: kolom uang `bigint` di payroll (akumulasi besar), `int` di Order cukup untuk harga kelas. **Wallet hanya boleh berubah lewat transaksi yang juga menulis Earning/PayoutRequest** (lihat 03 §concurrency).

---

## 9. Notifikasi & AI

```
Notification
  id PK, userId FK, type, title, body, readAt?, createdAt
  INDEX(userId, readAt)

AiUsageLog                     // observability + budget cap (lihat 05)
  id PK, tenantId?, userId? FK, feature  // QUIZ_GEN | TRANSCRIBE | SEARCH | MODERATE | SUMMARY
  model, inputHash, inputTokens, outputTokens, costMicros bigint
  cacheHit bool, status enum(OK|REJECTED|FAILED), refType?, refId?
  createdAt
  INDEX(userId, createdAt), INDEX(feature, createdAt)
```

---

## 10. Ringkasan indeks kritikal

| Tujuan | Indeks |
|---|---|
| Idempotensi webhook | `PaymentLog UNIQUE(provider, eventId)` |
| Cegah double-enroll | `Enrollment PARTIAL UNIQUE(userId, courseId)` |
| Cegah double-earning | `Earning UNIQUE(orderId, courseId)` |
| Cek akses cepat | `Enrollment(userId, status)` |
| Cron expire order | `Order(status, expiresAt)` |
| Outbox worker | `OutboxEvent(status, availableAt)` |
| Soft-delete + unik | semua `PARTIAL UNIQUE ... WHERE deleted_at IS NULL` |

## 11. Pertanyaan terbuka (data)
- **Aktivasi multi-tenant**: kolom `tenantId` sudah ada (defensif). Aktifkan RLS + filter wajib? (keputusan product)
- **Subscription/membership**: butuh tabel `Subscription` terpisah jika model langganan jalan (Fase 2). `itemType=SUBSCRIPTION` placeholder.
- **Co-teacher**: butuh `CourseTeacher (courseId,userId,role)` jika diadopsi.
