import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { signDoc, shortCode } from "@/lib/docsign";
import { certPayload } from "@/lib/docpayload";

export const dynamic = "force-dynamic";

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

const appUrl = () => (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");

export default async function Sertifikat() {
  const session = await auth();
  if (!session?.user) redirect("/auth");
  const uid = (session.user as { id: string }).id;

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: uid },
    include: { user: true, progress: true, course: { include: { ustadz: { include: { user: true } }, modules: { include: { lessons: true } } } } },
    orderBy: { enrolledAt: "desc" },
  });

  const completed = enrollments
    .map((en) => {
      const lessons = en.course.modules.flatMap((m) => m.lessons);
      const total = lessons.length;
      const done = en.progress.filter((p) => p.status === "COMPLETED").length;
      const hours = Math.round(lessons.reduce((n, l) => n + (l.durationSec ?? 0), 0) / 3600);
      return { en, total, done, hours, isDone: total > 0 && done >= total };
    })
    .filter((x) => x.isDone);

  const primary = completed[0];
  const sig = primary ? signDoc(certPayload(primary.en, primary.en.user, primary.en.course)) : "";
  const code = primary ? shortCode(sig) : "";
  const verifyUrl = primary ? `${appUrl()}/verifikasi?d=sertifikat&id=${primary.en.id}&sig=${sig}` : "";
  const certNo = primary ? "SK-2026-" + primary.en.id.slice(-5).toUpperCase() : "";

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

        {!primary ? (
          <div className="card card-pad" style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
            <svg className="ico" style={{ width: 40, height: 40, color: "rgb(var(--brand))", margin: "0 auto 1rem" }}><use href="#i-award" /></svg>
            <h2 style={{ fontSize: "1.2rem" }}>Belum ada sertifikat</h2>
            <p className="muted" style={{ fontSize: ".9rem", marginTop: ".4rem", marginBottom: "1.2rem" }}>Selesaikan semua materi sebuah kelas untuk mendapatkan sertifikat terverifikasi.</p>
            <a href="/dashboard" className="btn btn-primary">Lanjut Belajar</a>
          </div>
        ) : (
          <>
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
                  <p className="recipient">{primary.en.user.name}</p>
                  <div className="fl"><span className="dia" /></div>
                  <p className="sub">telah menyelesaikan dengan baik kelas</p>
                  <p className="course">{primary.en.course.title}</p>
                  <p className="sub">{primary.hours > 0 ? `${primary.hours} jam pembelajaran · ` : ""}{primary.total} materi · Predikat <b style={{ color: "rgb(var(--brand))" }}>Mumtaz</b></p>
                </div>

                <div className="foot">
                  <div className="sign"><div className="nm">{primary.en.course.ustadz?.user?.name ?? "Pengajar"}</div>Pengajar</div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".3rem" }}>
                    <div className="seal">
                      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "100%", height: "100%" }}><rect x="22" y="22" width="56" height="56" rx="4" /><rect x="22" y="22" width="56" height="56" rx="4" transform="rotate(45 50 50)" /><circle cx="50" cy="50" r="24" /></svg>
                      <svg viewBox="0 0 24 24" style={{ position: "absolute", width: 26, height: 26, color: "rgb(var(--brand))" }}><path d="M28 6a13 13 0 1 0 6 14 10 10 0 1 1-6-14Z" fill="currentColor" transform="scale(.6) translate(4 4)" /></svg>
                    </div>
                    <span style={{ fontSize: ".55rem", letterSpacing: ".14em", fontWeight: 700, color: "rgb(var(--brand))" }}>TERVERIFIKASI</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="qrchip" style={{ marginLeft: "auto" }}><img alt="QR verifikasi" src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&margin=0&data=${encodeURIComponent(verifyUrl)}`} /></div>
                    <p className="qmeta">No. {certNo}<b>{code}</b></p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: ".6rem", marginTop: "1.3rem", flexWrap: "wrap", justifyContent: "center" }}>
              <a href={`/bukti/sertifikat/${primary.en.id}`} target="_blank" rel="noopener" className="btn btn-primary"><svg className="ico ico-sm"><use href="#i-receipt" /></svg>Unduh PDF</a>
              <a href={verifyUrl} target="_blank" rel="noopener" className="btn btn-ghost"><svg className="ico ico-sm"><use href="#i-shield" /></svg>Halaman Verifikasi</a>
            </div>

            {completed.length > 1 && (
              <div className="card card-pad" style={{ marginTop: "2rem", maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
                <h2 style={{ fontSize: "1.05rem", marginBottom: ".6rem" }}>Sertifikat lainnya ({completed.length - 1})</h2>
                {completed.slice(1).map((x) => (
                  <div key={x.en.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".5rem 0", borderBottom: "1px solid rgb(var(--border))" }}>
                    <span style={{ fontSize: ".9rem" }}>{x.en.course.title}</span>
                    <a href={`/bukti/sertifikat/${x.en.id}`} target="_blank" rel="noopener" className="btn btn-ghost btn-sm">PDF</a>
                  </div>
                ))}
              </div>
            )}

            <div className="card card-pad" style={{ marginTop: "2rem", maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
              <h2 style={{ fontSize: "1.15rem", display: "flex", alignItems: "center", gap: ".5rem" }}><svg className="ico" style={{ color: "rgb(var(--brand))" }}><use href="#i-shield" /></svg>Verifikasi Keaslian</h2>
              <p className="muted" style={{ fontSize: ".88rem", margin: ".4rem 0 .9rem" }}>Pindai QR pada sertifikat atau buka halaman verifikasi — data diambil langsung dari server (anti-pemalsuan). Tanda tangan digital akan gagal bila sertifikat diubah.</p>
              <div className="card card-pad" style={{ background: "rgb(var(--success)/.08)", borderColor: "rgb(var(--success)/.3)" }}><p style={{ display: "flex", alignItems: "center", gap: ".5rem", fontWeight: 600, color: "rgb(var(--success))" }}><svg className="ico ico-sm"><use href="#i-check" /></svg>Kode verifikasi: {code}</p><p className="muted" style={{ fontSize: ".85rem", marginTop: ".3rem" }}>{primary.en.user.name} · {primary.en.course.title}.</p></div>
            </div>
          </>
        )}
      </main>
    </>
  );
}
