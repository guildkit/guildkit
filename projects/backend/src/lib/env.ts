import type { auth } from "@guildkit/shared/auth";
import type { GuildKitConfig } from "guildkit/config";

export type HonoEnv = {
  Variables: {
    user?: typeof auth.$Infer.Session.user;
    session?: typeof auth.$Infer.Session.session;
    config: GuildKitConfig;
  };
};
