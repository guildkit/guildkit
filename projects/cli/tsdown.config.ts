import { defineConfig } from "tsdown";

const commonConfig = defineConfig({
  format: [ "esm" ],
  platform: "node",

  minify: false,
  clean: true,

  exports: {
    packageJson: false,
    exclude: [ "guildkit" ],
  },
  publint: {
    level: "suggestion",
  },
});

export default defineConfig([
  {
    ...commonConfig,

    entry: "./src/index.ts",
    outDir: "dist",
    dts: true,
    sourcemap: true,
    treeshake: false,
  },
  {
    ...commonConfig,

    entry: {
      guildkit: "./src/cli.ts",
    },
    outDir: "bin",
    dts: false,
    sourcemap: false,
    treeshake: true,
  },
]);
