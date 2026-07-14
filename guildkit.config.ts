import type { GuildKitConfig } from "./projects/guildkit/src/lib/configs.ts";

// TODO make these items configurable by the GuildKit instance admins

const config: GuildKitConfig = {
  siteName: "GuildKit Demo",
  storage: process.env.SERVER_ENV === "development" ? {
    platform: "development",
  } : {
    platform: "cloudflare",
  },
};

export default config;
