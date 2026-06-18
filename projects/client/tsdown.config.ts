import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "./src/index.ts",
  },
  platform: "browser",
  format: [ "esm" ],
  target: "es2025",
  dts: true,

  sourcemap: true,
  treeshake: false,
  minify: false,
  clean: true,

  deps: {
    neverBundle: [ /^zod\/v4/ ],
  },

  exports: {
    packageJson: false,
  },
  publint: {
    level: "suggestion",
  },
});
