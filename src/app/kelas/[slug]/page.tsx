import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { idr, img } from "@/lib/format";
import { enrollCourse } from "../actions";

export const dynamic = "force-dynamic";

function Mark() {
  return (
    <svg className="mark" viewBox="0 0 40 40" fill="none">
      <path d="M28 6a13 13 0 1 0 6 14 10 10 0 1 1-6-14Z" fill="currentColor" />
      <circle cx="30" cy="11" r="1.6" fill="currentColor" />
    </svg>
  );
}

const LEVEL: Record<string, string> = { PEMULA: "Pemula", MENENGAH: "Menengah", LANJUTAN: "Lanjutan" };
const LESSON_ICON: Record<string, string> = { VIDEO: "i-play", PDF: "i-doc", AUDIO: "i-headphones", HTML_PPT: "i-layers", TEXT: "i-edit" };

const BAYAR_MSG: Record<string, string> = {
  gateway: "Metode pembayaran itu sedang tidak aktif. Pilih metode lain atau coba lagi nanti.",
  error: "Gagal membuat transaksi pembayaran. Silakan coba lagi.",
};

const GW_META: Record<string, { value: string; label: string; desc: string; tag: string; cls: string; icon?: string }> = {
  MIDTRANS: { value: "midtrans", label: "Virtual Account / QRIS / E-wallet", desc: "via Midtrans (otomatis)", tag: "VA", cls: "tag-info" },
  XENDIT: { value: "xendit", label: "VA / E-wallet / QRIS", desc: "via Xendit (otomatis)", tag: "XD", cls: "tag-info" },
  TRIPAY: { value: "tripay", label: "QRIS / VA / Retail", desc: "via Tripay (otomatis)", tag: "TP", cls: "tag-info" },
  MANUAL: { value: "manual", label: "Transfer Manual", desc: "Unggah bukti, verifikasi admin", tag: "", cls: "tag-success", icon: "i-wallet" },
};

