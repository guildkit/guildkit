import { cp, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getPaths } from "@guildkit/shared/cli";
import { build as buildWithVite, createServer, type InlineConfig } from "vite";
import { experimental_generateTypes as generateCloudflareTypes } from "wrangler";
import type { GuildKitConfig } from "@guildkit/shared";

export class GuildKitBackendTaskRunner {
  #config: GuildKitConfig;
  #cwdPath: string;
  #srcAppRootPath = join(import.meta.dirname, "..");
  #backendViteConfig: InlineConfig;

  constructor(config: GuildKitConfig, cwdPath: string) {
    this.#config = config;
    this.#cwdPath = cwdPath;
    const { intermediateBackendPath, distBackendPath } = getPaths(this.#cwdPath);

    this.#backendViteConfig = {
      configFile: join(intermediateBackendPath, "vite.config.ts"),
      root: intermediateBackendPath,
      build: {
        outDir: distBackendPath,
      },
      define: {
        __GUILDKIT_CONFIG__: JSON.stringify(this.#config),
      },
    };
  }

  async #copyIntermediateSource() {
    console.info("Setting up GuildKit source code...");

    const { intermediateBackendPath } = getPaths(this.#cwdPath);

    await cp(this.#srcAppRootPath, intermediateBackendPath, { recursive: true });

    if (this.#config.servers.app === "cloudflare") {
      await writeFile(
        join(intermediateBackendPath, "wrangler.json"),
        JSON.stringify({
          name: `${ this.#config.slug }-backend`,
          main: "./src/index.ts",

          compatibility_date: "2026-05-18",
          compatibility_flags: [
            "nodejs_compat",
          ],
        })
      );

      await generateCloudflareTypes({
        config: join(intermediateBackendPath, "wrangler.json"),
        path: join(intermediateBackendPath, "worker-configuration.d.ts"),
      });
    }
  };

  async dev() {
    await this.#copyIntermediateSource();

    const server = await createServer(this.#backendViteConfig);
    await server.listen();
    server.printUrls();
  };

  async build() {
    await this.#copyIntermediateSource();

    await buildWithVite(this.#backendViteConfig);
  };
}
