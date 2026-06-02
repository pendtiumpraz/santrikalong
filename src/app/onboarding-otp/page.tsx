export default function OnboardingOtp() {
  return (
    <div className="otp-wrap">
      <div className="card card-pad center" style={{ maxWidth: 420, width: "100%", padding: "2rem" }}>
        <span className="avatar" style={{ width: 60, height: 60, margin: "0 auto", background: "rgb(var(--brand-subtle)/.16)", color: "rgb(var(--brand))" }}><svg className="ico ico-lg"><use href="#i-shield" /></svg></span>
        <h1 style={{ fontSize: "1.5rem", marginTop: "1rem" }}>Verifikasi akunmu</h1>
        <p className="muted" style={{ fontSize: ".9rem", marginTop: ".4rem" }}>Kami kirim 6 digit kode ke <b style={{ color: "rgb(var(--text))" }}>ahmad@mail.com</b> &amp; WhatsApp.</p>
        <div className="otp"><input maxLength={1} defaultValue="8" /><input maxLength={1} defaultValue="2" /><input maxLength={1} defaultValue="4" /><input maxLength={1} /><input maxLength={1} /><input maxLength={1} /></div>
        <a href="/dashboard" className="btn btn-primary btn-block btn-lg">Verifikasi</a>
        <p className="muted" style={{ fontSize: ".85rem", marginTop: "1rem" }}>Belum dapat kode? <a href="#" style={{ color: "rgb(var(--brand))" }}>Kirim ulang (00:42)</a></p>
      </div>
    </div>
  );
}
