import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    prisma: "./exports/prisma.ts",
  },
  // dist/client/ and dist/server/ are used by Vinext.
  // Run tsdown after `vite build` because `vite build` empties dist/.
  outDir: "./dist/lib",
  platform: "node",
  format: [ "esm" ],
  target: "es2025",
  // Types are exported from the source files (see `exports` in package.json)
  dts: false,

  sourcemap: true,
  treeshake: false,
  minify: false,
  clean: true,

  publint: {
    level: "suggestion",
  },
});
