import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "./src/index.ts",
    auth: "./src/auth.ts",
    cli: "./src/cli.ts",
    prisma: "./src/prisma.ts",
    zod: "./src/zod/index.ts",
  },
  format: [ "esm" ],

  dts: true,
  sourcemap: true,

  treeshake: false,
  minify: false,
  clean: true,
  publint: {
    level: "suggestion",
  },
});
