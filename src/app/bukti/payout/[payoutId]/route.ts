import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { idr } from "@/lib/format";
import { signDoc, shortCode } from "@/lib/docsign";
import { payoutPayload } from "@/lib/docpayload";
import { buildPayoutPdf } from "@/lib/pdf";

export const runtime = "nodejs";

const appUrl = () => (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
const fmtDate = (d: Date | null) => (d ? d.toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" }) : "-");
const STATUS: Record<string, string> = { REQUESTED: "Diajukan", PROCESSING: "Diproses", PAID: "DIBAYARKAN", REJECTED: "Ditolak" };

export async function GET(_req: Request, { params }: { params: Promise<{ payoutId: string }> }) {
  const { payoutId } = await params;
  const session = await auth();
  if (!session?.user) return new Response("Unauthorized", { status: 401 });
  const uid = (session.user as { id: string }).id;
  const roles = ((session.user as { roles?: string[] }).roles) ?? [];
  const isAdmin = roles.includes("admin") || roles.includes("superadmin");

  const po = await prisma.payoutRequest.findUnique({ where: { id: payoutId } });
  if (!po) return new Response("Tidak ditemukan", { status: 404 });
  if (po.ustadzUserId !== uid && !isAdmin) return new Response("Forbidden", { status: 403 });

  const ustadz = await prisma.user.findUnique({ where: { id: po.ustadzUserId } });
  const bank = (po.bankSnapshot as { bank?: string; accountMasked?: string; no?: string } | null) ?? {};

  const sig = signDoc(payoutPayload(po));
  const code = shortCode(sig);

  const bytes = await buildPayoutPdf({
    number: po.id.slice(0, 10).toUpperCase(),
    issuedAt: fmtDate(po.processedAt ?? po.requestedAt),
    partyName: ustadz?.name ?? "Ustadz",
    rows: [
      { label: "Kunci idempotensi (anti dobel-klaim)", value: po.idempotencyKey },
      { label: "Rekening tujuan", value: `${bank.bank ?? "-"} - ${bank.accountMasked ?? bank.no ?? "-"}` },
      { label: "Bruto", value: idr(po.amountIdr) },
      { label: "Potongan pajak (PPh final 0,5%)", value: idr(po.taxWithheldIdr) },
      { label: "Diajukan", value: fmtDate(po.requestedAt) },
      { label: "Diproses", value: fmtDate(po.processedAt) },
      { label: "Ref. pencairan", value: po.disbursementRef ?? "-" },
    ],
    amountLabel: "Diterima bersih (neto)",
    amountValue: idr(po.netIdr),
    statusText: STATUS[po.status] ?? po.status,
    statusOk: po.status === "PAID",
    note: "Bukti pencairan gaji ustadz. Setiap klaim memiliki kunci idempotensi unik sehingga tidak dapat diklaim ganda. Tanda tangan digital menjamin keaslian; verifikasi via tautan di atas.",
    sig,
    code,
    verifyUrl: `${appUrl()}/verifikasi?d=payout&id=${po.id}&sig=${sig}`,
  });

  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="payout-${po.id.slice(0, 10)}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
