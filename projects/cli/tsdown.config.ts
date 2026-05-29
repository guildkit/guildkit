import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    "bin/cli": "./src/cli.ts",
    "dist/index": "./src/index.ts",
  },
  //outDir: "bin",
  format: [ "esm" ],
  target: "node24",

  dts: true,
  sourcemap: true,

  treeshake: false,
  minify: false,
  exports: true,
  clean: true,
});
