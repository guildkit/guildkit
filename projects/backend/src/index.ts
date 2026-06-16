import { initAuth } from "@guildkit/db/auth";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { initPrisma } from "./lib/prisma.ts";
import { jobs } from "./routes/jobs.ts";
import { organizations } from "./routes/organizations.ts";
import type { GuildKitConfig } from "@guildkit/shared";
import type { HonoEnv } from "./lib/env.ts";

export const guildKitBackend = (config: GuildKitConfig) =>
  new Hono<HonoEnv>()
    .use("/*", async (c, next) => {
      c.set("config", config);

      return next();
    })
    .use("/api/auth/*", cors({
      origin: "http://localhost:3001", // TODO replace with the origin
      allowHeaders: [ "Content-Type", "Authorization" ],
      allowMethods: [ "POST", "GET", "OPTIONS" ],
      exposeHeaders: [ "Content-Length" ],
      maxAge: 600,
      credentials: true,
    }))
    .on([ "POST", "GET" ], "/api/auth/*", async (c) => {
      const appServerName = c.get("config").servers.app;
      const prisma = await initPrisma(c.env, appServerName);
      const auth = initAuth(c.env, prisma);
      return auth.handler(c.req.raw);
    })
    .route("/", organizations)
    .route("/", jobs);
