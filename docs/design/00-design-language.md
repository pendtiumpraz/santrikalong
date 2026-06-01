# Design Language — "Cahaya di Keheningan Malam"

> Status: **DRAFT** · 2026-06-01
> Ini fondasi rasa (feel) desain. Semua keputusan visual harus bisa ditarik balik ke sini.

---

## 1. Konsep Inti

**"Santri Kalong"** = penuntut ilmu di **malam hari** — orang dewasa yang sudah bekerja/berkeluarga, lalu menuntut ilmu agama selepas Isya dengan ikhlas dan tekun. Kalong = makhluk nokturnal.

Dari sini lahir metafora desain:

> **Cahaya pelita di keheningan malam.**
> Ilmu adalah cahaya. Kita belajar di tengah keheningan, fokus, khusyuk, tanpa hiruk-pikuk.

Ini **bukan** platform yang berteriak. Ini ruang yang **tenang, hangat, dan dalam** — tempat orang sibuk bisa duduk, fokus, dan merasa dihormati.

### Tiga kata kunci rasa
1. **Tenang (Khusyuk)** — lapang, tidak ramai, tidak berisik visual.
2. **Hangat (Hormat)** — nada hangat seperti cahaya lampu & kertas tua, bukan dingin korporat.
3. **Berbobot (Berilmu)** — terasa serius, kredibel, scholarly — bukan mainan.

---

## 2. Mood Board (arah, bukan dekorasi)

| Sumber rasa | Diterjemahkan jadi |
|-------------|--------------------|
| Pelita / lentera di meja belajar | Warna **aksen emas hangat** sebagai satu-satunya "cahaya" |
| Langit malam selepas Isya | **Base gelap biru-hijau pekat** (mode malam jadi default karakter) |
| Manuskrip & kertas kitab | Permukaan terang **warna perkamen hangat**, bukan putih layar |
| Tinta & kaligrafi | Tipografi **serif** berkarakter untuk judul, garis tegas |
| Keheningan | **Ruang kosong (whitespace) yang lega**, ritme tenang |

Referensi rasa (bukan untuk ditiru mentah): aplikasi membaca Qur'an premium, app jurnal/meditasi yang tenang, situs penerbit buku klasik, museum digital. **Bukan**: dashboard SaaS startup, marketplace ramai, e-learning warna-warni anak.

---

## 3. Prinsip Desain

1. **Satu cahaya.** Hanya **satu warna aksen** (emas pelita) yang boleh "menyala". Sisanya tenang. Tombol utama, highlight, progress — semua memakai cahaya yang sama agar mata tahu ke mana harus pergi.
2. **Hierarki lewat ruang & tipografi, bukan lewat warna.** Kontras dibangun dari ukuran, berat huruf, dan jarak — bukan dengan menambah banyak warna.
3. **Hormati waktu & fokus pengguna.** Halaman belajar = mode fokus, distraksi minimal. Tidak ada banner promo saat orang sedang menyimak kajian.
4. **Konten adalah raja, chrome menghilang.** UI (navbar, tombol, panel) bersikap rendah hati; teks materi, video, ayat — itu yang menonjol.
5. **Tenang dalam gerak.** Animasi lambat & halus (ease-out, 200–400ms), tidak ada bounce/elastis. Transisi seperti lampu yang meredup, bukan iklan yang melompat.
6. **Konsisten itu ibadah.** Spacing, radius, ukuran ikon — semua dari skala yang sama. Tidak ada angka "ngarang".
7. **Adab visual.** Hindari ilustrasi makhluk hidup yang berlebihan; gunakan motif geometris Islami, kaligrafi, cahaya, dan pola — dengan hemat.

---

## 4. Anti-Slop Manifesto (yang DILARANG)

Aturan keras supaya tidak terlihat seperti template AI generik:

- ❌ **Emoji sebagai ikon UI.** Gunakan icon set garis konsisten (Lucide) + ikon kustom kalong/pelita/bulan sabit. Emoji hanya boleh di konten user, bukan di chrome.
- ❌ **Gradient blob ungu→pink** atau gradasi norak. Gradien hanya halus, gelap-ke-gelap, sebagai kedalaman malam.
- ❌ **Warna hijau neon default Tailwind** (`emerald-500` polos di mana-mana). Pakai palet kustom yang sudah diredam.
- ❌ **Inter untuk segalanya.** Wajib pasangan serif (judul) + sans (body) yang punya karakter.
- ❌ **Hero "headline gede + 2 tombol + ilustrasi 3D"** template. Hero harus mengandung satu ide visual (cahaya malam) yang khas.
- ❌ **Kartu drop-shadow tebal abu-abu.** Pakai border 1px tipis + bayangan sangat halus berwarna hangat.
- ❌ **Spacing acak.** Hanya dari skala 4px.
- ❌ **Border-radius beda-beda** tiap komponen. Satu sistem radius.
- ❌ Stok foto orang tersenyum ke kamera. Visual: tekstur kertas, kaligrafi, cahaya, suasana — atau foto autentik yang diberi treatment warna brand.

---

## 5. Light & Dark — keduanya warga kelas satu

Karena "kalong" itu nokturnal, **dark theme adalah identitas**, bukan sekadar opsi. Tapi membaca materi panjang butuh kenyamanan, jadi:

- **Dark ("Malam")** — default untuk landing, hero, ruang live, splash. Identitas brand.
- **Light ("Pagi/Kertas")** — default untuk membaca materi panjang & dashboard, agar nyaman & hemat mata di siang hari.
- Pengguna bisa beralih; sistem mengingat preferensi.

Keduanya pakai **palet hangat yang sama**, hanya dibalik. Lihat `01-design-system.md`.

---

## 6. Voice & Tone (microcopy)

- **Bahasa Indonesia yang santun & hangat**, tidak kaku, tidak lebay.
- Sapaan: hormat tapi akrab — "Antum/Anda" sesuai konteks; hindari gaul berlebihan.
- Istilah keislaman dipakai wajar (kajian, dauroh, materi, mufradat) tanpa menggurui.
- Pesan kosong/eror tidak menyalahkan: *"Belum ada kelas di sini. Mulai jelajahi katalog?"*
- Doa/sapaan ringan boleh di momen tepat (mis. selesai kelas: *"Baarakallahu fiik, materi selesai."*) — secukupnya, tidak norak.

---

## 7. Bagaimana mengukur "berhasil"?

Desain ini berhasil jika seseorang yang lelah pulang kerja membuka platform jam 9 malam dan merasa: **tenang, fokus, dihormati, dan ingin tinggal belajar.** Bukan merasa sedang dijualin sesuatu.
