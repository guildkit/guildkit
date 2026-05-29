import { cp, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getPaths } from "@guildkit/shared/cli";
import { build, dev } from "astro";
import { experimental_generateTypes as generateCloudflareTypes } from "wrangler";
import packageJson from "../package.json";
import type { GuildKitConfig } from "@guildkit/shared";

export class GuildKitFrontendTaskRunner {
  #config: GuildKitConfig;
  #cwdPath: string;
  #srcAppRootPath = join(import.meta.dirname, "../template");

  constructor(config: GuildKitConfig, cwdPath: string) {
    this.#config = config;
    this.#cwdPath = cwdPath;
  }

  async #copyIntermediateSource() {
    const { intermediateFrontendPath } = getPaths(this.#cwdPath);

    console.info("Setting up GuildKit frontend source code...");

    // Copy GuildKit frontend app
    await cp(this.#srcAppRootPath, intermediateFrontendPath, { recursive: true });

    await writeFile(
      join(intermediateFrontendPath, "package.json"),
      JSON.stringify(packageJson),
    );

    await writeFile(
      join(intermediateFrontendPath, "tsconfig.json"),
      JSON.stringify({
        extends: "astro/tsconfigs/strict",
        compilerOptions: {
          types: [
            this.#config.servers.app === "cloudflare" ? "./worker-configuration.d.ts" : "node",
          ],
        },
        include: [
          ".astro/types.d.ts",
          "**/*",
        ],
        exclude: [
          "dist",
        ],
      }
      ),
    );

    await writeFile(
      join(intermediateFrontendPath, "guildkit.config.json"),
      JSON.stringify(this.#config),
    );

    if (this.#config.servers.app === "cloudflare") {
      await writeFile(
        join(intermediateFrontendPath, "wrangler.json"),
        JSON.stringify({
          name: `${ this.#config.slug }-frontend`,
          assets: {
            directory: "public",
          },
        })
      );
      await generateCloudflareTypes({
        config: join(intermediateFrontendPath, "wrangler.json"),
        path: join(intermediateFrontendPath, "worker-configuration.d.ts"),
      });
    }
  };

  async dev() {
    const { intermediateFrontendPath } = getPaths(this.#cwdPath);

    await this.#copyIntermediateSource();

    const { address: {
      address,
      port,
    }} = await dev({
      root: intermediateFrontendPath,
    });

    console.log(`Server listening at https://${ address }:${ port }`);
  };

  async build() {
    const { intermediateFrontendPath } = getPaths(this.#cwdPath);

    await this.#copyIntermediateSource();

    await build({
      root: intermediateFrontendPath,
    });
  };
}
