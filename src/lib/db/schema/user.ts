import { randomUUID } from "node:crypto";
import {
  pgEnum,
  pgTable,
  text,
} from "drizzle-orm/pg-core";
import { timeLogs } from "../schema-utils.ts";
import type { InferEnum, InferSelectModel } from "drizzle-orm";

export const userType = pgEnum("UserType", [
  "administrative",
  "recruiter",
  "candidate",
]);

export type UserType = InferEnum<typeof userType>;

export const userProps = pgTable("userProps", {
  id: text().primaryKey().notNull().$defaultFn(() => randomUUID()),
  type: userType(),
  ...timeLogs,
});

export type UserProps = InferSelectModel<typeof userProps>;
