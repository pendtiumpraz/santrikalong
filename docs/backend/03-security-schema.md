# 03 — Skema Keamanan (Final)

> Status: **FINAL** · 2026-06-01 · Owner: Database & Security Engineer
> Selaras `docs/03 §5`, `04`, `08`. Menutup gap otorisasi (ownership), idempotensi, enkripsi, concurrency.

## 1. RBAC berlapis

**Lapis 1 — Middleware (Edge, coarse):** redirect belum-login; cek tier kasar route group `(admin)`/`(ustadz)` dari cookie session. **Tanpa Prisma** di Edge.

**Lapis 2 — Service guard (final, wajib):** tiap mutasi diawali:
```ts
requirePermission(ctx, "class.publish");           // izin
await assertOwner(ctx, course.ustadzId, "class");  // ownership, kecuali punya "class.edit.any"
```
- **Permission ≠ ownership.** `class.edit` saja tidak cukup; ustadz hanya boleh edit kelas miliknya. Admin pakai izin `*.any` untuk bypass. Ini sumber bug otorisasi paling umum di LMS.
- **Resolusi izin:** union semua role user → `Set<permission>`. Cache Redis `perm:user:{id}` di-tag `permVersion` user. RBAC berubah → bump `User.permVersion` → cache stale otomatis ditolak. **Jangan** taruh izin di JWT (sulit revoke).
- **DB Session** (Auth.js) → suspend user / ganti role langsung memutus akses (`suspendUser` juga `DELETE` Session-nya).

**Lapis 3 — UI** hanya kosmetik (sembunyikan tombol). Tidak pernah jadi kontrol keamanan. **Server Action = endpoint publik** → re-validasi auth+permission di setiap action.

## 2. Proteksi konten berbayar (signed URL + enrollment)

