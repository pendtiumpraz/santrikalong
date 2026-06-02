"use client";
import { useState } from "react";

// Persetujuan register: "Setujui semua" (toggle) + "Lihat detail" (expand) + toggle per item.
const ITEMS = [
  { key: "tos", label: "Syarat & Ketentuan + Privasi", req: true, desc: "Diperlukan untuk membuat akun." },
  { key: "email", label: "Info promosi via Email", desc: "Kelas baru & penawaran." },
  { key: "wa", label: "Info promosi via WhatsApp", desc: "Pengingat & penawaran." },
];

export function ConsentBox() {
  const [open, setOpen] = useState(false);
  const [checks, setChecks] = useState<Record<string, boolean>>({ tos: false, email: false, wa: false });
  const all = ITEMS.every((i) => checks[i.key]);
  const setAll = (v: boolean) => setChecks({ tos: v, email: v, wa: v });
  const setOne = (k: string, v: boolean) => setChecks((c) => ({ ...c, [k]: v }));

  return (
    <div className="consent">
      <div className="consent-top">
        <div><p className="consent-title">Setujui semua</p><p className="muted" style={{ fontSize: ".78rem" }}>Syarat &amp; Ketentuan, Privasi, dan info promosi</p></div>
        <label className="switch-toggle"><input type="checkbox" checked={all} onChange={(e) => setAll(e.target.checked)} /><span className="sl" /></label>
      </div>
      <button type="button" className="consent-more" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        Lihat detail &amp; atur sendiri <svg className="ico ico-sm"><use href="#i-chevron-d" /></svg>
      </button>
      {open && (
        <div className="consent-list">
          {ITEMS.map((i) => (
            <div className="consent-row" key={i.key}>
              <div><b>{i.label}</b>{i.req && <span className="creq">wajib</span>}<p className="muted" style={{ fontSize: ".76rem", marginTop: ".15rem" }}>{i.desc}</p></div>
              <label className="switch-toggle"><input type="checkbox" checked={checks[i.key]} onChange={(e) => setOne(i.key, e.target.checked)} /><span className="sl" /></label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
