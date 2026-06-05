import { ConsentBox } from "@/components/ConsentBox";
import { loginAction, registerAction } from "./actions";

function Mark() {
  return (
    <svg className="mark" viewBox="0 0 40 40" fill="none">
      <path d="M28 6a13 13 0 1 0 6 14 10 10 0 1 1-6-14Z" fill="currentColor" />
      <circle cx="30" cy="11" r="1.6" fill="currentColor" />
    </svg>
  );
}

const ERRORS: Record<string, string> = {
  kredensial: "Email atau kata sandi salah.",
  form: "Lengkapi data, kata sandi minimal 8 karakter.",
  terdaftar: "Email sudah terdaftar. Silakan masuk.",
};

export default async function Auth({ searchParams }: { searchParams: Promise<{ error?: string; tab?: string }> }) {
  const sp = await searchParams;
  const err = sp.error ? ERRORS[sp.error] ?? "Terjadi kesalahan." : null;
  const startRegister = sp.tab === "register";

  return (
    <div className="auth">
      <div className="aside">
        <div className="bgimg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1758696229365-997adf6e4a1c?auto=format&fit=crop&w=900&q=55')" }} />
        <div className="inner">
          <svg className="lan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><use href="#i-lantern" /></svg>
          <h2 style={{ fontSize: "1.8rem", color: "rgb(var(--text))" }}>Cahaya di keheningan malam</h2>
          <p className="muted" style={{ marginTop: ".7rem" }}>Bergabung dengan santri yang menuntut ilmu dari rumah, kapan saja.</p>
        </div>
      </div>

      <div className="aform" data-tabgroup>
        <div className="fbox">
          <a href="/" className="brand" style={{ marginBottom: "1.6rem" }}><Mark />SantriKalong</a>
          <div className="tabs" style={{ marginBottom: "1.4rem" }}>
            <button data-tab="login" aria-pressed={!startRegister}>Masuk</button>
            <button data-tab="register" aria-pressed={startRegister}>Daftar</button>
          </div>

          {err && <div className="card card-pad" style={{ padding: ".8rem 1rem", marginBottom: "1rem", background: "rgb(var(--danger)/.1)", borderColor: "rgb(var(--danger)/.35)", color: "rgb(var(--danger))", fontSize: ".88rem" }}>{err}</div>}

          <div data-panel="login" hidden={startRegister}>
            <form action={loginAction}>
              <div className="field"><label className="label">Email</label><input className="input" name="email" type="email" placeholder="nama@email.com" required /></div>
              <div className="field"><label className="label">Kata sandi</label><input className="input" name="password" type="password" placeholder="••••••••" required /></div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}><label className="check"><input type="checkbox" name="remember" />Ingat saya</label><a href="#" style={{ fontSize: ".85rem", color: "rgb(var(--brand))" }}>Lupa sandi?</a></div>
              <button type="submit" className="btn btn-primary btn-block btn-lg">Masuk</button>
            </form>
            <button className="btn btn-ghost btn-block" style={{ marginTop: ".6rem" }} disabled><svg className="ico ico-sm"><use href="#i-user" /></svg>Masuk dengan Google (segera)</button>
          </div>

          <div data-panel="register" hidden={!startRegister}>
            <form action={registerAction}>
              <div className="field"><label className="label">Nama lengkap</label><input className="input" name="name" placeholder="Nama kamu" required /></div>
              <div className="field"><label className="label">Email</label><input className="input" name="email" type="email" placeholder="nama@email.com" required /></div>
              <div className="field"><label className="label">No. WhatsApp</label><input className="input" name="phone" placeholder="08xxxxxxxxxx" /></div>
              <div className="field"><label className="label">Kata sandi</label><input className="input" name="password" type="password" placeholder="Min. 8 karakter" minLength={8} required /></div>
              <ConsentBox />
              <button type="submit" className="btn btn-primary btn-block btn-lg">Daftar &amp; Verifikasi</button>
            </form>
            <p className="center muted" style={{ fontSize: ".85rem", marginTop: "1rem" }}>Mau jadi pengajar? <a href="/studio" style={{ color: "rgb(var(--brand))" }}>Daftar sebagai ustadz</a> (perlu menyetujui Akad Pengajar).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
