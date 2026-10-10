import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/prisma/client.ts";

export const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
    // Cloudflare Workers does not allow reusing a connection (I/O object) created in another request.
    // Close each connection after use instead of keeping it in the pool for the subsequent requests.
    maxUses: 1,
  }),
});
