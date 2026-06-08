import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { idr } from "@/lib/format";
import { uploadManualProof } from "../actions";

export const dynamic = "force-dynamic";

// Rekening tujuan transfer manual (konfigurasi lewat superadmin menyusul).
const BANK = { bank: "Bank Syariah Indonesia (BSI)", no: "7001234567", an: "Yayasan SantriKalong" };

const ERR: Record<string, string> = {
  file: "Pilih berkas bukti transfer dulu.",
  besar: "Ukuran berkas maksimal 5 MB.",
  tipe: "Format harus JPG, PNG, WEBP, atau PDF.",
};

export default async function ManualCheckout({ params, searchParams }: { params: Promise<{ orderId: string }>; searchParams: Promise<{ ok?: string; err?: string }> }) {
  const { orderId } = await params;
  const { ok, err } = await searchParams;
  const session = await auth();
  if (!session?.user) redirect("/auth");
  const userId = (session.user as { id: string }).id;

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== userId) redirect("/dashboard");
  const course = order.itemType === "COURSE" ? await prisma.course.findUnique({ where: { id: order.itemId } }) : null;

  const uploaded = !!order.manualProofKey;
  const paid = order.status === "PAID";
  const errMsg = err ? ERR[err] : null;

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem" }}>
      <div className="card card-pad" style={{ maxWidth: 480, width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: ".7rem", marginBottom: "1rem" }}>
          <svg className="mark" style={{ width: 28, height: 28, color: "rgb(var(--brand))" }} viewBox="0 0 40 40" fill="none"><path d="M28 6a13 13 0 1 0 6 14 10 10 0 1 1-6-14Z" fill="currentColor" /></svg>
          <b style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem" }}>Transfer Manual</b>
        </div>

        <p className="muted" style={{ fontSize: ".9rem", marginBottom: "1rem" }}>{course?.title}</p>

        <div className="card card-pad" style={{ marginBottom: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".5rem" }}><span className="muted">Nominal transfer</span><b style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem" }}>{idr(order.amountIdr)}</b></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".9rem" }}><span className="muted">Bank</span><span>{BANK.bank}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".9rem" }}><span className="muted">No. rekening</span><b>{BANK.no}</b></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".9rem" }}><span className="muted">Atas nama</span><span>{BANK.an}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".9rem", marginTop: ".4rem", paddingTop: ".4rem", borderTop: "1px solid rgb(var(--border))" }}><span className="muted">Kode pesanan</span><span style={{ fontFamily: "var(--font-display)" }}>{order.reference ?? order.id.slice(0, 10)}</span></div>
        </div>

        {paid ? (
          <div className="card card-pad" style={{ background: "rgb(var(--success)/.1)", borderColor: "rgb(var(--success)/.3)" }}>
            <p style={{ fontWeight: 600, color: "rgb(var(--success))", display: "flex", gap: ".5rem", alignItems: "center" }}><svg className="ico ico-sm"><use href="#i-check" /></svg>Pembayaran terverifikasi</p>
            <a href="/dashboard" className="btn btn-primary btn-block" style={{ marginTop: ".8rem" }}>Ke Dashboard</a>
          </div>
        ) : uploaded && !ok ? (
          <div className="card card-pad" style={{ background: "rgb(var(--warning)/.1)", borderColor: "rgb(var(--warning)/.3)" }}>
            <p style={{ fontWeight: 600, color: "rgb(var(--warning))", display: "flex", gap: ".5rem", alignItems: "center" }}><svg className="ico ico-sm"><use href="#i-clock" /></svg>Bukti diterima — menunggu verifikasi admin</p>
            <p className="muted" style={{ fontSize: ".84rem", marginTop: ".4rem" }}>Kelas akan otomatis terbuka setelah admin memverifikasi. Kamu bisa unggah ulang bila perlu.</p>
          </div>
        ) : null}

        {!paid && (
          <form action={uploadManualProof} style={{ marginTop: uploaded || paid ? "1rem" : 0 }}>
            <input type="hidden" name="orderId" value={order.id} />
            {ok && <p style={{ color: "rgb(var(--success))", fontSize: ".85rem", marginBottom: ".6rem" }}>Bukti berhasil diunggah.</p>}
            {errMsg && <p style={{ color: "rgb(var(--danger))", fontSize: ".85rem", marginBottom: ".6rem" }}>{errMsg}</p>}
            <label className="label">{uploaded ? "Unggah ulang bukti transfer" : "Unggah bukti transfer"}</label>
            <input className="input" type="file" name="bukti" accept="image/jpeg,image/png,image/webp,application/pdf" required style={{ padding: ".5rem" }} />
            <p className="help" style={{ marginTop: ".4rem" }}>JPG/PNG/WEBP/PDF, maksimal 5 MB.</p>
            <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: "1rem" }}>Kirim Bukti</button>
          </form>
        )}
      </div>
    </main>
  );
}
