import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { idr } from "@/lib/format";
import { signDoc, shortCode } from "@/lib/docsign";
import { invoicePayload } from "@/lib/docpayload";
import { buildInvoicePdf } from "@/lib/pdf";

export const runtime = "nodejs";

const appUrl = () => (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
const fmtDate = (d: Date | null) => (d ? d.toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" }) : "-");
const STATUS: Record<string, string> = { PAID: "LUNAS", PENDING: "Menunggu pembayaran", WAITING_CONFIRMATION: "Menunggu verifikasi", EXPIRED: "Kedaluwarsa", FAILED: "Gagal", REFUNDED: "Dikembalikan" };

export async function GET(_req: Request, { params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const session = await auth();
  if (!session?.user) return new Response("Unauthorized", { status: 401 });
  const uid = (session.user as { id: string }).id;
  const roles = ((session.user as { roles?: string[] }).roles) ?? [];
  const isAdmin = roles.includes("admin") || roles.includes("superadmin");

  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { user: true } });
  if (!order) return new Response("Tidak ditemukan", { status: 404 });
  if (order.userId !== uid && !isAdmin) return new Response("Forbidden", { status: 403 });

  const course = order.itemType === "COURSE" ? await prisma.course.findUnique({ where: { id: order.itemId } }) : null;

  const sig = signDoc(invoicePayload(order));
  const code = shortCode(sig);

  const bytes = await buildInvoicePdf({
    number: order.reference ?? order.id.slice(0, 10).toUpperCase(),
    issuedAt: fmtDate(order.paidAt ?? order.createdAt),
    partyName: order.user.name,
    rows: [
      { label: "Item", value: course?.title ?? order.itemType },
      { label: "Metode pembayaran", value: order.gateway ?? "-" },
      { label: "Referensi", value: order.reference ?? order.id.slice(0, 12) },
      { label: "Email", value: order.user.email },
    ],
    amountLabel: "Total dibayar",
    amountValue: idr(order.amountIdr),
    statusText: STATUS[order.status] ?? order.status,
    statusOk: order.status === "PAID",
    note: "Dokumen diterbitkan otomatis oleh SantriKalong. Keasliannya dijamin tanda tangan digital di atas; perubahan apa pun membatalkan verifikasi.",
    sig,
    code,
    verifyUrl: `${appUrl()}/verifikasi?d=invoice&id=${order.id}&sig=${sig}`,
  });

  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="invoice-${(order.reference ?? order.id).replace(/[^a-zA-Z0-9-]/g, "")}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
