"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const MIN_PAYOUT = 50_000;
const TAX_PCT = 0.5; // PPh UMKM final 0,5% (configurable nanti)

// Ajukan klaim payout. Anti-fraud:
//  - saldo dihitung dari ledger (sum WalletEntry), bukan kolom mutable
//  - tolak bila ada klaim REQUESTED/PROCESSING yang masih berjalan
//  - langsung tahan dana (PAYOUT_HOLD negatif) sehingga tidak bisa diklaim dobel
export async function requestPayout() {
  const session = await auth();
  if (!session?.user) redirect("/auth");
  const userId = (session.user as { id: string }).id;

  await prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.findUnique({ where: { ustadzUserId: userId }, include: { entries: true } });
    if (!wallet) redirect("/studio?payout=nowallet");

    const balance = wallet.entries.reduce((n, e) => n + e.amountIdr, 0);
    if (balance < MIN_PAYOUT) redirect("/studio?payout=min");

    const active = await tx.payoutRequest.findFirst({ where: { ustadzUserId: userId, status: { in: ["REQUESTED", "PROCESSING"] } } });
    if (active) redirect("/studio?payout=aktif");

    const amount = balance;
    const tax = Math.round((amount * TAX_PCT) / 100);
    const net = amount - tax;

    await tx.payoutRequest.create({
      data: {
        ustadzUserId: userId, amountIdr: amount, taxWithheldIdr: tax, netIdr: net,
        idempotencyKey: userId + "-" + Date.now(), status: "REQUESTED",
        bankSnapshot: { bank: "BSI", accountMasked: "700****567" },
      },
    });
    await tx.walletEntry.create({ data: { walletId: wallet.id, type: "PAYOUT_HOLD", amountIdr: -amount, refType: "PAYOUT" } });
    await tx.auditLog.create({ data: { actorId: userId, action: "payout.request", targetType: "PayoutRequest", targetId: userId, meta: { amount } } });
  });

  revalidatePath("/studio");
  redirect("/studio?payout=ok");
}