export default async function KelasDetail({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ bayar?: string }> }) {
  const { slug } = await params;
  const bayarMsg = BAYAR_MSG[(await searchParams).bayar ?? ""];
  const c = await prisma.course.findFirst({
    where: { slug, deletedAt: null },
    include: {
      category: true,
      ustadz: { include: { user: true } },
      modules: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } },
    },
  });
  if (!c) notFound();

  const totalLessons = c.modules.reduce((n, m) => n + m.lessons.length, 0);
  const activeGateways = (await prisma.paymentGateway.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } })).filter((g) => GW_META[g.provider]);

  return (
    <>
      <header className="nav solid">
        <div className="container nav-in">
          <a href="/" className="brand"><Mark />SantriKalong</a>
          <nav className="nav-links"><a href="/katalog">Katalog</a><a href="/dauroh">Dauroh</a><a href="/live">Live Kelas</a><a href="/studio">Jadi Pengajar</a></nav>
          <div className="nav-right">
            <button className="icon-btn" id="sk-mode-toggle" aria-label="Ganti mode"><svg className="ico" id="sk-mode-ic"><use href="#i-sun" /></svg></button>
            <button className="icon-btn cart-btn" data-open="#cart" aria-label="Keranjang"><svg className="ico"><use href="#i-cart" /></svg><span className="cart-badge">2</span></button>
            <a href="/dashboard" className="btn btn-ghost btn-sm hide-sm">Dashboard</a>
          </div>
        </div>
      </header>

      <div className="breadcrumb container"><a href="/katalog">Katalog</a> / <span>{c.category?.name}</span> / <span style={{ color: "rgb(var(--text))" }}>{c.title}</span></div>

      <main className="sec container">
        <div className="detail">
          <div>
            <div style={{ display: "flex", gap: ".5rem", marginBottom: ".8rem" }}><span className="tag">{c.category?.name}</span><span className="tag tag-muted">{c.type === "LIVE" ? "Live" : "Rekaman"} · {LEVEL[c.level] ?? c.level}</span></div>
            <h1 style={{ fontSize: "clamp(1.7rem,3.5vw,2.4rem)" }}>{c.title}</h1>
            <p className="muted" style={{ marginTop: ".8rem", maxWidth: 640 }}>{c.description}</p>
            <div className="cmeta" style={{ marginTop: "1rem", fontSize: ".85rem" }}><span><svg className="ico ico-sm"><use href="#i-book" /></svg>{totalLessons} materi</span><span><svg className="ico ico-sm"><use href="#i-layers" /></svg>{LEVEL[c.level] ?? c.level}</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: ".7rem", marginTop: "1.1rem" }}><span className="avatar"><svg className="ico"><use href="#i-user" /></svg></span><div><p style={{ fontWeight: 600 }}>{c.ustadz?.user?.name}</p><p className="muted" style={{ fontSize: ".82rem" }}>{c.ustadz?.specialization}</p></div></div>

            <div className="card card-pad" style={{ marginTop: "1.8rem", position: "relative", overflow: "hidden", background: "#000", aspectRatio: "16/9", display: "grid", placeItems: "center", padding: 0 }}>
              <img src={img(c.thumbnailKey, 900)} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: .55 }} />
              <button className="icon-btn" style={{ position: "relative", width: 64, height: 64, borderRadius: 999, background: "rgb(var(--brand))", color: "rgb(var(--brand-fg))", border: "none" }}><svg className="ico ico-lg"><use href="#i-play" /></svg></button>
            </div>

            <h2 style={{ marginTop: "2.2rem", fontSize: "1.4rem" }}>Silabus Kelas</h2>
            <div style={{ marginTop: "1rem" }}>
              {c.modules.length === 0 && <p className="muted">Silabus akan segera ditambahkan.</p>}
              {c.modules.map((m, mi) => (
                <details className="acc" key={m.id} open={mi === 0}>
                  <summary><span>{m.title}</span><span className="muted" style={{ fontSize: ".8rem", fontWeight: 400 }}>{m.lessons.length} materi</span></summary>
                  <ul>
                    {m.lessons.length === 0 && <li><svg className="ico ico-sm"><use href="#i-lock" /></svg>Terkunci — daftar untuk akses</li>}
                    {m.lessons.map((l) => (
                      <li key={l.id}>
                        <svg className="ico ico-sm"><use href={`#${LESSON_ICON[l.contentType] ?? "i-doc"}`} /></svg>{l.title}
                        {l.isPreview && <span className="tag tag-free" style={{ marginLeft: "auto" }}>Preview</span>}
                        {!l.isPreview && l.durationSec ? <span className="muted" style={{ marginLeft: "auto", fontSize: ".78rem" }}>{Math.floor(l.durationSec / 60)}:{String(l.durationSec % 60).padStart(2, "0")}</span> : null}
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>

            <h2 style={{ marginTop: "2.2rem", fontSize: "1.4rem" }}>Tentang Pengajar</h2>
            <div className="card card-pad" style={{ marginTop: "1rem", display: "flex", gap: "1.1rem", flexWrap: "wrap" }}>
              <span className="avatar" style={{ width: 72, height: 72 }}><svg className="ico ico-lg"><use href="#i-user" /></svg></span>
              <div style={{ flex: 1, minWidth: 220 }}>
                <p style={{ fontWeight: 600, fontSize: "1.05rem" }}>{c.ustadz?.user?.name}</p>
                <p className="muted" style={{ fontSize: ".84rem" }}>{c.ustadz?.specialization}</p>
                <p className="muted" style={{ fontSize: ".9rem", marginTop: ".7rem" }}>{c.ustadz?.bio}</p>
              </div>
            </div>
          </div>

          <aside>
            <div className="buybox">
              <div className="top"><img src={img(c.thumbnailKey, 700)} alt="" /></div>
              <div className="pad">
                <div style={{ display: "flex", alignItems: "baseline", gap: ".5rem" }}><span className={c.isFree ? "price free" : "price"} style={{ fontSize: "1.8rem" }}>{idr(c.priceIdr)}</span></div>
                {bayarMsg && <p style={{ marginTop: ".8rem", padding: ".6rem .8rem", borderRadius: "var(--r-md)", background: "rgb(var(--danger)/.1)", color: "rgb(var(--danger))", fontSize: ".82rem" }}>{bayarMsg}</p>}
                <button className="btn btn-primary btn-block btn-lg" data-open="#checkout" style={{ marginTop: "1rem" }}>{c.isFree ? "Daftar & Mulai" : "Beli & Mulai Belajar"}</button>
                <button className="btn btn-ghost btn-block" data-open="#cart" style={{ marginTop: ".6rem" }}><svg className="ico ico-sm"><use href="#i-cart" /></svg>Tambah ke Keranjang</button>
                <ul className="learn" style={{ gridTemplateColumns: "1fr", marginTop: "1.2rem", gap: ".5rem" }}>
                  <li><svg className="ico ico-sm"><use href="#i-check" /></svg>Akses selamanya</li>
                  <li><svg className="ico ico-sm"><use href="#i-check" /></svg>{totalLessons} materi</li>
                  <li><svg className="ico ico-sm"><use href="#i-check" /></svg>Kuis &amp; sertifikat</li>
                  <li><svg className="ico ico-sm"><use href="#i-check" /></svg>Akses via HP &amp; laptop</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <div className="drawer" id="cart">
        <div className="drawer-head"><h3 style={{ fontFamily: "var(--font-display)" }}>Keranjang</h3><button className="icon-btn" data-close aria-label="Tutup"><svg className="ico"><use href="#i-x" /></svg></button></div>
        <div className="drawer-body">
          <div className="cart-item"><img src={img(c.thumbnailKey, 200)} alt="" /><div style={{ flex: 1 }}><p style={{ fontWeight: 600, fontSize: ".9rem" }}>{c.title}</p><p className="muted" style={{ fontSize: ".8rem" }}>{c.ustadz?.user?.name}</p><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: ".3rem" }}><span className="price" style={{ fontSize: "1rem" }}>{idr(c.priceIdr)}</span></div></div></div>
        </div>
        <div className="drawer-foot">
          <div className="sumrow"><span className="muted">Subtotal</span><b>{idr(c.priceIdr)}</b></div>
          <a href="/checkout" className="btn btn-primary btn-block">Lanjut ke Pembayaran</a>
        </div>
      </div>

      <div className="overlay" id="checkout">
        <div className="modal">
          <div className="modal-head"><h3>Pembayaran</h3><button className="icon-btn" data-close aria-label="Tutup"><svg className="ico"><use href="#i-x" /></svg></button></div>
          <div className="modal-body">
            <div className="card card-pad" style={{ marginBottom: "1.2rem" }}>
              <div className="sumrow"><span className="muted">{c.title}</span><span>{idr(c.priceIdr)}</span></div>
            </div>
            <form action={enrollCourse}>
              <input type="hidden" name="courseId" value={c.id} />
              {!c.isFree && (
                <>
                  <p className="label">Metode pembayaran</p>
                  {activeGateways.length === 0 && <p className="muted" style={{ fontSize: ".84rem" }}>Belum ada metode pembayaran aktif. Hubungi admin.</p>}
                  <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
                    {activeGateways.map((g, i) => {
                      const m = GW_META[g.provider];
                      return (
                        <label className="opt" key={g.id}>
                          <input type="radio" name="method" value={m.value} defaultChecked={i === 0} />
                          <span className={`tag ${m.cls}`} style={{ width: 40, justifyContent: "center" }}>{m.icon ? <svg className="ico ico-sm"><use href={`#${m.icon}`} /></svg> : m.tag}</span>
                          <div><p style={{ fontWeight: 600, fontSize: ".9rem" }}>{m.label}</p><p className="muted" style={{ fontSize: ".78rem" }}>{m.desc}</p></div>
                        </label>
                      );
                    })}
                  </div>
                </>
              )}
              <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: "1.2rem" }}>{c.isFree ? "Daftar Sekarang" : "Lanjut Bayar"}</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
