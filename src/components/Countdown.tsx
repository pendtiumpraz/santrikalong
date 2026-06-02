"use client";
import { useEffect, useState } from "react";

// Hitung mundur pra-live (ticking tiap detik).
export function Countdown({ h = 2, m = 14, s = 36 }: { h?: number; m?: number; s?: number }) {
  const [t, setT] = useState({ h, m, s });
  useEffect(() => {
    const id = setInterval(() => {
      setT((p) => {
        let { h, m, s } = p;
        if (s > 0) s--; else if (m > 0) { s = 59; m--; } else if (h > 0) { s = 59; m = 59; h--; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="cdwrap">
      <div className="cdbox"><b>{p(t.h)}</b><span>Jam</span></div>
      <div className="cdbox"><b>{p(t.m)}</b><span>Menit</span></div>
      <div className="cdbox"><b>{p(t.s)}</b><span>Detik</span></div>
    </div>
  );
}
