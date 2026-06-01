# 05 — Senior Dev Standards (santrikalong.com)

> Status: DRAFT · 2026-06-01

Dokumen ini adalah **standar wajib** untuk semua kontributor LMS santrikalong.com. Stack: Next.js (App Router) + TypeScript + Tailwind + Prisma + Auth.js. Tujuannya: kode konsisten, aman, dapat di-review, dan arsitektur tetap rapi seiring tim bertambah. Aturan di sini bersifat **blocking** — jika tidak terpenuhi, PR tidak boleh merge.

---

## 1. Coding Standards

### 1.1 TypeScript

- **`strict: true` wajib** di `tsconfig.json` (termasuk `noUncheckedIndexedAccess`, `noImplicitOverride`, `exactOptionalPropertyTypes`). Pengetatan tidak boleh diturunkan tanpa keputusan tim.
- **`any` dilarang.** Gunakan `unknown` + penyempitan tipe (narrowing) atau generic. `as` cast hanya boleh setelah validasi runtime (mis. hasil `zod.parse`).
- **Jangan `// @ts-ignore`.** Jika benar-benar terpaksa, pakai `// @ts-expect-error` + komentar alasan + tiket follow-up.
- Tipe domain (DTO, entity, Result) didefinisikan eksplisit, bukan disimpulkan dari Prisma row mentah yang bocor ke UI.
- Hindari `enum` TS — gunakan `as const` union atau enum Prisma yang di-re-export.

### 1.2 Penamaan

| Item | Konvensi | Contoh |
|---|---|---|
| Komponen React | `PascalCase` | `EnrollmentCard.tsx` |
| Hook | `useXxx` | `useCurrentUser.ts` |
| Service / util / fungsi | `camelCase` | `enrollStudent`, `formatRupiah` |
| Tipe / interface | `PascalCase` (tanpa prefix `I`) | `EnrollmentInput` |
| Konstanta global | `SCREAMING_SNAKE_CASE` | `MAX_UPLOAD_BYTES` |
| File route handler | `route.ts` | `app/api/webhooks/payment/route.ts` |
| Server Action | kata kerja, suffix `Action` opsional | `createCourseAction` |
| Boolean | prefix `is/has/can/should` | `isPublished`, `canEnroll` |

- Nama jelas dan deskriptif. Hindari singkatan ambigu (`usr`, `txn` boleh jika konsisten dan terdokumentasi).
- Folder & file non-komponen: `kebab-case`.

### 1.3 Struktur Folder

```
src/
  app/                      # routing App Router (page, layout, route handler)
    (public)/               # route group: halaman publik
    (dashboard)/            # route group: area login
    api/                    # route handlers (webhook, integrasi)
  modules/                  # batas modul domain (bounded context)
    <module>/
      service/              # ← business logic & otorisasi (PUBLIK lintas modul)
        index.ts            # API publik modul (HANYA ini yang boleh diimpor modul lain)
      repository/           # ← akses Prisma (INTERNAL, jangan diimpor lintas modul)
      schema/               # skema zod + tipe input/output
      actions/              # server actions (tipis)
      components/           # komponen khusus modul
      types.ts
  components/               # komponen UI lintas modul (design system)
  lib/                      # util murni, client (prisma, auth, sentry, env)
  server/                   # helper sisi server lintas modul (requirePermission, audit, result)
  styles/                   # token tema
docs/
prisma/
```

Aturan impor (di-enforce lint, lihat §2 & §5):
- `components/` & `lib/` **tidak boleh** mengimpor dari `modules/*`.
- `modules/A` hanya boleh mengimpor `modules/B/service` (API publik) — **tidak** `modules/B/repository`.
- `repository/` hanya diimpor oleh `service/` dalam modul yang sama.

### 1.4 Server Components default, Client seperlunya

- **Default Server Component.** `"use client"` hanya jika butuh state interaktif, event handler, browser API, atau hook client.
- Dorong batas `"use client"` serendah & sekecil mungkin (komponen daun), bukan di layout/page atas.
- **Jangan** mengambil data sensitif di Client Component. Fetch di server, kirim DTO minimal (jangan kirim row Prisma mentah / field rahasia).
- Mutasi via **Server Action** atau **Route Handler**, bukan fetch ad-hoc dari client tanpa lapisan validasi.

### 1.5 Validasi Zod di Server

- **Semua input eksternal** (form, query, body webhook, params) **wajib** divalidasi dengan zod **di server** sebelum dipakai. Validasi client hanya UX, bukan keamanan.
- Skema disimpan di `modules/<m>/schema/` dan dipakai ulang untuk infer tipe (`z.infer`).
- Pola: `const parsed = Schema.safeParse(input); if (!parsed.success) return err(...)` — jangan throw mentah ke user.

---

## 2. GUARDRAIL ARSITEKTUR (WAJIB — blocking)

Ini adalah inti integritas sistem. Pelanggaran = PR ditolak.

### 2.1 Server Action / Route Handler harus TIPIS

Action/handler hanya **orkestrasi 4 langkah**, tanpa business logic:

