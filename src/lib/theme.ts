// Theme engine — lihat docs/design/06. Dimensi: data-theme (mood) x data-mode (light/dark).
export const THEME_COOKIE = "sk_theme";
export const MODE_COOKIE = "sk_mode";
export const TEXT_COOKIE = "sk_text";

export const THEMES = ["pelita-malam", "kertas-subuh"] as const;
export const MODES = ["light", "dark"] as const;
export type ThemeId = (typeof THEMES)[number];
export type ModeId = (typeof MODES)[number];

export const DEFAULT_THEME: ThemeId = "pelita-malam";
export const DEFAULT_MODE: ModeId = "dark";

export const isTheme = (v?: string): v is ThemeId =>
  !!v && (THEMES as readonly string[]).includes(v);
export const isMode = (v?: string): v is ModeId =>
  !!v && (MODES as readonly string[]).includes(v);

/** Resolusi deterministik: pilihan user (cookie) menang; jika kosong → default. */
export function resolveTheme(input: {
  cookieTheme?: string;
  cookieMode?: string;
  cookieText?: string;
}) {
  return {
    theme: isTheme(input.cookieTheme) ? input.cookieTheme : DEFAULT_THEME,
    mode: isMode(input.cookieMode) ? input.cookieMode : DEFAULT_MODE,
    textLarge: input.cookieText === "large",
  };
}
