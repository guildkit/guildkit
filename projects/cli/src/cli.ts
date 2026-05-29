#!/usr/bin/env node

import { mkdir, rm } from "node:fs/promises";
import { command, run } from "@drizzle-team/brocli";
import { GuildKitBackendTaskRunner } from "@guildkit/backend";
import { GuildKitFrontendTaskRunner } from "@guildkit/frontend";
import { getPaths } from "@guildkit/shared/cli";
import { loadConfig } from "c12";
import type { GuildKitConfig } from "@guildkit/shared";

const { config } = await loadConfig<GuildKitConfig>({
  configFile: "guildkit",
});

const cleanup = async () => {
  const { intermediateRootPath, distRootPath } = getPaths(process.cwd());
  await Promise.all([
    rm(intermediateRootPath),
    rm(distRootPath),
  ]);
  await Promise.all([
    mkdir(intermediateRootPath, { recursive: true }),
    mkdir(distRootPath, { recursive: true }),
  ]);
};

await run([
  command({
    name: "dev",
    handler: async () => {
      const cwdPath = process.cwd();

      await cleanup();

      const backend = new GuildKitBackendTaskRunner(config, cwdPath);
      const frontend = new GuildKitFrontendTaskRunner(config, cwdPath);

      await Promise([
        backend.dev(),
        frontend.dev(),
      ]);
    },
  }),
  command({
    name: "build",
    handler: async () => {
      const cwdPath = process.cwd();

      await cleanup();

      const backend = new GuildKitBackendTaskRunner(config, cwdPath);
      const frontend = new GuildKitFrontendTaskRunner(config, cwdPath);

      await Promise([
        backend.build(),
        frontend.build(),
      ]);
    },
  }),
]);
