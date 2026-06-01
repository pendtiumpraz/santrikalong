# Design & Frontend — SantriKalong LMS

Fondasi UI/UX, design system, dan panduan frontend. **Baca berurutan.** Dibuat SEBELUM hi-fi mockup agar punya rasa desain yang khas, bukan template generik.

## Konsep
> **"Cahaya di Keheningan Malam"** — diturunkan dari makna *Santri Kalong* (penuntut ilmu di malam hari). Tenang · Hangat · Berbobot.

## Daftar Dokumen

| No | Dokumen | Isi |
|----|---------|-----|
| 00 | [Design Language](./00-design-language.md) | Konsep inti, mood, prinsip, **anti-slop manifesto**, voice & tone |
| 01 | [Design System](./01-design-system.md) | Token: warna (Pelita/Zaitun/Malam/Kertas), tipografi, spacing, radius, motion |
| 02 | [Komponen](./02-komponen.md) | Inventory & spesifikasi komponen UI + komponen khas LMS/Live |
| 03 | [UX Flows & IA](./03-ux-flows-ia.md) | Peta situs, prinsip UX, user flows, a11y, responsif |
| 04 | [Wireframes](./04-wireframes.md) | **Wireframe low-fi** (ASCII) untuk layar prioritas |
| 05 | [Frontend Guidelines](./05-frontend-guidelines.md) | Token→Tailwind, struktur komponen, disiplin anti-slop, a11y, performa |
| 06 | [**Sistem Multi-Tema**](./06-sistem-tema.md) | 🔑 **Kanonik theming**: light/dark × banyak tema mood, `data-theme`×`data-mode`, kontrak token, anti-FOUC, hasil diskusi 2 agent |

## Status & Langkah Berikut
**DRAFT.** Urutan kerja yang disarankan:
1. ✅ Design language & system (dokumen ini)
2. ⏭️ **Validasi konsep & palet** (review bareng)
3. ⏭️ Hi-fi mockup 1 layar "hero" (mis. Beranda atau Ruang Belajar) sebagai *north star*
4. ⏭️ Bangun komponen dasar (Button, Card, dst) sesuai token
5. ⏭️ Lanjut layar lain

> Catatan: folder `mockups/` (HTML lama) dibuat sebelum design system ini dan **tidak mengikuti** rasa desain final — anggap throwaway/referensi struktur saja. Hi-fi baru akan mengikuti `00`–`05`.
