// Prisma client (Neon Postgres via TCP, Node runtime). Lihat docs/backend/01-erd.md.
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function datasourceUrl(): string {
  let url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL belum di-set (lihat .env.example).");
  // Neon pooled endpoint (pgbouncer) — matikan prepared statements agar aman.
  if (!/[?&]pgbouncer=/.test(url)) url += (url.includes("?") ? "&" : "?") + "pgbouncer=true";
  return url;
}

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ datasourceUrl: datasourceUrl() });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
