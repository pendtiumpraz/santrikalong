import { prisma } from "@/lib/db";
import { idr, img } from "@/lib/format";

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

export default async function Katalog() {
  const courses = await prisma.course.findMany({
    where: { status: "PUBLISHED", deletedAt: null },
    include: { category: true, ustadz: { include: { user: true } } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <>
      <header className="nav solid">
        <div className="container nav-in">
          <a href="/" className="brand"><Mark />SantriKalong</a>
          <nav className="nav-links"><a href="/katalog" className="active">Katalog</a><a href="/dauroh">Dauroh</a><a href="/live">Live Kelas</a><a href="/studio">Jadi Pengajar</a></nav>
          <div className="nav-right">
            <button className="icon-btn" id="sk-mode-toggle" aria-label="Ganti mode"><svg className="ico" id="sk-mode-ic"><use href="#i-sun" /></svg></button>
            <a href="/checkout" className="icon-btn cart-btn" aria-label="Keranjang"><svg className="ico"><use href="#i-cart" /></svg><span className="cart-badge">2</span></a>
            <a href="/dashboard" className="btn btn-ghost btn-sm hide-sm">Dashboard</a>
            <a href="/auth" className="btn btn-primary btn-sm">Masuk</a>
          </div>
        </div>
      </header>

      <div className="breadcrumb container"><a href="/">Beranda</a> / <span>Katalog</span></div>
      <div className="container" style={{ paddingTop: ".8rem" }}><h1 style={{ fontSize: "clamp(1.8rem,4vw,2.5rem)" }}>Katalog Kelas</h1><p className="muted" style={{ marginTop: ".3rem" }}>{courses.length} kelas dari pengajar tepercaya.</p></div>

      <main className="sec container">
        <div className="kat">
          <aside className="filter" id="filter">
            <h4>Kategori</h4>
            <label><input type="checkbox" defaultChecked /> Bahasa Arab</label>
            <label><input type="checkbox" /> Tahsin &amp; Tahfizh</label>
            <label><input type="checkbox" /> Fiqih &amp; Aqidah</label>
            <label><input type="checkbox" /> Dauroh</label>
            <h4>Level</h4>
            <label><input type="radio" name="lv" defaultChecked /> Semua</label>
            <label><input type="radio" name="lv" /> Pemula</label>
            <label><input type="radio" name="lv" /> Menengah</label>
            <label><input type="radio" name="lv" /> Lanjutan</label>
            <h4>Harga</h4>
            <label><input type="radio" name="hg" defaultChecked /> Semua</label>
            <label><input type="radio" name="hg" /> Gratis</label>
            <label><input type="radio" name="hg" /> Berbayar</label>
            <button className="btn btn-ghost btn-sm btn-block" style={{ marginTop: "1.2rem" }}>Reset filter</button>
          </aside>

          <div>
            <div style={{ display: "flex", gap: ".7rem", alignItems: "center", marginBottom: "1.2rem", flexWrap: "wrap" }}>
              <div className="searchbar"><svg className="ico ico-sm"><use href="#i-search" /></svg><input className="input" placeholder="Cari kelas, ustadz, topik…" /></div>
              <button className="btn btn-ghost btn-sm filter-toggle" data-toggle="#filter"><svg className="ico ico-sm"><use href="#i-layers" /></svg>Filter</button>
              <select className="select" style={{ width: "auto" }}><option>Terbaru</option><option>Terpopuler</option><option>Rating tertinggi</option><option>Harga termurah</option></select>
            </div>
            <div className="chips">
              <button className="chip" aria-pressed="true">Semua</button>
              <button className="chip">Live</button><button className="chip">Rekaman</button><button className="chip">Gratis</button><button className="chip">Dauroh</button>
            </div>
            <p className="muted" style={{ fontSize: ".85rem", marginBottom: "1rem" }}>Menampilkan {courses.length} kelas</p>

            <div className="grid-c">
              {courses.map((c) => (
                <article className="ccard" key={c.id}>
                  <div className="thumb">
                    <img className="thumb-img" loading="lazy" alt={c.title} src={img(c.thumbnailKey)} />
                    <div className="pin">
                      <span className="tag">{c.category?.name ?? "Kelas"}</span>
                      {c.type === "LIVE"
                        ? <span className="tag tag-live spacer"><span className="dot" />LIVE</span>
                        : c.isFree
                          ? <span className="tag tag-free spacer">GRATIS</span>
                          : <span className="tag tag-muted spacer">Rekaman</span>}
                    </div>
                  </div>
                  <div className="ccard-b">
                    <h3>{c.title}</h3>
                    <p className="by">{c.ustadz?.user?.name ?? "Pengajar"}</p>
                    <div className="cmeta">
                      <span><svg className="ico ico-sm"><use href="#i-layers" /></svg>{LEVEL[c.level] ?? c.level}</span>
                      <span><svg className="ico ico-sm"><use href={c.type === "LIVE" ? "#i-broadcast" : "#i-play"} /></svg>{c.type === "LIVE" ? "Live" : "Rekaman"}</span>
                    </div>
                    <div className="cfoot"><span className={c.isFree ? "price free" : "price"}>{idr(c.priceIdr)}</span><a href={`/kelas/${c.slug}`} className="btn btn-soft btn-sm">Lihat</a></div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
