#!/usr/bin/env node

import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { command, run } from "@drizzle-team/brocli";
import { guildKitNodeJs } from "@guildkit/backend/nodejs";
import { astroConfig } from "@guildkit/frontend";
import { GuildKitConfigSchema } from "@guildkit/shared";
import { build as buildAstro, dev as astroDev } from "astro";
import { loadConfig } from "c12";
import { build as buildWithRollDown } from "rolldown";
import { wasm } from "rolldown-plugin-wasm";
import { unstable_dev as wranglerDev } from "wrangler";
import type { GuildKitConfig } from "@guildkit/shared";
import { seed } from "./cli/seed.ts";

const cwdPath = process.cwd();
const intermediateRootPath = join(cwdPath, ".guildkit/intermediate");
const intermediateBackendPath = join(intermediateRootPath, "backend");
const intermediateFrontendPath = join(intermediateRootPath, "frontend");
const intermediateBackendConfigDirPath = join(intermediateBackendPath, "config");
const intermediateBackendConfigPath = join(intermediateBackendConfigDirPath, "config/guildkit.config.js");
const distRootPath = join(cwdPath, "dist");
const distBackendPath = join(distRootPath, "backend");
const distFrontendPath = join(distRootPath, "frontend");

const backendDevPort = 3001;
// TODO: derive the deployed backend origin for production builds instead of
// always pointing the frontend (BFF) at the local backend dev server.
const backendBaseURL = `http://localhost:${ backendDevPort }`;

const prepare = async () => {
  const srcAppRootPath = join(import.meta.dirname, "../template"); // relative to bin/guildkit-helpers.mjs

  await Promise.all([
    rm(intermediateRootPath, { recursive: true, force: true }),
    rm(distRootPath, { recursive: true, force: true }),
  ]);

  await cp(srcAppRootPath, intermediateRootPath, {
    recursive: true,
    // guildkit.config.mjs in the source template is dummy.
    // It should be overwritten later.
    filter: (_, dest) => dest !== intermediateBackendConfigPath,
  });

  const { config: rawConfig, configFile: userConfigPath } = await loadConfig({
    name: "guildkit",
    configFileRequired: true,
  });

  const config = GuildKitConfigSchema.parse(rawConfig);

  if (userConfigPath?.endsWith(".cjs") || userConfigPath?.endsWith(".cts")) {
    throw new Error("guildkit.config.[cjs|cts] (CommonJS) is not supported.");
  } else if (userConfigPath?.endsWith(".ts") || userConfigPath?.endsWith(".mts")) {
    await buildWithRollDown({
      input: userConfigPath,
      output: {
        dir: intermediateBackendConfigDirPath,
        format: "esm",
        codeSplitting: false,
      },
      platform: "neutral",
    });
  } else if (userConfigPath?.endsWith(".js") || userConfigPath?.endsWith(".mjs")) {
    await cp(userConfigPath, intermediateBackendConfigPath);
  } else { // JSON, YAML, TOML, etc.
    await writeFile(
      join(intermediateBackendConfigPath),
      `export default ${ JSON.stringify(config) };`
    );
  }

  if (config.servers.app === "cloudflare") {
    await mkdir(intermediateFrontendPath);

    await Promise.all([
      // Backend
      writeFile(
        join(intermediateBackendPath, "wrangler.json"),
        JSON.stringify({
          name: `${ config.slug }-backend`,
          main: "./cloudflare.ts",

          compatibility_date: "2026-06-02",
          compatibility_flags: [
            "nodejs_compat",
          ],
        })
      ),
      // Frontend
      writeFile(
        join(intermediateFrontendPath, "wrangler.json"),
        JSON.stringify({
          name: `${ config.slug }-frontend`,
          compatibility_date: "2026-06-02",
          compatibility_flags: [
            "nodejs_compat",
          ],
          assets: {
            directory: "public",
          },
        })
      ),
    ]);
  }

  return config;
};

await run([
  command({
    name: "dev",
    handler: async () => {
      const devBackend = async (guildKitConfig: GuildKitConfig) => {
        if (guildKitConfig.servers.app === "cloudflare") {
          await wranglerDev(
            join(intermediateBackendPath, "cloudflare.ts"),
            {
              config: join(intermediateBackendPath, "wrangler.json"),
              port: backendDevPort,
            }
          );
        } else {
          console.info("Starting server with Node.js...");
          const server = guildKitNodeJs(guildKitConfig);
          const addressInfo = server.address();

          if (addressInfo) {
            console.info(`Running backend server at ${ typeof addressInfo === "string" ? addressInfo : `http://localhost:${ addressInfo?.port }` }`);
          }
        }
      };
      const devFrontend = async (guildKitConfig: GuildKitConfig) => {
        const astroDevConfig = astroConfig(guildKitConfig, {
          wranglerConfigPath: join(intermediateFrontendPath, "wrangler.json"),
          backendBaseURL,
        });

        const {
          address: {
            address,
            port,
          },
        } = await astroDev(astroDevConfig);

        console.info(`Running frontend (BFF) server at http://${ address }:${ port }`);
      };

      const config = await prepare();

      await Promise.all([
        devBackend(config),
        devFrontend(config),
      ]);
    },
  }),
  command({
    name: "build",
    handler: async () => {
      const config = await prepare();

      await Promise.all([
        // backend
        buildWithRollDown({
          input: {
            guildkit: config.servers.app === "cloudflare"
              ? join(intermediateBackendPath, "cloudflare.ts")
              : join(intermediateBackendPath, "nodejs.ts"),
          },
          output: {
            dir: distBackendPath,
            format: "esm",
            codeSplitting: true,
            minify: "dce-only",
          },
          platform: "node",
          external: [
            // BetterAuth depends optionally depends on it, but not necessary to install.
            "@opentelemetry/api",
          ],
          plugins: [
            wasm(),
          ],
        }),

        // frontend
        buildAstro({
          ...astroConfig(config, {
            wranglerConfigPath: join(intermediateFrontendPath, "wrangler.json"),
            backendBaseURL,
          }),
          outDir: distFrontendPath,
        }),
      ]);
    },
  }),
  command({
    name: "seed",
    handler: async () => seed(),
  }),
]);
