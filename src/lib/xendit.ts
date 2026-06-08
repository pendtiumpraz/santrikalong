// Xendit Invoice API: buat invoice bertuan rumah (hosted) → redirect; user pilih
// metode (VA/ewallet/QRIS) di halaman Xendit. Webhook dikonfirmasi via callback token.
export function xenditConfig() {
  const secretKey = process.env.XENDIT_SECRET_KEY ?? "";
  const callbackToken = process.env.XENDIT_CALLBACK_TOKEN ?? "";
  return { secretKey, callbackToken, configured: secretKey.length > 0 };
}

export async function createXenditInvoice(p: {
  orderId: string;
  amount: number;
  email?: string;
  description: string;
  successUrl: string;
  failureUrl: string;
}): Promise<{ redirectUrl: string }> {
  const { secretKey, configured } = xenditConfig();
  if (!configured) throw new Error("XENDIT_SECRET_KEY belum di-set");

  const res = await fetch("https://api.xendit.co/v2/invoices", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Basic " + Buffer.from(secretKey + ":").toString("base64") },
    body: JSON.stringify({
      external_id: p.orderId,
      amount: p.amount,
      payer_email: p.email,
      description: p.description,
      success_redirect_url: p.successUrl,
      failure_redirect_url: p.failureUrl,
      currency: "IDR",
    }),
  });
  if (!res.ok) throw new Error("Xendit invoice gagal (" + res.status + "): " + (await res.text()));
  const data = (await res.json()) as { invoice_url: string };
  return { redirectUrl: data.invoice_url };
}

// Klasifikasi status invoice Xendit.
export function classifyXendit(status: string): "paid" | "failed" | "pending" {
  const s = (status || "").toUpperCase();
  if (s === "PAID" || s === "SETTLED") return "paid";
  if (s === "EXPIRED") return "failed";
  return "pending";
}
