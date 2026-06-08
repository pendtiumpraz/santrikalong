import { prisma } from "@/lib/db";
import { fulfillOrder } from "@/lib/fulfillment";
import { verifyTripayCallback, classifyTripay } from "@/lib/tripay";

export const runtime = "nodejs";

// Webhook Tripay. Verifikasi via header X-Callback-Signature (HMAC raw body).
// Set URL callback: <APP_URL>/api/payment/tripay di dashboard Tripay.
export async function POST(req: Request) {
  const raw = await req.text();
  const sig = req.headers.get("x-callback-signature") ?? "";
  if (!verifyTripayCallback(raw, sig)) return new Response("invalid signature", { status: 403 });

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return new Response("bad request", { status: 400 });
  }

  const orderId = String(body.merchant_ref ?? "");
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return new Response("ok", { status: 200 });

  const eventId = String(body.reference ?? `${orderId}-${body.status}`);
  try {
    await prisma.paymentLog.create({ data: { orderId: order.id, provider: "TRIPAY", eventId, payload: body as object } });
  } catch {
    /* duplikat */
  }

  const outcome = classifyTripay(String(body.status ?? ""));
  if (outcome === "paid") await fulfillOrder(order.id);
  else if (outcome === "failed" && order.status !== "PAID") await prisma.order.update({ where: { id: order.id }, data: { status: "FAILED" } });

  return new Response("ok", { status: 200 });
}
