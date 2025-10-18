#!/usr/bin/env -S pnpm exec jiti

import { join } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { config } from "../../../src/lib/configs.ts";

const intermediateDirPath = join(import.meta.dirname, "../../../src/intermediate");

const publicConfigStr = JSON.stringify({
  maxLogoSizeMiB: config.maxLogoSizeMiB,
}, undefined, 2);

await mkdir(intermediateDirPath, { recursive: true });
await writeFile(join(intermediateDirPath, "public-configs.json"), publicConfigStr);
