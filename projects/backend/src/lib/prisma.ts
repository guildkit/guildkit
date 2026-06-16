import { PrismaPg } from "@prisma/adapter-pg";
import type { PrismaClient as PrismaClientCloudflare } from "@guildkit/db/prisma/cloudflare";
import type { PrismaClient as PrismaClientNodeJs } from "@guildkit/db/prisma/nodejs";
import type { Env, GuildKitConfig } from "@guildkit/shared";

type Platform = GuildKitConfig["servers"]["app"];

export class PrismaInitializer {
  private static instance: PrismaInitializer;
  #prisma: PrismaClientNodeJs | PrismaClientCloudflare | undefined;

  constructor() {
    if (PrismaInitializer.instance) {
      return PrismaInitializer.instance;
    }

    PrismaInitializer.instance = this;
  }

  async getPrismaClient(env: Env, platform: Platform): Promise<PrismaClientNodeJs | PrismaClientCloudflare> {
    if (!this.#prisma) {
      if (platform === "cloudflare") {
        const { PrismaClient } = await import("@guildkit/db/prisma/cloudflare");

        this.#prisma = new PrismaClient({
          adapter: new PrismaPg({
            connectionString: env.DATABASE_URL,
          }),
        });
      } else {
        const { PrismaClient } = await import("@guildkit/db/prisma/nodejs");

        this.#prisma = new PrismaClient({
          adapter: new PrismaPg({
            connectionString: env.DATABASE_URL,
          }),
        });
      }
    }

    return this.#prisma;
  }
}

/**
 * Initialize PrismaClient.
 * @param env - Environmental variables
 * @param platform - Platform (Node.js or Cloudflare)
 * @returns BetterAuth's auth object
 */
export const initPrisma = async (env: Env, platform: Platform) =>
  new PrismaInitializer().getPrismaClient(env, platform);
