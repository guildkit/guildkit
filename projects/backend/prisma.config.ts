import { definePrismaConfig } from "./exports/prisma.ts";

const config = definePrismaConfig({
  migrations: {
    seed: "pnpm run seed",
  },
});

export default config;
