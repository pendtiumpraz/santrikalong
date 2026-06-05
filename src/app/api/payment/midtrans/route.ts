import { prisma } from "@/lib/db";
import { fulfillOrder } from "@/lib/fulfillment";
import { verifyNotificationSignature, classifyStatus } from "@/lib/midtrans";

export const runtime = "nodejs";

// Webhook notifikasi Midtrans. Verifikasi signature lalu settle order (idempotent).
// Set URL ini di dashboard Midtrans: <APP_URL>/api/payment/midtrans
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response("bad request", { status: 400 });
  }

  const order_id = String(body.order_id ?? "");
  const status_code = String(body.status_code ?? "");
  const gross_amount = String(body.gross_amount ?? "");
  const signature_key = String(body.signature_key ?? "");

  if (!verifyNotificationSignature({ order_id, status_code, gross_amount, signature_key })) {
    return new Response("invalid signature", { status: 403 });
  }

  const order = await prisma.order.findUnique({ where: { id: order_id } });
  if (!order) return new Response("ok", { status: 200 }); // ack agar Midtrans berhenti retry

  // catat log (idempotent via unique provider+eventId)
  const eventId = String(body.transaction_id ?? `${order_id}-${status_code}`);
  try {
    await prisma.paymentLog.create({ data: { orderId: order.id, provider: "MIDTRANS", eventId, payload: body as object } });
  } catch {
    /* duplikat notifikasi — abaikan, fulfill tetap idempotent */
  }

  const outcome = classifyStatus(body as { transaction_status?: string; fraud_status?: string });
  if (outcome === "paid") {
    await fulfillOrder(order.id);
  } else if (outcome === "failed" && order.status !== "PAID") {
    const expired = body.transaction_status === "expire";
    await prisma.order.update({ where: { id: order.id }, data: { status: expired ? "EXPIRED" : "FAILED" } });
  }

  return new Response("ok", { status: 200 });
}
