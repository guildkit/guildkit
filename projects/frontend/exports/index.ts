import { join } from "node:path";
import cloudflare from "@astrojs/cloudflare";
import nodejs from "@astrojs/node";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import type { GuildKitConfig } from "@guildkit/shared";
import type { AstroUserConfig } from "astro";

// `@astrojs/react` v6 depends on Vite 8 while Astro core still ships Vite 7, so
// `@tailwindcss/vite` is typed against a newer Vite than Astro's config expects.
// The plugin is runtime-compatible (the build passes); this reconciles the types.
type AstroVitePlugins = NonNullable<NonNullable<AstroUserConfig["vite"]>["plugins"]>;

type GuildKitAstroOptions = {
  wranglerConfigPath: string;
  backendBaseURL: string;
};
export const astroConfig = (
  {
    siteName,
    slug,
    servers,
  }: GuildKitConfig,
  {
    wranglerConfigPath,
    backendBaseURL,
  }: GuildKitAstroOptions
) => defineConfig({
  root: join(import.meta.dirname, "../app"),
  output: "server",
  build: {
    serverEntry: "entry.mjs",
  },

  integrations: [
    react(),
  ],

  adapter:
    servers.app === "nodejs" ? nodejs({ mode: "standalone" })
    : servers.app === "cloudflare" ? cloudflare({ configPath: wranglerConfigPath })
    : undefined,

  vite: {
    plugins: [ tailwindcss() ] as unknown as AstroVitePlugins,
    define: {
      __GUILDKIT_PUBLIC_CONFIG__: JSON.stringify({
        siteName,
        slug,
        backendBaseURL,
      }),
    },
  },

  server: {
    port: 3000,
  },
});
