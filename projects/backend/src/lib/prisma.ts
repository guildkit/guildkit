import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./prisma/cloudflare/client.ts";
import type { Env } from "@guildkit/shared";

/**
 * Initialize PrismaClient.
 * @param env - Environmental variables
 * @param platform - Platform (Node.js or Cloudflare)
 * @returns BetterAuth's auth object
 */
export async function initPrisma(env: Env): Promise<PrismaClient> {
  return new PrismaClient({
    adapter: new PrismaPg({
      connectionString: env.DATABASE_URL,
    }),
  });
}
