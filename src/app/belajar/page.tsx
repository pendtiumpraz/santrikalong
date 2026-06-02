export default function Belajar() {
  return (
    <>
      <div className="lbar">
        <a href="/dashboard" className="icon-btn" aria-label="Kembali"><svg className="ico"><use href="#i-arrow-l" /></svg></a>
        <span className="ttl">Bahasa Arab untuk Pemula</span>
        <div className="lprog" style={{ marginLeft: "auto" }}><div className="bar"><i style={{ width: "38%" }} /></div><span>38% selesai</span></div>
        <button className="icon-btn" id="sk-mode-toggle" aria-label="Ganti mode"><svg className="ico" id="sk-mode-ic"><use href="#i-sun" /></svg></button>
      </div>

      <div className="learn-grid">
        <main>
          <div className="player">
            <img src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1000&q=55" alt="" />
            <button className="pbtn"><svg className="ico ico-lg"><use href="#i-play" /></svg></button>
          </div>
          <div className="lhead">
            <div><h1 style={{ fontSize: "1.2rem" }}>Bab 1 · Materi 1 — Mengenal Huruf Hijaiyah</h1><p className="muted" style={{ fontSize: ".82rem", marginTop: ".2rem" }}>Durasi 12:30 · Ust. Abdullah, Lc.</p></div>
            <div style={{ display: "flex", gap: ".5rem" }}>
              <button className="btn btn-ghost btn-sm"><svg className="ico ico-sm"><use href="#i-arrow-l" /></svg>Sebelumnya</button>
              <button className="btn btn-primary btn-sm">Tandai Selesai <svg className="ico ico-sm"><use href="#i-check" /></svg></button>
              <button className="btn btn-ghost btn-sm">Berikutnya <svg className="ico ico-sm"><use href="#i-arrow" /></svg></button>
            </div>
          </div>

          <div className="lbody" data-tabgroup>
            <div className="tabs" style={{ marginBottom: "1.3rem" }}>
              <button data-tab="materi" aria-pressed="true">Materi Pendukung</button>
              <button data-tab="kuis">Kuis</button>
              <button data-tab="catatan">Catatan</button>
              <button data-tab="diskusi">Diskusi</button>
            </div>

            <div data-panel="materi">
              <div className="docview">
                <div className="vt"><span style={{ display: "flex", alignItems: "center", gap: ".5rem" }}><svg className="ico ico-sm"><use href="#i-doc" /></svg>Tabel Huruf &amp; Latihan Tulis.pdf</span><span className="muted" style={{ display: "flex", gap: ".8rem", alignItems: "center" }}><span>100%</span><button className="btn btn-ghost btn-sm">Unduh</button></span></div>
                <div className="vp">[ Tampilan PDF inline — pdf.js ]</div>
              </div>
              <div className="grid-2" style={{ marginTop: "1rem" }}>
                <div className="card card-pad" style={{ display: "flex", alignItems: "center", gap: ".8rem" }}><svg className="ico ico-lg" style={{ color: "rgb(var(--brand))" }}><use href="#i-headphones" /></svg><div style={{ flex: 1 }}><p style={{ fontWeight: 600, fontSize: ".9rem" }}>Audio Makhraj.mp3</p><p className="muted" style={{ fontSize: ".78rem" }}>08:10</p></div><button className="btn btn-soft btn-sm">Putar</button></div>
                <div className="card card-pad" style={{ display: "flex", alignItems: "center", gap: ".8rem" }}><svg className="ico ico-lg" style={{ color: "rgb(var(--brand))" }}><use href="#i-layers" /></svg><div style={{ flex: 1 }}><p style={{ fontWeight: 600, fontSize: ".9rem" }}>Slide Ringkasan (HTML)</p><p className="muted" style={{ fontSize: ".78rem" }}>Reveal.js · 14 slide</p></div><button className="btn btn-soft btn-sm">Buka</button></div>
              </div>
            </div>

            <div data-panel="kuis" hidden>
              <div className="card card-pad">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}><h3 style={{ fontFamily: "var(--font-display)" }}>Kuis Bab 1</h3><span className="muted" style={{ fontSize: ".82rem" }}>Soal 3 dari 10 · 04:21</span></div>
                <div className="bar" style={{ marginBottom: "1.3rem" }}><i style={{ width: "30%" }} /></div>
                <p style={{ fontWeight: 600, marginBottom: "1rem" }}>Huruf <span style={{ fontSize: "1.5rem" }}>ث</span> dilafalkan dengan ujung lidah menyentuh…</p>
                <label className="qopt"><input type="radio" name="q" />Bibir atas dan bawah</label>
                <label className="qopt"><input type="radio" name="q" />Ujung lidah &amp; ujung gigi seri atas</label>
                <label className="qopt"><input type="radio" name="q" />Pangkal tenggorokan</label>
                <label className="qopt"><input type="radio" name="q" />Tengah lidah &amp; langit-langit</label>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}><button className="btn btn-ghost btn-sm">Sebelumnya</button><button className="btn btn-primary btn-sm">Soal Berikutnya</button></div>
              </div>
            </div>

            <div data-panel="catatan" hidden>
              <textarea className="textarea" placeholder="Tulis catatan pribadimu untuk materi ini…" style={{ minHeight: "160px" }} />
              <button className="btn btn-primary btn-sm" style={{ marginTop: ".6rem" }}>Simpan Catatan</button>
            </div>

            <div data-panel="diskusi" hidden>
              <div className="card card-pad" style={{ marginBottom: ".8rem" }}>
                <div style={{ display: "flex", gap: ".7rem" }}><span className="avatar sm"><svg className="ico ico-sm"><use href="#i-user" /></svg></span><div><p style={{ fontWeight: 600, fontSize: ".88rem" }}>Ahmad R. <span className="muted" style={{ fontWeight: 400 }}>· 2 hari lalu</span></p><p className="muted" style={{ fontSize: ".9rem", marginTop: ".2rem" }}>Ustadz, apakah ث dan س pelafalannya beda jauh?</p></div></div>
                <div style={{ display: "flex", gap: ".7rem", marginTop: ".8rem", marginLeft: "2.5rem" }}><span className="avatar sm"><svg className="ico ico-sm"><use href="#i-user" /></svg></span><div><p style={{ fontWeight: 600, fontSize: ".88rem" }}>Ust. Abdullah <span className="tag" style={{ marginLeft: ".3rem" }}>Pengajar</span></p><p className="muted" style={{ fontSize: ".9rem", marginTop: ".2rem" }}>Beda, akhi. ث keluar dari ujung lidah &amp; gigi; س dari ujung lidah dekat gigi bawah.</p></div></div>
              </div>
              <div style={{ display: "flex", gap: ".5rem" }}><input className="input" placeholder="Tanyakan sesuatu…" /><button className="btn btn-primary btn-sm">Kirim</button></div>
            </div>
          </div>
        </main>

        <aside className="side">
          <div style={{ padding: ".9rem 1.1rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgb(var(--border))" }}><b>Konten Kelas</b><span className="muted" style={{ fontSize: ".78rem" }}>12 / 32</span></div>
          <div className="grp">Bab 1 — Pengenalan Huruf</div>
          <div className="lesson active"><svg className="ico ico-sm st"><use href="#i-play" /></svg><span className="t">Mengenal Huruf Hijaiyah</span><span className="meta">12:30</span></div>
          <div className="lesson"><svg className="ico ico-sm st done"><use href="#i-check" /></svg><span className="t">Tabel Huruf (PDF)</span><svg className="ico ico-sm meta"><use href="#i-doc" /></svg></div>
          <div className="lesson"><svg className="ico ico-sm st done"><use href="#i-check" /></svg><span className="t">Pelafalan Makhraj</span><svg className="ico ico-sm meta"><use href="#i-headphones" /></svg></div>
          <div className="lesson"><span className="st" style={{ width: 16, textAlign: "center" }}>○</span><span className="t">Slide Ringkasan Bab</span><svg className="ico ico-sm meta"><use href="#i-layers" /></svg></div>
          <div className="lesson"><span className="st" style={{ width: 16, textAlign: "center" }}>○</span><span className="t">Kuis Bab 1</span><svg className="ico ico-sm meta"><use href="#i-edit" /></svg></div>
          <div className="grp">Bab 2 — Isim, Fi&apos;il, Harf</div>
          <div className="lesson"><span className="st" style={{ width: 16, textAlign: "center" }}>○</span><span className="t">Apa itu Isim?</span><span className="meta">10:05</span></div>
          <div className="lesson"><span className="st" style={{ width: 16, textAlign: "center" }}>○</span><span className="t">Mengenal Fi&apos;il</span><span className="meta">11:20</span></div>
          <div style={{ margin: "1.1rem", padding: "1rem", borderRadius: "var(--r-md)", background: "rgb(var(--live)/.1)", border: "1px solid rgb(var(--live)/.25)" }}>
            <p className="tag tag-live" style={{ background: "none", padding: 0 }}><span className="dot" />SESI LIVE BERIKUTNYA</p>
            <p style={{ fontWeight: 600, marginTop: ".4rem" }}>Tanya Jawab Bab 1–2</p>
            <p className="muted" style={{ fontSize: ".8rem" }}>Sabtu, 7 Jun 2026 · 20:00 WIB</p>
            <a href="/live" className="btn btn-soft btn-sm btn-block" style={{ marginTop: ".6rem" }}>Ingatkan Saya</a>
          </div>
        </aside>
      </div>
    </>
  );
}
