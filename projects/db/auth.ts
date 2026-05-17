import { PrismaPg } from "@prisma/adapter-pg";
import { initAuth } from "./src/auth";
import { PrismaClient } from "./src/prisma/clients/nodejs/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

export const auth = initAuth(process.env, prisma);
