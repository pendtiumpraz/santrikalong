# Pertanyaan Terbuka (Perlu Diputuskan)

> Status: **DRAFT** · 2026-06-01
> Daftar keputusan yang memengaruhi arsitektur. Isi jawaban di sini saat sudah diputuskan.

## Produk & Bisnis
1. **Model monetisasi utama**: per kelas, langganan, atau campuran?
2. **Revenue share ustadz**: ada bagi hasil? Berapa %? Bagaimana payout-nya?
3. **Dauroh**: apakah selalu berbayar & berbatas kuota? Ada sertifikat?
4. **Kelas gratis**: ada konten gratis untuk akuisisi?
5. **Refund**: ada kebijakan refund?
6. **Pajak/PPN** di invoice: perlu?

## Pengguna & Akses
7. **Multi-tenant?** Apakah akan ada beberapa lembaga/yayasan dengan portal terpisah, atau satu portal terpusat? (berpengaruh besar ke data model)
8. **Co-teacher / asisten ustadz**: satu kelas bisa banyak pengajar?
9. **Dokumen approval ustadz**: apa saja yang wajib (sanad, ijazah, CV)?

## Konten & Live
10. **Provider live streaming** pilihan: Cloudflare Stream / Mux / Agora / 100ms / Zoom / YouTube Live?
11. **Provider video on-demand**: Cloudflare Stream / Mux / self-host?
12. **Batas ukuran/format upload** materi?
13. **PPT**: konversi server-side (LibreOffice) atau embed Office viewer?
14. **Proteksi konten**: seberapa ketat (DRM, watermark, signed URL saja)?

## Pembayaran
15. **Gateway prioritas** untuk MVP: Midtrans dulu? + Manual?
16. **Mata uang**: hanya IDR?
17. Butuh **VA, QRIS, e-wallet, kartu** — mana yang wajib?

## Teknis & Operasional
18. **Hosting**: Vercel + DB managed (Neon/Supabase) atau VPS sendiri?
19. **Auth**: Auth.js / Lucia / Clerk?
20. **Domain & email** pengirim (untuk notifikasi)?
21. **Bahasa antarmuka**: ID saja dulu, atau langsung multi-bahasa?

## Branding & Desain
22. Sudah ada **brand guideline / logo / warna** santrikalong.com?
23. Mau **mockup** dulu sampai level mana — wireframe low-fi atau hi-fi UI?

---

### Kebutuhan Mockup (langkah berikutnya)
User minta **mockup dulu**. Yang perlu disepakati untuk mulai mockup:
- Halaman prioritas: Landing, Katalog, Detail Kelas, Ruang Belajar (lesson viewer), Ruang Live, Checkout, Panel Ustadz, Panel Superadmin.
- Gaya: low-fi (wireframe) atau hi-fi (komponen jadi)?
- Tools: langsung React/Next + Tailwind (clickable prototype) atau gambar/figma-like dulu?
