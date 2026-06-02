export default function Studio() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sb-brand"><svg className="mark" style={{ width: 30, height: 30, color: "rgb(var(--brand))" }} viewBox="0 0 40 40" fill="none"><path d="M28 6a13 13 0 1 0 6 14 10 10 0 1 1-6-14Z" fill="currentColor" /></svg>SantriKalong<span className="tag" style={{ marginLeft: "auto" }}>STUDIO</span></div>
        <nav>
          <div className="sb-group">Pengajar</div>
          <button className="sb-link active" data-view="dash" data-title="Dashboard"><svg className="ico ico-sm"><use href="#i-grid" /></svg>Dashboard</button>
          <button className="sb-link" data-view="kelas" data-title="Kelas Saya"><svg className="ico ico-sm"><use href="#i-book" /></svg>Kelas Saya</button>
          <button className="sb-link" data-view="kuis" data-title="Builder Kuis"><svg className="ico ico-sm"><use href="#i-edit" /></svg>Builder Kuis</button>
          <button className="sb-link" data-view="live" data-title="Jadwal Live"><svg className="ico ico-sm"><use href="#i-broadcast" /></svg>Jadwal Live</button>
          <div className="sb-group">Keuangan</div>
          <button className="sb-link" data-view="earn" data-title="Penghasilan & Saldo"><svg className="ico ico-sm"><use href="#i-wallet" /></svg>Penghasilan</button>
        </nav>
        <div style={{ padding: ".8rem", borderTop: "1px solid rgb(var(--border))", display: "flex", alignItems: "center", gap: ".6rem" }}><span className="avatar sm"><svg className="ico ico-sm"><use href="#i-user" /></svg></span><div style={{ fontSize: ".78rem" }}><p style={{ fontWeight: 600 }}>Ust. Abdullah, Lc.</p><p className="muted">Pengajar terverifikasi</p></div></div>
      </aside>

      <div className="main">
        <div className="topbar">
          <button className="icon-btn sb-toggle" id="sk-sb-toggle" aria-label="Menu"><svg className="ico"><use href="#i-menu" /></svg></button>
          <h1 id="sk-page-title">Dashboard</h1>
          <div style={{ marginLeft: "auto", display: "flex", gap: ".5rem" }}><button className="icon-btn" id="sk-mode-toggle" aria-label="Ganti mode"><svg className="ico" id="sk-mode-ic"><use href="#i-sun" /></svg></button><a href="/" className="btn btn-ghost btn-sm">Lihat Situs</a></div>
        </div>
        <div className="content">

          <section data-pane="dash">
            <div className="grid-4">
              <div className="stat"><p className="lbl">Total santri</p><p className="val tnum">1.240</p><p className="delta up">▲ 84 bln ini</p></div>
              <div className="stat"><p className="lbl">Pendapatan bln ini</p><p className="val tnum">Rp 8,7jt</p></div>
              <div className="stat"><p className="lbl">Rating rata-rata</p><p className="val tnum">4.9</p></div>
              <div className="stat"><p className="lbl">Kelas publish</p><p className="val tnum">3</p></div>
            </div>
            <div className="card card-pad" style={{ marginTop: "1rem" }}><p style={{ fontWeight: 600, marginBottom: ".8rem" }}>Aktivitas terbaru</p><ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: ".7rem", fontSize: ".88rem" }}><li>12 santri baru di &quot;Bahasa Arab Pemula&quot;</li><li>Ulasan baru 5.0 dari Ahmad R.</li><li>3 pertanyaan diskusi belum dijawab</li><li>Earning Rp 8,69jt tersedia untuk diklaim</li></ul></div>
          </section>

          <section data-pane="kelas" hidden>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}><h2 style={{ fontSize: "1.2rem" }}>Kelas Saya</h2><button className="btn btn-primary btn-sm"><svg className="ico ico-sm"><use href="#i-plus" /></svg>Buat Kelas</button></div>
            <div className="card card-pad" style={{ marginBottom: "1.2rem", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}><img src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=160&q=50" style={{ width: 80, height: 50, objectFit: "cover", borderRadius: "var(--r-sm)" }} alt="" /><div style={{ flex: 1, minWidth: 160 }}><p style={{ fontWeight: 600 }}>Bahasa Arab untuk Pemula</p><p className="muted" style={{ fontSize: ".8rem" }}>32 materi · 1.240 santri</p></div><span className="tag tag-success">Published</span><button className="btn btn-ghost btn-sm"><svg className="ico ico-sm"><use href="#i-edit" /></svg>Edit</button></div>
            <div className="card card-pad">
              <p style={{ fontWeight: 600, marginBottom: ".3rem" }}>Editor Kurikulum — Bab 1</p><p className="help" style={{ marginBottom: ".9rem" }}>Seret untuk mengurutkan. Klik materi untuk edit.</p>
              <div className="lessrow"><svg className="ico ico-sm drag"><use href="#i-menu" /></svg><svg className="ico ico-sm" style={{ color: "rgb(var(--brand))" }}><use href="#i-play" /></svg><span style={{ flex: 1 }}>Mengenal Huruf Hijaiyah</span><span className="tag tag-muted">Video</span><button className="icon-btn" style={{ width: 32, height: 32 }}><svg className="ico ico-sm"><use href="#i-edit" /></svg></button></div>
              <div className="lessrow"><svg className="ico ico-sm drag"><use href="#i-menu" /></svg><svg className="ico ico-sm" style={{ color: "rgb(var(--brand))" }}><use href="#i-doc" /></svg><span style={{ flex: 1 }}>Tabel Huruf &amp; Latihan</span><span className="tag tag-muted">PDF</span><button className="icon-btn" style={{ width: 32, height: 32 }}><svg className="ico ico-sm"><use href="#i-edit" /></svg></button></div>
              <div className="lessrow"><svg className="ico ico-sm drag"><use href="#i-menu" /></svg><svg className="ico ico-sm" style={{ color: "rgb(var(--brand))" }}><use href="#i-edit" /></svg><span style={{ flex: 1 }}>Kuis Bab 1</span><span className="tag tag-muted">Kuis</span><button className="icon-btn" style={{ width: 32, height: 32 }}><svg className="ico ico-sm"><use href="#i-edit" /></svg></button></div>
              <div style={{ display: "flex", gap: ".5rem", marginTop: ".6rem" }}><button className="btn btn-soft btn-sm"><svg className="ico ico-sm"><use href="#i-upload" /></svg>Upload Materi</button><button className="btn btn-ghost btn-sm"><svg className="ico ico-sm"><use href="#i-plus" /></svg>Tambah Bab</button></div>
            </div>
          </section>

          <section data-pane="kuis" hidden>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}><h2 style={{ fontSize: "1.2rem" }}>Builder Kuis — Kuis Bab 1</h2><button className="btn btn-primary btn-sm">Simpan Kuis</button></div>
            <div className="grid-2" style={{ gridTemplateColumns: "2fr 1fr" }}>
              <div>
                <div className="qcard"><div style={{ display: "flex", justifyContent: "space-between" }}><b style={{ fontSize: ".9rem" }}>Soal 1 · Pilihan Ganda</b><button className="icon-btn" style={{ width: 30, height: 30 }}><svg className="ico ico-sm"><use href="#i-trash" /></svg></button></div><input className="input" defaultValue="Huruf ث dilafalkan dengan ujung lidah menyentuh…" style={{ margin: ".6rem 0" }} /><label className="opt"><input type="radio" name="c1" />Bibir atas dan bawah</label><label className="opt" style={{ marginTop: ".4rem" }}><input type="radio" name="c1" defaultChecked />Ujung lidah &amp; gigi seri atas <span className="tag tag-success" style={{ marginLeft: "auto" }}>Benar</span></label></div>
                <button className="btn btn-soft btn-sm"><svg className="ico ico-sm"><use href="#i-plus" /></svg>Tambah Soal</button>
              </div>
              <div className="card card-pad"><p style={{ fontWeight: 600, marginBottom: ".8rem" }}>Pengaturan</p>
                <div className="field"><label className="label">Tipe soal</label><select className="select"><option>Pilihan ganda</option><option>Benar / Salah</option><option>Isian singkat</option><option>Esai (nilai manual)</option></select></div>
                <div className="field"><label className="label">Batas waktu (menit)</label><input className="input" defaultValue="15" /></div>
                <div className="field"><label className="label">Nilai lulus (KKM)</label><input className="input" defaultValue="70" /></div>
                <label className="check"><input type="checkbox" defaultChecked /> Acak urutan soal</label>
              </div>
            </div>
          </section>

          <section data-pane="live" hidden>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}><h2 style={{ fontSize: "1.2rem" }}>Jadwal Live</h2><button className="btn btn-primary btn-sm"><svg className="ico ico-sm"><use href="#i-plus" /></svg>Jadwalkan Live</button></div>
            <div className="card card-pad" style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}><div style={{ width: 50, height: 50, borderRadius: "var(--r-md)", background: "rgb(var(--live)/.14)", color: "rgb(var(--live))", display: "grid", placeItems: "center" }}><svg className="ico"><use href="#i-broadcast" /></svg></div><div style={{ flex: 1, minWidth: 160 }}><p style={{ fontWeight: 600 }}>Tanya Jawab Bab 1–2</p><p className="muted" style={{ fontSize: ".82rem" }}>Sabtu, 7 Jun 2026 · 20:00 WIB · 86 terdaftar</p></div><a href="/live" className="btn btn-primary btn-sm">Mulai Siaran</a><button className="btn btn-ghost btn-sm">Edit</button></div>
          </section>

          <section data-pane="earn" hidden>
            <div className="grid-2" style={{ gridTemplateColumns: "1.2fr 1fr" }}>
              <div className="wallet"><p className="eyebrow">Saldo tersedia</p><p style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem", fontWeight: 600, margin: ".3rem 0" }}>Rp 8.698.620</p><p className="muted" style={{ fontSize: ".84rem" }}>Tertahan (refund window): Rp 1.240.000</p><button className="btn btn-primary" data-open="#claim" style={{ marginTop: "1rem" }}>Klaim Payout</button></div>
              <div className="card card-pad"><p style={{ fontWeight: 600, marginBottom: ".6rem" }}>Rekening payout</p><p style={{ fontSize: ".9rem" }}>BSI · 700••••567</p><p className="muted" style={{ fontSize: ".82rem" }}>a.n. Abdullah</p><p className="tag tag-success" style={{ marginTop: ".6rem" }}>Terverifikasi</p><p className="help" style={{ marginTop: ".6rem" }}>Ganti rekening menahan payout 3 hari (keamanan).</p></div>
            </div>
            <div className="table-wrap" style={{ marginTop: "1.2rem" }}><table className="tbl"><thead><tr><th>Periode</th><th className="tr-num">Bruto</th><th className="tr-num">Pajak</th><th className="tr-num">Net</th><th>Status</th><th>Bukti</th></tr></thead><tbody>
              <tr><td>Jun 2026</td><td className="tr-num">Rp 12.516.000</td><td className="tr-num">−62.580</td><td className="tr-num"><b>Rp 8.698.620</b></td><td><span className="tag tag-success">Tersedia</span></td><td>—</td></tr>
              <tr><td>Mei 2026</td><td className="tr-num">Rp 9.300.000</td><td className="tr-num">−46.500</td><td className="tr-num"><b>Rp 6.461.500</b></td><td><span className="tag tag-info">Dibayar</span></td><td><button className="btn btn-ghost btn-sm"><svg className="ico ico-sm"><use href="#i-receipt" /></svg>PDF</button></td></tr>
            </tbody></table></div>
          </section>

        </div>
      </div>

      <div className="overlay" id="claim">
        <div className="modal">
          <div className="modal-head"><h3>Klaim Payout</h3><button className="icon-btn" data-close aria-label="Tutup"><svg className="ico"><use href="#i-x" /></svg></button></div>
          <div className="modal-body">
            <div className="card card-pad" style={{ marginBottom: "1rem" }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: ".92rem", marginBottom: ".4rem" }}><span className="muted">Saldo tersedia</span><b>Rp 8.698.620</b></div><div style={{ display: "flex", justifyContent: "space-between", fontSize: ".92rem" }}><span className="muted">Min. payout</span><span>Rp 50.000</span></div></div>
            <div className="field"><label className="label">Jumlah klaim</label><input className="input" defaultValue="Rp 8.698.620" /></div>
            <div className="field"><label className="label">Transfer ke</label><input className="input" defaultValue="BSI · 700••••567 a.n. Abdullah" disabled /></div>
            <p className="help">Permintaan diproses admin. Saldo ditahan sementara hingga diverifikasi (anti double-claim). Bukti pengajuan PDF otomatis dibuat.</p>
            <button className="btn btn-primary btn-block btn-lg" style={{ marginTop: "1rem" }}>Ajukan Klaim</button>
          </div>
        </div>
      </div>
    </div>
  );
}
