import { cloudflare } from "@cloudflare/vite-plugin";
import vinext from "vinext";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    vinext(),
    cloudflare({
      viteEnvironment: {
        name: "rsc",
        childEnvironments: [ "ssr" ],
      },
    }),
  ],
  resolve: {
    // Resolve the `@/` path alias in tsconfig.json
    tsconfigPaths: true,
  },
});
