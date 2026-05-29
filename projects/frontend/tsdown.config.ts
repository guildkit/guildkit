import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    cli: "./exports/cli.ts",
  },
  format: [ "esm" ],
  target: "es2025",

  dts: true,
  sourcemap: true,

  treeshake: false,
  minify: false,
  clean: true,

  publint: {
    level: "suggestion",
  },
});
