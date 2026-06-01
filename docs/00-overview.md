# SantriKalong LMS — Overview & Visi

> Dokumen brainstorming awal. Status: **DRAFT** · Update terakhir: 2026-06-01

## 1. Apa ini?

Platform **Learning Management System (LMS)** untuk **santrikalong.com** — pembelajaran ilmu agama & bahasa secara online, dengan dua mode utama:

1. **Live Streaming** — kajian/kelas langsung (dauroh online, kelas terjadwal).
2. **Self-paced / On-demand** — ustadz upload materi (video, audio, PDF, PPT), santri belajar kapan saja.

Dibangun dengan **Next.js (full-stack)**.

## 2. Target Pengguna

| Segmen | Kebutuhan |
|--------|-----------|
| Santri / Member | Belajar bahasa Arab, tahsin, ikut dauroh, kuis, sertifikat |
| Ustadz / Pengajar | Bikin kelas, upload materi, live streaming, kelola kuis & santri |
| Admin / Superadmin | Approve ustadz, RBAC, atur pembayaran, moderasi konten |

## 3. Kategori Materi (contoh)

- Bahasa Arab (Nahwu, Shorof, Muhadatsah)
- Tahsin & Tahfizh Al-Qur'an
- Dauroh Online (event berbatas waktu)
- Fiqih, Aqidah, Hadits, dll (extensible)

## 4. Mode Pembelajaran

### A. Live Streaming
- Kelas/kajian terjadwal secara langsung.
- Bisa berupa dauroh (event, sesi terbatas) atau kelas reguler.
- Fitur pendukung: chat live, Q&A, rekaman otomatis (jadi VOD setelah selesai).

### B. On-demand (Self-paced)
- Ustadz upload materi per modul/pertemuan.
- Tipe konten materi:
  - **Video** (upload / embed / streaming)
  - **Audio** (kajian audio, murottal)
  - **PDF** (ditampilkan inline di viewer)
  - **PPT / PPTX** (ditampilkan inline)
  - **HTML PPT** (slide berbasis HTML — mis. reveal.js — ditampilkan langsung)
- **Quiz** per modul/materi untuk evaluasi.

## 5. Pilar Utama Sistem

1. **Konten & Kurikulum** — kelas, modul, materi multi-format, quiz.
2. **Live & Event** — streaming, jadwal, dauroh.
3. **Manajemen Pengguna & RBAC** — santri, ustadz, admin, approval ustadz.
4. **Monetisasi & Pembayaran** — multi gateway (Midtrans, Tripay, Xendit, manual), bisa diaktif/nonaktifkan dari panel superadmin.
5. **Penilaian & Progress** — tracking, quiz, sertifikat.

## 6. Daftar Dokumen Brainstorming

| File | Isi |
|------|-----|
| `00-overview.md` | Visi & ringkasan (dokumen ini) |
| `01-roles-rbac.md` | Peran pengguna, RBAC, alur approval ustadz |
| `02-fitur.md` | Daftar fitur lengkap per modul |
| `03-arsitektur-teknis.md` | Tech stack, struktur Next.js, infra |
| `04-pembayaran.md` | Strategi pembayaran & integrasi gateway |
| `05-data-model.md` | Rancangan entitas/database |
| `06-roadmap.md` | Fase MVP → lanjutan |
| `07-pertanyaan-terbuka.md` | Hal yang perlu diputuskan |

## 7. Prinsip Desain

- **Mobile-first** — mayoritas santri akses via HP.
- **Multi-payment, toggle-able** — admin bisa nyalakan/matikan gateway.
- **Modular & extensible** — kategori/jenis kelas bisa nambah tanpa rombak besar.
- **Aman & amanah** — data pengguna & transaksi terjaga.
