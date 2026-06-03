const HERO_BG =
  "url('https://images.unsplash.com/photo-1758696229365-997adf6e4a1c?auto=format&fit=crop&w=1400&q=55')";

function Mark() {
  return (
    <svg className="mark" viewBox="0 0 40 40" fill="none">
      <path d="M28 6a13 13 0 1 0 6 14 10 10 0 1 1-6-14Z" fill="currentColor" />
      <circle cx="30" cy="11" r="1.6" fill="currentColor" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <header className="nav">
        <div className="container nav-in">
          <a href="/" className="brand"><Mark />SantriKalong</a>
          <nav className="nav-links">
            <a href="/katalog">Katalog</a><a href="/dauroh">Dauroh</a><a href="/live">Live Kelas</a><a href="/studio">Jadi Pengajar</a>
          </nav>
          <div className="nav-right">
            <button className="icon-btn" id="sk-mode-toggle" aria-label="Ganti mode"><svg className="ico" id="sk-mode-ic"><use href="#i-sun" /></svg></button>
            <a href="/checkout" className="icon-btn cart-btn" aria-label="Keranjang"><svg className="ico"><use href="#i-cart" /></svg><span className="cart-badge">2</span></a>
            <a href="/auth" className="btn btn-ghost btn-sm hide-sm">Masuk</a>
            <a href="/auth" className="btn btn-primary btn-sm">Daftar</a>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: HERO_BG }} />
        <div className="halo" />
        <svg className="arch" viewBox="0 0 640 320" fill="none">
          <path d="M40 320V160a280 280 0 0 1 560 0v160" stroke="currentColor" strokeWidth="1.2" />
          <path d="M120 320V170a200 200 0 0 1 400 0v150" stroke="currentColor" strokeWidth="1" />
        </svg>
        <div className="container hero-in">
          <div className="lantern-wrap"><svg className="lantern" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><use href="#i-lantern" /></svg></div>
          <p className="eyebrow" style={{ marginTop: "1.3rem" }}>Ilmu adalah cahaya</p>
          <h1>Menuntut ilmu di <span className="lt">keheningan malam</span></h1>
          <p className="lead">Kelas tahsin, bahasa Arab, dan dauroh online — langsung maupun rekaman. Dibimbing ustadz tepercaya, di ruang yang tenang untuk fokus.</p>
          <div className="hero-cta">
            <a href="/katalog" className="btn btn-primary btn-lg">Jelajahi Kelas <svg className="ico"><use href="#i-arrow" /></svg></a>
            <a href="/katalog" className="btn btn-ghost btn-lg">Lihat Jadwal Live</a>
          </div>
          <div className="hero-stats">
            <div><b>120+</b><span>Kelas</span></div><div><b>35</b><span>Ustadz</span></div><div><b>8.500+</b><span>Santri</span></div>
          </div>
        </div>
      </section>

      <section className="sec container">
        <div className="sec-head"><h2>Jalan ilmu</h2></div>
        <div className="grid-4">
          <a href="/katalog" className="cat"><svg className="ci ico"><use href="#i-book" /></svg><h3>Bahasa Arab</h3><p>24 kelas</p></a>
          <a href="/katalog" className="cat"><svg className="ci ico"><use href="#i-quran" /></svg><h3>Tahsin &amp; Tahfizh</h3><p>18 kelas</p></a>
          <a href="/katalog" className="cat"><svg className="ci ico"><use href="#i-broadcast" /></svg><h3>Dauroh Online</h3><p>9 event</p></a>
          <a href="/katalog" className="cat"><svg className="ci ico"><use href="#i-layers" /></svg><h3>Fiqih &amp; Aqidah</h3><p>31 kelas</p></a>
        </div>
      </section>

      <section className="sec container">
        <div className="sec-head"><h2>Kelas pilihan</h2><a href="/katalog">Lihat semua <svg className="ico ico-sm"><use href="#i-arrow" /></svg></a></div>
        <div className="grid-c">
          <article className="ccard">
            <div className="thumb"><img className="thumb-img" loading="lazy" alt="" src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=600&q=55" /><div className="pin"><span className="tag">Bahasa Arab</span><span className="tag tag-muted spacer">Rekaman</span></div></div>
            <div className="ccard-b"><h3>Bahasa Arab untuk Pemula — Dasar Nahwu</h3><p className="by">Ust. Abdullah, Lc.</p><div className="cmeta"><span><svg className="ico ico-sm"><use href="#i-star" /></svg>4.9</span><span><svg className="ico ico-sm"><use href="#i-book" /></svg>32 materi</span><span>Pemula</span></div><div className="cfoot"><span className="price">Rp 149.000</span><a href="/kelas/bahasa-arab-pemula" className="btn btn-soft btn-sm">Lihat</a></div></div>
          </article>
          <article className="ccard">
            <div className="thumb"><img className="thumb-img" loading="lazy" alt="" src="https://images.unsplash.com/photo-1616422840391-fa670d4b2ae7?auto=format&fit=crop&w=600&q=55" /><div className="pin"><span className="tag">Tahsin</span><span className="tag tag-live spacer"><span className="dot" />LIVE</span></div></div>
            <div className="ccard-b"><h3>Tahsin Al-Qur&apos;an Metode Tilawati</h3><p className="by">Ustadzah Fatimah</p><div className="cmeta"><span><svg className="ico ico-sm"><use href="#i-star" /></svg>5.0</span><span><svg className="ico ico-sm"><use href="#i-clock" /></svg>Tiap Sabtu</span></div><div className="cfoot"><span className="price">Rp 250.000</span><a href="/kelas/tahsin-tilawati" className="btn btn-soft btn-sm">Lihat</a></div></div>
          </article>
          <article className="ccard">
            <div className="thumb"><img className="thumb-img" loading="lazy" alt="" src="https://images.unsplash.com/photo-1639918065925-eb39272edda2?auto=format&fit=crop&w=600&q=55" /><div className="pin"><span className="tag">Fiqih</span><span className="tag tag-free spacer">GRATIS</span></div></div>
            <div className="ccard-b"><h3>Fiqih Thaharah untuk Sehari-hari</h3><p className="by">Ust. Yusuf</p><div className="cmeta"><span><svg className="ico ico-sm"><use href="#i-star" /></svg>4.8</span><span><svg className="ico ico-sm"><use href="#i-book" /></svg>12 materi</span></div><div className="cfoot"><span className="price free">Gratis</span><a href="/kelas/fiqih-thaharah" className="btn btn-soft btn-sm">Lihat</a></div></div>
          </article>
        </div>
      </section>

      <section className="sec container">
        <div className="band">
          <div>
            <p className="eyebrow">Untuk para pengajar</p>
            <h2 style={{ marginTop: ".4rem" }}>Punya ilmu untuk dibagikan?</h2>
            <p className="muted" style={{ marginTop: ".5rem", maxWidth: "520px" }}>Daftar jadi pengajar, susun kelas, dan dapatkan bagi hasil dari setiap santri yang mendaftar.</p>
          </div>
          <a href="/studio" className="btn btn-primary">Daftar Jadi Pengajar <svg className="ico"><use href="#i-arrow" /></svg></a>
        </div>
      </section>

      <footer className="ft">
        <div className="container ft-grid">
          <div className="ft-brand">
            <a href="/" className="brand"><Mark />SantriKalong</a>
            <p>Ruang menuntut ilmu agama &amp; bahasa Arab — tenang, untuk semua kalangan.</p>
          </div>
          <div><h4>Belajar</h4><ul><li><a href="/katalog">Katalog</a></li><li><a href="/dauroh">Dauroh</a></li><li><a href="/live">Live Kelas</a></li></ul></div>
          <div><h4>Platform</h4><ul><li><a href="/studio">Jadi Pengajar</a></li><li><a href="#">Tentang</a></li><li><a href="#">Kontak</a></li></ul></div>
          <div><h4>Bantuan</h4><ul><li><a href="#">Pusat Bantuan</a></li><li><a href="#">Privasi</a></li><li><a href="#">Ketentuan</a></li></ul></div>
        </div>
        <div className="container"><p className="copy">© 2026 SantriKalong.com — Baarakallahu fiikum.</p></div>
      </footer>
    </>
  );
}
