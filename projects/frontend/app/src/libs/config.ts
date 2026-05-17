import type { GuildKitConfig } from "@guildkit/shared";

declare const __GUILDKIT_PUBLIC_CONFIG__: Pick<GuildKitConfig, "siteName" | "slug">;

export const { siteName, slug } = __GUILDKIT_PUBLIC_CONFIG__;
