function Mark() {
  return (
    <svg className="mark" viewBox="0 0 40 40" fill="none">
      <path d="M28 6a13 13 0 1 0 6 14 10 10 0 1 1-6-14Z" fill="currentColor" />
      <circle cx="30" cy="11" r="1.6" fill="currentColor" />
    </svg>
  );
}

export default function Kelas() {
  return (
    <>
      <header className="nav solid">
        <div className="container nav-in">
          <a href="/" className="brand"><Mark />SantriKalong</a>
          <nav className="nav-links"><a href="/katalog">Katalog</a><a href="/katalog">Dauroh</a><a href="/katalog">Live Kelas</a><a href="/studio">Jadi Pengajar</a></nav>
          <div className="nav-right">
            <button className="icon-btn" id="sk-mode-toggle" aria-label="Ganti mode"><svg className="ico" id="sk-mode-ic"><use href="#i-sun" /></svg></button>
            <button className="icon-btn cart-btn" data-open="#cart" aria-label="Keranjang"><svg className="ico"><use href="#i-cart" /></svg><span className="cart-badge">2</span></button>
            <a href="/dashboard" className="btn btn-ghost btn-sm hide-sm">Dashboard</a>
          </div>
        </div>
      </header>

      <div className="breadcrumb container"><a href="/katalog">Katalog</a> / <span>Bahasa Arab</span> / <span style={{ color: "rgb(var(--text))" }}>Dasar Nahwu</span></div>

      <main className="sec container">
        <div className="detail">
          <div>
            <div style={{ display: "flex", gap: ".5rem", marginBottom: ".8rem" }}><span className="tag">Bahasa Arab</span><span className="tag tag-muted">Rekaman · Pemula</span></div>
            <h1 style={{ fontSize: "clamp(1.7rem,3.5vw,2.4rem)" }}>Bahasa Arab untuk Pemula — Dasar Nahwu &amp; Shorof</h1>
            <p className="muted" style={{ marginTop: ".8rem", maxWidth: "640px" }}>Pelajari fondasi bahasa Arab dari nol: membaca huruf, kaidah nahwu dasar, hingga menyusun kalimat sederhana. Cocok untuk yang ingin memahami Al-Qur&apos;an.</p>
            <div className="cmeta" style={{ marginTop: "1rem", fontSize: ".85rem" }}><span><svg className="ico ico-sm"><use href="#i-star" /></svg><b style={{ color: "rgb(var(--text))" }}>4.9</b> (212 ulasan)</span><span><svg className="ico ico-sm"><use href="#i-users" /></svg>1.240 santri</span><span><svg className="ico ico-sm"><use href="#i-clock" /></svg>8 jam</span><span><svg className="ico ico-sm"><use href="#i-book" /></svg>32 materi</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: ".7rem", marginTop: "1.1rem" }}><span className="avatar"><svg className="ico"><use href="#i-user" /></svg></span><div><p style={{ fontWeight: 600 }}>Ust. Abdullah, Lc.</p><p className="muted" style={{ fontSize: ".82rem" }}>Lulusan LIPIA · 8 tahun mengajar</p></div></div>

            <div className="card card-pad" style={{ marginTop: "1.8rem", position: "relative", overflow: "hidden", background: "#000", aspectRatio: "16/9", display: "grid", placeItems: "center", padding: 0 }}>
              <img src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=900&q=55" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: .55 }} />
              <button className="icon-btn" style={{ position: "relative", width: 64, height: 64, borderRadius: 999, background: "rgb(var(--brand))", color: "rgb(var(--brand-fg))", border: "none" }}><svg className="ico ico-lg"><use href="#i-play" /></svg></button>
            </div>

            <h2 style={{ marginTop: "2.2rem", fontSize: "1.4rem" }}>Yang akan kamu pelajari</h2>
            <ul className="learn" style={{ marginTop: "1rem" }}>
              <li><svg className="ico ico-sm"><use href="#i-check" /></svg>Membaca &amp; menulis huruf hijaiyah</li>
              <li><svg className="ico ico-sm"><use href="#i-check" /></svg>Kaidah dasar nahwu (isim, fi&apos;il, harf)</li>
              <li><svg className="ico ico-sm"><use href="#i-check" /></svg>Pengenalan shorof &amp; perubahan kata</li>
              <li><svg className="ico ico-sm"><use href="#i-check" /></svg>Menyusun kalimat sederhana</li>
              <li><svg className="ico ico-sm"><use href="#i-check" /></svg>Kosakata harian (mufradat)</li>
              <li><svg className="ico ico-sm"><use href="#i-check" /></svg>Latihan &amp; kuis tiap bab</li>
            </ul>

            <h2 style={{ marginTop: "2.2rem", fontSize: "1.4rem" }}>Silabus Kelas</h2>
            <div style={{ marginTop: "1rem" }}>
              <details className="acc" open><summary><span>Bab 1 — Pengenalan Huruf</span><span className="muted" style={{ fontSize: ".8rem", fontWeight: 400 }}>5 materi</span></summary>
                <ul>
                  <li><svg className="ico ico-sm"><use href="#i-play" /></svg>Video: Mengenal huruf hijaiyah<span className="muted" style={{ marginLeft: "auto", fontSize: ".78rem" }}>12:30</span></li>
                  <li><svg className="ico ico-sm"><use href="#i-doc" /></svg>PDF: Tabel huruf &amp; latihan<span className="tag tag-free" style={{ marginLeft: "auto" }}>Preview</span></li>
                  <li><svg className="ico ico-sm"><use href="#i-headphones" /></svg>Audio: Pelafalan makhraj<span className="muted" style={{ marginLeft: "auto", fontSize: ".78rem" }}>08:10</span></li>
                  <li><svg className="ico ico-sm"><use href="#i-layers" /></svg>Slide HTML: Ringkasan bab</li>
                  <li><svg className="ico ico-sm"><use href="#i-edit" /></svg>Kuis Bab 1<span className="muted" style={{ marginLeft: "auto", fontSize: ".78rem" }}>10 soal</span></li>
                </ul>
              </details>
              <details className="acc"><summary><span>Bab 2 — Isim, Fi&apos;il, Harf</span><span className="muted" style={{ fontSize: ".8rem", fontWeight: 400 }}>7 materi</span></summary><ul><li><svg className="ico ico-sm"><use href="#i-lock" /></svg>Terkunci — daftar untuk akses</li></ul></details>
              <details className="acc"><summary><span>Bab 3 — Menyusun Kalimat</span><span className="muted" style={{ fontSize: ".8rem", fontWeight: 400 }}>6 materi</span></summary><ul><li><svg className="ico ico-sm"><use href="#i-lock" /></svg>Terkunci — daftar untuk akses</li></ul></details>
            </div>

            <h2 style={{ marginTop: "2.2rem", fontSize: "1.4rem" }}>Tentang Pengajar</h2>
            <div className="card card-pad" style={{ marginTop: "1rem", display: "flex", gap: "1.1rem", flexWrap: "wrap" }}>
              <span className="avatar" style={{ width: 72, height: 72 }}><svg className="ico ico-lg"><use href="#i-user" /></svg></span>
              <div style={{ flex: 1, minWidth: 220 }}>
                <p style={{ fontWeight: 600, fontSize: "1.05rem" }}>Ust. Abdullah, Lc.</p>
                <p className="muted" style={{ fontSize: ".84rem" }}>Lulusan LIPIA · Pengajar bahasa Arab 8 tahun</p>
                <div className="cmeta" style={{ marginTop: ".6rem" }}><span><svg className="ico ico-sm"><use href="#i-star" /></svg>4.9 rating</span><span><svg className="ico ico-sm"><use href="#i-users" /></svg>3.100 santri</span><span><svg className="ico ico-sm"><use href="#i-book" /></svg>3 kelas</span></div>
                <p className="muted" style={{ fontSize: ".9rem", marginTop: ".7rem" }}>Fokus mengajar nahwu &amp; shorof dengan metode bertahap agar mudah dipahami pemula yang ingin memahami Al-Qur&apos;an.</p>
                <button className="btn btn-ghost btn-sm" style={{ marginTop: ".8rem" }}>Lihat profil pengajar</button>
              </div>
            </div>

            <h2 style={{ marginTop: "2.2rem", fontSize: "1.4rem" }}>Ulasan Santri</h2>
            <div className="card card-pad" style={{ marginTop: "1rem", display: "grid", gridTemplateColumns: "auto 1fr", gap: "1.6rem", alignItems: "center" }}>
              <div style={{ textAlign: "center" }}><p style={{ fontFamily: "var(--font-display)", fontSize: "3rem", fontWeight: 600, color: "rgb(var(--brand))", lineHeight: 1 }}>4.9</p><p style={{ color: "rgb(var(--brand))" }}>★★★★★</p><p className="muted" style={{ fontSize: ".8rem" }}>212 ulasan</p></div>
              <div style={{ display: "flex", flexDirection: "column", gap: ".35rem", minWidth: 160 }}>
                <div style={{ display: "flex", alignItems: "center", gap: ".6rem", fontSize: ".8rem" }}><span className="muted">5★</span><div className="bar" style={{ flex: 1 }}><i style={{ width: "88%" }} /></div><span className="muted">88%</span></div>
                <div style={{ display: "flex", alignItems: "center", gap: ".6rem", fontSize: ".8rem" }}><span className="muted">4★</span><div className="bar" style={{ flex: 1 }}><i style={{ width: "9%" }} /></div><span className="muted">9%</span></div>
                <div style={{ display: "flex", alignItems: "center", gap: ".6rem", fontSize: ".8rem" }}><span className="muted">3★</span><div className="bar" style={{ flex: 1 }}><i style={{ width: "2%" }} /></div><span className="muted">2%</span></div>
                <div style={{ display: "flex", alignItems: "center", gap: ".6rem", fontSize: ".8rem" }}><span className="muted">2★</span><div className="bar" style={{ flex: 1 }}><i style={{ width: "1%" }} /></div><span className="muted">1%</span></div>
              </div>
            </div>
            <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: ".8rem" }}>
              <div className="card card-pad"><div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}><span className="avatar sm"><svg className="ico ico-sm"><use href="#i-user" /></svg></span><div><p style={{ fontWeight: 600, fontSize: ".9rem" }}>Ahmad R. <span className="muted" style={{ fontWeight: 400 }}>· 2 minggu lalu</span></p><p style={{ color: "rgb(var(--brand))", fontSize: ".8rem" }}>★★★★★</p></div></div><p className="muted" style={{ fontSize: ".9rem", marginTop: ".6rem" }}>Penjelasan ustadz sangat runtut, dari nol benar-benar dibimbing. Barakallahu fiik.</p></div>
              <div className="card card-pad"><div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}><span className="avatar sm"><svg className="ico ico-sm"><use href="#i-user" /></svg></span><div><p style={{ fontWeight: 600, fontSize: ".9rem" }}>Siti K. <span className="muted" style={{ fontWeight: 400 }}>· 1 bulan lalu</span></p><p style={{ color: "rgb(var(--brand))", fontSize: ".8rem" }}>★★★★★</p></div></div><p className="muted" style={{ fontSize: ".9rem", marginTop: ".6rem" }}>Materi PDF &amp; audionya sangat membantu latihan di rumah. Kuisnya bikin makin paham.</p></div>
            </div>
          </div>

          <aside>
            <div className="buybox">
              <div className="top"><img src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=700&q=55" alt="" /></div>
              <div className="pad">
                <div style={{ display: "flex", alignItems: "baseline", gap: ".5rem" }}><span className="price" style={{ fontSize: "1.8rem" }}>Rp 149.000</span><s className="muted" style={{ fontSize: ".9rem" }}>Rp 249.000</s></div>
                <p className="tag tag-warn" style={{ marginTop: ".6rem" }}>Promo berakhir 3 hari lagi</p>
                <button className="btn btn-primary btn-block btn-lg" data-open="#checkout" style={{ marginTop: "1rem" }}>Beli &amp; Mulai Belajar</button>
                <button className="btn btn-ghost btn-block" data-open="#cart" style={{ marginTop: ".6rem" }}><svg className="ico ico-sm"><use href="#i-cart" /></svg>Tambah ke Keranjang</button>
                <ul className="learn" style={{ gridTemplateColumns: "1fr", marginTop: "1.2rem", gap: ".5rem" }}>
                  <li><svg className="ico ico-sm"><use href="#i-check" /></svg>Akses selamanya</li>
                  <li><svg className="ico ico-sm"><use href="#i-check" /></svg>32 materi (video, audio, PDF)</li>
                  <li><svg className="ico ico-sm"><use href="#i-check" /></svg>Kuis &amp; sertifikat</li>
                  <li><svg className="ico ico-sm"><use href="#i-check" /></svg>Akses via HP &amp; laptop</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <div className="drawer" id="cart">
        <div className="drawer-head"><h3 style={{ fontFamily: "var(--font-display)" }}>Keranjang (2)</h3><button className="icon-btn" data-close aria-label="Tutup"><svg className="ico"><use href="#i-x" /></svg></button></div>
        <div className="drawer-body">
          <div className="cart-item"><img src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=200&q=50" alt="" /><div style={{ flex: 1 }}><p style={{ fontWeight: 600, fontSize: ".9rem" }}>Bahasa Arab untuk Pemula</p><p className="muted" style={{ fontSize: ".8rem" }}>Ust. Abdullah, Lc.</p><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: ".3rem" }}><span className="price" style={{ fontSize: "1rem" }}>Rp 149.000</span><button className="icon-btn" style={{ width: 30, height: 30 }} aria-label="Hapus"><svg className="ico ico-sm"><use href="#i-trash" /></svg></button></div></div></div>
          <div className="cart-item"><img src="https://images.unsplash.com/photo-1616422840391-fa670d4b2ae7?auto=format&fit=crop&w=200&q=50" alt="" /><div style={{ flex: 1 }}><p style={{ fontWeight: 600, fontSize: ".9rem" }}>Tahsin Al-Qur&apos;an Tilawati</p><p className="muted" style={{ fontSize: ".8rem" }}>Ustadzah Fatimah</p><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: ".3rem" }}><span className="price" style={{ fontSize: "1rem" }}>Rp 250.000</span><button className="icon-btn" style={{ width: 30, height: 30 }} aria-label="Hapus"><svg className="ico ico-sm"><use href="#i-trash" /></svg></button></div></div></div>
        </div>
        <div className="drawer-foot">
          <div className="sumrow"><span className="muted">Subtotal</span><b>Rp 399.000</b></div>
          <button className="btn btn-primary btn-block" data-open="#checkout">Lanjut ke Pembayaran</button>
        </div>
      </div>

      <div className="overlay" id="checkout">
        <div className="modal">
          <div className="modal-head"><h3>Pembayaran</h3><button className="icon-btn" data-close aria-label="Tutup"><svg className="ico"><use href="#i-x" /></svg></button></div>
          <div className="modal-body">
            <div className="card card-pad" style={{ marginBottom: "1.2rem" }}>
              <div className="sumrow"><span className="muted">2 kelas</span><span>Rp 399.000</span></div>
              <div className="sumrow"><span className="muted">Biaya layanan</span><span>Rp 2.500</span></div>
              <div className="sumrow" style={{ borderTop: "1px solid rgb(var(--border))", paddingTop: ".5rem", marginTop: ".3rem", fontWeight: 700 }}><span>Total</span><span className="price" style={{ fontSize: "1.1rem" }}>Rp 401.500</span></div>
            </div>
            <p className="label">Metode pembayaran</p>
            <p className="help" style={{ marginTop: "-.2rem", marginBottom: ".6rem" }}>Gateway aktif diatur admin (Midtrans / Tripay / Xendit / Manual)</p>
            <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
              <label className="opt"><input type="radio" name="pay" defaultChecked /><span className="tag tag-info" style={{ width: 40, justifyContent: "center" }}>VA</span><div><p style={{ fontWeight: 600, fontSize: ".9rem" }}>Virtual Account / QRIS</p><p className="muted" style={{ fontSize: ".78rem" }}>via Midtrans</p></div></label>
              <label className="opt"><input type="radio" name="pay" /><span className="tag" style={{ width: 40, justifyContent: "center", background: "rgb(139 92 246/.16)", color: "#8b5cf6" }}>eW</span><div><p style={{ fontWeight: 600, fontSize: ".9rem" }}>E-Wallet (OVO, Dana)</p><p className="muted" style={{ fontSize: ".78rem" }}>via Xendit</p></div></label>
              <label className="opt"><input type="radio" name="pay" /><span className="tag tag-warn" style={{ width: 40, justifyContent: "center" }}>RT</span><div><p style={{ fontWeight: 600, fontSize: ".9rem" }}>Retail / Bank lain</p><p className="muted" style={{ fontSize: ".78rem" }}>via Tripay</p></div></label>
              <label className="opt"><input type="radio" name="pay" /><span className="tag tag-success" style={{ width: 40, justifyContent: "center" }}><svg className="ico ico-sm"><use href="#i-wallet" /></svg></span><div><p style={{ fontWeight: 600, fontSize: ".9rem" }}>Transfer Manual</p><p className="muted" style={{ fontSize: ".78rem" }}>Upload bukti, verifikasi admin</p></div></label>
            </div>
            <button className="btn btn-primary btn-block btn-lg" style={{ marginTop: "1.2rem" }}>Bayar Sekarang</button>
            <p className="center muted" style={{ fontSize: ".78rem", marginTop: ".7rem" }}><svg className="ico ico-sm" style={{ display: "inline", verticalAlign: "-3px" }}><use href="#i-shield" /></svg> Pembayaran aman &amp; terenkripsi</p>
          </div>
        </div>
      </div>
    </>
  );
}
