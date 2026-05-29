import { auth } from "@guildkit/shared/auth";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { jobs } from "./routes/jobs.ts";
import { organizations } from "./routes/organizations.ts";
import type { GuildKitConfig } from "@guildkit/shared";
import type { HonoEnv } from "./lib/env.ts";

export const guildKitBackend = (config: GuildKitConfig) =>
  new Hono<HonoEnv>()
    .use("/*", (c, next) => {
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
    .on([ "POST", "GET" ], "/api/auth/*", (c) => auth.handler(c.req.raw))
    .route("/organizations", organizations)
    .route("/jobs", jobs);
