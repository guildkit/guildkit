import type { GuildKitConfig } from "guildkit";

// TODO make these items configurable by the GuildKit instance admins

const config: GuildKitConfig = {
  siteName: "GuildKit Demo",
  slug: "guildkit-demo",
  servers: {
    app: "cloudflare",
    storage: {
      client: {
        // TODO
      },
    },
  },
  dev: {
    port: 3001,
  },
};

export default config;
