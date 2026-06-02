function Mark() {
  return (
    <svg className="mark" viewBox="0 0 40 40" fill="none">
      <path d="M28 6a13 13 0 1 0 6 14 10 10 0 1 1-6-14Z" fill="currentColor" />
      <circle cx="30" cy="11" r="1.6" fill="currentColor" />
    </svg>
  );
}

export default function Dashboard() {
  return (
    <>
      <header className="nav solid">
        <div className="container nav-in">
          <a href="/" className="brand"><Mark />SantriKalong</a>
          <nav className="nav-links"><a href="/dashboard" className="active">Belajar</a><a href="/katalog">Katalog</a><a href="/live">Live</a><a href="/sertifikat">Sertifikat</a></nav>
          <div className="nav-right">
            <button className="icon-btn" id="sk-mode-toggle" aria-label="Ganti mode"><svg className="ico" id="sk-mode-ic"><use href="#i-sun" /></svg></button>
            <a href="#" className="icon-btn" aria-label="Notifikasi"><svg className="ico"><use href="#i-bell" /></svg></a>
            <a href="/profil" className="avatar sm" aria-label="Profil"><svg className="ico ico-sm"><use href="#i-user" /></svg></a>
          </div>
        </div>
      </header>

      <main className="container" style={{ paddingTop: "6rem", paddingBottom: "3rem" }}>
        <p className="eyebrow">Assalamu&apos;alaikum</p>
        <h1 style={{ fontSize: "clamp(1.7rem,4vw,2.3rem)", marginTop: ".3rem" }}>Selamat datang kembali, Ahmad</h1>

        <div className="resume" style={{ marginTop: "1.6rem" }}>
          <div className="rimg"><img src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=500&q=55" alt="" /></div>
          <div className="rb">
            <p className="eyebrow">Lanjutkan belajar</p>
            <h2 style={{ fontSize: "1.4rem", marginTop: ".3rem" }}>Bahasa Arab untuk Pemula — Dasar Nahwu</h2>
            <p className="muted" style={{ fontSize: ".88rem", marginTop: ".3rem" }}>Berikutnya: Bab 1 · Materi 4 — Slide Ringkasan Bab</p>
            <div className="bar" style={{ marginTop: "1rem", maxWidth: 360 }}><i style={{ width: "38%" }} /></div>
            <p className="muted" style={{ fontSize: ".8rem", marginTop: ".4rem" }}>12 dari 32 materi · 38%</p>
            <a href="/belajar" className="btn btn-primary" style={{ marginTop: "1rem" }}>Lanjutkan <svg className="ico ico-sm"><use href="#i-play" /></svg></a>
          </div>
        </div>

        <div className="grid-4" style={{ marginTop: "1.5rem" }}>
          <div className="stat"><p className="lbl">Kelas aktif</p><p className="val tnum">4</p></div>
          <div className="stat"><p className="lbl">Selesai</p><p className="val tnum">2</p></div>
          <div className="stat"><p className="lbl">Sertifikat</p><p className="val tnum">2</p></div>
          <div className="stat"><p className="lbl">Jam belajar</p><p className="val tnum">26</p></div>
        </div>

        <div className="sec-head" style={{ marginTop: "2.4rem" }}><h2>Kelas saya</h2><a href="/katalog">Cari kelas lain <svg className="ico ico-sm"><use href="#i-arrow" /></svg></a></div>
        <div className="grid-c">
          <article className="mycard"><div className="th"><img src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=600&q=55" alt="" /></div><div className="b"><h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem" }}>Bahasa Arab untuk Pemula</h3><div className="bar" style={{ margin: ".7rem 0 .4rem" }}><i style={{ width: "38%" }} /></div><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span className="muted" style={{ fontSize: ".8rem" }}>38%</span><a href="/belajar" className="btn btn-soft btn-sm">Lanjut</a></div></div></article>
          <article className="mycard"><div className="th"><img src="https://images.unsplash.com/photo-1616422840391-fa670d4b2ae7?auto=format&fit=crop&w=600&q=55" alt="" /></div><div className="b"><h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem" }}>Tahsin Al-Qur&apos;an Tilawati</h3><div className="bar" style={{ margin: ".7rem 0 .4rem" }}><i style={{ width: "70%" }} /></div><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span className="muted" style={{ fontSize: ".8rem" }}>70%</span><a href="/belajar" className="btn btn-soft btn-sm">Lanjut</a></div></div></article>
          <article className="mycard"><div className="th"><img src="https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=600&q=55" alt="" /></div><div className="b"><h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem" }}>Fiqih Thaharah</h3><div className="bar" style={{ margin: ".7rem 0 .4rem" }}><i style={{ width: "100%" }} /></div><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span className="tag tag-success">Selesai</span><a href="/sertifikat" className="btn btn-soft btn-sm">Sertifikat</a></div></div></article>
        </div>

        <div className="sec-head" style={{ marginTop: "2.4rem" }}><h2>Live mendatang</h2></div>
        <div className="card card-pad" style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ width: 52, height: 52, borderRadius: "var(--r-md)", background: "rgb(var(--live)/.14)", color: "rgb(var(--live))", display: "grid", placeItems: "center" }}><svg className="ico"><use href="#i-broadcast" /></svg></div>
          <div style={{ flex: 1, minWidth: 180 }}><p style={{ fontWeight: 600 }}>Tanya Jawab Bab 1–2 — Bahasa Arab</p><p className="muted" style={{ fontSize: ".84rem" }}>Sabtu, 7 Jun 2026 · 20:00 WIB · Ust. Abdullah</p></div>
          <a href="/live" className="btn btn-soft btn-sm">Ingatkan Saya</a>
        </div>
      </main>
    </>
  );
}
