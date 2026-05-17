import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "./exports/index.ts",
  format: [ "esm" ],
  platform: "node",

  dts: true,
  sourcemap: true,

  treeshake: false,
  minify: false,
  clean: true,

  exports: {
    packageJson: false,
  },
  publint: {
    level: "suggestion",
  },
});
