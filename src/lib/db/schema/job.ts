import { relations, type InferSelectModel } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { organization } from "./better-auth.ts";
import { currency } from "./currencies.ts";
import { jobsAndUsersRelationTable } from "./relations.ts";
import { timeLogs } from "../schema-utils.ts";

export const salaryPer = pgEnum("SalaryPer", [
  "YEAR",
  "MONTH",
  "DAY",
  "HOUR",
]);

export const job = pgTable("job", {
  id: uuid().primaryKey().notNull().defaultRandom(),
  title: text().notNull(),
  description: text().notNull(),
  applicationUrl: text().notNull(),
  location: text().notNull(),
  salary: integer().notNull(),
  currency: currency().notNull(),
  salaryPer: salaryPer().notNull(),
  employer: text().notNull().references(() => organization.id),
  expiresAt: timestamp().notNull(),
  ...timeLogs,
});
export const jobRelations = relations(job, ({ one, many }) => ({
  employer: one(organization, {
    fields: [ job.employer ],
    references: [ organization.id ],
  }),
  candidates: many(jobsAndUsersRelationTable),
}));

export type Job = InferSelectModel<typeof job>;
