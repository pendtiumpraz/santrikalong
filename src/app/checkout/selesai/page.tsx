import { prisma } from "@/lib/db";
import { fulfillOrder } from "@/lib/fulfillment";
import { getTransactionStatus, classifyStatus, midtransConfig } from "@/lib/midtrans";
import { idr } from "@/lib/format";

export const dynamic = "force-dynamic";

// Halaman selesai (finish redirect Midtrans). Selain menampilkan status, ia juga
// menanyakan status ke Midtrans dan settle bila sudah lunas — fallback bila
// webhook belum sampai (mis. saat dev di localhost tanpa tunnel).
export default async function CheckoutSelesai({ searchParams }: { searchParams: Promise<{ order_id?: string }> }) {
  const orderId = (await searchParams).order_id ?? "";
  let outcome: "paid" | "pending" | "failed" | "unknown" = "unknown";
  let order = orderId ? await prisma.order.findUnique({ where: { id: orderId } }) : null;

  if (order) {
    if (order.status === "PAID") {
      outcome = "paid";
    } else if (order.gateway === "MIDTRANS" && midtransConfig().configured) {
      try {
        const s = await getTransactionStatus(orderId);
        const c = classifyStatus(s);
        if (c === "paid") {
          await fulfillOrder(orderId);
          outcome = "paid";
          order = await prisma.order.findUnique({ where: { id: orderId } });
        } else {
          outcome = c;
        }
      } catch {
        outcome = "pending";
      }
    } else {
      outcome = "pending";
    }
  }

  const M: Record<string, { ic: string; title: string; sub: string; color: string }> = {
    paid: { ic: "i-check", title: "Pembayaran berhasil", sub: "Kelas sudah masuk ke dashboardmu. Selamat belajar!", color: "var(--success)" },
    pending: { ic: "i-clock", title: "Menunggu pembayaran", sub: "Selesaikan pembayaran. Status akan otomatis terbarui setelah dikonfirmasi.", color: "var(--warning)" },
    failed: { ic: "i-x", title: "Pembayaran gagal / dibatalkan", sub: "Transaksi tidak selesai. Kamu bisa mencoba membeli lagi.", color: "var(--danger)" },
    unknown: { ic: "i-receipt", title: "Transaksi tidak ditemukan", sub: "Kami tidak menemukan pesanan ini.", color: "var(--text-muted)" },
  };
  const m = M[outcome];

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem" }}>
      <div className="card card-pad" style={{ maxWidth: 440, width: "100%", textAlign: "center" }}>
        <span style={{ width: 64, height: 64, borderRadius: "50%", display: "grid", placeItems: "center", margin: "0 auto 1rem", background: `rgb(${m.color}/.12)`, color: `rgb(${m.color})` }}>
          <svg className="ico" style={{ width: 30, height: 30 }}><use href={`#${m.ic}`} /></svg>
        </span>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", marginBottom: ".4rem" }}>{m.title}</h1>
        <p className="muted" style={{ fontSize: ".9rem", marginBottom: order ? "1.2rem" : "1.6rem" }}>{m.sub}</p>
        {order && (
          <div className="card card-pad" style={{ marginBottom: "1.2rem", textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".88rem" }}><span className="muted">No. pesanan</span><span style={{ fontFamily: "var(--font-display)" }}>{order.id.slice(0, 10)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".88rem", marginTop: ".4rem" }}><span className="muted">Jumlah</span><b>{idr(order.amountIdr)}</b></div>
          </div>
        )}
        <div style={{ display: "flex", gap: ".6rem", justifyContent: "center" }}>
          {outcome === "paid" ? (
            <>
              {order && <a href={`/bukti/invoice/${order.id}`} target="_blank" rel="noopener" className="btn btn-ghost"><svg className="ico ico-sm"><use href="#i-receipt" /></svg>Invoice</a>}
              <a href="/dashboard" className="btn btn-primary">Ke Dashboard</a>
            </>
          ) : (
            <>
              <a href="/katalog" className="btn btn-ghost">Katalog</a>
              <a href="/dashboard" className="btn btn-primary">Dashboard</a>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
