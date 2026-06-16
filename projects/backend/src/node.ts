import { serve } from "@hono/node-server";
import { guildKitBackend } from "./index.ts";

export const guildKitNodeJs = (...args: Parameters<typeof guildKitBackend>) => serve({
  fetch: guildKitBackend(...args).fetch,
  port: args[0].dev?.port ?? 3001,
});
