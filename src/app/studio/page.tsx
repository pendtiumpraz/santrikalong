import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { idr } from "@/lib/format";

export const dynamic = "force-dynamic";

const LESSON_TAG: Record<string, string> = { VIDEO: "Video", AUDIO: "Audio", PDF: "PDF", HTML_PPT: "Slide", TEXT: "Kuis" };
const LESSON_ICON: Record<string, string> = { VIDEO: "i-play", PDF: "i-doc", AUDIO: "i-headphones", HTML_PPT: "i-layers", TEXT: "i-edit" };

export default async function Studio() {
  const session = await auth();
  if (!session?.user) redirect("/auth");
  const roles = ((session.user as { roles?: string[] }).roles) ?? [];
  if (!roles.includes("ustadz") && !roles.includes("superadmin")) redirect("/dashboard");
  const userId = (session.user as { id: string }).id;

  const [profile, wallet, payouts] = await Promise.all([
    prisma.ustadzProfile.findUnique({
      where: { userId },
      include: { courses: { include: { _count: { select: { enrollments: true } }, modules: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } } }, orderBy: { createdAt: "asc" } } },
    }),
    prisma.wallet.findUnique({ where: { ustadzUserId: userId }, include: { entries: { orderBy: { createdAt: "desc" } } } }),
    prisma.payoutRequest.findMany({ where: { ustadzUserId: userId }, orderBy: { requestedAt: "desc" } }),
  ]);

  const courses = profile?.courses ?? [];
  const totalSantri = courses.reduce((n, c) => n + c._count.enrollments, 0);
  const published = courses.filter((c) => c.status === "PUBLISHED").length;
  const entries = wallet?.entries ?? [];
  const balance = entries.reduce((n, e) => n + e.amountIdr, 0);
  const editing = courses[0];

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
        <div style={{ padding: ".8rem", borderTop: "1px solid rgb(var(--border))", display: "flex", alignItems: "center", gap: ".6rem" }}><span className="avatar sm"><svg className="ico ico-sm"><use href="#i-user" /></svg></span><div style={{ fontSize: ".78rem" }}><p style={{ fontWeight: 600 }}>{session.user.name}</p><p className="muted">{profile ? "Pengajar terverifikasi" : session.user.email}</p></div></div>
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
              <div className="stat"><p className="lbl">Total santri</p><p className="val tnum">{totalSantri.toLocaleString("id-ID")}</p></div>
              <div className="stat"><p className="lbl">Saldo earning</p><p className="val tnum">{idr(balance)}</p></div>
              <div className="stat"><p className="lbl">Kelas publish</p><p className="val tnum">{published}</p></div>
              <div className="stat"><p className="lbl">Total kelas</p><p className="val tnum">{courses.length}</p></div>
            </div>
            <div className="card card-pad" style={{ marginTop: "1rem" }}><p style={{ fontWeight: 600, marginBottom: ".8rem" }}>Ringkasan</p><ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: ".7rem", fontSize: ".88rem" }}>
              <li>{totalSantri} santri terdaftar di kelasmu</li>
              <li>{published} kelas dipublikasikan</li>
              <li>Saldo earning tersedia: <b>{idr(balance)}</b></li>
              {!profile && <li className="muted">Akun ini superadmin (bukan profil pengajar) — data kosong.</li>}
            </ul></div>
          </section>

          <section data-pane="kelas" hidden>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}><h2 style={{ fontSize: "1.2rem" }}>Kelas Saya ({courses.length})</h2><button className="btn btn-primary btn-sm"><svg className="ico ico-sm"><use href="#i-plus" /></svg>Buat Kelas</button></div>
            {courses.length === 0 && <p className="muted">Belum ada kelas. Buat kelas pertamamu.</p>}
            {courses.map((c) => (
              <div className="card card-pad" key={c.id} style={{ marginBottom: ".8rem", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 160 }}><p style={{ fontWeight: 600 }}>{c.title}</p><p className="muted" style={{ fontSize: ".8rem" }}>{c.modules.reduce((n, m) => n + m.lessons.length, 0)} materi · {c._count.enrollments} santri</p></div>
                <span className={c.status === "PUBLISHED" ? "tag tag-success" : "tag tag-warn"}>{c.status}</span>
                <button className="btn btn-ghost btn-sm"><svg className="ico ico-sm"><use href="#i-edit" /></svg>Edit</button>
              </div>
            ))}

            {editing && (
              <div className="card card-pad" style={{ marginTop: "1rem" }}>
                <p style={{ fontWeight: 600, marginBottom: ".3rem" }}>Editor Kurikulum — {editing.title}</p><p className="help" style={{ marginBottom: ".9rem" }}>Materi dari database. Seret untuk mengurutkan.</p>
                {editing.modules.map((m) => (
                  <div key={m.id}>
                    <p className="muted" style={{ fontSize: ".75rem", textTransform: "uppercase", letterSpacing: ".06em", margin: ".6rem 0 .4rem" }}>{m.title}</p>
                    {m.lessons.map((l) => (
                      <div className="lessrow" key={l.id}><svg className="ico ico-sm drag"><use href="#i-menu" /></svg><svg className="ico ico-sm" style={{ color: "rgb(var(--brand))" }}><use href={`#${LESSON_ICON[l.contentType] ?? "i-doc"}`} /></svg><span style={{ flex: 1 }}>{l.title}</span><span className="tag tag-muted">{LESSON_TAG[l.contentType] ?? l.contentType}</span><button className="icon-btn" style={{ width: 32, height: 32 }}><svg className="ico ico-sm"><use href="#i-edit" /></svg></button></div>
                    ))}
                  </div>
                ))}
                <div style={{ display: "flex", gap: ".5rem", marginTop: ".6rem" }}><button className="btn btn-soft btn-sm"><svg className="ico ico-sm"><use href="#i-upload" /></svg>Upload Materi</button><button className="btn btn-ghost btn-sm"><svg className="ico ico-sm"><use href="#i-plus" /></svg>Tambah Bab</button></div>
              </div>
            )}
          </section>

          <section data-pane="kuis" hidden>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}><h2 style={{ fontSize: "1.2rem" }}>Builder Kuis</h2><button className="btn btn-primary btn-sm">Simpan Kuis</button></div>
            <div className="qcard"><div style={{ display: "flex", justifyContent: "space-between" }}><b style={{ fontSize: ".9rem" }}>Soal 1 · Pilihan Ganda</b><button className="icon-btn" style={{ width: 30, height: 30 }}><svg className="ico ico-sm"><use href="#i-trash" /></svg></button></div><input className="input" placeholder="Tulis pertanyaan…" style={{ margin: ".6rem 0" }} /><label className="opt"><input type="radio" name="c1" />Pilihan A</label><label className="opt" style={{ marginTop: ".4rem" }}><input type="radio" name="c1" defaultChecked />Pilihan B (benar)</label></div>
            <button className="btn btn-soft btn-sm"><svg className="ico ico-sm"><use href="#i-plus" /></svg>Tambah Soal</button>
          </section>

          <section data-pane="live" hidden>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}><h2 style={{ fontSize: "1.2rem" }}>Jadwal Live</h2><button className="btn btn-primary btn-sm"><svg className="ico ico-sm"><use href="#i-plus" /></svg>Jadwalkan Live</button></div>
            <div className="empty"><svg className="ico"><use href="#i-broadcast" /></svg><p>Belum ada sesi live terjadwal.</p></div>
          </section>

          <section data-pane="earn" hidden>
            <div className="grid-2" style={{ gridTemplateColumns: "1.2fr 1fr" }}>
              <div className="wallet"><p className="eyebrow">Saldo tersedia</p><p style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem", fontWeight: 600, margin: ".3rem 0" }}>{idr(balance)}</p><p className="muted" style={{ fontSize: ".84rem" }}>{entries.length} transaksi earning</p><button className="btn btn-primary" data-open="#claim" style={{ marginTop: "1rem" }}>Klaim Payout</button></div>
              <div className="card card-pad"><p style={{ fontWeight: 600, marginBottom: ".6rem" }}>Status payout</p>{payouts.length === 0 ? <p className="muted" style={{ fontSize: ".85rem" }}>Belum ada pengajuan payout.</p> : payouts.map((p) => (<p key={p.id} style={{ fontSize: ".85rem", marginBottom: ".3rem" }}>{idr(p.netIdr)} · <span className="tag tag-warn">{p.status}</span></p>))}</div>
            </div>
            <div className="table-wrap" style={{ marginTop: "1.2rem" }}><table className="tbl"><thead><tr><th>Tanggal</th><th>Jenis</th><th className="tr-num">Jumlah</th></tr></thead><tbody>
              {entries.length === 0 && <tr><td colSpan={3} className="muted">Belum ada earning.</td></tr>}
              {entries.map((e) => (<tr key={e.id}><td className="muted">{e.createdAt.toLocaleDateString("id-ID", { dateStyle: "medium" })}</td><td>{e.type === "EARNING_CREDIT" ? "Bagi hasil" : e.type}</td><td className="tr-num"><b>{idr(e.amountIdr)}</b></td></tr>))}
            </tbody></table></div>
          </section>

        </div>
      </div>

      <div className="overlay" id="claim">
        <div className="modal">
          <div className="modal-head"><h3>Klaim Payout</h3><button className="icon-btn" data-close aria-label="Tutup"><svg className="ico"><use href="#i-x" /></svg></button></div>
          <div className="modal-body">
            <div className="card card-pad" style={{ marginBottom: "1rem" }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: ".92rem" }}><span className="muted">Saldo tersedia</span><b>{idr(balance)}</b></div></div>
            <div className="field"><label className="label">Jumlah klaim</label><input className="input" defaultValue={idr(balance)} /></div>
            <p className="help">Diproses admin. Saldo ditahan hingga diverifikasi (anti double-claim). Bukti PDF otomatis dibuat.</p>
            <button className="btn btn-primary btn-block btn-lg" style={{ marginTop: "1rem" }}>Ajukan Klaim</button>
          </div>
        </div>
      </div>
    </div>
  );
}
