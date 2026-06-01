// Prisma client untuk Neon (serverless driver adapter).
// Lihat docs/backend/01-erd.md untuk skema. Jalankan `npm run db:generate` setelah edit schema.
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL belum di-set (lihat .env.example).");
  }
  // @prisma/adapter-neon v6 menerima PoolConfig (mengelola pool sendiri).
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
