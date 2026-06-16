import type { Session, User } from "@guildkit/db/auth";
import type { Env, GuildKitConfig } from "@guildkit/shared";

export type HonoEnv = {
  Bindings: Env;
  Variables: {
    user?: User;
    session?: Session;
    config: GuildKitConfig;
  };
};
