#!/usr/bin/env -S pnpm exec jiti

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
// TODO avoid referring to other project directory.
import { config } from "../../../../backend/src/lib/configs.ts";

const intermediateDirPath = join(import.meta.dirname, "../../../src/intermediate");

const publicConfigStr = JSON.stringify({
  maxLogoSizeMiB: config.maxLogoSizeMiB,
}, undefined, 2);

await mkdir(intermediateDirPath, { recursive: true });
await writeFile(join(intermediateDirPath, "public-configs.json"), publicConfigStr);