Alur `GET /api/v1/media/[assetId]/url`:
1. `getAuthContext` → wajib login.
2. Resolve `asset → lesson → module → course`.
3. Jika `lesson.isPreview` → boleh tanpa enrollment.
4. Else cek `Enrollment(userId, courseId, status=ACTIVE)` (atau `expiresAt > now` untuk membership). Tidak ada → `403`.
5. Generate **signed URL berumur pendek** (mis. 5–15 menit): R2/S3 presigned GET, atau signed playback token Mux/CF Stream (JWT bertanda).
6. **Jangan simpan URL signed di DB.** Selalu generate on-demand. Response `Cache-Control: private, no-store`.
7. **Watermark dinamis** (nama/ID santri) di player untuk konten sensitif — mitigasi share-record (DRM penuh ditunda, sesuai docs/07 #14).

`presign` upload: validasi `mimeType` allowlist + `maxSize`, scope `fileKey` ke `tenant/course/lesson`, cek `material.upload` + ownership.

## 3. Verifikasi signature webhook (di adapter, sebelum parse logic)

| Provider | Verifikasi | Gagal |
|---|---|---|
| Midtrans | SHA512(`order_id+status_code+gross_amount+serverKey`) == `signature_key` | 401 |
| Xendit | header `x-callback-token` == token tersimpan | 401 |
| Tripay | HMAC-SHA256(body, privateKey) == header `X-Callback-Signature` | 401 |
| Mux / CF Stream | HMAC header (`Mux-Signature` / CF secret) timing-safe | 401 |

Wajib: **timing-safe compare**; tolak sebelum baca body logic; verifikasi `gross_amount == order.amount` (anti-tampering nominal).

## 4. Idempotensi & state machine pembayaran (kritikal)

Dalam **satu transaksi DB**:
1. **Ledger:** `INSERT PaymentLog(provider, eventId, ...)`. `eventId` dari payload; jika kosong → derive `(reference+status+sigHash)`. **Unique violation → event duplikat → balas 200, stop.**
2. **Compare-and-set:** `UPDATE "Order" SET status='PAID', paidAt=now WHERE id=? AND status='PENDING'`. **0 row → sudah diproses / transisi tak sah → skip side-effect** (200).
3. **Side-effect atomik:** buat `Enrollment` + `Invoice` dalam transaksi yang sama.
4. **Emit async:** `INSERT OutboxEvent('order.paid')` dalam transaksi yang sama → worker buat `Earning` (payroll). Kegagalan payroll **tidak** merusak enroll.
5. Balas `200` cepat; kerja berat (PDF invoice, email) → queue.
6. **Reconcile cron** (`getStatus` polling) karena webhook bisa hilang.

**Refund:** webhook refund → `Order REFUNDED` → `Enrollment REVOKED` → outbox `earning.reverse` → `Earning REVERSED`. Jika saldo sudah ke-payout → catat **clawback** (utang ustadz) bukan saldo negatif diam-diam.

## 5. Concurrency Wallet (anti-race payout vs earning)

Payout dan earning masuk bisa balapan. Pilih salah satu, konsisten:
- **Pessimistic:** `SELECT * FROM "Wallet" WHERE userId=? FOR UPDATE` di awal transaksi payout.
- **Optimistic:** `UPDATE "Wallet" SET availableBalance=availableBalance-?, version=version+1 WHERE userId=? AND version=? AND availableBalance>=?`; 0 row → retry/abort.

Aturan: **Wallet hanya berubah dalam transaksi yang juga menulis `Earning`/`PayoutRequest`** + cek `availableBalance >= amount` dan `>= minimumPayout`. Engine pajak (`calcTax`) fungsi murni teruji, terpisah dari I/O; ambang omzet dibaca dari `UstadzYearlyRevenue` (bukan recompute history).

## 6. Validasi input (zod) di boundary service

- Setiap service mutasi: `schema.safeParse(input)` → `fieldErrors` ke envelope. Tipe inferensi dari zod (`z.infer`).
- Schema bersama di `lib/schema/`. Sanitasi HTML PPT (DOMPurify + iframe `sandbox` tanpa `allow-same-origin`) → cegah XSS (docs/03 §5).
- Slug, ID, enum di-validasi ketat; tolak field tak dikenal (`.strict()`).

## 7. OWASP Top 10 — mitigasi

| Risiko | Mitigasi |
|---|---|
| A01 Broken Access Control | RBAC 3-lapis + ownership + cek enrollment server-side; SA dianggap publik |
| A02 Cryptographic Failures | TLS wajib; argon2id password; envelope encryption kredensial (§8) |
| A03 Injection | Prisma parameterized; zod; sanitasi HTML PPT |
| A04 Insecure Design | State machine Order; outbox; idempotency ledger |
| A05 Misconfiguration | Secrets di env/secret manager; CSP; security headers; sandbox iframe |
| A06 Vulnerable Components | Dependabot/`npm audit` di CI; pin versi |
| A07 Auth Failures | DB session revocable; rate-limit OTP/login; 2FA admin/ustadz; lockout |
| A08 Integrity Failures | Verifikasi signature webhook; verifikasi `gross_amount` |
| A09 Logging Failures | AuditLog immutable + AiUsageLog + log akses media |
| A10 SSRF | Validasi/allowlist URL outbound (embed YouTube, fetch transkrip) |

Headers: `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`.

## 8. Enkripsi kredensial gateway & PII

**Envelope encryption** untuk `PaymentGateway.credentialsEnc`, `ingestKey`, `npwp/nik/accountNumber`, `twoFactorSecret`:
- DEK acak per-record → enkripsi data **AES-256-GCM** (IV unik + authTag).
- DEK dibungkus **KEK** (master key di env / KMS). Simpan `keyVersion` untuk **rotasi** tanpa decrypt massal serentak.
- **Jangan reuse satu key untuk semua**; jangan ikut backup plaintext. Decrypt hanya in-memory di service layer saat dipakai, tidak pernah dikirim ke client.
- Modul `lib/crypto.ts`: `seal(plaintext)→{ciphertext,iv,tag,keyVersion}`, `open(...)`.

## 9. Audit log

Aksi sensitif → `AuditLog` (append-only, tanpa soft delete): approve/suspend ustadz, ubah RBAC, toggle/edit kredensial gateway, refund, confirm manual payment, process payout, hapus konten, panggilan AI. Simpan `actorId, action, targetType/Id, meta, ip, userAgent`. Tak boleh di-edit/hapus dari app; retensi panjang untuk akuntabilitas (amanah) & pelaporan pajak.
