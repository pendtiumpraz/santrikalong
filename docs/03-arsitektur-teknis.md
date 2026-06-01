# Arsitektur Teknis

> Status: **DRAFT** · 2026-06-01

## 1. Tech Stack (usulan)

| Layer | Pilihan | Alasan |
|-------|---------|--------|
| Framework | **Next.js (App Router)** | Full-stack, SSR/SSG untuk SEO katalog, API routes/Server Actions |
| Bahasa | **TypeScript** | Aman & maintainable |
| Styling | **Tailwind CSS** + **shadcn/ui** | Cepat, konsisten, mobile-first |
| Database | **PostgreSQL** | Relasional, cocok untuk RBAC/enrollment/transaksi |
| ORM | **Prisma** (atau Drizzle) | Type-safe, migrasi mudah |
| Auth | **Auth.js (NextAuth)** atau **Lucia** / **Clerk** | Email, OAuth, role |
| Penyimpanan file | **S3-compatible** (Cloudflare R2 / Wasabi / S3) | Materi, video, PDF |
| Video on-demand | **Cloudflare Stream** / **Mux** | Transcoding, signed URL, adaptif |
| Live streaming | **Cloudflare Stream Live** / **Mux** / **100ms** / **Agora** | Broadcast + low latency |
| Cache/Queue | **Redis** (Upstash) | Session, rate limit, job ringan |
| Background jobs | **BullMQ** / Inngest / cron | Konversi PPT→PDF, kirim email, payout |
| Email | **Resend** / SMTP | Notifikasi & verifikasi |
| Pembayaran | **Midtrans / Tripay / Xendit** SDK | Multi gateway |
| Deployment | **Vercel** (app) + DB managed (Neon/Supabase/RDS) | Mudah scale |

> Catatan: untuk video berat & live, lebih hemat & andal pakai provider khusus daripada self-host di awal.

## 2. Struktur Next.js (App Router) — usulan

```
src/
├── app/
│   ├── (marketing)/              # landing, katalog publik (SEO)
│   │   ├── page.tsx
│   │   └── kelas/[slug]/page.tsx
│   ├── (auth)/                   # login, register, verifikasi
│   ├── (santri)/                 # area belajar
│   │   ├── dashboard/
│   │   ├── kelas/[id]/belajar/
│   │   └── live/[id]/
│   ├── (ustadz)/                 # panel pengajar
│   │   └── studio/...
│   ├── (admin)/                  # panel superadmin/admin
│   │   ├── rbac/
│   │   ├── ustadz-approval/
│   │   ├── pembayaran/
│   │   └── laporan/
│   └── api/
│       ├── webhooks/             # midtrans, tripay, xendit, mux
│       └── ...
├── components/
├── lib/                          # auth, db, payment adapters, rbac
│   ├── payment/
│   │   ├── provider.ts           # interface PaymentProvider
│   │   ├── midtrans.ts
│   │   ├── tripay.ts
│   │   └── xendit.ts
│   └── rbac/
├── server/                       # service layer, actions
└── prisma/
    └── schema.prisma
```

## 3. Pola Penting

### a. Payment Adapter (Strategy Pattern)
Satu interface `PaymentProvider` (createTransaction, verifyWebhook, getStatus). Tiap gateway implementasi sendiri. Superadmin tinggal nyalakan/matikan & isi API key per gateway. → detail di `04-pembayaran.md`.

### b. RBAC Middleware
- Cek permission di middleware/route + di service layer (jangan hanya di UI).
- Permission disimpan di DB, di-cache di Redis/session untuk performa.

### c. Proteksi konten berbayar
- Video & file pakai **signed URL** berbatas waktu.
- Cek enrollment sebelum kasih akses materi.
- Hindari URL file statis yang bisa dibagikan bebas.

### d. Konversi materi
- PPT/PPTX → PDF/gambar via **LibreOffice headless** di worker (background job).
- Simpan hasil di object storage.

## 4. Infrastruktur & Lingkungan
- Env terpisah: `development`, `staging`, `production`.
- Secrets di env vars (jangan commit API key gateway).
- Webhook gateway → endpoint terverifikasi (signature check).
- Backup DB terjadwal.
- Monitoring: error tracking (Sentry), uptime, log.

## 5. Keamanan
- HTTPS wajib.
- Rate limiting (login, OTP, webhook).
- Validasi input (zod) di server.
- Verifikasi signature webhook pembayaran.
- Audit log untuk aksi sensitif.
- Sanitasi HTML PPT (iframe sandbox) agar tidak jadi celah XSS.

## 6. Skalabilitas (nanti)
- Pisahkan worker job dari web.
- CDN untuk aset & video (sudah otomatis kalau pakai Cloudflare/Mux).
- Read replica DB kalau traffic besar.
