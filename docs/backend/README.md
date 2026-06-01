# Backend & Database — SantriKalong LMS

Hasil **diskusi 2 agent** (Backend/API Architect + Database & Security Engineer). Acuan teknis untuk merangkai database & API.

| No | Dokumen | Isi |
|----|---------|-----|
| 01 | [ERD](./01-erd.md) | Entity-relationship: entitas, relasi, kunci, indeks, enum status |
| 02 | [API Plan](./02-api-plan.md) | Endpoint/Server Action per modul, auth, paginasi, error envelope, rate limit |
| 03 | [Security Schema](./03-security-schema.md) | RBAC berlapis, signed URL, verifikasi webhook, OWASP, enkripsi kredensial, audit |
| 04 | [Prompt Guarding](./04-prompt-guarding.md) | Pertahanan prompt injection untuk fitur AI, sanitasi I/O, pembatasan tool |
| 05 | [AI Usage](./05-ai-usage.md) | Use case AI, pilihan model Claude, caching, biaya, guardrail, human-in-the-loop |
| 06 | [Soft Delete & Restore](./06-soft-delete-restore.md) | Pola soft delete, audit, restore, retensi, hard-delete terjadwal |

> Selaraskan dengan requirement produk: anti-fraud payout (`../09-keamanan-payout-bukti.md`) & consent (`../10-consent-marketing.md`).
