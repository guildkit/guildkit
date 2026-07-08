import type { GuildKitConfig } from "@guildkit/shared";

declare const __GUILDKIT_PUBLIC_CONFIG__: Pick<GuildKitConfig, "siteName" | "slug"> & {
  backendBaseURL: string;
};

export const { siteName, slug, backendBaseURL } = __GUILDKIT_PUBLIC_CONFIG__;
