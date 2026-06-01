# Dokumentasi Brainstorming — SantriKalong LMS

Folder ini berisi hasil brainstorming awal untuk membangun LMS **santrikalong.com** dengan Next.js.

## Daftar Isi

| No | Dokumen | Isi |
|----|---------|-----|
| 00 | [Overview & Visi](./00-overview.md) | Gambaran besar, target pengguna, mode belajar |
| 01 | [Peran & RBAC](./01-roles-rbac.md) | Role, permission, alur approval ustadz |
| 02 | [Daftar Fitur](./02-fitur.md) | Fitur lengkap per modul + prioritas |
| 03 | [Arsitektur Teknis](./03-arsitektur-teknis.md) | Tech stack, struktur Next.js, infra |
| 04 | [Pembayaran](./04-pembayaran.md) | Multi gateway, adapter, alur bayar |
| 05 | [Data Model](./05-data-model.md) | Rancangan entitas/database |
| 06 | [Roadmap](./06-roadmap.md) | Fase MVP → lanjutan |
| 07 | [Pertanyaan Terbuka](./07-pertanyaan-terbuka.md) | Keputusan yang perlu diambil |
| 08 | [Penggajian Ustadz & Pajak](./08-penggajian-ustadz-pajak.md) | Revenue share, saldo & klaim, perhitungan pajak (configurable) |
| 09 | [Keamanan Payout & Bukti](./09-keamanan-payout-bukti.md) | Anti double-claim (ledger, lock, idempotency), PDF bukti tamper-evident |
| 10 | [Consent & Marketing](./10-consent-marketing.md) | Persetujuan daftar (editable, berversi) + list kontak marketing WA/email |
| 🎨 | [**Design & Frontend**](./design/README.md) | Design language, design system, komponen, UX flows, **wireframe**, frontend guideline, tema, tolak ukur, a11y |
| ⚙️ | [**Backend & Database**](./backend/README.md) | ERD, API plan, security schema, prompt guarding, AI usage, soft-delete/restore |
| 🛠️ | [**Implementasi**](./implementation/README.md) | PM plan, urutan pengembangan, commit breakdown, progress report, QA strategy, dev standards |

## Status
**DRAFT** — masih tahap brainstorming. Langkah berikutnya: jawab pertanyaan terbuka (`07`), lalu mulai **mockup**.
