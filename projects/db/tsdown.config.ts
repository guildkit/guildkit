import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "./src/auth/index.ts",
  format: [ "esm" ],
  deps: {
    // Declared in the root package.json instead to avoid the cyclic workspace dependencies
    neverBundle: [ /^@guildkit\/backend(\/|$)/ ],
  },

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
