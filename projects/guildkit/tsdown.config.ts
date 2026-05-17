import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    cli: "./exports/cli.ts",
  },
  format: [ "esm" ],

  dts: true,
  sourcemap: true,

  treeshake: false,
  minify: false,
  clean: true,
});
