import { relations, type InferSelectModel } from "drizzle-orm";
import { job } from "./job.ts";
import { jobsAndUsersRelationTable } from "./relations.ts";
import { userProps } from "./user.ts";
import {
  organization,
  organizationRelations as betterAuthOrganizationRelations,
  user,
  userRelations as betterAuthUserRelations,
} from "../../../intermediate/better-auth-schema.ts"; // Can't use `@/` since this file isn't managed by Next.js

//
// User
//
export const userRelations = relations(user, ({ one, many }) => ({
  ...betterAuthUserRelations.config({ one, many }),
  props: one(userProps, {
    fields: [ user.propsId ],
    references: [ userProps.id ],
  }),
  appliedJobs: many(jobsAndUsersRelationTable),
}));

export type User = InferSelectModel<typeof user>;

//
// Organization
//
export const organizationRelations = relations(organization, ({ one, many }) => ({
  ...betterAuthOrganizationRelations.config({ one, many }),
  jobs: many(job),
}));

// I can't star export except for a few items in TypeScript syntax,
// so I manually listed all the items to export.
export {
  account,
  accountRelations,
  invitation,
  invitationRelations,
  member,
  memberRelations,
  organization,
  session,
  sessionRelations,
  user,
  verification,
} from "../../../intermediate/better-auth-schema.ts";
