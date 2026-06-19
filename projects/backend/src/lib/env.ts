import type { Auth, Session, User } from "@guildkit/db/auth";
import type { Env, GuildKitConfig } from "@guildkit/shared";
import type { PrismaClient } from "./prisma";

export type HonoEnv = {
  Bindings: Env;
  Variables: {
    user?: User;
    session?: Session;
    auth?: Auth;
    prisma?: PrismaClient;
    config: GuildKitConfig;
  };
};