```ts
// modules/enrollment/actions/enroll.ts
export async function enrollAction(input: unknown): Promise<Result<EnrollmentDto>> {
  // 1) PARSE — validasi zod
  const parsed = EnrollInput.safeParse(input);
  if (!parsed.success) return err("VALIDATION", parsed.error.flatten());

  // 2) REQUIRE PERMISSION — otorisasi
  const actor = await requirePermission("enrollment:create");

  // 3) SERVICE — semua logika di sini
  const result = await enrollmentService.enroll(actor, parsed.data);

  // 4) BUNGKUS Result<T>
  return result;
}
```

Larangan di action/handler: query Prisma langsung, kalkulasi domain, pengecekan otorisasi manual, kirim email/notif, mutasi wallet. Semua itu milik service.

### 2.2 Business logic & otorisasi HANYA di service layer

- Keputusan domain (boleh/tidak, harga, status transisi) dan **otorisasi tingkat resource** (mis. "guru ini pemilik kelas ini?") berada di service.
- `requirePermission` di action hanya cek izin kasar (coarse); service tetap memverifikasi kepemilikan/scope data.
- Repository **tidak** memuat logika bisnis — hanya CRUD/query.

### 2.3 Lintas-modul hanya via service publik

- Modul lain mengakses fungsionalitas via `modules/X/service` (export publik) — **dilarang** mengimpor `repository`, schema internal, atau model Prisma modul lain langsung.
- Tujuan: batas modul tegas, refactor aman, ketergantungan terkontrol. Di-enforce oleh ESLint boundaries (§5).

### 2.4 Tidak ada warna hardcoded

- Gunakan **token peran/semantik** dari tema (mis. `bg-surface`, `text-brand`, `border-danger`), bukan warna mentah.
- **Lint memblokir** literal palet seperti `pelita-*`, `malam-*`, `emerald-*`, juga hex (`#`), `rgb(`, `hsl(` di JSX/className.
- Tambah/ubah warna hanya lewat token tema terpusat (`styles/` + config Tailwind), divalidasi token validator (§5).

### 2.5 Tidak ada mutasi wallet di luar transaksi ber-ledger

- Setiap perubahan saldo **wajib** lewat `walletService` dalam **transaksi DB** yang menulis **entri ledger** (double-entry / append-only) di transaksi yang sama.
- **Dilarang** `prisma.wallet.update({ balance })` langsung. Saldo adalah turunan/terkunci konsistensinya dengan ledger.
- Operasi finansial harus **idempoten** (pakai idempotency key untuk webhook/retry pembayaran).

### 2.6 Aksi sensitif menulis AuditLog

- Aksi sensitif (perubahan izin/peran, mutasi wallet, payout, ubah harga, hapus data, login admin, perubahan integrasi) **wajib** menulis `AuditLog` dalam transaksi yang sama dengan aksinya.
- AuditLog memuat: `actorId`, `action`, `targetType`, `targetId`, `metadata` (tanpa data rahasia), `createdAt`. Append-only.

### 2.7 Perubahan izin bump `permVersion`

- Saat izin/peran user berubah, **wajib** menaikkan `permVersion` user terkait sehingga sesi/token lama invalid dan izin di-refresh.
- Cek `permVersion` saat resolve sesi; mismatch memaksa re-evaluasi izin.

---

## 3. Git Workflow & Branching

