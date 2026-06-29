import { PrismaPg } from "@prisma/adapter-pg";
import type { PrismaClient as PrismaClientCloudflare } from "./prisma/cloudflare/client.ts";
import type { PrismaClient as PrismaClientNodeJs } from "./prisma/nodejs/client.ts";
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
    const { PrismaClient } = await import("./prisma/cloudflare/client.ts");

    return new PrismaClient({
      adapter: new PrismaPg({
        connectionString: env.DATABASE_URL,
      }),
    });
  } else {
    const { PrismaClient } = await import("./prisma/nodejs/client.ts");

    return new PrismaClient({
      adapter: new PrismaPg({
        connectionString: env.DATABASE_URL,
      }),
    });
  }
}
