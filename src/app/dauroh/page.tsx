function Mark() {
  return (
    <svg className="mark" viewBox="0 0 40 40" fill="none">
      <path d="M28 6a13 13 0 1 0 6 14 10 10 0 1 1-6-14Z" fill="currentColor" />
      <circle cx="30" cy="11" r="1.6" fill="currentColor" />
    </svg>
  );
}

const AGENDA = [
  { d: "15", w: "Sab", t: "Sesi 1 — Makkah sebelum kenabian", s: "Kondisi jazirah Arab, kelahiran & masa muda Nabi ﷺ. 20:00–21:30 WIB." },
  { d: "16", w: "Ahad", t: "Sesi 2 — Wahyu pertama & dakwah sirriyah", s: "Turunnya wahyu, dakwah sembunyi-sembunyi, generasi pertama. 20:00–21:30 WIB." },
  { d: "17", w: "Sen", t: "Sesi 3 — Dakwah terbuka & tanya jawab", s: "Ujian dakwah, hijrah Habasyah, sesi tanya jawab terbuka. 20:00–21:30 WIB." },
];

export default function Dauroh() {
  return (
    <>
      <header className="nav solid">
        <div className="container nav-in">
          <a href="/" className="brand"><Mark />SantriKalong</a>
          <nav className="nav-links"><a href="/katalog">Katalog</a><a href="/dauroh" className="active">Dauroh</a><a href="/live">Live Kelas</a><a href="/studio">Jadi Pengajar</a></nav>
          <div className="nav-right">
            <button className="icon-btn" id="sk-mode-toggle" aria-label="Ganti mode"><svg className="ico" id="sk-mode-ic"><use href="#i-sun" /></svg></button>
            <a href="/checkout" className="icon-btn cart-btn" aria-label="Keranjang"><svg className="ico"><use href="#i-cart" /></svg><span className="cart-badge">2</span></a>
            <a href="/dashboard" className="btn btn-ghost btn-sm hide-sm">Dashboard</a>
          </div>
        </div>
      </header>

      <div className="breadcrumb container"><a href="/katalog">Katalog</a> / <span>Dauroh</span> / <span style={{ color: "rgb(var(--text))" }}>Sirah Nabawiyah</span></div>
      <div className="container" style={{ paddingTop: ".8rem" }}>
        <div style={{ display: "flex", gap: ".5rem", marginBottom: ".7rem" }}><span className="tag tag-info">Dauroh Online</span><span className="tag tag-warn">Kuota terbatas</span></div>
        <h1 style={{ fontSize: "clamp(1.8rem,4vw,2.6rem)" }}>Dauroh Online: Mengenal Sirah Nabawiyah</h1>
        <p className="muted" style={{ marginTop: ".5rem", maxWidth: 640 }}>Program intensif 3 malam mengupas perjalanan hidup Rasulullah ﷺ secara runtut, langsung bersama pemateri, plus rekaman &amp; e-modul.</p>
        <div className="cmeta" style={{ marginTop: ".9rem", fontSize: ".85rem" }}><span><svg className="ico ico-sm"><use href="#i-clock" /></svg>15–17 Juni 2026</span><span><svg className="ico ico-sm"><use href="#i-broadcast" /></svg>3 sesi live</span><span><svg className="ico ico-sm"><use href="#i-users" /></svg>Kuota 200</span><span><svg className="ico ico-sm"><use href="#i-award" /></svg>Bersertifikat</span></div>
      </div>

      <main className="sec container">
        <div className="detail">
          <div>
            <div className="dau-banner"><img src="https://images.unsplash.com/photo-1564769662533-4f00a87b4056?auto=format&fit=crop&w=1100&q=55" alt="Masjid dengan menara di waktu senja" /></div>

            <h2 style={{ marginTop: "2rem", fontSize: "1.4rem" }}>Tentang Dauroh</h2>
            <p className="muted" style={{ marginTop: ".8rem", lineHeight: 1.7 }}>Dauroh ini dirancang untuk peserta yang ingin memahami sirah Nabawiyah secara terstruktur dalam waktu singkat. Setiap sesi live 90 menit, dibimbing langsung oleh pemateri, dan diakhiri tanya jawab. Tidak bisa hadir live? Semua sesi direkam dan bisa ditonton ulang kapan saja.</p>

            <h2 style={{ marginTop: "2.2rem", fontSize: "1.4rem" }}>Agenda</h2>
            <div className="agenda">
              {AGENDA.map((a) => (
                <div className="agenda-item" key={a.d}>
                  <div className="day"><b>{a.d}</b><span>{a.w}</span></div>
                  <div className="ses"><h4>{a.t}</h4><p>{a.s}</p></div>
                </div>
              ))}
            </div>

            <h2 style={{ marginTop: "2.2rem", fontSize: "1.4rem" }}>Pemateri</h2>
            <div className="card card-pad" style={{ marginTop: "1rem", display: "flex", gap: "1.1rem", flexWrap: "wrap" }}>
              <span className="avatar" style={{ width: 72, height: 72 }}><svg className="ico ico-lg"><use href="#i-user" /></svg></span>
              <div style={{ flex: 1, minWidth: 220 }}>
                <p style={{ fontWeight: 600, fontSize: "1.05rem" }}>Ust. Hamzah Abdul Karim, M.A.</p>
                <p className="muted" style={{ fontSize: ".84rem" }}>Lulusan Universitas Madinah · Spesialisasi Sirah &amp; Hadits</p>
                <p className="muted" style={{ fontSize: ".9rem", marginTop: ".7rem" }}>Telah mengisi puluhan dauroh sirah di berbagai kota, dengan gaya penyampaian yang runtut dan mudah diikuti.</p>
              </div>
            </div>

            <h2 style={{ marginTop: "2.2rem", fontSize: "1.4rem" }}>Yang kamu dapatkan</h2>
            <ul className="learn" style={{ marginTop: "1rem" }}>
              <li><svg className="ico ico-sm"><use href="#i-broadcast" /></svg>3 sesi live interaktif + tanya jawab</li>
              <li><svg className="ico ico-sm"><use href="#i-play" /></svg>Rekaman semua sesi (akses selamanya)</li>
              <li><svg className="ico ico-sm"><use href="#i-doc" /></svg>E-modul ringkasan sirah (PDF)</li>
              <li><svg className="ico ico-sm"><use href="#i-users" /></svg>Grup diskusi peserta</li>
              <li><svg className="ico ico-sm"><use href="#i-award" /></svg>Sertifikat penyelesaian</li>
              <li><svg className="ico ico-sm"><use href="#i-check" /></svg>Tugas &amp; kuis ringan tiap sesi</li>
            </ul>
          </div>

          <aside>
            <div className="buybox">
              <div className="top"><img src="https://images.unsplash.com/photo-1564769662533-4f00a87b4056?auto=format&fit=crop&w=700&q=55" alt="" /></div>
              <div className="pad">
                <div style={{ display: "flex", alignItems: "baseline", gap: ".5rem" }}><span className="price" style={{ fontSize: "1.8rem" }}>Rp 99.000</span><s className="muted" style={{ fontSize: ".9rem" }}>Rp 200.000</s></div>
                <p className="tag tag-warn" style={{ marginTop: ".6rem" }}>Pendaftaran ditutup 3 hari lagi</p>

                <div className="seats">
                  <div className="row"><span>142 / 200 kursi terisi</span><span>tersisa 58</span></div>
                  <div className="bar"><i style={{ width: "71%" }} /></div>
                </div>

                <button className="btn btn-primary btn-block btn-lg" data-open="#daftar">Daftar Sekarang</button>
                <a href="/checkout" className="btn btn-ghost btn-block" style={{ marginTop: ".6rem" }}><svg className="ico ico-sm"><use href="#i-cart" /></svg>Tambah ke Keranjang</a>

                <div style={{ marginTop: "1.1rem" }}>
                  <div className="kv"><svg className="ico ico-sm"><use href="#i-clock" /></svg>Mulai<b style={{ color: "rgb(var(--text))" }}>Sab, 15 Jun · 20:00</b></div>
                  <div className="kv"><svg className="ico ico-sm"><use href="#i-broadcast" /></svg>Format<b style={{ color: "rgb(var(--text))" }}>Live + Rekaman</b></div>
                  <div className="kv"><svg className="ico ico-sm"><use href="#i-award" /></svg>Sertifikat<b style={{ color: "rgb(var(--text))" }}>Ya</b></div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <div className="overlay" id="daftar">
        <div className="modal">
          <div className="modal-head"><h3>Daftar Dauroh</h3><button className="icon-btn" data-close aria-label="Tutup"><svg className="ico"><use href="#i-x" /></svg></button></div>
          <div className="modal-body">
            <div className="card card-pad" style={{ marginBottom: "1.1rem" }}>
              <p style={{ fontWeight: 600 }}>Dauroh: Mengenal Sirah Nabawiyah</p>
              <p className="muted" style={{ fontSize: ".84rem", marginTop: ".2rem" }}>15–17 Juni 2026 · 3 sesi live · bersertifikat</p>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: ".7rem", fontWeight: 700 }}><span>Total</span><span className="price" style={{ fontSize: "1.1rem" }}>Rp 99.000</span></div>
            </div>
            <p className="label">Metode pembayaran</p>
            <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
              <label className="opt"><input type="radio" name="pay" defaultChecked /><span className="tag tag-info" style={{ width: 40, justifyContent: "center" }}>VA</span><div><p style={{ fontWeight: 600, fontSize: ".9rem" }}>Virtual Account / QRIS</p><p className="muted" style={{ fontSize: ".78rem" }}>via Midtrans</p></div></label>
              <label className="opt"><input type="radio" name="pay" /><span className="tag tag-warn" style={{ width: 40, justifyContent: "center" }}>RT</span><div><p style={{ fontWeight: 600, fontSize: ".9rem" }}>Retail / Bank lain</p><p className="muted" style={{ fontSize: ".78rem" }}>via Tripay</p></div></label>
            </div>
            <button className="btn btn-primary btn-block btn-lg" style={{ marginTop: "1.2rem" }}>Bayar &amp; Daftar</button>
            <p className="center muted" style={{ fontSize: ".78rem", marginTop: ".7rem" }}>Tautan grup &amp; ruang live dikirim ke email setelah pembayaran.</p>
          </div>
        </div>
      </div>
    </>
  );
}
