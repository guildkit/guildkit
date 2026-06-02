#!/usr/bin/env -S pnpm exec jiti

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { serve, ServerType } from "@hono/node-server";
import { guildKitBackend } from "../../../src/index.ts";
import type { GuildKitConfig } from "@guildkit/shared";

const outputPath = resolve(import.meta.dirname, "../../../intermediate/openapi.json");

const config: GuildKitConfig = {
  slug: "openapi-docs-build",
  siteName: "OpenAPI Docs Build",
  servers: {
    app: "nodejs",
    storage: {
      client: {},
    },
  },
};

const app = guildKitBackend(config);

const server = await new Promise<ServerType>((resolve) => {
  const _server: ServerType = serve({
    fetch: app.fetch,
    port: 3001
  }, () => resolve(_server));
});

try {
  const res = await fetch(`http://localhost:3001/docs`);

  if (!res.ok) {
    throw new Error(`Failed to fetch /docs: ${res.status} ${res.statusText}`);
  }

  const doc = await res.json();

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(doc, null, 2)}\n`);

  console.log(`Wrote OpenAPI spec to ${outputPath}`);
} finally {
  server.close();
}
