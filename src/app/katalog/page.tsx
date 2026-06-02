function Mark() {
  return (
    <svg className="mark" viewBox="0 0 40 40" fill="none">
      <path d="M28 6a13 13 0 1 0 6 14 10 10 0 1 1-6-14Z" fill="currentColor" />
      <circle cx="30" cy="11" r="1.6" fill="currentColor" />
    </svg>
  );
}

type Course = {
  img: string; tag: string; tagClass?: string; badge: string; badgeClass: string;
  title: string; by: string; rating: string; metaIcon: string; meta: string; level?: string;
  price: string; priceClass?: string; cta: string;
};

const COURSES: Course[] = [
  { img: "photo-1609599006353-e629aaabfeae", tag: "Bahasa Arab", badge: "Rekaman", badgeClass: "tag tag-muted spacer", title: "Bahasa Arab untuk Pemula — Dasar Nahwu", by: "Ust. Abdullah, Lc.", rating: "4.9", metaIcon: "i-book", meta: "32 materi", level: "Pemula", price: "Rp 149.000", cta: "Lihat" },
  { img: "photo-1616422840391-fa670d4b2ae7", tag: "Tahsin", badge: "● LIVE", badgeClass: "tag tag-live spacer", title: "Tahsin Al-Qur'an Metode Tilawati", by: "Ustadzah Fatimah", rating: "5.0", metaIcon: "i-clock", meta: "Tiap Sabtu", price: "Rp 250.000", cta: "Lihat" },
  { img: "photo-1639918065925-eb39272edda2", tag: "Dauroh", tagClass: "tag tag-info", badge: "Event", badgeClass: "tag tag-muted spacer", title: "Dauroh Online: Sirah Nabawiyah", by: "Ust. Hamzah, M.A.", rating: "", metaIcon: "i-clock", meta: "15–17 Jun", level: "Kuota 200", price: "Rp 99.000", cta: "Daftar" },
  { img: "photo-1542816417-0983c9c9ad53", tag: "Fiqih", tagClass: "tag tag-danger", badge: "GRATIS", badgeClass: "tag tag-free spacer", title: "Fiqih Thaharah untuk Sehari-hari", by: "Ust. Yusuf", rating: "4.8", metaIcon: "i-book", meta: "12 materi", price: "Gratis", priceClass: "price free", cta: "Lihat" },
  { img: "photo-1589462135796-2b46e4bdd7fe", tag: "Bahasa Arab", badge: "Rekaman", badgeClass: "tag tag-muted spacer", title: "Muhadatsah: Percakapan Arab Praktis", by: "Ust. Abdullah, Lc.", rating: "4.7", metaIcon: "i-book", meta: "28 materi", level: "Menengah", price: "Rp 175.000", cta: "Lihat" },
  { img: "photo-1587617425953-9075d28b8c46", tag: "Tahfizh", badge: "Rekaman", badgeClass: "tag tag-muted spacer", title: "Program Tahfizh Juz 30 Terbimbing", by: "Ustadzah Fatimah", rating: "4.9", metaIcon: "i-book", meta: "30 materi", price: "Rp 199.000", cta: "Lihat" },
];

export default function Katalog() {
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
      <div className="container" style={{ paddingTop: ".8rem" }}><h1 style={{ fontSize: "clamp(1.8rem,4vw,2.5rem)" }}>Katalog Kelas</h1><p className="muted" style={{ marginTop: ".3rem" }}>120+ kelas dari 35 ustadz tepercaya.</p></div>

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
            <p className="muted" style={{ fontSize: ".85rem", marginBottom: "1rem" }}>Menampilkan 6 dari 123 hasil</p>

            <div className="grid-c">
              {COURSES.map((c, i) => (
                <article className="ccard" key={i}>
                  <div className="thumb">
                    <img className="thumb-img" loading="lazy" alt="" src={`https://images.unsplash.com/${c.img}?auto=format&fit=crop&w=600&q=55`} />
                    <div className="pin"><span className={c.tagClass ?? "tag"}>{c.tag}</span><span className={c.badgeClass}>{c.badge === "● LIVE" ? <><span className="dot" />LIVE</> : c.badge}</span></div>
                  </div>
                  <div className="ccard-b">
                    <h3>{c.title}</h3><p className="by">{c.by}</p>
                    <div className="cmeta">
                      {c.rating && <span><svg className="ico ico-sm"><use href="#i-star" /></svg>{c.rating}</span>}
                      <span><svg className="ico ico-sm"><use href={`#${c.metaIcon}`} /></svg>{c.meta}</span>
                      {c.level && <span>{c.level}</span>}
                    </div>
                    <div className="cfoot"><span className={c.priceClass ?? "price"}>{c.price}</span><a href="/kelas" className="btn btn-soft btn-sm">{c.cta}</a></div>
                  </div>
                </article>
              ))}
            </div>
            <div className="center" style={{ marginTop: "2rem" }}><button className="btn btn-ghost">Muat lebih banyak</button></div>
          </div>
        </div>
      </main>
    </>
  );
}
