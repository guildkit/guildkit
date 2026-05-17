import { wasm } from "rolldown-plugin-wasm";
import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    auth: "./src/auth/index.ts",
    "prisma/cloudflare": "./src/prisma/clients/cloudflare/client.ts",
    "prisma/nodejs": "./src/prisma/clients/nodejs/client.ts",
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
  plugins: [
    wasm(),
  ],
});
