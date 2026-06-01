import type { Config } from "tailwindcss";

// Token peran dipetakan dari CSS variables (lihat globals.css & docs/design/06).
// Util digenerate sekali; nilainya ikut cascade data-theme x data-mode.
const rgb = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

export default {
  darkMode: ["selector", '[data-mode="dark"] &'],
  content: ["./src/**/*.{ts,tsx,mdx}"],
  // Matikan preflight: pakai reset dari globals.css (port dari prototype) agar 100% identik.
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        bg: rgb("--bg"),
        surface: rgb("--surface"),
        "surface-alt": rgb("--surface-alt"),
        border: rgb("--border"),
        divider: rgb("--divider"),
        fg: rgb("--text"),
        muted: rgb("--text-muted"),
        brand: rgb("--brand"),
        "brand-hover": rgb("--brand-hover"),
        "brand-fg": rgb("--brand-fg"),
        "brand-subtle": rgb("--brand-subtle"),
        "accent-2": rgb("--accent-2"),
        ring: rgb("--ring"),
        success: rgb("--success"),
        warning: rgb("--warning"),
        danger: rgb("--danger"),
        info: rgb("--info"),
        live: rgb("--live"),
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "var(--r-sm)",
        md: "var(--r-md)",
        lg: "var(--r-lg)",
        xl: "var(--r-xl)",
      },
      boxShadow: {
        e1: "0 1px 2px rgb(var(--shadow-color) / calc(var(--shadow-strength) * .75))",
        e2: "0 4px 16px rgb(var(--shadow-color) / var(--shadow-strength))",
        e3: "0 12px 40px rgb(var(--shadow-color) / calc(var(--shadow-strength) * 3))",
        glow: "0 0 24px rgb(var(--glow-color) / var(--glow-strength))",
      },
      transitionTimingFunction: { calm: "var(--ease)" },
    },
  },
  plugins: [],
} satisfies Config;
