import { spawn } from "node:child_process";
import { cp, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { join } from "node:path";
import { getPaths } from "@guildkit/shared/cli";
import next from "next";
import { experimental_generateTypes as generateCloudflareTypes } from "wrangler";
import type { GuildKitConfig } from "@guildkit/shared";

export class GuildKitFrontendTaskRunner {
  #config: GuildKitConfig;
  #cwdPath: string;
  #srcNpmRootPath = join(import.meta.dirname, "..");

  constructor(config: GuildKitConfig, cwdPath: string) {
    this.#config = config;
    this.#cwdPath = cwdPath;
  }

  async #copyIntermediateSource() {
    const { intermediateFrontendPath } = getPaths(this.#cwdPath);

    // Copy GuildKit app
    console.info("Setting up GuildKit frontend source code...");

    await cp(this.#srcNpmRootPath, intermediateFrontendPath, { recursive: true });

    await writeFile(
      join(intermediateFrontendPath, "wrangler.json"),
      JSON.stringify({
        name: `${ this.#config.slug }-frontend`,

        main: "./src/index.ts", // TODO
        assets: {
          directory: "public",
        },

        compatibility_date: "2026-05-18",
        compatibility_flags: [
          "nodejs_compat",
        ],
      })
    );
    await generateCloudflareTypes({
      config: join(intermediateFrontendPath, "wrangler.json"),
      path: join(intermediateFrontendPath, "types/worker-configuration.d.ts"),
    });
  };

  async dev() {
    const { intermediateFrontendPath } = getPaths(this.#cwdPath);

    await this.#copyIntermediateSource();

    const port = (process.env.PORT ? parseInt(process.env.PORT) : undefined)
      ?? this.#config?.dev?.port
      ?? 3000;
    const nextjs = next({
      dev: true,
      dir: intermediateFrontendPath,
      port,
    });
    const handle = nextjs.getRequestHandler();

    await nextjs.prepare();
    const server = createServer((req, res) => void handle(req, res));
    server.listen(port);

    console.log(`
      Server listening at http://localhost:${ port } as development
    `);
  };

  async build() {
    const { intermediateFrontendPath } = getPaths(this.#cwdPath);

    await this.#copyIntermediateSource();

    await new Promise<void>((resolve, reject) => {
      const proc = spawn("npx", [ "next", "build" ], {
        cwd: intermediateFrontendPath,
        stdio: "inherit",
      });

      proc.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`next build exited with code ${ code }`));
        }
      });

      proc.on("error", reject);
    });
  };
}
