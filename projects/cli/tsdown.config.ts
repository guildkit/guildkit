import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    cli: "./src/cli.ts",
    index: "./src/index.ts",
  },
  format: [ "esm" ],

  dts: true,
  sourcemap: true,

  treeshake: false,
  minify: false,
  clean: true,
});
