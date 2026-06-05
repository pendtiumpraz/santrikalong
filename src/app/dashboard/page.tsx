import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { img } from "@/lib/format";
import { logoutAction } from "@/app/auth/actions";

export const dynamic = "force-dynamic";

function Mark() {
  return (
    <svg className="mark" viewBox="0 0 40 40" fill="none">
      <path d="M28 6a13 13 0 1 0 6 14 10 10 0 1 1-6-14Z" fill="currentColor" />
      <circle cx="30" cy="11" r="1.6" fill="currentColor" />
    </svg>
  );
}

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user) redirect("/auth");
  const userId = (session.user as { id: string }).id;

  const enrollments = await prisma.enrollment.findMany({
    where: { userId, status: "ACTIVE" },
    include: {
      course: { include: { category: true, modules: { include: { lessons: { select: { id: true } } } } } },
      progress: { where: { status: "COMPLETED" }, select: { id: true } },
    },
    orderBy: { enrolledAt: "desc" },
  });

  const items = enrollments.map((e) => {
    const total = e.course.modules.reduce((n, m) => n + m.lessons.length, 0);
    const done = e.progress.length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    return { e, total, done, pct };
  });
  const aktif = items.length;
  const selesai = items.filter((i) => i.pct === 100).length;
  const lanjut = items.find((i) => i.pct < 100) ?? items[0];

  return (
    <>
      <header className="nav solid">
        <div className="container nav-in">
          <a href="/" className="brand"><Mark />SantriKalong</a>
          <nav className="nav-links"><a href="/dashboard" className="active">Belajar</a><a href="/katalog">Katalog</a><a href="/live">Live</a><a href="/sertifikat">Sertifikat</a></nav>
          <div className="nav-right">
            <button className="icon-btn" id="sk-mode-toggle" aria-label="Ganti mode"><svg className="ico" id="sk-mode-ic"><use href="#i-sun" /></svg></button>
            <a href="/profil" className="avatar sm" aria-label="Profil"><svg className="ico ico-sm"><use href="#i-user" /></svg></a>
            <form action={logoutAction}><button className="btn btn-ghost btn-sm" type="submit">Keluar</button></form>
          </div>
        </div>
      </header>

      <main className="container" style={{ paddingTop: "6rem", paddingBottom: "3rem" }}>
        <p className="eyebrow">Assalamu&apos;alaikum</p>
        <h1 style={{ fontSize: "clamp(1.7rem,4vw,2.3rem)", marginTop: ".3rem" }}>Selamat datang kembali, {session.user.name}</h1>

        {lanjut ? (
          <div className="resume" style={{ marginTop: "1.6rem" }}>
            <div className="rimg"><img src={img(lanjut.e.course.thumbnailKey, 500)} alt="" /></div>
            <div className="rb">
              <p className="eyebrow">Lanjutkan belajar</p>
              <h2 style={{ fontSize: "1.4rem", marginTop: ".3rem" }}>{lanjut.e.course.title}</h2>
              <p className="muted" style={{ fontSize: ".88rem", marginTop: ".3rem" }}>{lanjut.e.course.category?.name}</p>
              <div className="bar" style={{ marginTop: "1rem", maxWidth: 360 }}><i style={{ width: `${lanjut.pct}%` }} /></div>
              <p className="muted" style={{ fontSize: ".8rem", marginTop: ".4rem" }}>{lanjut.done} dari {lanjut.total} materi · {lanjut.pct}%</p>
              <a href="/belajar" className="btn btn-primary" style={{ marginTop: "1rem" }}>Lanjutkan <svg className="ico ico-sm"><use href="#i-play" /></svg></a>
            </div>
          </div>
        ) : (
          <div className="card card-pad" style={{ marginTop: "1.6rem" }}>
            <p>Kamu belum terdaftar di kelas mana pun.</p>
            <a href="/katalog" className="btn btn-primary btn-sm" style={{ marginTop: ".8rem" }}>Jelajahi Katalog</a>
          </div>
        )}

        <div className="grid-4" style={{ marginTop: "1.5rem" }}>
          <div className="stat"><p className="lbl">Kelas aktif</p><p className="val tnum">{aktif}</p></div>
          <div className="stat"><p className="lbl">Selesai</p><p className="val tnum">{selesai}</p></div>
          <div className="stat"><p className="lbl">Sertifikat</p><p className="val tnum">{selesai}</p></div>
          <div className="stat"><p className="lbl">Kelas tersedia</p><p className="val tnum">{aktif}</p></div>
        </div>

        <div className="sec-head" style={{ marginTop: "2.4rem" }}><h2>Kelas saya</h2><a href="/katalog">Cari kelas lain <svg className="ico ico-sm"><use href="#i-arrow" /></svg></a></div>
        {items.length === 0 ? (
          <p className="muted">Belum ada kelas.</p>
        ) : (
          <div className="grid-c">
            {items.map(({ e, pct }) => (
              <article className="mycard" key={e.id}>
                <div className="th"><img src={img(e.course.thumbnailKey, 600)} alt="" /></div>
                <div className="b">
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem" }}>{e.course.title}</h3>
                  <div className="bar" style={{ margin: ".7rem 0 .4rem" }}><i style={{ width: `${pct}%` }} /></div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {pct === 100 ? <span className="tag tag-success">Selesai</span> : <span className="muted" style={{ fontSize: ".8rem" }}>{pct}%</span>}
                    <a href={pct === 100 ? "/sertifikat" : "/belajar"} className="btn btn-soft btn-sm">{pct === 100 ? "Sertifikat" : "Lanjut"}</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
