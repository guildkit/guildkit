import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    cli: "./bin/cli.ts",
    index: "./src/index.ts",
  },
  format: [ "esm" ],

  dts: true,
  sourcemap: true,

  treeshake: false,
  minify: false,
  clean: true,
});
