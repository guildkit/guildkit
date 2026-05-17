import { createAccessControl, type AccessControl } from "better-auth/plugins/access";

export const recruiterAc: AccessControl = createAccessControl({
  project: [ "create", "share", "update", "delete" ],
});

export const recruiterRoles = {
  /** Role for the owners of the each organizations. They can control everything in their organization(s). */
  recruiterAdmin: recruiterAc.newRole({
    project: [],
  }),
  /** Role for the recruiter users. */
  recruiter: recruiterAc.newRole({
    project: [],
  }),
};

export const adminAc: AccessControl = createAccessControl({
  project: [ "create", "share", "update", "delete" ],
});

export const adminRoles = {
  /** Role for the GuildKit admins. They can control everything of every job search websites. */
  gkAdmin: adminAc.newRole({
    project: [ "create", "update" ],
  }),
  /**
   * Role for the admins of the each job search websites built by GuildKit.
   * They can control everything in their own job search service(s).
   */
  siteAdmin: adminAc.newRole({
    project: [],
  }),
  /**
   * Default user role.
   * All the `candidate` type users have this role.
   * If the user type is `recruiter`, they can do nothing and wait for the invitations from the `recruiterOrgOwner`.
   */
  none: adminAc.newRole({
    project: [],
  }),
};
