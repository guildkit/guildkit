import { randomUUID } from "node:crypto";
import { eq, type InferInsertModel } from "drizzle-orm";
import { db } from "./db.ts";
import { userProps } from "./schema/user.ts";
import {
  member,
  organization as organizationTable,
  user as userTable,
} from "../../intermediate/better-auth-schema.ts"; // Can't use `@/` since this file isn't managed by Next.js

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

export type UserWithProps = Omit<InferInsertModel<typeof userTable>, "propsId" | "recruitsFor"> & {
  props: InferInsertModel<typeof userProps>;
  recruitsFor?: string[];
};

export const insertUsers = async (users: UserWithProps | UserWithProps[], tx: Transaction) => {
  const usersWithProps = Array.isArray(users) ? users : [ users ];
  const newUserIds: string[] = [];

  // TODO Fix N+1 problem
  for (const userWithProps of usersWithProps) {
    const { props, ...userWithoutProps } = userWithProps;

    const [{ propsId }] = await tx.insert(userProps).values(props).returning({ propsId: userProps.id });

    const [{ id: newUserId }] = await tx.insert(userTable).values({
      ...userWithoutProps,
      propsId: propsId,
    }).returning({ id: userTable.id });

    newUserIds.push(newUserId);
  }

  return newUserIds;
};

export const updateUserProps = (user: InferInsertModel<typeof userTable>) => {
  type UpdateFn = typeof db.update<typeof userProps>;
  type SetFn = ReturnType<UpdateFn>["set"];
  type SetParams = Parameters<SetFn>;

  return {
    set: async (...values: SetParams) => db.update(userProps)
      .set(...values)
      .where(eq(userProps.id, user.propsId)),
  };
};

export type OrgWithRecruiters = InferInsertModel<typeof organizationTable> & {
  recruiters: UserWithProps[];
};

export const insertOrganizations = async (organizations: OrgWithRecruiters | OrgWithRecruiters[], tx: Transaction) => {
  const orgsWithRecruiters = Array.isArray(organizations) ? organizations : [ organizations ];

  // TODO Fix N+1 problem
  for (const orgWithRecruiters of orgsWithRecruiters) {
    const { recruiters = [], ...org } = orgWithRecruiters;

    const [{ id: orgId }] = await tx.insert(organizationTable).values(org).returning({ id: organizationTable.id });

    const newRecruiterIds = (0 < recruiters.length) ? await insertUsers(recruiters, tx) : [];

    if (0 < newRecruiterIds.length) {
      await tx.insert(member).values(
        newRecruiterIds.map((newRecruiterId) => ({
          organizationId: orgId,
          userId: newRecruiterId,
          id: randomUUID(),
          createdAt: new Date(),
        }))
      );
    }
  }
};
