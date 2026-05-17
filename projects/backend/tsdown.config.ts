import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "./src/index.ts",
    nodejs: "./src/node.ts",
  },
  platform: "neutral",
  format: [ "esm" ],
  target: "es2025",
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
