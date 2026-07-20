import "dotenv/config";
import { join } from "node:path";
import { toMerged } from "es-toolkit";
import { defineConfig, env, type PrismaConfig } from "prisma/config";

export { initPrisma } from "../src/lib/prisma.ts";

export const definePrismaConfig = (config: PrismaConfig = {}): PrismaConfig => defineConfig(
  toMerged(
    config,
    {
      schema: join(import.meta.dirname, "../prisma/"),
      migrations: {
        path: join(process.cwd(), "prisma/migrations"),
      },
      datasource: {
        url: env("DATABASE_URL"),
      },
    } satisfies PrismaConfig,
  )
);

export type { PrismaClient } from "../src/lib/prisma.ts";
