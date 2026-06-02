import { ConsentBox } from "@/components/ConsentBox";

function Mark() {
  return (
    <svg className="mark" viewBox="0 0 40 40" fill="none">
      <path d="M28 6a13 13 0 1 0 6 14 10 10 0 1 1-6-14Z" fill="currentColor" />
      <circle cx="30" cy="11" r="1.6" fill="currentColor" />
    </svg>
  );
}

export default function Auth() {
  return (
    <div className="auth">
      <div className="aside">
        <div className="bgimg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1758696229365-997adf6e4a1c?auto=format&fit=crop&w=900&q=55')" }} />
        <div className="inner">
          <svg className="lan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><use href="#i-lantern" /></svg>
          <h2 style={{ fontSize: "1.8rem", color: "rgb(var(--text))" }}>Cahaya di keheningan malam</h2>
          <p className="muted" style={{ marginTop: ".7rem" }}>Bergabung dengan 8.500+ santri yang menuntut ilmu dari rumah, kapan saja.</p>
        </div>
      </div>

      <div className="aform" data-tabgroup>
        <div className="fbox">
          <a href="/" className="brand" style={{ marginBottom: "1.6rem" }}><Mark />SantriKalong</a>
          <div className="tabs" style={{ marginBottom: "1.4rem" }}><button data-tab="login" aria-pressed="true">Masuk</button><button data-tab="register">Daftar</button></div>

          <div data-panel="login">
            <div className="field"><label className="label">Email atau No. HP</label><input className="input" placeholder="nama@email.com" /></div>
            <div className="field"><label className="label">Kata sandi</label><input className="input" type="password" placeholder="••••••••" /></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}><label className="check"><input type="checkbox" />Ingat saya</label><a href="#" style={{ fontSize: ".85rem", color: "rgb(var(--brand))" }}>Lupa sandi?</a></div>
            <a href="/dashboard" className="btn btn-primary btn-block btn-lg">Masuk</a>
            <button className="btn btn-ghost btn-block" style={{ marginTop: ".6rem" }}><svg className="ico ico-sm"><use href="#i-user" /></svg>Masuk dengan Google</button>
          </div>

          <div data-panel="register" hidden>
            <div className="field"><label className="label">Nama lengkap</label><input className="input" placeholder="Nama kamu" /></div>
            <div className="field"><label className="label">Email</label><input className="input" placeholder="nama@email.com" /></div>
            <div className="field"><label className="label">No. WhatsApp</label><input className="input" placeholder="08xxxxxxxxxx" /></div>
            <div className="field"><label className="label">Kata sandi</label><input className="input" type="password" placeholder="Min. 8 karakter" /></div>
            <ConsentBox />
            <a href="/onboarding-otp" className="btn btn-primary btn-block btn-lg">Daftar &amp; Verifikasi</a>
            <p className="help center" style={{ marginTop: ".7rem" }}>Kode OTP akan dikirim ke email/WA untuk verifikasi.</p>
            <p className="center muted" style={{ fontSize: ".85rem", marginTop: "1rem" }}>Mau jadi pengajar? <a href="/studio" style={{ color: "rgb(var(--brand))" }}>Daftar sebagai ustadz</a> (perlu menyetujui Akad Pengajar).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
