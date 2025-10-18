#!/usr/bin/env -S pnpm exec jiti

import { reset } from "drizzle-seed";
import { db } from "../../../src/lib/db/db.ts";
import * as schema from "../../../src/lib/db/schema/index.ts";

await reset(db, schema);
