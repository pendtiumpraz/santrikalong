import crypto from "crypto";

// Rahasia penanda tangan dokumen. Pisahkan dari AUTH_SECRET bila ada,
// agar rotasi sesi tidak membatalkan bukti yang sudah terbit.
function secret(): string {
  const s = process.env.DOC_SIGNING_SECRET || process.env.AUTH_SECRET;
  if (!s) throw new Error("DOC_SIGNING_SECRET / AUTH_SECRET belum di-set");
  return s;
}

// Payload kanonik: urutkan key agar tanda tangan deterministik (tahan reorder).
function canonical(payload: Record<string, string | number | null>): string {
  return Object.keys(payload)
    .sort()
    .map((k) => `${k}=${payload[k] ?? ""}`)
    .join("&");
}

// Tanda tangan HMAC-SHA256 atas isi dokumen → hex.
export function signDoc(payload: Record<string, string | number | null>): string {
  return crypto.createHmac("sha256", secret()).update(canonical(payload)).digest("hex");
}

// Verifikasi konstan-waktu.
export function verifyDoc(payload: Record<string, string | number | null>, sig: string): boolean {
  const expected = signDoc(payload);
  const a = Buffer.from(expected);
  const b = Buffer.from(sig ?? "");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Kode verifikasi pendek (8 char) untuk ditampilkan di dokumen.
export function shortCode(sig: string): string {
  return sig.slice(0, 8).toUpperCase();
}
