export const idr = (n: number) => (n <= 0 ? "Gratis" : "Rp " + n.toLocaleString("id-ID"));
export const img = (key: string | null | undefined, w = 600) =>
  key ? `https://images.unsplash.com/${key}?auto=format&fit=crop&w=${w}&q=55` : "";
