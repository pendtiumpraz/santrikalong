import { Countdown } from "@/components/Countdown";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const FATHOM = "https://fathom.video/share/REPLACE_WITH_RECORDING_ID";

export default async function Live() {
  const course = await prisma.course.findFirst({
    where: { type: "LIVE", status: "PUBLISHED", deletedAt: null },
    include: { ustadz: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
  });
  const judul = course?.title ?? "Sesi Live SantriKalong";
  const pengajar = course?.ustadz?.user?.name ?? "Ustadz SantriKalong";

  return (
    <div data-tabgroup>
      <div className="lvbar">
        <a href="/dashboard" className="icon-btn" aria-label="Kembali"><svg className="ico"><use href="#i-arrow-l" /></svg></a>
        <span style={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{judul}</span>
        <div className="seg" style={{ marginLeft: "auto" }}>
          <button data-tab="pre">Pra-Live</button>
          <button data-tab="live" aria-pressed="true">Live</button>
          <button data-tab="vod">Rekaman</button>
        </div>
        <button className="icon-btn" id="sk-mode-toggle" aria-label="Ganti mode"><svg className="ico" id="sk-mode-ic"><use href="#i-sun" /></svg></button>
      </div>

      {/* PRA-LIVE */}
      <section data-panel="pre" hidden>
        <div className="pre">
          <div className="bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1758458045183-7e7c453a0580?auto=format&fit=crop&w=1100&q=55')" }} />
          <div className="inner">
            <span className="tag tag-warn" style={{ margin: "0 auto" }}><svg className="ico ico-sm"><use href="#i-clock" /></svg>AKAN DIMULAI</span>
            <h1 style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)", marginTop: "1rem" }}>{judul}</h1>
            <p className="muted" style={{ marginTop: ".4rem" }}>Sabtu, 7 Juni 2026 · 20:00 WIB · bersama {pengajar}</p>
            <Countdown />
            <div style={{ display: "flex", gap: ".6rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn btn-primary btn-lg"><svg className="ico ico-sm"><use href="#i-bell" /></svg>Ingatkan Saya</button>
              <button className="btn btn-ghost btn-lg"><svg className="ico ico-sm"><use href="#i-clock" /></svg>Tambah ke Kalender</button>
            </div>
            <p className="muted" style={{ fontSize: ".84rem", marginTop: "1.4rem" }}><svg className="ico ico-sm" style={{ display: "inline", verticalAlign: "-3px" }}><use href="#i-users" /></svg> 86 santri sudah mendaftar</p>
            <div className="card card-pad" style={{ marginTop: "1.6rem", textAlign: "left", maxWidth: 420, marginLeft: "auto", marginRight: "auto" }}>
              <p style={{ fontWeight: 600, fontSize: ".9rem", marginBottom: ".5rem" }}>Yang perlu disiapkan</p>
              <ul className="muted" style={{ fontSize: ".86rem", listStyle: "none", display: "flex", flexDirection: "column", gap: ".4rem" }}>
                <li>• Sudah menonton materi Bab 1–2</li>
                <li>• Siapkan pertanyaan di tab Q&amp;A</li>
                <li>• Koneksi stabil &amp; tempat yang tenang</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE */}
      <section data-panel="live">
        <div className="lvgrid">
          <div className="stage">
            <div className="screen">
              <img src="https://images.unsplash.com/photo-1758458045183-7e7c453a0580?auto=format&fit=crop&w=1000&q=55" alt="" />
              <div className="badge-tl"><span className="tag tag-live"><span className="dot" />LIVE</span><span className="tag" style={{ background: "rgb(0 0 0/.5)", color: "#fff" }}>03:14:22</span></div>
              <button className="icon-btn" style={{ position: "relative", width: 72, height: 72, borderRadius: 999, background: "rgb(var(--brand))", color: "rgb(var(--brand-fg))", border: "none" }}><svg className="ico ico-lg"><use href="#i-play" /></svg></button>
            </div>
            <div className="controls">
              <button className="icon-btn" aria-label="Play"><svg className="ico"><use href="#i-play" /></svg></button>
              <div className="bar" style={{ flex: 1, background: "rgb(255 255 255/.2)" }}><i style={{ width: "60%", background: "rgb(var(--brand))" }} /></div>
              <button className="btn btn-sm" style={{ background: "rgb(255 255 255/.12)", color: "#fff" }}>HD</button>
              <button className="icon-btn" aria-label="Fullscreen"><svg className="ico"><use href="#i-grid" /></svg></button>
            </div>
          </div>
          <aside className="chat" data-tabgroup>
            <div className="tabs" style={{ padding: "0 1rem" }}><button data-tab="chat" aria-pressed="true">Chat</button><button data-tab="qna">Tanya (Q&amp;A)</button></div>
            <div className="msgs" data-panel="chat">
              <p className="msg"><b>Ahmad R.</b> Assalamu&apos;alaikum ustadz</p>
              <p className="msg host"><b>Ust. Abdullah</b> <span className="tag tag-success" style={{ fontSize: ".62rem" }}>Pengajar</span> Wa&apos;alaikumussalam, kita mulai ya.</p>
              <p className="msg"><b>Siti K.</b> Hadir dari Bandung</p>
              <p className="msg"><b>Budi S.</b> Bismillah</p>
              <p className="msg"><b>Fatimah</b> Suaranya jelas alhamdulillah</p>
            </div>
            <div className="msgs" data-panel="qna" hidden>
              <div className="card card-pad" style={{ padding: ".8rem" }}><p className="msg" style={{ marginBottom: ".4rem" }}><b>Ahmad R.</b> Apa beda ث dan س?</p><button className="btn btn-ghost btn-sm">▲ 12 dukung</button></div>
              <div className="card card-pad" style={{ padding: ".8rem" }}><p className="msg" style={{ marginBottom: ".4rem" }}><b>Siti K.</b> Rekamannya bisa diakses nanti?</p><button className="btn btn-ghost btn-sm">▲ 8 dukung</button></div>
            </div>
            <div style={{ padding: ".8rem 1rem", borderTop: "1px solid rgb(var(--border))", display: "flex", gap: ".5rem" }}><input className="input" placeholder="Tulis pesan…" /><button className="btn btn-primary btn-sm">Kirim</button></div>
          </aside>
        </div>
      </section>

      {/* REKAMAN (VOD via Fathom) */}
      <section data-panel="vod" hidden>
        <div className="lvgrid">
          <div className="stage">
            <iframe className="vodframe" src={FATHOM} title="Rekaman: Tanya Jawab Bab 1–2" allow="fullscreen; picture-in-picture" allowFullScreen referrerPolicy="no-referrer-when-downgrade" />
            <div className="controls" style={{ justifyContent: "space-between" }}>
              <span style={{ fontSize: ".78rem", display: "flex", alignItems: "center", gap: ".45rem" }}><svg className="ico ico-sm"><use href="#i-broadcast" /></svg>Direkam via Fathom</span>
              <a href={FATHOM} target="_blank" rel="noopener" className="btn btn-sm" style={{ background: "rgb(255 255 255/.12)", color: "#fff" }}>Buka di Fathom <svg className="ico ico-sm"><use href="#i-arrow" /></svg></a>
            </div>
          </div>
          <aside className="vodside">
            <div style={{ padding: ".9rem 1.1rem", borderBottom: "1px solid rgb(var(--border))", display: "flex", justifyContent: "space-between", alignItems: "center" }}><b>Bagian Rekaman</b><button className="btn btn-ghost btn-sm"><svg className="ico ico-sm"><use href="#i-receipt" /></svg>Transkrip</button></div>
            <div className="chap active"><span className="tm">00:00</span><span style={{ flex: 1 }}>Pembukaan &amp; doa</span></div>
            <div className="chap"><span className="tm">06:30</span><span style={{ flex: 1 }}>Review huruf hijaiyah</span></div>
            <div className="chap"><span className="tm">24:10</span><span style={{ flex: 1 }}>Tanya jawab: makhraj ث &amp; س</span></div>
            <div className="chap"><span className="tm">48:55</span><span style={{ flex: 1 }}>Latihan menyusun kalimat</span></div>
            <div className="chap"><span className="tm">1:12:00</span><span style={{ flex: 1 }}>Penutup &amp; PR pekan depan</span></div>
            <div style={{ padding: "1.1rem", borderTop: "1px solid rgb(var(--border))" }}>
              <p className="muted" style={{ fontSize: ".82rem", marginBottom: ".6rem" }}>Rekaman sesi Sabtu, 7 Jun 2026 — di-embed dari <b style={{ color: "rgb(var(--text))" }}>Fathom</b>, hanya untuk peserta terdaftar.</p>
              <button className="btn btn-soft btn-sm btn-block"><svg className="ico ico-sm"><use href="#i-check" /></svg>Tandai sudah ditonton</button>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
