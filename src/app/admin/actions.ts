"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  const roles = ((session?.user as { roles?: string[] })?.roles) ?? [];
  if (!session?.user || (!roles.includes("admin") && !roles.includes("superadmin"))) redirect("/auth");
  return session.user as { id: string };
}

export async function approveUstadz(formData: FormData) {
  const admin = await requireAdmin();
  const profileId = String(formData.get("profileId") ?? "");
  await prisma.$transaction(async (tx) => {
    const p = await tx.ustadzProfile.update({ where: { id: profileId }, data: { status: "APPROVED", reviewedById: admin.id, reviewedAt: new Date() } });
    const role = await tx.role.findUnique({ where: { name: "ustadz" } });
    if (role) await tx.userRole.upsert({ where: { userId_roleId: { userId: p.userId, roleId: role.id } }, update: {}, create: { userId: p.userId, roleId: role.id } });
    await tx.auditLog.create({ data: { actorId: admin.id, action: "user.approve", targetType: "UstadzProfile", targetId: profileId } });
  });
  revalidatePath("/admin");
}

export async function rejectUstadz(formData: FormData) {
  const admin = await requireAdmin();
  const profileId = String(formData.get("profileId") ?? "");
  await prisma.ustadzProfile.update({ where: { id: profileId }, data: { status: "REJECTED", reviewedById: admin.id, reviewedAt: new Date(), rejectionReason: "Tidak memenuhi syarat" } });
  await prisma.auditLog.create({ data: { actorId: admin.id, action: "user.reject", targetType: "UstadzProfile", targetId: profileId } });
  revalidatePath("/admin");
}

export async function toggleGateway(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const to = String(formData.get("to") ?? "") === "1";
  const gw = await prisma.paymentGateway.update({ where: { id }, data: { isActive: to } });
  await prisma.auditLog.create({ data: { actorId: admin.id, action: "payment.gateway.toggle", targetType: "PaymentGateway", targetId: gw.provider, meta: { to: to ? "on" : "off" } } });
  revalidatePath("/admin");
}

export async function approvePayout(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await prisma.$transaction(async (tx) => {
    const po = await tx.payoutRequest.update({ where: { id }, data: { status: "PAID", processedAt: new Date(), disbursementRef: "DISB-" + Date.now() } });
    await tx.auditLog.create({ data: { actorId: admin.id, action: "payout.approve", targetType: "PayoutRequest", targetId: po.id } });
  });
  revalidatePath("/admin");
}

export async function rejectPayout(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await prisma.$transaction(async (tx) => {
    const po = await tx.payoutRequest.update({ where: { id }, data: { status: "REJECTED", processedAt: new Date(), rejectionReason: "Ditolak admin" } });
    // kembalikan dana yang ditahan (HOLD) ke saldo ustadz
    const wallet = await tx.wallet.findUnique({ where: { ustadzUserId: po.ustadzUserId } });
    if (wallet) await tx.walletEntry.create({ data: { walletId: wallet.id, type: "HOLD_RELEASE", amountIdr: po.amountIdr, refType: "PAYOUT", refId: po.id } });
    await tx.auditLog.create({ data: { actorId: admin.id, action: "payout.reject", targetType: "PayoutRequest", targetId: po.id } });
  });
  revalidatePath("/admin");
}
