# 05 — Penggunaan AI: Use Case, Model, Biaya, Guardrail (Final)

> Status: **FINAL** · 2026-06-01
> Model default **Claude** (Opus/Sonnet/Haiku terbaru). Adapter `LLMProvider` di `src/server/ai/` agar model bisa diganti. Guardrail di `04-prompt-guarding.md`.

## 1. Scope MVP
Sesuai rekomendasi rekan: **mulai dari generate-quiz + transkrip**. Sisanya Fase 2+.

## 2. Use case & pilihan model

| Fitur | Pendekatan | Model | Prioritas |
|---|---|---|---|
| **Generate kuis dari materi** | Structured output (tool/JSON) → draft Question+Option; ustadz **wajib review**. Async via queue. | **Sonnet** (keseimbangan kualitas/biaya) | 🟢 MVP |
| **Transkrip audio/video** | ASR (Whisper / provider) → simpan VTT `LessonAsset(kind=TRANSCRIPT)`; subtitle + sumber search/quiz. Trigger via webhook `asset.ready`. | ASR provider (bukan Claude) | 🟢 MVP |
| **Pencarian semantik** | Embedding materi+transkrip → **pgvector** (sudah PostgreSQL). `/api/v1/catalog/search` mode hybrid. | embedding model | 🟡 |
| **Rekomendasi kelas** | Awal rule-based (kategori+history); lanjut embedding similarity. | — / embedding | 🔵 |
| **Moderasi konten** | Klasifikasi teks diskusi/Q&A/review → flag; **manusia final**. | **Haiku** (murah, volume) | 🟡 |
| **Ringkasan materi** | Ringkas poin per lesson dari transkrip; disclaimer. | **Haiku/Sonnet** | 🔵 |

> **Opus** disiapkan untuk tugas penalaran berat sesekali (mis. review kualitas soal), bukan jalur volume.

## 3. Prompt caching

- Konteks besar yang dipakai berulang (materi/transkrip panjang, system prompt + few-shot) ditandai sebagai **cache breakpoint** Claude. Susun prompt: `[system stabil + few-shot (cached)] → [dokumen materi (cached per-lesson)] → [instruksi spesifik (variabel)]`.
- Manfaat: generate banyak soal dari satu materi → konteks materi cache-hit, hanya instruksi yang berubah. Catat `cacheHit` di `AiUsageLog`.

## 4. Estimasi biaya (orientasi, IDR ~Rp16.000/USD)

Asumsi kasar (tarif Claude bisa berubah; angka untuk perencanaan budget cap, bukan kontrak):

| Tugas | Token in/out (perkiraan) | Model | Biaya/operasi (perkiraan) |
|---|---|---|---|
| Generate 10 soal / lesson | ~8k in (cached sebagian) + 2k out | Sonnet | ~Rp300–800 |
| Moderasi 1 komentar | ~0.5k in + 0.1k out | Haiku | ~Rp5–20 |
| Ringkasan 1 lesson | ~6k in + 1k out | Haiku | ~Rp50–150 |
| Transkrip 1 jam audio | — | ASR | ~Rp2.000–10.000 (per provider) |

Dengan prompt caching, biaya generate-quiz turun signifikan untuk batch. **Budget cap default**: per ustadz Rp50.000/bulan untuk AI text (configurable), platform total cap harian → alert.

## 5. Guardrail (ringkas; detail di 04)
- Pisahkan instruksi vs data; output via JSON schema + zod; sanitasi & filter domain (anti-fatwa).
- Output AI selalu **draft** butuh approval manusia. AI tak menulis DB langsung.
- Redaksi PII/sanad sebelum kirim. Rate-limit + budget cap + `AiUsageLog`.

## 6. Fallback & ketahanan
- **Model fallback**: Sonnet gagal/over-budget → coba Haiku (kualitas lebih rendah, tandai); transient error → exponential backoff retry.
- **Provider fallback**: adapter `LLMProvider` memungkinkan ganti provider tanpa rombak service.
- **Degradasi anggun**: budget cap tercapai → fitur AI dinonaktifkan sementara, UI menampilkan "buat manual". Tidak memblokir alur inti (belajar/bayar).
- **Idempotent jobs**: semua panggilan AI **async via queue** (Inngest/BullMQ), idempotent (dedup by `inputHash`+ref), retry. **Cache hasil** (quiz draft/ringkasan) di DB — jangan regenerate.

## 7. Human-in-the-loop
- Quiz: ustadz review & edit sebelum publish.
- Moderasi: AI pra-saring → admin/ustadz keputusan final (konten agama).
- Ringkasan publik: berlabel otomatis + arahkan ke ustadz untuk masalah hukum/fikih.

## 8. Arsitektur modul
`src/server/ai/` : `provider.ts` (interface `LLMProvider`), `claude.ts`, `prompts/` (versioned), `quizGen.ts`, `moderation.ts`, `embedding.ts`. Dipanggil **hanya** dari worker job, bukan inline request.
