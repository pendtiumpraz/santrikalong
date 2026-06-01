# Roadmap & Fase Pengembangan

> Status: **DRAFT** · 2026-06-01

## Filosofi
Bangun **MVP yang bisa menghasilkan** dulu (santri bisa daftar → beli → belajar), baru perkaya fitur live, gamifikasi, dan monetisasi lanjutan.

---

## Fase 0 — Fondasi (setup)
- Repo Next.js + TypeScript + Tailwind + shadcn/ui
- DB PostgreSQL + Prisma, skema awal
- Auth dasar (email + verifikasi)
- Layout & design system, mobile-first
- Deploy pipeline (staging)

## Fase 1 — MVP (On-demand + Pembayaran)
**Tujuan: santri bisa beli & belajar kelas on-demand.**
- RBAC dasar (superadmin, ustadz, santri)
- Approval ustadz
- CRUD kelas → modul → materi (video, audio, PDF)
- Viewer PDF + player video/audio (signed URL)
- Enrollment & progress dasar
- Checkout + **1–2 gateway** (mis. Midtrans + Manual) dengan toggle superadmin
- Quiz objektif (MCQ, true/false) + auto-grading
- Panel superadmin inti (approval, gateway, kategori, transaksi)
- Notifikasi email + in-app dasar

## Fase 2 — Live & Penyempurnaan
- Live streaming + jadwal + chat
- Rekaman live → VOD
- Dauroh sebagai event (kuota, periode, sertifikat)
- PPT/PPTX viewer (konversi) + HTML PPT
- Sertifikat penyelesaian
- Gateway tambahan (Tripay, Xendit)
- Kupon/voucher
- Rating & review kelas
- Analitik ustadz

## Fase 3 — Skala & Engagement
- Membership/langganan
- Revenue share & payout ustadz
- Gamifikasi (badge, poin, streak, leaderboard)
- Forum/diskusi per kelas
- Notifikasi WhatsApp/push
- Multi-bahasa & dukungan RTL Arab penuh
- Quiz live (kahoot-style)
- PWA / aplikasi mobile

---

## Saran Eksekusi
- Mulai dari **alur uang & akses** (paling berisiko): enrollment + payment + proteksi konten.
- Pakai provider managed untuk video/live agar tidak terjebak infra di awal.
- Rilis ke sekelompok kecil ustadz & santri (beta) sebelum publik.
