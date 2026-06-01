# Prototype Hi-Fi — SantriKalong LMS

Mockup HTML **semua halaman**, mengikuti `docs/design/00`–`09`. Design system bersama → tinggal dikonversi ke komponen Next.js + Tailwind. **Bukan** folder `mockups/` lama (throwaway).

## Cara buka
Buka `index.html` di browser (atau `npx serve prototype`). Ganti tema/mode/teks via tombol **palet** kanan-bawah — **persist antar halaman** (localStorage).

## Fondasi bersama
| File | Isi |
|------|-----|
| `assets/app.css` | Design system: token 2 tema (Pelita Malam / Kertas Subuh) × light/dark, komponen, responsive |
| `assets/app.js` | Sprite ikon (SVG, tanpa emoji), theme-switcher global + persist, helper tabs/sidebar/modal/drawer, anti-FOUC |

## Halaman

### Publik & Santri
| File | Halaman |
|------|---------|
| `index.html` | Landing (hero "cahaya di malam", kategori, kelas pilihan) |
| `katalog.html` | Katalog + filter + chips + search |
| `kelas.html` | Detail kelas + **keranjang (drawer)** + **checkout (modal multi-gateway)** |
| `checkout.html` | Keranjang penuh + ringkasan + kupon + metode bayar + upload bukti manual |
| `dashboard.html` | Dashboard santri ("Lanjutkan belajar", kelas saya, live mendatang) |
| `belajar.html` | Ruang belajar: player + viewer PDF/audio/slide + tab Kuis/Catatan/Diskusi + silabus |
| `live.html` | Ruang live: stream + kontrol + chat + Q&A |
| `sertifikat.html` | Sertifikat + **verifikasi keaslian publik** |
| `profil.html` | Profil & Pengaturan: **pemilih tema penuh** + **consent (editable)** + notifikasi + keamanan |
| `auth.html` | Masuk / Daftar + **consent** (ToS/Privasi + opt-in marketing) |
| `onboarding-otp.html` | Verifikasi OTP |
| `404.html` | Halaman sistem (not found) |

### Pengelola
| File | Halaman |
|------|---------|
| `studio.html` | Studio Ustadz: dashboard, editor kurikulum, builder kuis, jadwal live, **penghasilan + klaim payout** |
| `admin.html` | Superadmin: dashboard, **approval ustadz**, **RBAC**, **kontak marketing**, **gateway**, **penggajian + pajak**, transaksi, audit |

## Catatan konversi ke Next.js
- CSS variables di `app.css` = persis token untuk `globals.css` + Tailwind (`rgb(var(--x) / <alpha-value>)`).
- Theme switch di prototype pakai localStorage + inline head-script (anti-FOUC); di produksi → cookie + SSR + Server Action (lihat `docs/design/06 §4`).
- Ikon inline `<symbol>` → ganti Lucide + ikon kustom brand.
- Disiplin anti-slop dipertahankan: tanpa emoji di UI, Fraunces + Plus Jakarta Sans, satu aksen "menyala", shadow/glow via token.
