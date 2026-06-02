function Mark() {
  return (
    <svg className="mark" viewBox="0 0 40 40" fill="none">
      <path d="M28 6a13 13 0 1 0 6 14 10 10 0 1 1-6-14Z" fill="currentColor" />
      <circle cx="30" cy="11" r="1.6" fill="currentColor" />
    </svg>
  );
}

export default function Checkout() {
  return (
    <>
      <header className="nav solid">
        <div className="container nav-in">
          <a href="/" className="brand"><Mark />SantriKalong</a>
          <nav className="nav-links"><a href="/katalog">Katalog</a><a href="/live">Live</a></nav>
          <div className="nav-right"><button className="icon-btn" id="sk-mode-toggle" aria-label="Ganti mode"><svg className="ico" id="sk-mode-ic"><use href="#i-sun" /></svg></button><a href="/dashboard" className="btn btn-ghost btn-sm">Dashboard</a></div>
        </div>
      </header>

      <div className="breadcrumb container"><a href="/katalog">Katalog</a> / <span>Keranjang &amp; Pembayaran</span></div>
      <div className="container" style={{ paddingTop: ".8rem" }}><h1 style={{ fontSize: "clamp(1.7rem,4vw,2.3rem)" }}>Keranjang &amp; Pembayaran</h1></div>

      <main className="sec container">
        <div className="cgrid">
          <div>
            <div className="card card-pad">
              <h2 style={{ fontSize: "1.15rem", marginBottom: ".4rem" }}>Kelas di keranjang (2)</h2>
              <div className="citem"><img src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=240&q=50" alt="" /><div style={{ flex: 1 }}><p style={{ fontWeight: 600 }}>Bahasa Arab untuk Pemula — Dasar Nahwu</p><p className="muted" style={{ fontSize: ".84rem" }}>Ust. Abdullah, Lc. · Akses selamanya</p></div><div style={{ textAlign: "right" }}><span className="price" style={{ fontSize: "1.05rem" }}>Rp 149.000</span><br /><button className="btn btn-ghost btn-sm" style={{ marginTop: ".4rem" }}><svg className="ico ico-sm"><use href="#i-trash" /></svg>Hapus</button></div></div>
              <div className="citem" style={{ borderBottom: "none" }}><img src="https://images.unsplash.com/photo-1616422840391-fa670d4b2ae7?auto=format&fit=crop&w=240&q=50" alt="" /><div style={{ flex: 1 }}><p style={{ fontWeight: 600 }}>Tahsin Al-Qur&apos;an Metode Tilawati</p><p className="muted" style={{ fontSize: ".84rem" }}>Ustadzah Fatimah · Live</p></div><div style={{ textAlign: "right" }}><span className="price" style={{ fontSize: "1.05rem" }}>Rp 250.000</span><br /><button className="btn btn-ghost btn-sm" style={{ marginTop: ".4rem" }}><svg className="ico ico-sm"><use href="#i-trash" /></svg>Hapus</button></div></div>
            </div>

            <div className="card card-pad" style={{ marginTop: "1.2rem" }}>
              <h2 style={{ fontSize: "1.15rem", marginBottom: ".8rem" }}>Metode pembayaran</h2>
              <p className="help" style={{ marginTop: "-.4rem", marginBottom: ".8rem" }}>Hanya gateway yang diaktifkan admin yang tampil.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
                <label className="opt"><input type="radio" name="pay" defaultChecked /><span className="tag tag-info" style={{ width: 42, justifyContent: "center" }}>VA</span><div><p style={{ fontWeight: 600, fontSize: ".9rem" }}>Virtual Account / QRIS</p><p className="muted" style={{ fontSize: ".78rem" }}>via Midtrans</p></div></label>
                <label className="opt"><input type="radio" name="pay" /><span className="tag" style={{ width: 42, justifyContent: "center", background: "rgb(139 92 246/.16)", color: "#8b5cf6" }}>eW</span><div><p style={{ fontWeight: 600, fontSize: ".9rem" }}>E-Wallet (OVO, Dana, ShopeePay)</p><p className="muted" style={{ fontSize: ".78rem" }}>via Xendit</p></div></label>
                <label className="opt"><input type="radio" name="pay" /><span className="tag tag-warn" style={{ width: 42, justifyContent: "center" }}>RT</span><div><p style={{ fontWeight: 600, fontSize: ".9rem" }}>Retail (Alfamart/Indomaret) / Bank</p><p className="muted" style={{ fontSize: ".78rem" }}>via Tripay</p></div></label>
                <label className="opt"><input type="radio" name="pay" data-reveal="#manualbox" /><span className="tag tag-success" style={{ width: 42, justifyContent: "center" }}><svg className="ico ico-sm"><use href="#i-wallet" /></svg></span><div><p style={{ fontWeight: 600, fontSize: ".9rem" }}>Transfer Manual</p><p className="muted" style={{ fontSize: ".78rem" }}>BSI 7001234567 a.n. Yayasan SantriKalong</p></div></label>
              </div>
              <div className="manual" id="manualbox" hidden><svg className="ico ico-lg" style={{ margin: "0 auto .5rem" }}><use href="#i-upload" /></svg><p style={{ fontSize: ".88rem" }}>Seret bukti transfer ke sini, atau <b style={{ color: "rgb(var(--brand))" }}>pilih file</b></p><p style={{ fontSize: ".76rem", marginTop: ".2rem" }}>JPG/PNG/PDF · maks 5 MB. Diverifikasi admin maks 1×24 jam.</p></div>
            </div>
          </div>

          <aside className="summary">
            <h2 style={{ fontSize: "1.15rem", marginBottom: "1rem" }}>Ringkasan</h2>
            <div className="sumrow"><span className="muted">Subtotal (2 kelas)</span><span>Rp 399.000</span></div>
            <div className="sumrow"><span className="muted">Biaya layanan</span><span>Rp 2.500</span></div>
            <div style={{ display: "flex", gap: ".5rem", margin: ".8rem 0" }}><input className="input" placeholder="Kode kupon" /><button className="btn btn-ghost btn-sm">Pakai</button></div>
            <div className="sumrow" style={{ borderTop: "1px solid rgb(var(--border))", paddingTop: ".7rem", fontWeight: 700, fontSize: "1.05rem" }}><span>Total</span><span className="price">Rp 401.500</span></div>
            <button className="btn btn-primary btn-block btn-lg" style={{ marginTop: "1rem" }}>Bayar Sekarang</button>
            <p className="center muted" style={{ fontSize: ".78rem", marginTop: ".7rem" }}><svg className="ico ico-sm" style={{ display: "inline", verticalAlign: "-3px" }}><use href="#i-shield" /></svg> Pembayaran aman &amp; terenkripsi. Invoice dikirim ke email.</p>
          </aside>
        </div>
      </main>
    </>
  );
}
