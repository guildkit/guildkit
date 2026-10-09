import { PrismaPg } from "@prisma/adapter-pg";
import { cacheForRequest } from "vinext/cache";
import { PrismaClient } from "./prisma/cloudflare/client.ts";

/**
 * Get PrismaClient for the current request.
 * Cloudflare Workers do not allow to reuse the DB connection opened in another request,
 * so PrismaClient (and its connection pool) is created for each request.
 */
const getRequestPrisma = cacheForRequest(() => new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
}));

/**
 * PrismaClient that can be used as a module-level variable.
 * Every property access is forwarded to the PrismaClient for the current request.
 */
export const prisma = new Proxy({} as PrismaClient, {
  get: (_target, property) => {
    const client = getRequestPrisma();
    const value: unknown = Reflect.get(client, property, client);

    return typeof value === "function"
      ? (value as (...args: unknown[]) => unknown).bind(client)
      : value;
  },
});

export type { PrismaClient };
