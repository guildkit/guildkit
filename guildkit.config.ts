import { env } from "node:process";
import type { GuildKitConfig } from "@/lib/configs.ts";

// TODO make these items configurable by the GuildKit instance admins

const config: GuildKitConfig = {
  storage: env.SERVER_ENV === "development" ? {
    platform: "development",
  } : {
    platform: "cloudflare",
  },
  currencies: [ "JPY", "KRW", "USD" ],
  maxLogoSizeMiB: 8,
};

export default config;
