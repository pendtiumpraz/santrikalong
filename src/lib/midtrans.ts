import crypto from "crypto";

// Konfigurasi Midtrans. Server key dari env (fallback dev) — di production
// idealnya diambil dari PaymentGateway.credentials (terenkripsi) per docs/backend.
export function midtransConfig() {
  const serverKey = process.env.MIDTRANS_SERVER_KEY ?? "";
  const clientKey = process.env.MIDTRANS_CLIENT_KEY ?? "";
  const isProd = process.env.MIDTRANS_IS_PRODUCTION === "true";
  return { serverKey, clientKey, isProd, configured: serverKey.length > 0 };
}

const SNAP = (prod: boolean) => prod ? "https://app.midtrans.com/snap/v1/transactions" : "https://app.sandbox.midtrans.com/snap/v1/transactions";
const API = (prod: boolean) => prod ? "https://api.midtrans.com/v2" : "https://api.sandbox.midtrans.com/v2";

function basicAuth(serverKey: string) {
  return "Basic " + Buffer.from(serverKey + ":").toString("base64");
}

export type SnapItem = { id: string; price: number; quantity: number; name: string };

// Buat transaksi Snap → kembalikan token + redirect_url (halaman bayar Midtrans).
export async function createSnapTransaction(p: {
  orderId: string;
  grossAmount: number;
  customer: { name?: string; email?: string };
  items: SnapItem[];
  finishUrl: string;
}): Promise<{ token: string; redirectUrl: string }> {
  const { serverKey, isProd, configured } = midtransConfig();
  if (!configured) throw new Error("MIDTRANS_SERVER_KEY belum di-set");

  const res = await fetch(SNAP(isProd), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: basicAuth(serverKey) },
    body: JSON.stringify({
      transaction_details: { order_id: p.orderId, gross_amount: p.grossAmount },
      item_details: p.items,
      customer_details: { first_name: p.customer.name ?? "Santri", email: p.customer.email },
      callbacks: { finish: p.finishUrl },
      credit_card: { secure: true },
    }),
  });
  if (!res.ok) throw new Error("Midtrans Snap gagal (" + res.status + "): " + (await res.text()));
  const data = (await res.json()) as { token: string; redirect_url: string };
  return { token: data.token, redirectUrl: data.redirect_url };
}

export type MidtransStatus = { transaction_status?: string; fraud_status?: string; status_code?: string; payment_type?: string };

// Cek status transaksi (dipakai di halaman selesai sebagai fallback bila webhook belum diterima).
export async function getTransactionStatus(orderId: string): Promise<MidtransStatus> {
  const { serverKey, isProd, configured } = midtransConfig();
  if (!configured) throw new Error("MIDTRANS_SERVER_KEY belum di-set");
  const res = await fetch(`${API(isProd)}/${encodeURIComponent(orderId)}/status`, {
    headers: { Accept: "application/json", Authorization: basicAuth(serverKey) },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Midtrans status gagal (" + res.status + ")");
  return (await res.json()) as MidtransStatus;
}

// Verifikasi signature notifikasi webhook: sha512(order_id + status_code + gross_amount + serverKey).
export function verifyNotificationSignature(p: { order_id: string; status_code: string; gross_amount: string; signature_key: string }): boolean {
  const { serverKey } = midtransConfig();
  const expected = crypto.createHash("sha512").update(p.order_id + p.status_code + p.gross_amount + serverKey).digest("hex");
  // bandingkan konstan-waktu
  const a = Buffer.from(expected);
  const b = Buffer.from(p.signature_key ?? "");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Klasifikasi status transaksi Midtrans → outcome internal.
export function classifyStatus(s: MidtransStatus): "paid" | "pending" | "failed" {
  const t = s.transaction_status;
  if (t === "settlement" || (t === "capture" && s.fraud_status === "accept")) return "paid";
  if (t === "deny" || t === "cancel" || t === "expire" || t === "failure") return "failed";
  return "pending";
}
