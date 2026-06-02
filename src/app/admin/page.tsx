function Toggle({ on }: { on?: boolean }) {
  return <label className="switch-toggle"><input type="checkbox" defaultChecked={on} /><span className="sl" /></label>;
}

export default function Admin() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sb-brand"><svg className="mark" style={{ width: 30, height: 30, color: "rgb(var(--brand))" }} viewBox="0 0 40 40" fill="none"><path d="M28 6a13 13 0 1 0 6 14 10 10 0 1 1-6-14Z" fill="currentColor" /></svg>SantriKalong<span className="tag tag-warn" style={{ marginLeft: "auto" }}>ADMIN</span></div>
        <nav>
          <div className="sb-group">Umum</div>
          <button className="sb-link active" data-view="dash" data-title="Dashboard"><svg className="ico ico-sm"><use href="#i-grid" /></svg>Dashboard</button>
          <button className="sb-link" data-view="konten" data-title="Kelas & Konten"><svg className="ico ico-sm"><use href="#i-book" /></svg>Kelas &amp; Konten</button>
          <div className="sb-group">Pengguna</div>
          <button className="sb-link" data-view="approval" data-title="Persetujuan Ustadz"><svg className="ico ico-sm"><use href="#i-check" /></svg>Approval Ustadz<span className="badge">3</span></button>
          <button className="sb-link" data-view="rbac" data-title="RBAC & Roles"><svg className="ico ico-sm"><use href="#i-shield" /></svg>RBAC &amp; Roles</button>
          <button className="sb-link" data-view="marketing" data-title="Kontak Marketing"><svg className="ico ico-sm"><use href="#i-users" /></svg>Kontak Marketing</button>
          <div className="sb-group">Keuangan</div>
          <button className="sb-link" data-view="gateway" data-title="Gateway Pembayaran"><svg className="ico ico-sm"><use href="#i-card" /></svg>Gateway Pembayaran</button>
          <button className="sb-link" data-view="payroll" data-title="Penggajian Ustadz"><svg className="ico ico-sm"><use href="#i-wallet" /></svg>Penggajian Ustadz</button>
          <button className="sb-link" data-view="tax" data-title="Pengaturan Pajak"><svg className="ico ico-sm"><use href="#i-receipt" /></svg>Pengaturan Pajak</button>
          <button className="sb-link" data-view="trx" data-title="Transaksi"><svg className="ico ico-sm"><use href="#i-chart" /></svg>Transaksi</button>
          <div className="sb-group">Sistem</div>
          <button className="sb-link" data-view="audit" data-title="Audit Log"><svg className="ico ico-sm"><use href="#i-lock" /></svg>Audit Log</button>
        </nav>
        <div style={{ padding: ".8rem", borderTop: "1px solid rgb(var(--border))", display: "flex", alignItems: "center", gap: ".6rem" }}><span className="avatar sm"><svg className="ico ico-sm"><use href="#i-user" /></svg></span><div style={{ fontSize: ".78rem" }}><p style={{ fontWeight: 600 }}>Superadmin</p><p className="muted">admin@santrikalong.com</p></div></div>
      </aside>

      <div className="main">
        <div className="topbar">
          <button className="icon-btn sb-toggle" id="sk-sb-toggle" aria-label="Menu"><svg className="ico"><use href="#i-menu" /></svg></button>
          <h1 id="sk-page-title">Dashboard</h1>
          <div style={{ marginLeft: "auto", display: "flex", gap: ".5rem" }}><button className="icon-btn" id="sk-mode-toggle" aria-label="Ganti mode"><svg className="ico" id="sk-mode-ic"><use href="#i-sun" /></svg></button><button className="icon-btn" aria-label="Notifikasi"><svg className="ico"><use href="#i-bell" /></svg></button><a href="/" className="btn btn-ghost btn-sm">Lihat Situs</a></div>
        </div>
        <div className="content">

          <section data-pane="dash">
            <div className="grid-4">
              <div className="stat"><p className="lbl">Pendapatan bln ini</p><p className="val tnum">Rp 48,2jt</p><p className="delta up">▲ 12%</p></div>
              <div className="stat"><p className="lbl">Santri aktif</p><p className="val tnum">8.512</p><p className="delta up">▲ 240 baru</p></div>
              <div className="stat"><p className="lbl">Ustadz aktif</p><p className="val tnum">35</p><p className="delta" style={{ color: "rgb(var(--warning))" }}>3 pending</p></div>
              <div className="stat"><p className="lbl">Saldo payout</p><p className="val tnum">Rp 21,7jt</p><p className="delta muted">belum diklaim</p></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", marginTop: "1rem" }}>
              <div className="card card-pad"><p style={{ fontWeight: 600, marginBottom: "1rem" }}>Grafik Penjualan</p><div className="chart"><i style={{ height: "40%" }} /><i style={{ height: "65%" }} /><i style={{ height: "50%" }} /><i style={{ height: "80%" }} /><i style={{ height: "70%" }} /><i style={{ height: "95%" }} /></div></div>
              <div className="card card-pad"><p style={{ fontWeight: 600, marginBottom: ".8rem" }}>Perlu Tindakan</p><ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: ".7rem", fontSize: ".88rem" }}><li>3 pendaftaran ustadz menunggu</li><li>4 klaim payout menunggu</li><li>2 bukti transfer manual</li><li>Rekonsiliasi payout: OK</li></ul></div>
            </div>
          </section>

          <section data-pane="konten" hidden>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
              <div className="seg"><button aria-pressed="true">Semua</button><button>Menunggu Review (2)</button><button>Published</button><button>Diarsip</button></div>
            </div>
            <div className="card card-pad" style={{ marginBottom: "1rem", background: "rgb(var(--warning)/.08)", borderColor: "rgb(var(--warning)/.3)" }}><p style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: ".5rem" }}><svg className="ico ico-sm" style={{ color: "rgb(var(--warning))" }}><use href="#i-flag" /></svg>2 kelas menunggu review sebelum dipublikasikan</p></div>
            <div className="table-wrap"><table className="tbl"><thead><tr><th>Kelas</th><th>Ustadz</th><th>Kategori</th><th>Tipe</th><th className="tr-num">Santri</th><th>Status</th><th>Aksi</th></tr></thead><tbody>
              <tr><td><b>Manhaj Salaf untuk Pemula</b></td><td>Ust. Bilal</td><td>Aqidah</td><td>Rekaman</td><td className="tr-num">—</td><td><span className="tag tag-warn">Menunggu Review</span></td><td><div style={{ display: "flex", gap: ".4rem" }}><button className="btn btn-primary btn-sm">Tinjau</button><button className="btn btn-ghost btn-sm">Pratinjau</button></div></td></tr>
              <tr><td><b>Dauroh: Adab Penuntut Ilmu</b></td><td>Ust. Hamzah</td><td>Dauroh</td><td>Live</td><td className="tr-num">—</td><td><span className="tag tag-warn">Menunggu Review</span></td><td><div style={{ display: "flex", gap: ".4rem" }}><button className="btn btn-primary btn-sm">Tinjau</button><button className="btn btn-ghost btn-sm">Pratinjau</button></div></td></tr>
              <tr><td><b>Bahasa Arab untuk Pemula</b></td><td>Ust. Abdullah</td><td>Bahasa Arab</td><td>Rekaman</td><td className="tr-num">1.240</td><td><span className="tag tag-success">Published</span></td><td><div style={{ display: "flex", gap: ".4rem" }}><button className="btn btn-ghost btn-sm">Detail</button><button className="btn btn-danger btn-sm">Takedown</button></div></td></tr>
              <tr><td><b>Sirah Nabawiyah (lama)</b></td><td>Ust. Hamzah</td><td>Sirah</td><td>Rekaman</td><td className="tr-num">120</td><td><span className="tag tag-muted">Diarsip</span></td><td><div style={{ display: "flex", gap: ".4rem" }}><button className="btn btn-soft btn-sm">Pulihkan</button></div></td></tr>
            </tbody></table></div>
            <p className="help" style={{ marginTop: ".6rem" }}>Takedown &amp; arsip bersifat <b>soft-delete</b> (bisa dipulihkan) &amp; tercatat di Audit Log. Lihat docs/backend/06.</p>
          </section>

          <section data-pane="approval" hidden>
            <div className="card card-pad">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".5rem" }}><h2 style={{ fontSize: "1.15rem" }}>Pendaftaran Ustadz Menunggu</h2><div className="seg"><button aria-pressed="true">Pending (3)</button><button>Disetujui</button><button>Ditolak</button></div></div>
              {[["Ust. Hamzah Abdul Karim, M.A.", "Sirah & Hadits · Univ. Madinah", ["CV.pdf", "Ijazah.pdf", "Sanad.pdf"]], ["Ustadzah Aisyah Nuraini", "Tahsin Anak · Sertifikat Tilawati", ["CV.pdf", "Sertifikat.pdf"]], ["Ust. Bilal Ramadhan, Lc.", "Bahasa Arab · LIPIA", ["CV.pdf", "Ijazah.pdf"]]].map((a, i) => (
                <div className="applicant" key={i} style={i === 2 ? { borderBottom: "none" } : undefined}>
                  <span className="avatar"><svg className="ico"><use href="#i-user" /></svg></span>
                  <div style={{ flex: 1, minWidth: 200 }}><p style={{ fontWeight: 600 }}>{a[0] as string}</p><p className="muted" style={{ fontSize: ".82rem" }}>{a[1] as string}</p><div style={{ display: "flex", gap: ".4rem", marginTop: ".5rem" }}>{(a[2] as string[]).map((d) => <span className="tag tag-muted" key={d}>{d}</span>)}</div></div>
                  <span className="tag tag-warn">Pending</span>
                  <div style={{ display: "flex", gap: ".5rem" }}><button className="btn btn-primary btn-sm">Setujui</button><button className="btn btn-danger btn-sm">Tolak</button><button className="btn btn-ghost btn-sm">Detail</button></div>
                </div>
              ))}
            </div>
          </section>

          <section data-pane="rbac" hidden>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem" }}>
              <div className="card card-pad"><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".8rem" }}><p style={{ fontWeight: 600 }}>Roles</p><button className="btn btn-soft btn-sm"><svg className="ico ico-sm"><use href="#i-plus" /></svg>Role</button></div>
                <div className="sb-link active" style={{ marginBottom: ".3rem" }}>Superadmin <span className="muted" style={{ marginLeft: "auto", fontSize: ".78rem" }}>1</span></div>
                <div className="sb-link">Admin <span className="muted" style={{ marginLeft: "auto", fontSize: ".78rem" }}>2</span></div>
                <div className="sb-link">Ustadz <span className="muted" style={{ marginLeft: "auto", fontSize: ".78rem" }}>35</span></div>
                <div className="sb-link">Santri <span className="muted" style={{ marginLeft: "auto", fontSize: ".78rem" }}>8.512</span></div>
              </div>
              <div className="card card-pad"><p style={{ fontWeight: 600 }}>Hak akses — Role: <span style={{ color: "rgb(var(--brand))" }}>Admin</span></p><p className="help" style={{ marginBottom: ".9rem" }}>Centang permission yang dimiliki role.</p>
                <div className="perm"><span><code>user.approve</code> — Menyetujui ustadz</span><Toggle on /></div>
                <div className="perm"><span><code>rbac.manage</code> — Kelola role &amp; hak akses</span><Toggle /></div>
                <div className="perm"><span><code>payment.gateway.toggle</code> — Atur gateway</span><Toggle /></div>
                <div className="perm"><span><code>payout.approve</code> — Setujui klaim ustadz</span><Toggle on /></div>
                <div className="perm"><span><code>tax.manage</code> — Atur pajak</span><Toggle /></div>
                <button className="btn btn-primary btn-sm" style={{ marginTop: ".6rem" }}>Simpan</button>
              </div>
            </div>
          </section>

          <section data-pane="marketing" hidden>
            <div className="card card-pad" style={{ marginBottom: "1rem", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <p className="muted" style={{ fontSize: ".88rem", flex: 1 }}>Hanya menampilkan pengguna dengan <b style={{ color: "rgb(var(--text))" }}>consent marketing aktif</b> (real-time). Yang mencabut otomatis hilang.</p>
              <div className="seg"><button aria-pressed="true">Semua</button><button>WA</button><button>Email</button></div>
              <button className="btn btn-primary btn-sm"><svg className="ico ico-sm"><use href="#i-upload" /></svg>Export CSV</button>
            </div>
            <div className="table-wrap"><table className="tbl"><thead><tr><th>Nama</th><th>Email</th><th>WhatsApp</th><th>Consent</th><th>Sejak</th></tr></thead><tbody>
              <tr><td>Ahmad R.</td><td>ahmad@mail.com</td><td>0812••••3456</td><td><span className="tag tag-success">Email + WA</span></td><td className="muted">12 Mei 2026</td></tr>
              <tr><td>Siti K.</td><td>siti@mail.com</td><td>—</td><td><span className="tag tag-info">Email</span></td><td className="muted">3 Jun 2026</td></tr>
              <tr><td>Budi S.</td><td>budi@mail.com</td><td>0813••••7788</td><td><span className="tag tag-success">Email + WA</span></td><td className="muted">28 Mei 2026</td></tr>
            </tbody></table></div>
          </section>

          <section data-pane="gateway" hidden>
            <p className="muted" style={{ fontSize: ".88rem", marginBottom: "1rem" }}>Aktifkan/nonaktifkan gateway &amp; isi kredensial. Hanya yang aktif tampil di checkout.</p>
            <div className="grid-2">
              <div className="gwcard"><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ display: "flex", gap: ".7rem", alignItems: "center" }}><span className="tag tag-info" style={{ width: 42, height: 42, borderRadius: "var(--r-md)", justifyContent: "center" }}>MT</span><div><p style={{ fontWeight: 600 }}>Midtrans</p><p className="muted" style={{ fontSize: ".78rem" }}>VA, QRIS, Kartu</p></div></div><Toggle on /></div><div style={{ display: "flex", gap: ".4rem", margin: ".8rem 0" }}><span className="tag tag-success">Aktif</span><span className="tag tag-muted">Production</span></div><input className="input" type="password" defaultValue="••••••••" placeholder="Server Key" style={{ marginBottom: ".5rem" }} /><input className="input" placeholder="Client Key" /></div>
              <div className="gwcard"><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ display: "flex", gap: ".7rem", alignItems: "center" }}><span className="tag tag-warn" style={{ width: 42, height: 42, borderRadius: "var(--r-md)", justifyContent: "center" }}>TP</span><div><p style={{ fontWeight: 600 }}>Tripay</p><p className="muted" style={{ fontSize: ".78rem" }}>Retail, VA, QRIS</p></div></div><Toggle on /></div><div style={{ display: "flex", gap: ".4rem", margin: ".8rem 0" }}><span className="tag tag-success">Aktif</span><span className="tag tag-warn">Sandbox</span></div><input className="input" placeholder="API Key" style={{ marginBottom: ".5rem" }} /><input className="input" placeholder="Merchant Code" /></div>
              <div className="gwcard"><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ display: "flex", gap: ".7rem", alignItems: "center" }}><span className="tag" style={{ width: 42, height: 42, borderRadius: "var(--r-md)", justifyContent: "center", background: "rgb(139 92 246/.16)", color: "#8b5cf6" }}>XD</span><div><p style={{ fontWeight: 600 }}>Xendit</p><p className="muted" style={{ fontSize: ".78rem" }}>E-wallet, VA, Payout</p></div></div><Toggle /></div><div style={{ display: "flex", gap: ".4rem", margin: ".8rem 0" }}><span className="tag tag-muted">Nonaktif</span></div><input className="input" placeholder="Secret API Key" disabled /></div>
              <div className="gwcard"><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ display: "flex", gap: ".7rem", alignItems: "center" }}><span className="tag tag-success" style={{ width: 42, height: 42, borderRadius: "var(--r-md)", justifyContent: "center" }}><svg className="ico ico-sm"><use href="#i-wallet" /></svg></span><div><p style={{ fontWeight: 600 }}>Transfer Manual</p><p className="muted" style={{ fontSize: ".78rem" }}>Verifikasi admin</p></div></div><Toggle on /></div><input className="input" defaultValue="BSI" style={{ margin: ".8rem 0 .5rem" }} /><input className="input" defaultValue="7001234567" style={{ marginBottom: ".5rem" }} /><input className="input" defaultValue="Yayasan SantriKalong" /></div>
            </div>
          </section>

          <section data-pane="payroll" hidden>
            <div className="grid-4">
              <div className="stat"><p className="lbl">Pendapatan ustadz</p><p className="val tnum">Rp 33,7jt</p></div>
              <div className="stat"><p className="lbl">Pajak dipotong</p><p className="val tnum">Rp 168rb</p><p className="delta muted">PPh final 0,5%</p></div>
              <div className="stat"><p className="lbl">Saldo belum klaim</p><p className="val tnum">Rp 21,7jt</p></div>
              <div className="stat"><p className="lbl">Klaim menunggu</p><p className="val tnum" style={{ color: "rgb(var(--warning))" }}>4</p></div>
            </div>
            <div className="table-wrap" style={{ marginTop: "1rem" }}><table className="tbl"><thead><tr><th>Ustadz</th><th className="tr-num">Terjual</th><th className="tr-num">Bruto</th><th className="tr-num">Bagi hasil 70%</th><th className="tr-num">Pajak</th><th className="tr-num">Net / Saldo</th><th>Status</th></tr></thead><tbody>
              <tr><td><b>Ust. Abdullah</b><br /><span className="muted" style={{ fontSize: ".76rem" }}>NPWP ✓ · UMKM 0,5%</span></td><td className="tr-num">84</td><td className="tr-num">Rp 12.516.000</td><td className="tr-num">Rp 8.761.200</td><td className="tr-num" style={{ color: "rgb(var(--danger))" }}>−62.580</td><td className="tr-num"><b>Rp 8.698.620</b></td><td><span className="tag tag-success">Tersedia</span></td></tr>
              <tr><td><b>Ustadzah Fatimah</b><br /><span className="muted" style={{ fontSize: ".76rem" }}>NPWP ✓ · UMKM 0,5%</span></td><td className="tr-num">61</td><td className="tr-num">Rp 9.150.000</td><td className="tr-num">Rp 6.405.000</td><td className="tr-num" style={{ color: "rgb(var(--danger))" }}>−45.750</td><td className="tr-num"><b>Rp 6.359.250</b></td><td><span className="tag tag-warn">Klaim diajukan</span></td></tr>
              <tr><td><b>Ust. Hamzah</b><br /><span className="muted" style={{ fontSize: ".76rem", color: "rgb(var(--danger))" }}>NPWP ✗ · +20%</span></td><td className="tr-num">39</td><td className="tr-num">Rp 3.861.000</td><td className="tr-num">Rp 2.702.700</td><td className="tr-num" style={{ color: "rgb(var(--danger))" }}>−16.216</td><td className="tr-num"><b>Rp 2.686.484</b></td><td><span className="tag tag-muted">Saldo (carry)</span></td></tr>
            </tbody></table></div>
            <p className="help" style={{ marginTop: ".6rem" }}>Saldo berbasis <b>ledger append-only</b> · klaim atomic + idempotency (anti double-claim) · bukti PDF tamper-evident (QR verifikasi). Lihat docs/09.</p>
            <div className="card card-pad" style={{ marginTop: "1rem" }}><p style={{ fontWeight: 600, marginBottom: ".6rem" }}>Permintaan Klaim Menunggu</p>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1rem", padding: ".8rem", border: "1px solid rgb(var(--border))", borderRadius: "var(--r-md)" }}><span className="avatar sm"><svg className="ico ico-sm"><use href="#i-user" /></svg></span><div style={{ flex: 1, minWidth: 160 }}><p style={{ fontWeight: 600, fontSize: ".9rem" }}>Ustadzah Fatimah</p><p className="muted" style={{ fontSize: ".78rem" }}>BSI · 700••••567</p></div><b>Rp 6.359.250</b><div style={{ display: "flex", gap: ".5rem" }}><button className="btn btn-ghost btn-sm"><svg className="ico ico-sm"><use href="#i-receipt" /></svg>Bukti</button><button className="btn btn-primary btn-sm">Setujui &amp; Transfer</button><button className="btn btn-danger btn-sm">Tolak</button></div></div>
            </div>
          </section>

          <section data-pane="tax" hidden>
            <div className="card card-pad" style={{ background: "rgb(var(--warning)/.08)", borderColor: "rgb(var(--warning)/.3)", marginBottom: "1rem" }}><p style={{ fontSize: ".88rem" }}><b>Disclaimer:</b> bukan nasihat pajak. Per Juni 2026: <b>PP 20/2026</b> — PPh final UMKM 0,5% tanpa batas waktu untuk Orang Pribadi (omzet ≤ Rp4,8M/th; ≤ Rp500jt/th bebas).</p></div>
            <div className="grid-2">
              <div className="card card-pad"><p style={{ fontWeight: 600, marginBottom: ".8rem" }}>Skema Pajak Ustadz</p>
                <div className="field"><label className="label">Mode Pajak</label><select className="select"><option>UMKM Final 0,5% (PP 20/2026)</option><option>PPh 21 Bukan Pegawai (Ps.17 × 50% × bruto)</option><option>Custom Flat (%)</option><option>Tanpa Potongan</option></select></div>
                <div className="grid-2" style={{ gap: ".8rem" }}><div className="field"><label className="label">Tarif Final (%)</label><input className="input" defaultValue="0.5" /></div><div className="field"><label className="label">Surcharge non-NPWP (%)</label><input className="input" defaultValue="20" /></div><div className="field"><label className="label">Bebas pajak ≤ (Rp/th)</label><input className="input" defaultValue="500.000.000" /></div><div className="field"><label className="label">Batas omzet (Rp/th)</label><input className="input" defaultValue="4.800.000.000" /></div></div>
                <button className="btn btn-primary btn-sm">Simpan</button>
              </div>
              <div className="card card-pad"><p style={{ fontWeight: 600 }}>Tarif Pasal 17 (Progresif)</p><p className="help" style={{ marginBottom: ".8rem" }}>Dipakai bila mode = PPh 21.</p>
                <table className="tbl" style={{ border: "none" }}><tbody>
                  <tr><td>s/d Rp 60 jt</td><td className="tr-num">5%</td></tr><tr><td>Rp 60–250 jt</td><td className="tr-num">15%</td></tr><tr><td>Rp 250–500 jt</td><td className="tr-num">25%</td></tr><tr><td>Rp 500jt–5 M</td><td className="tr-num">30%</td></tr><tr><td>di atas Rp 5 M</td><td className="tr-num">35%</td></tr>
                </tbody></table>
              </div>
            </div>
          </section>

          <section data-pane="trx" hidden>
            <div className="table-wrap"><table className="tbl"><thead><tr><th>Invoice</th><th>Santri</th><th>Kelas</th><th>Gateway</th><th className="tr-num">Jumlah</th><th>Status</th></tr></thead><tbody>
              <tr><td style={{ fontFamily: "var(--font-display)" }}>INV-20260601-001</td><td>Ahmad R.</td><td>Bahasa Arab Pemula</td><td>Midtrans</td><td className="tr-num">Rp 151.500</td><td><span className="tag tag-success">Lunas</span></td></tr>
              <tr><td style={{ fontFamily: "var(--font-display)" }}>INV-20260601-002</td><td>Siti K.</td><td>Tahsin Tilawati</td><td>Tripay</td><td className="tr-num">Rp 250.000</td><td><span className="tag tag-warn">Pending</span></td></tr>
              <tr><td style={{ fontFamily: "var(--font-display)" }}>INV-20260531-118</td><td>Budi S.</td><td>Dauroh Sirah</td><td>Manual</td><td className="tr-num">Rp 99.000</td><td><span className="tag tag-info">Verifikasi</span></td></tr>
            </tbody></table></div>
          </section>

          <section data-pane="audit" hidden>
            <div className="table-wrap"><table className="tbl"><thead><tr><th>Waktu</th><th>Aktor</th><th>Aksi</th><th>Target</th></tr></thead><tbody>
              <tr><td className="muted">01 Jun 11:42</td><td>Superadmin</td><td><code style={{ fontSize: ".8rem" }}>user.approve</code></td><td>Ust. Yusuf</td></tr>
              <tr><td className="muted">01 Jun 10:15</td><td>Superadmin</td><td><code style={{ fontSize: ".8rem" }}>payment.gateway.toggle</code></td><td>Xendit → off</td></tr>
              <tr><td className="muted">31 Mei 19:03</td><td>Admin Aisyah</td><td><code style={{ fontSize: ".8rem" }}>payout.approve</code></td><td>Klaim #PO-118</td></tr>
            </tbody></table></div>
          </section>

        </div>
      </div>
    </div>
  );
}
