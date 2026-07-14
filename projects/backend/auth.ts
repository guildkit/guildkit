import { PrismaPg } from "@prisma/adapter-pg";
import { initAuth } from "@guildkit/db";
import { PrismaClient } from "./src/lib/prisma/nodejs/client.ts";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

export const auth = initAuth(process.env, prisma);
