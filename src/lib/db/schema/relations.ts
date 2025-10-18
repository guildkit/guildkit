import { relations } from "drizzle-orm";
import {
  pgTable,
  primaryKey,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./better-auth.ts";
import { job } from "./job.ts";

export const jobsAndUsersRelationTable = pgTable("jobsAndCandidatesRelation", {
  appliedJobId: uuid().notNull().references(() => job.id),
  candidateId: text().notNull().references(() => user.id),
}, (t) => [ primaryKey({ columns: [ t.appliedJobId, t.candidateId ]}) ]);

export const jobsAndUsersRelations = relations(jobsAndUsersRelationTable, ({ one }) => ({
  job: one(job, {
    fields: [ jobsAndUsersRelationTable.appliedJobId ],
    references: [ job.id ],
  }),
  candidate: one(user, {
    fields: [ jobsAndUsersRelationTable.candidateId ],
    references: [ user.id ],
  }),
}));
