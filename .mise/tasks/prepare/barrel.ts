#!/usr/bin/env -S pnpm exec jiti

import { readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const projectRoot = join(import.meta.dirname, "../../..");

const generateSchemaBarrel = async () => {
  const schemaDirPath = join(projectRoot, "src/lib/db/schema");
  const schemaFileNames = await readdir(schemaDirPath);

  const barrel = schemaFileNames
    .filter((schemaFileName) => schemaFileName !== "index.ts")
    .map((schemaFileName) => `export * from "./${ schemaFileName }";\n`);

  await writeFile(join(schemaDirPath, "index.ts"), barrel);
};

await generateSchemaBarrel();
