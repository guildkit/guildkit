import cloudflare from "@astrojs/cloudflare";
import netlify from "@astrojs/netlify";
import nodejs from "@astrojs/node";
import vercel from "@astrojs/vercel";
import { loadJSON } from "@phanect/utils/nodejs";
import { defineConfig } from "astro/config";
import type { GuildKitConfig } from "@guildkit/shared";

const guildKitConfig = await loadJSON<GuildKitConfig>("./guildkit.config.json");

export default defineConfig({
  adapter: guildKitConfig.servers.app === "nodejs" ? nodejs({ mode: "standalone" })
  : guildKitConfig.servers.app === "cloudflare" ? cloudflare()
  : guildKitConfig.servers.app === "netlify" ? netlify()
  : guildKitConfig.servers.app === "vercel" ? vercel()
  : undefined,
});
