# Rancangan Data Model (Draft)

> Status: **DRAFT** · 2026-06-01
> Gambaran entitas inti. Belum final — untuk diskusi sebelum bikin `schema.prisma`.

## 1. Pengguna & RBAC

```
User
  id, name, email, phone, passwordHash, avatar, bio
  status            // ACTIVE | SUSPENDED
  emailVerifiedAt
  createdAt

Role
  id, name, description, isSystem

Permission
  id, key            // "class.create", "user.approve", dst
  description

RolePermission   (Role ⇄ Permission)
UserRole         (User ⇄ Role)   // user bisa multi-role

UstadzProfile
  id, userId
  status            // PENDING | APPROVED | REJECTED | SUSPENDED
  bio, specialization
  documents (JSON)  // CV, sanad/ijazah
  reviewedBy, reviewedAt, rejectionReason

AuditLog
  id, actorId, action, targetType, targetId, meta(JSON), createdAt
```

## 2. Konten & Kurikulum

```
Category
  id, name, slug, parentId(opsional)

Course (Kelas)
  id, title, slug, description, thumbnail
  categoryId, ustadzId(ownerId)
  type              // ON_DEMAND | LIVE
  level             // PEMULA | MENENGAH | LANJUTAN
  price, isFree
  status            // DRAFT | PENDING_REVIEW | PUBLISHED | ARCHIVED
  createdAt

Module (Section)
  id, courseId, title, order

Lesson (Materi)
  id, moduleId, title, order
  contentType       // VIDEO | AUDIO | PDF | PPT | HTML_PPT | TEXT
  isPreview         // bisa dilihat gratis?
  duration

LessonAsset
  id, lessonId
  kind              // SOURCE | CONVERTED | ATTACHMENT
  storageKey, mimeType, url(signed), meta(JSON)
  // mis. PPT asli + hasil konversi PDF
```

## 3. Live & Dauroh

```
LiveSession
  id, courseId(opsional), hostId(ustadz)
  title, scheduledAt, startedAt, endedAt
  status            // SCHEDULED | LIVE | ENDED
  provider          // CLOUDFLARE | MUX | AGORA | YOUTUBE...
  streamKey/ingest, playbackUrl
  recordingAssetId  // jadi VOD setelah selesai

DaurohEvent
  id, title, description, periodStart, periodEnd
  quota, price, certificateEnabled
  // bisa relasi ke Course/LiveSession

LiveAttendance
  id, liveSessionId, userId, joinedAt, leftAt
```

## 4. Quiz & Penilaian

```
Quiz
  id, courseId/lessonId, title
  timeLimit, maxAttempts, passingScore, shuffle

Question
  id, quizId, type        // MCQ | TRUE_FALSE | SHORT | ESSAY | MATCH
  text, points, order

Option
  id, questionId, text, isCorrect

QuizAttempt
  id, quizId, userId, startedAt, submittedAt, score, status

Answer
  id, attemptId, questionId, response(JSON), isCorrect, awardedPoints
```

## 5. Enrollment & Progress

```
Enrollment
  id, userId, courseId(/daurohId)
  source            // PURCHASE | MANUAL | FREE
  status            // ACTIVE | EXPIRED | REVOKED
  enrolledAt, expiresAt(opsional utk membership)

LessonProgress
  id, enrollmentId/userId, lessonId
  status            // NOT_STARTED | IN_PROGRESS | COMPLETED
  progressPct, lastPositionSec, completedAt

Certificate
  id, userId, courseId/daurohId
  number, issuedAt, fileKey, verifyCode
```

## 6. Pembayaran

```
PaymentGateway
  id, provider, isActive, mode, credentials(enc), displayName, sortOrder

Order
  id, userId, itemType(COURSE|DAUROH|SUBSCRIPTION), itemId
  amount, currency, status
  gatewayProvider, reference, paymentUrl/vaNumber
  paidAt, expiresAt, createdAt

PaymentLog
  id, orderId, provider, event, payloadRaw(JSON), createdAt   // jejak webhook

Invoice
  id, orderId, number, fileKey, issuedAt

ManualPaymentProof
  id, orderId, fileKey, uploadedAt, verifiedBy, verifiedAt

Coupon (opsional)
  id, code, type(PERCENT|FIXED), value, quota, validUntil
```

## 7. Notifikasi
```
Notification
  id, userId, type, title, body, readAt, createdAt
```

## 8. Catatan Relasi
- `User` bisa punya banyak `Role`; akses ditentukan gabungan permission.
- `Course` milik satu `Ustadz` (ownerId), bisa diperluas ke co-teacher (later).
- `Enrollment` jadi gerbang akses `Lesson`/`LessonAsset`.
- Semua aset berbayar diakses via **signed URL**, dicek terhadap `Enrollment`.
