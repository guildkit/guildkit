import { PrismaPg } from "@prisma/adapter-pg";
import type { PrismaClient as PrismaClientCloudflare } from "@guildkit/db/prisma/cloudflare";
import type { PrismaClient as PrismaClientNodeJs } from "@guildkit/db/prisma/nodejs";
import type { Env, GuildKitConfig } from "@guildkit/shared";

type Platform = GuildKitConfig["servers"]["app"];

export type PrismaClient = PrismaClientNodeJs | PrismaClientCloudflare;

/**
 * Initialize PrismaClient.
 * @param env - Environmental variables
 * @param platform - Platform (Node.js or Cloudflare)
 * @returns BetterAuth's auth object
 */
export async function initPrisma(env: Env, platform: "cloudflare"): Promise<PrismaClientCloudflare>;
export async function initPrisma(env: Env, platform: "nodejs"): Promise<PrismaClientNodeJs>;
export async function initPrisma(env: Env, platform: Platform): Promise<PrismaClient> {
  if (platform === "cloudflare") {
    const { PrismaClient } = await import("@guildkit/db/prisma/cloudflare");

    return new PrismaClient({
      adapter: new PrismaPg({
        connectionString: env.DATABASE_URL,
      }),
    });
  } else {
    const { PrismaClient } = await import("@guildkit/db/prisma/nodejs");

    return new PrismaClient({
      adapter: new PrismaPg({
        connectionString: env.DATABASE_URL,
      }),
    });
  }
}
