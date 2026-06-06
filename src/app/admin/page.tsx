import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { idr } from "@/lib/format";
import { approveUstadz, rejectUstadz, toggleGateway, approvePayout, rejectPayout } from "./actions";

export const dynamic = "force-dynamic";

function GatewayToggle({ id, on }: { id: string; on?: boolean }) {
  return (
    <form action={toggleGateway}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="to" value={on ? "0" : "1"} />
      <button type="submit" className={on ? "btn btn-ghost btn-sm" : "btn btn-primary btn-sm"}>{on ? "Nonaktifkan" : "Aktifkan"}</button>
    </form>
  );
}

const jt = (n: number) => "Rp " + (n / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 }) + "jt";

export default async function Admin() {
  const session = await auth();
  if (!session?.user) redirect("/auth");
  const roles0 = ((session.user as { roles?: string[] }).roles) ?? [];
  if (!roles0.includes("admin") && !roles0.includes("superadmin")) redirect("/dashboard");

  const [userCount, ustadzApproved, pendingList, gateways, rolesList, permsList, orders, consentRecs, audits, ustadzList, payouts, courses, revenueAgg, earnAgg] = await Promise.all([
    prisma.user.count(),
    prisma.ustadzProfile.count({ where: { status: "APPROVED" } }),
    prisma.ustadzProfile.findMany({ where: { status: "PENDING" }, include: { user: true }, orderBy: { createdAt: "asc" } }),
    prisma.paymentGateway.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.role.findMany({ include: { _count: { select: { users: true, permissions: true } } }, orderBy: { name: "asc" } }),
    prisma.permission.findMany({ orderBy: { key: "asc" } }),
    prisma.order.findMany({ include: { user: true }, orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.consentRecord.findMany({ where: { type: { in: ["marketing_email", "marketing_wa"] }, granted: true }, include: { user: true } }),
    prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.ustadzProfile.findMany({ where: { status: "APPROVED" }, include: { user: { include: { wallet: { include: { entries: true } } } } } }),
    prisma.payoutRequest.findMany({ where: { status: "REQUESTED" }, orderBy: { requestedAt: "desc" } }),
    prisma.course.findMany({ include: { ustadz: { include: { user: true } }, category: true, _count: { select: { enrollments: true } } }, orderBy: { createdAt: "desc" } }),
    prisma.order.aggregate({ _sum: { amountIdr: true }, where: { status: "PAID" } }),
    prisma.walletEntry.aggregate({ _sum: { amountIdr: true }, where: { type: "EARNING_CREDIT" } }),
  ]);

  const revenue = revenueAgg._sum.amountIdr ?? 0;
  const saldo = earnAgg._sum.amountIdr ?? 0;
  const courseTitle = new Map(courses.map((c) => [c.id, c.title]));
  const nameById = new Map(ustadzList.map((u) => [u.userId, u.user.name]));
  const earnings = ustadzList.map((u) => ({
    name: u.user.name,
    npwp: false,
    total: (u.user.wallet?.entries ?? []).filter((e) => e.type === "EARNING_CREDIT").reduce((n, e) => n + e.amountIdr, 0),
  }));
  // group consent per user
  const cmap = new Map<string, { name: string; email: string; phone: string | null; ch: Set<string> }>();
  for (const r of consentRecs) {
    const e = cmap.get(r.userId) ?? { name: r.user.name, email: r.user.email, phone: r.user.phone, ch: new Set<string>() };
    e.ch.add(r.type === "marketing_wa" ? "WA" : "Email");
    cmap.set(r.userId, e);
  }
  const contacts = [...cmap.values()];
  const STATUS: Record<string, string> = { PAID: "Lunas", PENDING: "Pending", WAITING_CONFIRMATION: "Verifikasi", EXPIRED: "Expired", FAILED: "Gagal", REFUNDED: "Refund" };
  const STATUS_CLS: Record<string, string> = { PAID: "tag-success", PENDING: "tag-warn", WAITING_CONFIRMATION: "tag-info" };

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sb-brand"><svg className="mark" style={{ width: 30, height: 30, color: "rgb(var(--brand))" }} viewBox="0 0 40 40" fill="none"><path d="M28 6a13 13 0 1 0 6 14 10 10 0 1 1-6-14Z" fill="currentColor" /></svg>SantriKalong<span className="tag tag-warn" style={{ marginLeft: "auto" }}>ADMIN</span></div>
        <nav>
          <div className="sb-group">Umum</div>
          <button className="sb-link active" data-view="dash" data-title="Dashboard"><svg className="ico ico-sm"><use href="#i-grid" /></svg>Dashboard</button>
          <button className="sb-link" data-view="konten" data-title="Kelas & Konten"><svg className="ico ico-sm"><use href="#i-book" /></svg>Kelas &amp; Konten</button>
          <div className="sb-group">Pengguna</div>
          <button className="sb-link" data-view="approval" data-title="Persetujuan Ustadz"><svg className="ico ico-sm"><use href="#i-check" /></svg>Approval Ustadz{pendingList.length > 0 && <span className="badge">{pendingList.length}</span>}</button>
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
        <div style={{ padding: ".8rem", borderTop: "1px solid rgb(var(--border))", display: "flex", alignItems: "center", gap: ".6rem" }}><span className="avatar sm"><svg className="ico ico-sm"><use href="#i-user" /></svg></span><div style={{ fontSize: ".78rem" }}><p style={{ fontWeight: 600 }}>{session.user.name}</p><p className="muted">{session.user.email}</p></div></div>
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
              <div className="stat"><p className="lbl">Pendapatan (lunas)</p><p className="val tnum">{jt(revenue)}</p></div>
              <div className="stat"><p className="lbl">Total pengguna</p><p className="val tnum">{userCount}</p></div>
              <div className="stat"><p className="lbl">Ustadz aktif</p><p className="val tnum">{ustadzApproved}</p><p className="delta" style={{ color: "rgb(var(--warning))" }}>{pendingList.length} pending</p></div>
              <div className="stat"><p className="lbl">Saldo earning</p><p className="val tnum">{jt(saldo)}</p></div>
            </div>
            <div className="card card-pad" style={{ marginTop: "1rem" }}><p style={{ fontWeight: 600, marginBottom: ".8rem" }}>Perlu Tindakan</p><ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: ".7rem", fontSize: ".88rem" }}><li>{pendingList.length} pendaftaran ustadz menunggu</li><li>{payouts.length} klaim payout menunggu</li><li>{orders.filter((o) => o.status === "WAITING_CONFIRMATION").length} bukti transfer manual</li></ul></div>
          </section>

          <section data-pane="konten" hidden>
            <div className="table-wrap"><table className="tbl"><thead><tr><th>Kelas</th><th>Ustadz</th><th>Kategori</th><th>Tipe</th><th className="tr-num">Santri</th><th>Status</th></tr></thead><tbody>
              {courses.map((c) => (
                <tr key={c.id}><td><b>{c.title}</b></td><td>{c.ustadz?.user?.name}</td><td>{c.category?.name}</td><td>{c.type === "LIVE" ? "Live" : "Rekaman"}{c.isFree ? " · Gratis" : ""}</td><td className="tr-num">{c._count.enrollments}</td><td><span className={c.status === "PUBLISHED" ? "tag tag-success" : c.status === "ARCHIVED" ? "tag tag-muted" : "tag tag-warn"}>{c.status}</span></td></tr>
              ))}
            </tbody></table></div>
          </section>

          <section data-pane="approval" hidden>
            <div className="card card-pad">
              <h2 style={{ fontSize: "1.15rem", marginBottom: ".5rem" }}>Pendaftaran Ustadz Menunggu ({pendingList.length})</h2>
              {pendingList.length === 0 && <p className="muted">Tidak ada pendaftaran menunggu.</p>}
              {pendingList.map((p, i) => {
                const docs = (p.documents as { files?: string[] } | null)?.files ?? [];
                return (
                  <div className="applicant" key={p.id} style={i === pendingList.length - 1 ? { borderBottom: "none" } : undefined}>
                    <span className="avatar"><svg className="ico"><use href="#i-user" /></svg></span>
                    <div style={{ flex: 1, minWidth: 200 }}><p style={{ fontWeight: 600 }}>{p.user.name}</p><p className="muted" style={{ fontSize: ".82rem" }}>{p.specialization}</p><div style={{ display: "flex", gap: ".4rem", marginTop: ".5rem" }}>{docs.map((d) => <span className="tag tag-muted" key={d}>{d}</span>)}</div></div>
                    <span className="tag tag-warn">Pending</span>
                    <div style={{ display: "flex", gap: ".5rem" }}>
                      <form action={approveUstadz}><input type="hidden" name="profileId" value={p.id} /><button type="submit" className="btn btn-primary btn-sm">Setujui</button></form>
                      <form action={rejectUstadz}><input type="hidden" name="profileId" value={p.id} /><button type="submit" className="btn btn-danger btn-sm">Tolak</button></form>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section data-pane="rbac" hidden>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem" }}>
              <div className="card card-pad"><p style={{ fontWeight: 600, marginBottom: ".8rem" }}>Roles</p>
                {rolesList.map((r) => (<div className="sb-link" key={r.id} style={{ marginBottom: ".3rem" }}>{r.name} <span className="muted" style={{ marginLeft: "auto", fontSize: ".78rem" }}>{r._count.users} user · {r._count.permissions} izin</span></div>))}
              </div>
              <div className="card card-pad"><p style={{ fontWeight: 600 }}>Permissions terdaftar ({permsList.length})</p><p className="help" style={{ marginBottom: ".9rem" }}>Daftar hak akses di sistem.</p>
                {permsList.map((pm) => (<div className="perm" key={pm.id}><span><code>{pm.key}</code></span><span className="muted" style={{ fontSize: ".78rem" }}>izin</span></div>))}
              </div>
            </div>
          </section>

          <section data-pane="marketing" hidden>
            <div className="card card-pad" style={{ marginBottom: "1rem", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <p className="muted" style={{ fontSize: ".88rem", flex: 1 }}>Hanya pengguna dengan <b style={{ color: "rgb(var(--text))" }}>consent marketing aktif</b> ({contacts.length} kontak).</p>
              <button className="btn btn-primary btn-sm"><svg className="ico ico-sm"><use href="#i-upload" /></svg>Export CSV</button>
            </div>
            <div className="table-wrap"><table className="tbl"><thead><tr><th>Nama</th><th>Email</th><th>WhatsApp</th><th>Consent</th></tr></thead><tbody>
              {contacts.length === 0 && <tr><td colSpan={4} className="muted">Belum ada kontak yang opt-in.</td></tr>}
              {contacts.map((c, i) => (<tr key={i}><td>{c.name}</td><td>{c.email}</td><td>{c.phone ?? "—"}</td><td><span className="tag tag-success">{[...c.ch].join(" + ")}</span></td></tr>))}
            </tbody></table></div>
          </section>

          <section data-pane="gateway" hidden>
            <p className="muted" style={{ fontSize: ".88rem", marginBottom: "1rem" }}>Status gateway dari database. Hanya yang aktif tampil di checkout.</p>
            <div className="grid-2">
              {gateways.map((g) => (
                <div className="gwcard" key={g.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: ".7rem", alignItems: "center" }}><span className="tag" style={{ width: 42, height: 42, borderRadius: "var(--r-md)", justifyContent: "center" }}>{g.provider.slice(0, 2)}</span><div><p style={{ fontWeight: 600 }}>{g.displayName}</p><p className="muted" style={{ fontSize: ".78rem" }}>{g.provider}</p></div></div>
                    <GatewayToggle id={g.id} on={g.isActive} />
                  </div>
                  <div style={{ display: "flex", gap: ".4rem", margin: ".8rem 0" }}><span className={g.isActive ? "tag tag-success" : "tag tag-muted"}>{g.isActive ? "Aktif" : "Nonaktif"}</span><span className={g.mode === "PRODUCTION" ? "tag tag-muted" : "tag tag-warn"}>{g.mode === "PRODUCTION" ? "Production" : "Sandbox"}</span></div>
                  <input className="input" placeholder="Kredensial (tersimpan terenkripsi)" disabled={!g.isActive} />
                </div>
              ))}
            </div>
          </section>

          <section data-pane="payroll" hidden>
            <div className="grid-4">
              <div className="stat"><p className="lbl">Total earning ustadz</p><p className="val tnum">{jt(saldo)}</p></div>
              <div className="stat"><p className="lbl">Klaim menunggu</p><p className="val tnum" style={{ color: "rgb(var(--warning))" }}>{payouts.length}</p></div>
              <div className="stat"><p className="lbl">Ustadz aktif</p><p className="val tnum">{ustadzApproved}</p></div>
              <div className="stat"><p className="lbl">Gateway payout</p><p className="val tnum">{gateways.filter((g) => g.isActive).length}</p></div>
            </div>
            <div className="table-wrap" style={{ marginTop: "1rem" }}><table className="tbl"><thead><tr><th>Ustadz</th><th className="tr-num">Earning</th></tr></thead><tbody>
              {earnings.map((e, i) => (<tr key={i}><td><b>{e.name}</b></td><td className="tr-num"><b>{idr(e.total)}</b></td></tr>))}
            </tbody></table></div>
            <p className="help" style={{ marginTop: ".6rem" }}>Saldo berbasis <b>ledger (WalletEntry append-only)</b>. Lihat docs/09.</p>
            <div className="card card-pad" style={{ marginTop: "1rem" }}><p style={{ fontWeight: 600, marginBottom: ".6rem" }}>Permintaan Klaim Menunggu ({payouts.length})</p>
              {payouts.length === 0 && <p className="muted">Tidak ada klaim menunggu.</p>}
              {payouts.map((po) => {
                const bank = po.bankSnapshot as { bank?: string; no?: string } | null;
                return (
                  <div key={po.id} style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1rem", padding: ".8rem", border: "1px solid rgb(var(--border))", borderRadius: "var(--r-md)", marginBottom: ".5rem" }}>
                    <span className="avatar sm"><svg className="ico ico-sm"><use href="#i-user" /></svg></span>
                    <div style={{ flex: 1, minWidth: 160 }}><p style={{ fontWeight: 600, fontSize: ".9rem" }}>{nameById.get(po.ustadzUserId) ?? "Ustadz"}</p><p className="muted" style={{ fontSize: ".78rem" }}>{bank?.bank} · {bank?.no}</p></div>
                    <b>{idr(po.netIdr)}</b>
                    <div style={{ display: "flex", gap: ".5rem" }}>
                      <a className="btn btn-ghost btn-sm" href={`/bukti/payout/${po.id}`} target="_blank" rel="noopener"><svg className="ico ico-sm"><use href="#i-receipt" /></svg>Bukti</a>
                      <form action={approvePayout}><input type="hidden" name="id" value={po.id} /><button type="submit" className="btn btn-primary btn-sm">Setujui &amp; Transfer</button></form>
                      <form action={rejectPayout}><input type="hidden" name="id" value={po.id} /><button type="submit" className="btn btn-danger btn-sm">Tolak</button></form>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section data-pane="tax" hidden>
            <div className="card card-pad" style={{ background: "rgb(var(--warning)/.08)", borderColor: "rgb(var(--warning)/.3)", marginBottom: "1rem" }}><p style={{ fontSize: ".88rem" }}><b>Disclaimer:</b> bukan nasihat pajak. Per 2026: <b>PP 20/2026</b> — PPh final UMKM 0,5% tanpa batas waktu untuk Orang Pribadi.</p></div>
            <div className="card card-pad" style={{ maxWidth: 520 }}><p style={{ fontWeight: 600, marginBottom: ".8rem" }}>Skema Pajak Ustadz</p>
              <div className="field"><label className="label">Mode Pajak</label><select className="select"><option>UMKM Final 0,5% (PP 20/2026)</option><option>PPh 21 Bukan Pegawai</option><option>Custom Flat (%)</option><option>Tanpa Potongan</option></select></div>
              <div className="grid-2" style={{ gap: ".8rem" }}><div className="field"><label className="label">Tarif Final (%)</label><input className="input" defaultValue="0.5" /></div><div className="field"><label className="label">Surcharge non-NPWP (%)</label><input className="input" defaultValue="20" /></div></div>
              <button className="btn btn-primary btn-sm">Simpan</button>
            </div>
          </section>

          <section data-pane="trx" hidden>
            <div className="table-wrap"><table className="tbl"><thead><tr><th>Invoice</th><th>Santri</th><th>Item</th><th>Gateway</th><th className="tr-num">Jumlah</th><th>Status</th><th>Bukti</th></tr></thead><tbody>
              {orders.length === 0 && <tr><td colSpan={7} className="muted">Belum ada transaksi.</td></tr>}
              {orders.map((o) => (<tr key={o.id}><td style={{ fontFamily: "var(--font-display)" }}>{o.reference ?? o.id.slice(0, 10)}</td><td>{o.user.name}</td><td>{courseTitle.get(o.itemId) ?? o.itemType}</td><td>{o.gateway ?? "—"}</td><td className="tr-num">{idr(o.amountIdr)}</td><td><span className={`tag ${STATUS_CLS[o.status] ?? "tag-muted"}`}>{STATUS[o.status] ?? o.status}</span></td><td><a className="btn btn-ghost btn-sm" href={`/bukti/invoice/${o.id}`} target="_blank" rel="noopener"><svg className="ico ico-sm"><use href="#i-receipt" /></svg></a></td></tr>))}
            </tbody></table></div>
          </section>

          <section data-pane="audit" hidden>
            <div className="table-wrap"><table className="tbl"><thead><tr><th>Waktu</th><th>Aktor</th><th>Aksi</th><th>Target</th></tr></thead><tbody>
              {audits.length === 0 && <tr><td colSpan={4} className="muted">Belum ada log.</td></tr>}
              {audits.map((a) => (<tr key={a.id}><td className="muted">{a.createdAt.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</td><td>{a.actorId === session.user!.id ? "Anda" : "Admin"}</td><td><code style={{ fontSize: ".8rem" }}>{a.action}</code></td><td>{a.targetType} {a.targetId !== "-" ? a.targetId : ""}</td></tr>))}
            </tbody></table></div>
          </section>

        </div>
      </div>
    </div>
  );
}
