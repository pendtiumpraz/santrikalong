"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Beli/daftar kelas: buat Order (PAID) + Enrollment + bagi hasil ke wallet ustadz.
// (Integrasi gateway nyata menyusul; untuk sekarang dianggap sukses.)
export async function enrollCourse(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/auth");
  const userId = (session.user as { id: string }).id;
  const courseId = String(formData.get("courseId") ?? "");

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course || course.status !== "PUBLISHED" || course.deletedAt) redirect("/katalog");

  const existing = await prisma.enrollment.findUnique({ where: { userId_courseId: { userId, courseId } } });
  if (existing) redirect("/dashboard");

  await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId, itemType: "COURSE", itemId: courseId, amountIdr: course.priceIdr,
        status: "PAID", gateway: course.isFree ? null : "MIDTRANS",
        reference: "INV-" + Date.now(), paidAt: new Date(),
      },
    });
    await tx.enrollment.create({ data: { userId, courseId, source: course.isFree ? "FREE" : "PURCHASE", status: "ACTIVE" } });

    if (!course.isFree && course.priceIdr > 0) {
      const profile = await tx.ustadzProfile.findUnique({ where: { id: course.ustadzId } });
      if (profile) {
        const share = Math.round((course.priceIdr * profile.revenueSharePct) / 100);
        const wallet = await tx.wallet.upsert({ where: { ustadzUserId: profile.userId }, update: {}, create: { ustadzUserId: profile.userId } });
        await tx.walletEntry.create({ data: { walletId: wallet.id, type: "EARNING_CREDIT", amountIdr: share, refType: "ORDER", refId: order.id } });
      }
    }
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
