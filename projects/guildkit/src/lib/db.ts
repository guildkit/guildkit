import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/prisma";

// In Prisma 7 the connection URL is passed to the driver adapter, not the schema.
function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  return new PrismaClient({ adapter });
}

// Reuse a single instance across hot-reloads in development.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient; };

export const prisma: PrismaClient
  = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
