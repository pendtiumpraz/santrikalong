import { prisma } from "@/lib/db";

// Settle order LUNAS secara idempotent: tandai PAID, buat Enrollment, kredit
// bagi hasil ke wallet ustadz. Aman dipanggil berkali-kali (webhook bisa retry).
// Mengembalikan true bila ini transisi pertama ke PAID.
export async function fulfillOrder(orderId: string, opts?: { paidAt?: Date }): Promise<boolean> {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id: orderId } });
    if (!order || order.status === "PAID") return false;
    if (order.itemType !== "COURSE") return false;

    const course = await tx.course.findUnique({ where: { id: order.itemId } });
    if (!course) return false;

    await tx.order.update({ where: { id: orderId }, data: { status: "PAID", paidAt: opts?.paidAt ?? new Date() } });

    const existing = await tx.enrollment.findUnique({ where: { userId_courseId: { userId: order.userId, courseId: course.id } } });
    if (!existing) await tx.enrollment.create({ data: { userId: order.userId, courseId: course.id, source: course.isFree ? "FREE" : "PURCHASE", status: "ACTIVE" } });

    if (!course.isFree && course.priceIdr > 0) {
      const already = await tx.walletEntry.findFirst({ where: { refType: "ORDER", refId: orderId, type: "EARNING_CREDIT" } });
      if (!already) {
        const profile = await tx.ustadzProfile.findUnique({ where: { id: course.ustadzId } });
        if (profile) {
          const share = Math.round((course.priceIdr * profile.revenueSharePct) / 100);
          const wallet = await tx.wallet.upsert({ where: { ustadzUserId: profile.userId }, update: {}, create: { ustadzUserId: profile.userId } });
          await tx.walletEntry.create({ data: { walletId: wallet.id, type: "EARNING_CREDIT", amountIdr: share, refType: "ORDER", refId: orderId } });
        }
      }
    }
    await tx.auditLog.create({ data: { actorId: order.userId, action: "order.paid", targetType: "Order", targetId: orderId } });
    return true;
  });
}
