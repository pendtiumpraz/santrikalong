import crypto from "crypto";

// Tripay (closed payment). Default channel QRIS agar cukup satu redirect ke
// halaman bayar Tripay. Pemilihan channel lain bisa ditambah kemudian.
export function tripayConfig() {
  const apiKey = process.env.TRIPAY_API_KEY ?? "";
  const privateKey = process.env.TRIPAY_PRIVATE_KEY ?? "";
  const merchantCode = process.env.TRIPAY_MERCHANT_CODE ?? "";
  const isProd = process.env.TRIPAY_IS_PRODUCTION === "true";
  return { apiKey, privateKey, merchantCode, isProd, configured: apiKey.length > 0 && privateKey.length > 0 && merchantCode.length > 0 };
}

const base = (prod: boolean) => (prod ? "https://tripay.co.id/api" : "https://tripay.co.id/api-sandbox");

export async function createTripayTransaction(p: {
  orderId: string;
  amount: number;
  customerName?: string;
  customerEmail?: string;
  itemName: string;
  returnUrl: string;
  channel?: string;
}): Promise<{ redirectUrl: string; reference: string }> {
  const { apiKey, privateKey, merchantCode, isProd, configured } = tripayConfig();
  if (!configured) throw new Error("Kredensial Tripay belum lengkap");

  const signature = crypto.createHmac("sha256", privateKey).update(merchantCode + p.orderId + p.amount).digest("hex");
  const res = await fetch(base(isProd) + "/transaction/create", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + apiKey },
    body: JSON.stringify({
      method: p.channel ?? "QRIS",
      merchant_ref: p.orderId,
      amount: p.amount,
      customer_name: p.customerName ?? "Santri",
      customer_email: p.customerEmail ?? "santri@santrikalong.com",
      order_items: [{ name: p.itemName, price: p.amount, quantity: 1 }],
      return_url: p.returnUrl,
      signature,
    }),
  });
  if (!res.ok) throw new Error("Tripay create gagal (" + res.status + "): " + (await res.text()));
  const json = (await res.json()) as { data?: { checkout_url?: string; reference?: string } };
  if (!json.data?.checkout_url) throw new Error("Tripay: checkout_url kosong");
  return { redirectUrl: json.data.checkout_url, reference: json.data.reference ?? "" };
}

// Verifikasi callback Tripay: HMAC-SHA256(rawBody, privateKey) == X-Callback-Signature.
export function verifyTripayCallback(rawBody: string, signatureHeader: string): boolean {
  const { privateKey } = tripayConfig();
  const expected = crypto.createHmac("sha256", privateKey).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signatureHeader ?? "");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function classifyTripay(status: string): "paid" | "failed" | "pending" {
  const s = (status || "").toUpperCase();
  if (s === "PAID") return "paid";
  if (s === "EXPIRED" || s === "FAILED" || s === "REFUND") return "failed";
  return "pending";
}
