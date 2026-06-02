function Mark() {
  return (
    <svg className="mark" viewBox="0 0 40 40" fill="none">
      <path d="M28 6a13 13 0 1 0 6 14 10 10 0 1 1-6-14Z" fill="currentColor" />
      <circle cx="30" cy="11" r="1.6" fill="currentColor" />
    </svg>
  );
}

const Corner = ({ cls }: { cls: string }) => (
  <svg className={`corner ${cls}`} viewBox="0 0 74 74" fill="none" stroke="currentColor" strokeWidth="1.3">
    <path d="M4 70V34A30 30 0 0 1 34 4h36" /><path d="M11 70V37A26 26 0 0 1 37 11h33" />
    <circle cx="14" cy="14" r="3" fill="currentColor" stroke="none" />
  </svg>
);

export default function Sertifikat() {
  return (
    <>
      <header className="nav solid">
        <div className="container nav-in">
          <a href="/" className="brand"><Mark />SantriKalong</a>
          <nav className="nav-links"><a href="/dashboard">Belajar</a><a href="/katalog">Katalog</a><a href="/sertifikat" className="active">Sertifikat</a></nav>
          <div className="nav-right"><button className="icon-btn" id="sk-mode-toggle" aria-label="Ganti mode"><svg className="ico" id="sk-mode-ic"><use href="#i-sun" /></svg></button><a href="/profil" className="avatar sm"><svg className="ico ico-sm"><use href="#i-user" /></svg></a></div>
        </div>
      </header>

      <main className="container" style={{ paddingTop: "6rem", paddingBottom: "3rem", maxWidth: 940 }}>
        <div className="breadcrumb" style={{ paddingTop: 0 }}><a href="/dashboard">Dashboard</a> / <span>Sertifikat</span></div>
        <h1 style={{ fontSize: "clamp(1.6rem,3.5vw,2.2rem)", margin: ".4rem 0 1.4rem" }}>Sertifikat Penyelesaian</h1>

        <div className="cert-shell">
          <div className="cert">
            <div className="pattern" />
            <div className="frame" />
            <Corner cls="tl" /><Corner cls="tr" /><Corner cls="bl" /><Corner cls="br" />

            <div className="inner">
              <div className="cert-brand"><Mark />SantriKalong</div>
              <p className="arabic">وَقُل رَّبِّ زِدْنِي عِلْمًا</p>
              <p className="eyebrow">Sertifikat Penyelesaian</p>
              <p className="sub">Dengan bangga diberikan kepada</p>
              <p className="recipient">Ahmad Ramadhan</p>
              <div className="fl"><span className="dia" /></div>
              <p className="sub">telah menyelesaikan dengan baik kelas</p>
              <p className="course">Fiqih Thaharah untuk Sehari-hari</p>
              <p className="sub">12 jam pembelajaran · Nilai akhir 92 · Predikat <b style={{ color: "rgb(var(--brand))" }}>Mumtaz</b></p>
            </div>

            <div className="foot">
              <div className="sign"><div className="nm">Ust. Yusuf</div>Pengajar</div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".3rem" }}>
                <div className="seal">
                  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "100%", height: "100%" }}><rect x="22" y="22" width="56" height="56" rx="4" /><rect x="22" y="22" width="56" height="56" rx="4" transform="rotate(45 50 50)" /><circle cx="50" cy="50" r="24" /></svg>
                  <svg viewBox="0 0 24 24" style={{ position: "absolute", width: 26, height: 26, color: "rgb(var(--brand))" }}><path d="M28 6a13 13 0 1 0 6 14 10 10 0 1 1-6-14Z" fill="currentColor" transform="scale(.6) translate(4 4)" /></svg>
                </div>
                <span style={{ fontSize: ".55rem", letterSpacing: ".14em", fontWeight: 700, color: "rgb(var(--brand))" }}>TERVERIFIKASI</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="qrchip" style={{ marginLeft: "auto" }}><img alt="QR verifikasi" src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&margin=0&data=https://santrikalong.com/verify/8F2A-9C71-KL30" /></div>
                <p className="qmeta">No. SK-2026-00412<b>8F2A-9C71-KL30</b></p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: ".6rem", marginTop: "1.3rem", flexWrap: "wrap", justifyContent: "center" }}>
          <button className="btn btn-primary"><svg className="ico ico-sm"><use href="#i-receipt" /></svg>Unduh PDF</button>
          <button className="btn btn-ghost"><svg className="ico ico-sm"><use href="#i-arrow" /></svg>Bagikan</button>
        </div>

        <div className="card card-pad" style={{ marginTop: "2rem", maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
          <h2 style={{ fontSize: "1.15rem", display: "flex", alignItems: "center", gap: ".5rem" }}><svg className="ico" style={{ color: "rgb(var(--brand))" }}><use href="#i-shield" /></svg>Verifikasi Keaslian</h2>
          <p className="muted" style={{ fontSize: ".88rem", margin: ".4rem 0 .9rem" }}>Masukkan kode verifikasi untuk memastikan sertifikat asli — data diambil langsung dari server (anti-pemalsuan).</p>
          <div style={{ display: "flex", gap: ".5rem" }}><input className="input" defaultValue="8F2A-9C71-KL30" /><button className="btn btn-primary">Verifikasi</button></div>
          <div className="card card-pad" style={{ marginTop: "1rem", background: "rgb(var(--success)/.08)", borderColor: "rgb(var(--success)/.3)" }}><p style={{ display: "flex", alignItems: "center", gap: ".5rem", fontWeight: 600, color: "rgb(var(--success))" }}><svg className="ico ico-sm"><use href="#i-check" /></svg>Sertifikat ASLI &amp; terverifikasi</p><p className="muted" style={{ fontSize: ".85rem", marginTop: ".3rem" }}>Ahmad Ramadhan · Fiqih Thaharah · diterbitkan 28 Mei 2026.</p></div>
        </div>
      </main>
    </>
  );
}
