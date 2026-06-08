import { prisma } from "@/lib/db";
import { fulfillOrder } from "@/lib/fulfillment";
import { xenditConfig, classifyXendit } from "@/lib/xendit";

export const runtime = "nodejs";

// Webhook Xendit. Verifikasi via header x-callback-token.
// Set URL: <APP_URL>/api/payment/xendit di dashboard Xendit.
export async function POST(req: Request) {
  const token = req.headers.get("x-callback-token") ?? "";
  const { callbackToken } = xenditConfig();
  if (!callbackToken || token !== callbackToken) return new Response("invalid token", { status: 403 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response("bad request", { status: 400 });
  }

  const orderId = String(body.external_id ?? "");
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return new Response("ok", { status: 200 });

  const eventId = String(body.id ?? `${orderId}-${body.status}`);
  try {
    await prisma.paymentLog.create({ data: { orderId: order.id, provider: "XENDIT", eventId, payload: body as object } });
  } catch {
    /* duplikat */
  }

  const outcome = classifyXendit(String(body.status ?? ""));
  if (outcome === "paid") await fulfillOrder(order.id);
  else if (outcome === "failed" && order.status !== "PAID") await prisma.order.update({ where: { id: order.id }, data: { status: "EXPIRED" } });

  return new Response("ok", { status: 200 });
}
