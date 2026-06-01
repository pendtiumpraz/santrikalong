# SantriKalong LMS — Aplikasi (Next.js)

Implementasi LMS santrikalong.com. UI **port 1:1 dari `prototype/`** (design system sama persis via `src/app/globals.css`).

Dokumen: lihat [`docs/`](./docs/README.md) (produk, design, backend, implementation).

## Stack
- **Next.js (App Router) + TypeScript + Tailwind** (preflight dimatikan; pakai design system port dari prototype → tampilan identik).
- **Neon Postgres** + **Prisma** (driver serverless `@prisma/adapter-neon`).
- **Storage blob privat** (S3-compatible: Cloudflare R2 / S3) — file **selalu diakses lewat domain kita** via `app/media/[...key]` (URL blob tak pernah terekspos).
- **PWA** (manifest) — installable; siap dibungkus jadi **APK** (lihat di bawah).

## Setup
```bash
cp .env.example .env        # isi DATABASE_URL (Neon), STORAGE_* (R2/S3), dst
npm install
npm run db:generate         # generate Prisma client
npm run db:push             # buat tabel di Neon (dev) — produksi pakai migrate
npm run dev                 # http://localhost:3000
```

## Tema (light/dark × multi-tema)
- `data-theme` (Pelita Malam / Kertas Subuh) × `data-mode` (light/dark) di `<html>`.
- **Anti-FOUC**: `layout.tsx` (Server Component) membaca cookie → set atribut saat SSR.
- Ganti tema via tombol palet (kanan-bawah, di-inject `AppClient`); pilihan disimpan di cookie → konsisten antar halaman & SSR.

## Storage privat lewat domain sendiri
- Upload: presigned PUT ke bucket privat (`lib/storage.ts → presignUpload`).
- Akses: `GET /media/<key>` (`app/media/[...key]/route.ts`) men-stream objek dari bucket privat. Klien hanya melihat `https://santrikalong.com/media/...`.
- TODO: tambah cek sesi + enrollment di route media sebelum produksi (docs/backend/03).

## Mobile & APK
- Sudah **mobile-first/responsive** (sama seperti prototype) + **PWA** (manifest, theme-color, installable).
- Jadi **APK** setelah selesai: bungkus PWA via **Bubblewrap** / **PWABuilder** (TWA) atau **Capacitor**.
- Catatan: ganti `public/icon-192.png` & `icon-512.png` dengan PNG asli (saat ini ada `icon.svg`); store APK butuh PNG maskable.

## Status konversi halaman (prototype → Next.js)
- [x] Fondasi: globals.css (design system), theme engine, IconSprite, AppClient, layout, storage, media route, Prisma starter, PWA.
- [x] `/` (landing)
- [ ] `/katalog`, `/kelas`, `/checkout`, `/dashboard`, `/belajar`, `/live`, `/sertifikat`, `/profil`, `/auth`, `/onboarding-otp`, `/studio`, `/admin`, `not-found`
  → dikonversi batch berikutnya; **semua memakai `globals.css` yang sama → 100% identik dengan prototype**.

> Kebenaran visual dijaga dengan memakai ulang CSS prototype apa adanya. Komponen React = struktur sama, class sama.
