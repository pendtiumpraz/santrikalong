"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { fulfillOrder } from "@/lib/fulfillment";
import { createSnapTransaction, midtransConfig } from "@/lib/midtrans";
import { createTripayTransaction, tripayConfig } from "@/lib/tripay";
import { createXenditInvoice, xenditConfig } from "@/lib/xendit";
import type { GatewayProvider } from "@prisma/client";

const ONLINE: Record<string, { provider: GatewayProvider; configured: () => boolean }> = {
  midtrans: { provider: "MIDTRANS", configured: () => midtransConfig().configured },
  tripay: { provider: "TRIPAY", configured: () => tripayConfig().configured },
  xendit: { provider: "XENDIT", configured: () => xenditConfig().configured },
};

function appUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

// Beli/daftar kelas:
//  - Gratis  → langsung settle (Order PAID + Enrollment).
//  - Berbayar → Order PENDING + Snap Midtrans, redirect ke halaman bayar.
//               Settle final terjadi di webhook / halaman selesai (idempotent).
export async function enrollCourse(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/auth");
  const userId = (session.user as { id: string }).id;
  const courseId = String(formData.get("courseId") ?? "");
  const method = String(formData.get("method") ?? "midtrans"); // midtrans | manual

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course || course.status !== "PUBLISHED" || course.deletedAt) redirect("/katalog");

  const existing = await prisma.enrollment.findUnique({ where: { userId_courseId: { userId, courseId } } });
  if (existing) redirect("/dashboard");

  // ---- Gratis: langsung settle ----
  if (course.isFree || course.priceIdr <= 0) {
    const order = await prisma.order.create({
      data: { userId, itemType: "COURSE", itemId: courseId, amountIdr: 0, status: "PENDING", reference: "FREE-" + Date.now() },
    });
    await fulfillOrder(order.id);
    revalidatePath("/dashboard");
    redirect("/dashboard");
  }

  // ---- Transfer Manual: buat order menunggu verifikasi, arahkan ke unggah bukti ----
  if (method === "manual") {
    const mg = await prisma.paymentGateway.findUnique({ where: { provider: "MANUAL" } });
    if (!mg?.isActive) redirect("/kelas/" + course.slug + "?bayar=gateway");
    const order = await prisma.order.create({
      data: { userId, itemType: "COURSE", itemId: courseId, amountIdr: course.priceIdr, status: "WAITING_CONFIRMATION", gateway: "MANUAL", reference: "MNL-" + courseId.slice(0, 6) },
    });
    redirect("/checkout/manual/" + order.id);
  }

  // ---- Berbayar via gateway online (midtrans/tripay/xendit) ----
  const sel = ONLINE[method] ?? ONLINE.midtrans;
  const gw = await prisma.paymentGateway.findUnique({ where: { provider: sel.provider } });
  if (!gw?.isActive || !sel.configured()) redirect("/kelas/" + course.slug + "?bayar=gateway");

  const order = await prisma.order.create({
    data: { userId, itemType: "COURSE", itemId: courseId, amountIdr: course.priceIdr, status: "PENDING", gateway: sel.provider, reference: sel.provider.slice(0, 3) + "-" + courseId.slice(0, 6) },
  });
  const finishUrl = appUrl() + "/checkout/selesai?order_id=" + order.id;

  let redirectUrl: string;
  try {
    if (sel.provider === "MIDTRANS") {
      const r = await createSnapTransaction({
        orderId: order.id, grossAmount: course.priceIdr,
        customer: { name: session.user.name ?? undefined, email: session.user.email ?? undefined },
        items: [{ id: course.id, price: course.priceIdr, quantity: 1, name: course.title.slice(0, 50) }],
        finishUrl,
      });
      redirectUrl = r.redirectUrl;
    } else if (sel.provider === "XENDIT") {
      const r = await createXenditInvoice({
        orderId: order.id, amount: course.priceIdr, email: session.user.email ?? undefined,
        description: course.title.slice(0, 80), successUrl: finishUrl, failureUrl: finishUrl,
      });
      redirectUrl = r.redirectUrl;
    } else {
      const r = await createTripayTransaction({
        orderId: order.id, amount: course.priceIdr,
        customerName: session.user.name ?? undefined, customerEmail: session.user.email ?? undefined,
        itemName: course.title.slice(0, 50), returnUrl: finishUrl,
      });
      redirectUrl = r.redirectUrl;
    }
    await prisma.order.update({ where: { id: order.id }, data: { paymentUrl: redirectUrl } });
  } catch {
    await prisma.order.update({ where: { id: order.id }, data: { status: "FAILED" } });
    redirect("/kelas/" + course.slug + "?bayar=error");
  }

  redirect(redirectUrl);
}