- **Trunk-based**: branch pendek dari `main`, hidup singkat (≤ 1–2 hari), sering rebase ke `main`.
- Penamaan branch: `feat/<ringkas>`, `fix/<ringkas>`, `chore/...`, `refactor/...`.
- **Conventional Commits**: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`, `perf:`. Subjek imperatif, ringkas; breaking change pakai `!` atau footer `BREAKING CHANGE:`.
- **PR kecil & reviewable**: idealnya < ~400 baris diff. PR besar dipecah. Sertakan deskripsi: tujuan, cara test, dampak, screenshot bila UI.
- **Migrasi Prisma di PR terpisah** dan **reversible** (punya jalur rollback). Pisahkan migrasi skema dari perubahan kode aplikasi agar deploy bertahap aman (expand → migrate → contract).
- **Fitur berisiko di belakang feature flag** (default off). Merge boleh duluan, aktivasi terkontrol & dapat di-rollback tanpa revert kode.
- Tidak ada force-push ke `main`. Tidak ada `--no-verify` / skip hook kecuali disetujui eksplisit.

---

## 4. Checklist CODE REVIEW

Reviewer mencentang semua sebelum approve:

**Keamanan**
- [ ] Semua input eksternal divalidasi zod di server; tidak ada data rahasia bocor ke client.
- [ ] Tidak ada secret hardcoded; query aman dari injeksi (pakai Prisma, bukan raw string).

**Otorisasi**
- [ ] Setiap action/handler memanggil `requirePermission`.
- [ ] Service memverifikasi kepemilikan/scope resource (bukan hanya izin kasar).
- [ ] Perubahan izin/peran bump `permVersion`.

**Idempotensi**
- [ ] Operasi mutasi (terutama wallet/pembayaran/webhook) idempoten via idempotency key.

**Error handling (Result)**
- [ ] Fungsi domain mengembalikan `Result<T>`, bukan throw tak terkendali.
- [ ] Pesan ke user generik; detail teknis di-log, bukan di-expose.

**Arsitektur**
- [ ] Action/handler tipis (parse → requirePermission → service → Result).
- [ ] Tidak ada akses Prisma di action/komponen; lintas modul via service publik.
- [ ] Tidak ada mutasi wallet di luar transaksi ber-ledger; AuditLog ditulis untuk aksi sensitif.

**Test**
- [ ] Ada unit test untuk logika service & integration test untuk alur kritikal/perubahan ini.

**A11y**
- [ ] Elemen interaktif punya label/role; fokus & keyboard nav benar; kontras cukup; pakai HTML semantik.

**Perf**
- [ ] Tidak ada N+1 query; `"use client"` minimal; data fetch efisien; tidak ada regresi bundle besar.

**No-hardcoded-color**
- [ ] Hanya token tema dipakai; tidak ada `pelita-/malam-/emerald-`, hex, `rgb()`/`hsl()`.

---

## 5. CI Gates (BLOCKING)

Pipeline harus hijau sebelum merge. Semua gate berikut **memblokir**:

1. **Typecheck** — `tsc --noEmit` (strict) tanpa error.
2. **Lint anti-slop** — ESLint termasuk:
   - aturan boundaries (no impor `repository` lintas modul; `lib/`/`components/` tak impor `modules/*`),
   - blok `any`, `@ts-ignore`, `console.log` tersisa,
   - blok Prisma di action/komponen,
   - blok warna hardcoded (`pelita-*`, `malam-*`, `emerald-*`, hex, `rgb/hsl`).
3. **Unit + Integration tests** — lulus semua; ambang coverage modul kritikal tidak turun.
4. **axe-core** — scan a11y otomatis pada halaman/komponen kunci, 0 violation serius.
5. **Lighthouse** — skor **a11y ≥ 95** dan **perf budget** terpenuhi (gagal jika di bawah ambang).
6. **Bundle size** — size budget per route/chunk; gagal jika melampaui batas.
7. **Validator token tema** — memastikan semua warna merujuk token terdaftar; token tak dikenal = gagal.
8. **Secret scan** — gitleaks/trufflehog; deteksi secret = gagal.

---

## 6. Error Handling & Logging

### 6.1 Result discriminated union

Service tidak melempar exception untuk error yang diharapkan; kembalikan `Result<T>`:

```ts
type Ok<T> = { ok: true; data: T };
type Err = { ok: false; code: ErrorCode; message: string; details?: unknown };
type Result<T> = Ok<T> | Err;

const ok = <T>(data: T): Result<T> => ({ ok: true, data });
const err = (code: ErrorCode, message: string, details?: unknown): Err =>
  ({ ok: false, code, message, details });
```

- `ErrorCode` adalah union terbatas (mis. `"VALIDATION" | "FORBIDDEN" | "NOT_FOUND" | "CONFLICT" | "INTERNAL"`) yang dipetakan ke HTTP/UI.
- Error tak terduga (bug, infra) boleh throw → ditangkap boundary → dilaporkan ke Sentry → user dapat pesan generik.

### 6.2 Sentry

- Integrasikan Sentry (server + client). Tangkap error tak terduga dengan konteks (request id, actor id, modul) — **tanpa** PII/secret.
- Pasang `tracesSampleRate` wajar untuk perf monitoring.

### 6.3 Jangan bocorkan detail ke user

- Pesan user generik & ramah ("Terjadi kesalahan, coba lagi"). **Jangan** kirim stack trace, query, atau pesan internal.
- Detail lengkap hanya di log/Sentry, dikorelasikan via `requestId`.

---

## 7. Keamanan Dasar Dev

- **Env & secrets**: semua rahasia via env (divalidasi saat boot dengan zod di `lib/env`). **Jangan** commit `.env`; `.env.example` berisi placeholder. Akses env hanya di server.
- **Enkripsi kredensial gateway**: kredensial payment/integrasi disimpan **terenkripsi at-rest** (mis. AES-GCM dengan KMS/secret terpisah), bukan plaintext di DB. Dekripsi hanya saat dipakai di server.
- **Signed URL**: aset privat (materi, sertifikat, upload) diakses lewat URL bertanda tangan & **kedaluwarsa**, bukan URL publik permanen. Verifikasi otorisasi sebelum menerbitkan signed URL.
- **Verifikasi webhook**: semua webhook (pembayaran dll.) **wajib** diverifikasi signature/HMAC sebelum diproses, cek timestamp (anti-replay), dan **idempoten** terhadap pengiriman ulang. Tolak payload tak terverifikasi tanpa membocorkan alasan detail.
- Prinsip umum: least privilege, validasi di server, default deny pada otorisasi, jangan percaya input client.

---

_Aturan ini hidup; usul perubahan lewat PR ke dokumen ini + diskusi tim. Sampai disepakati, standar di atas berlaku penuh._
