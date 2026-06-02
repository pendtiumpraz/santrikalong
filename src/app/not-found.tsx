export default function NotFound() {
  return (
    <div className="sys-wrap">
      <div className="sys-halo" />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 440 }}>
        <svg className="sys-lan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><use href="#i-lantern" /></svg>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "4rem", color: "rgb(var(--brand))", lineHeight: 1 }}>404</p>
        <h1 style={{ fontSize: "1.6rem", marginTop: ".5rem" }}>Halaman tak ditemukan</h1>
        <p className="muted" style={{ marginTop: ".6rem" }}>Mungkin pelitanya padam di lorong ini. Mari kembali ke jalan yang terang.</p>
        <div style={{ display: "flex", gap: ".6rem", justifyContent: "center", marginTop: "1.4rem", flexWrap: "wrap" }}>
          <a href="/" className="btn btn-primary">Kembali ke Beranda</a>
          <a href="/katalog" className="btn btn-ghost">Jelajahi Katalog</a>
        </div>
      </div>
    </div>
  );
}
