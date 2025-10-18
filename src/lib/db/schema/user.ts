import { randomUUID } from "node:crypto";
import { relations, type InferEnum, type InferSelectModel } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  text,
} from "drizzle-orm/pg-core";
import { user } from "./better-auth.ts";
import { timeLogs } from "../schema-utils.ts";
import { jobsAndUsersRelationTable } from "./relations.ts";

export const userRelations = relations(user, ({ one, many }) => ({
  props: one(userProps, {
    fields: [ user.propsId ],
    references: [ userProps.id ],
  }),
  appliedJobs: many(jobsAndUsersRelationTable),
}));

export type User = InferSelectModel<typeof user>;

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
