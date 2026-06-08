"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { putObject } from "@/lib/storage";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "application/pdf": "pdf" };

// Unggah bukti transfer manual. Disimpan ke blob PRIVAT; order tetap
// WAITING_CONFIRMATION sampai admin memverifikasi.
export async function uploadManualProof(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/auth");
  const userId = (session.user as { id: string }).id;
  const orderId = String(formData.get("orderId") ?? "");

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== userId) redirect("/dashboard");
  if (order.status === "PAID") redirect("/dashboard");

  const file = formData.get("bukti");
  if (!(file instanceof File) || file.size === 0) redirect("/checkout/manual/" + orderId + "?err=file");
  if (file.size > MAX_BYTES) redirect("/checkout/manual/" + orderId + "?err=besar");
  const ext = ALLOWED[file.type];
  if (!ext) redirect("/checkout/manual/" + orderId + "?err=tipe");

  const buf = Buffer.from(await file.arrayBuffer());
  const key = `manual-proof/${orderId}.${ext}`;
  await putObject(key, buf, file.type);

  await prisma.order.update({ where: { id: orderId }, data: { manualProofKey: key, status: "WAITING_CONFIRMATION" } });
  await prisma.auditLog.create({ data: { actorId: userId, action: "order.manual.proof", targetType: "Order", targetId: orderId } });

  revalidatePath("/checkout/manual/" + orderId);
  redirect("/checkout/manual/" + orderId + "?ok=1");
}
