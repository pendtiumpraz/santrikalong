import { prisma } from "@/lib/db";
import { idr } from "@/lib/format";
import { verifyDoc, shortCode } from "@/lib/docsign";
import { invoicePayload, payoutPayload } from "@/lib/docpayload";

export const dynamic = "force-dynamic";

const fmt = (d: Date | null) => (d ? d.toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" }) : "-");

// Verifikasi keaslian dokumen (publik). Tanda tangan dihitung ULANG dari data
// database, lalu dibandingkan dengan sig pada tautan/PDF. Bila isi PDF diubah,
// sig tak akan cocok → INVALID. Angka yang ditampilkan = sumber kebenaran (DB).
export default async function Verifikasi({ searchParams }: { searchParams: Promise<{ d?: string; id?: string; sig?: string }> }) {
  const { d, id, sig } = await searchParams;
  let valid = false;
  let rows: { label: string; value: string }[] = [];
  let title = "";
  let code = "";

  if ((d === "invoice" || d === "payout") && id && sig) {
    code = shortCode(sig);
    if (d === "invoice") {
      const order = await prisma.order.findUnique({ where: { id }, include: { user: true } });
      if (order) {
        valid = verifyDoc(invoicePayload(order), sig);
        const course = order.itemType === "COURSE" ? await prisma.course.findUnique({ where: { id: order.itemId } }) : null;
        title = "Invoice " + (order.reference ?? order.id.slice(0, 10).toUpperCase());
        rows = [
          { label: "Pembeli", value: order.user.name },
          { label: "Item", value: course?.title ?? order.itemType },
          { label: "Jumlah", value: idr(order.amountIdr) },
          { label: "Status", value: order.status },
          { label: "Dibayar", value: fmt(order.paidAt) },
        ];
      }
    } else {
      const po = await prisma.payoutRequest.findUnique({ where: { id } });
      if (po) {
        valid = verifyDoc(payoutPayload(po), sig);
        const ustadz = await prisma.user.findUnique({ where: { id: po.ustadzUserId } });
        title = "Bukti Payout " + po.id.slice(0, 10).toUpperCase();
        rows = [
          { label: "Penerima", value: ustadz?.name ?? "-" },
          { label: "Bruto", value: idr(po.amountIdr) },
          { label: "Pajak", value: idr(po.taxWithheldIdr) },
          { label: "Neto diterima", value: idr(po.netIdr) },
          { label: "Status", value: po.status },
          { label: "Diproses", value: fmt(po.processedAt) },
        ];
      }
    }
  }

  const found = rows.length > 0;

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem" }}>
      <div className="card card-pad" style={{ maxWidth: 480, width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: ".7rem", marginBottom: "1rem" }}>
          <svg className="mark" style={{ width: 30, height: 30, color: "rgb(var(--brand))" }} viewBox="0 0 40 40" fill="none"><path d="M28 6a13 13 0 1 0 6 14 10 10 0 1 1-6-14Z" fill="currentColor" /></svg>
          <b style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem" }}>Verifikasi Dokumen</b>
        </div>

        {!found ? (
          <p className="muted" style={{ fontSize: ".9rem" }}>Dokumen tidak ditemukan atau tautan tidak lengkap.</p>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: ".6rem", padding: ".8rem 1rem", borderRadius: "var(--r-md)", marginBottom: "1rem", background: valid ? "rgb(var(--success)/.1)" : "rgb(var(--danger)/.1)", color: valid ? "rgb(var(--success))" : "rgb(var(--danger))" }}>
              <svg className="ico"><use href={valid ? "#i-check" : "#i-x"} /></svg>
              <div>
                <p style={{ fontWeight: 700 }}>{valid ? "ASLI & TERVERIFIKASI" : "TIDAK VALID"}</p>
                <p style={{ fontSize: ".78rem", opacity: 0.85 }}>{valid ? "Tanda tangan cocok dengan data resmi." : "Tanda tangan tidak cocok — dokumen mungkin diubah atau palsu."}</p>
              </div>
            </div>
            <p style={{ fontWeight: 600, marginBottom: ".6rem" }}>{title}</p>
            {rows.map((r) => (
              <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: ".5rem 0", borderBottom: "1px solid rgb(var(--border))", fontSize: ".9rem" }}>
                <span className="muted">{r.label}</span><b>{r.value}</b>
              </div>
            ))}
            <p className="help" style={{ marginTop: "1rem" }}>Kode verifikasi: <b>{code}</b>. Angka di atas diambil langsung dari basis data resmi SantriKalong.</p>
          </>
        )}
      </div>
    </main>
  );
}
