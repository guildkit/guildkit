import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "./src/index.ts",
    zod: "./src/zod/index.ts",
  },
  format: [ "esm" ],

  dts: true,
  sourcemap: true,

  treeshake: false,
  minify: false,
  clean: true,

  exports: {
    packageJson: false,
    inlinedDependencies: false,
  },
  publint: {
    level: "suggestion",
  },
});
