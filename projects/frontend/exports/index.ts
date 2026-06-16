import { join } from "node:path";
import cloudflare from "@astrojs/cloudflare";
import nodejs from "@astrojs/node";
import { defineConfig } from "astro/config";
import type { GuildKitConfig } from "@guildkit/shared";

type GuildKitAstroOptions = {
  wranglerConfigPath: string;
};
export const astroConfig = (
  {
    siteName,
    slug,
    servers,
  }: GuildKitConfig,
  {
    wranglerConfigPath,
  }: GuildKitAstroOptions
) => defineConfig({
  root: join(import.meta.dirname, "../app"),
  build: {
    serverEntry: "entry.mjs",
  },

  adapter:
    servers.app === "nodejs" ? nodejs({ mode: "standalone" })
    : servers.app === "cloudflare" ? cloudflare({ configPath: wranglerConfigPath })
    : undefined,

  vite: {
    define: {
      __GUILDKIT_PUBLIC_CONFIG__: JSON.stringify({
        siteName,
        slug,
      }),
    },
  },

  server: {
    port: 3000,
  },
});
