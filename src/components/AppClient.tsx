"use client";
import { useEffect } from "react";

// Perilaku klien (desain awal): theme switcher + sprite-based icon mode toggle, tabs, sidebar, modal.
// Persist tema pakai COOKIE agar SSR konsisten (anti-FOUC) — lihat docs/design/06.
export function AppClient() {
  useEffect(() => {
    const root = document.documentElement;
    const setCookie = (k: string, v: string) => {
      document.cookie = `${k}=${v};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
    };
    const press = (sel: string, attr: string, val: string) =>
      document.querySelectorAll(sel).forEach((b) => b.setAttribute("aria-pressed", String(b.getAttribute(attr) === val)));
    const applyMode = () => {
      const m = root.getAttribute("data-mode");
      const ic = document.querySelector("#sk-mode-ic use");
      if (ic) ic.setAttribute("href", m === "dark" ? "#i-sun" : "#i-moon");
      press("[data-set-mode]", "data-set-mode", m || "");
    };
    const setTheme = (t: string) => { root.dataset.theme = t; setCookie("sk_theme", t); press("[data-set-theme]", "data-set-theme", t); };
    const setMode = (m: string) => { root.dataset.mode = m; setCookie("sk_mode", m); applyMode(); };
    const setText = (s: string) => { if (s === "large") root.dataset.textsize = "large"; else root.removeAttribute("data-textsize"); setCookie("sk_text", s); press("[data-set-text]", "data-set-text", s); };

    if (!document.getElementById("sk-switch")) {
      const d = document.createElement("div");
      d.id = "sk-switch";
      d.innerHTML =
        '<div class="panel"><p class="sw-title">Tema (mood)</p><div class="sw-themes">' +
        '<button class="sw-theme" data-set-theme="pelita-malam"><span class="sw-sw"><i style="background:#0E1A17"></i><i style="background:#CE9A33"></i><i style="background:#2F7A64"></i></span><b>Pelita Malam</b><span>Khusyuk</span></button>' +
        '<button class="sw-theme" data-set-theme="kertas-subuh"><span class="sw-sw"><i style="background:#FBFCFD;border:1px solid #ddd"></i><i style="background:#2F6F8F"></i><i style="background:#7FB6CE"></i></span><b>Kertas Subuh</b><span>Bersih</span></button>' +
        '</div><p class="sw-title">Mode</p><div class="sw-row"><div class="seg">' +
        '<button data-set-mode="light"><svg class="ico ico-sm"><use href="#i-sun"/></svg>Terang</button>' +
        '<button data-set-mode="dark"><svg class="ico ico-sm"><use href="#i-moon"/></svg>Gelap</button>' +
        '</div></div><p class="sw-title">Aksesibilitas</p><div class="seg" style="display:flex">' +
        '<button data-set-text="normal" style="flex:1;justify-content:center">Teks normal</button>' +
        '<button data-set-text="large" style="flex:1;justify-content:center"><svg class="ico ico-sm"><use href="#i-text"/></svg>Besar</button>' +
        '</div></div><button class="fab" aria-label="Tema & tampilan"><svg class="ico" style="width:22px;height:22px"><use href="#i-palette"/></svg></button>';
      document.body.appendChild(d);
      d.querySelector(".fab")!.addEventListener("click", () => d.classList.toggle("open"));
      d.querySelectorAll<HTMLElement>("[data-set-theme]").forEach((b) => (b.onclick = () => setTheme(b.dataset.setTheme!)));
      d.querySelectorAll<HTMLElement>("[data-set-mode]").forEach((b) => (b.onclick = () => setMode(b.dataset.setMode!)));
      d.querySelectorAll<HTMLElement>("[data-set-text]").forEach((b) => (b.onclick = () => setText(b.dataset.setText!)));
    }

    press("[data-set-theme]", "data-set-theme", root.getAttribute("data-theme") || "");
    applyMode();
    press("[data-set-text]", "data-set-text", root.getAttribute("data-textsize") === "large" ? "large" : "normal");

    const mt = document.getElementById("sk-mode-toggle");
    const onMode = () => setMode(root.getAttribute("data-mode") === "dark" ? "light" : "dark");
    mt?.addEventListener("click", onMode);

    const nav = document.querySelector("header.nav");
    const onScroll = () => nav && !nav.classList.contains("solid") && nav.classList.toggle("scrolled", window.scrollY > 20);
    if (nav && !nav.classList.contains("solid")) { window.addEventListener("scroll", onScroll, { passive: true }); onScroll(); }

    const handlers: Array<[Element, string, EventListener]> = [];
    document.querySelectorAll<HTMLElement>("[data-tab]").forEach((btn) => {
      const h = () => {
        const group = btn.closest("[data-tabgroup]") || document;
        group.querySelectorAll("[data-tab]").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
        const sel = btn.getAttribute("data-tab")!.replace("#", "");
        group.querySelectorAll<HTMLElement>("[data-panel]").forEach((p) => (p.hidden = p.getAttribute("data-panel") !== sel));
      };
      btn.addEventListener("click", h); handlers.push([btn, "click", h as EventListener]);
    });
    document.querySelectorAll<HTMLElement>("[data-view]").forEach((btn) => {
      const h = () => {
        document.querySelectorAll("[data-view]").forEach((b) => b.classList.toggle("active", b === btn));
        const id = btn.getAttribute("data-view");
        document.querySelectorAll<HTMLElement>("[data-pane]").forEach((p) => (p.hidden = p.getAttribute("data-pane") !== id));
        const tt = document.getElementById("sk-page-title"); if (tt && btn.dataset.title) tt.textContent = btn.dataset.title;
        document.querySelector(".sidebar")?.classList.remove("open");
      };
      btn.addEventListener("click", h); handlers.push([btn, "click", h as EventListener]);
    });
    document.getElementById("sk-sb-toggle")?.addEventListener("click", () => document.querySelector(".sidebar")?.classList.toggle("open"));
    document.querySelectorAll<HTMLElement>("[data-toggle]").forEach((b) => b.addEventListener("click", () => document.querySelector(b.getAttribute("data-toggle")!)?.classList.toggle("show")));
    document.querySelectorAll<HTMLElement>("[data-open]").forEach((b) => b.addEventListener("click", () => document.querySelector(b.getAttribute("data-open")!)?.classList.add("open")));
    document.querySelectorAll<HTMLElement>("[data-close]").forEach((b) => b.addEventListener("click", () => b.closest(".overlay,.drawer")?.classList.remove("open")));
    document.querySelectorAll<HTMLElement>(".overlay").forEach((o) => o.addEventListener("click", (e) => { if (e.target === o) o.classList.remove("open"); }));

    return () => {
      mt?.removeEventListener("click", onMode);
      window.removeEventListener("scroll", onScroll);
      handlers.forEach(([el, ev, h]) => el.removeEventListener(ev, h));
    };
  }, []);

  return null;
}
