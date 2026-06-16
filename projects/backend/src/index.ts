import { initAuth } from "@guildkit/db/auth";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { initPrisma } from "./lib/prisma.ts";
import { jobs } from "./routes/jobs.ts";
import { organizations } from "./routes/organizations.ts";
import type { GuildKitConfig } from "@guildkit/shared";
import type { HonoEnv } from "./lib/env.ts";

export const guildKitBackend = (config: GuildKitConfig) =>
  new OpenAPIHono<HonoEnv>()
    .doc("/docs", {
      openapi: "3.0.0",
      info: {
        version: "1.0.0",
        title: "GuildKit API",
      },
    })
    .use("/*", async (c, next) => {
      c.set("config", config);

      const prisma = await initPrisma(c.env, config.servers.app)
      c.set("prisma", prisma);
      c.set("auth", initAuth(c.env, prisma));

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
    .on(["POST", "GET"], "/api/auth/*", async (c) => c.get("auth")?.handler(c.req.raw))
    .get("/healthcheck", async (c) => c.body("Active!"))
    .route("/", organizations)
    .route("/", jobs);
