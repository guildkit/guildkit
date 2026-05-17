import type { auth } from "@guildkit/shared/auth";

export type HonoEnv = {
  Variables: {
    user?: typeof auth.$Infer.Session.user;
    session?: typeof auth.$Infer.Session.session;
  };
};
