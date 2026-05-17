import { wasm } from "rolldown-plugin-wasm";
import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "./src/index.ts",
    nodejs: "./src/node.ts",
  },
  platform: "node",
  format: [ "esm" ],
  target: "es2025",
  dts: true,

  sourcemap: true,
  treeshake: false,
  minify: false,
  clean: true,

  plugins: [
    wasm(),
  ],
  exports: {
    packageJson: false,
    inlinedDependencies: false,
  },
  publint: {
    level: "suggestion",
  },
});
