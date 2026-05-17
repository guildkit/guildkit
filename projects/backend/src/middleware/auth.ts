import { auth } from "@guildkit/shared/auth";
import type { Organization, User } from "@guildkit/shared/auth";
import type { MiddlewareHandler } from "hono";
import type { HonoEnv } from "../lib/env";

type Recruiter = Omit<User, "type"> & {
  type: "recruiter";
};
type RequireAuthAsOptions = {
  allowUsersWithoutType?: boolean;
  allowOrphanRecruiter?: boolean;
};

/**
 * Check if the user is authenticated and have the specified role.
 * Returns the authenticated user and session if the check passes, otherwise an error.
 * @param expectedType - The expected user type to check against.
 * @param options - Options for the authentication check.
 * @param options.allowUsersWithoutType - Set true to allow users without a type to pass the check.
 * @param options.allowOrphanRecruiter - Set true to allow the recruiters which does not belong to any organizations.
 * @returns - The object with authenticated user and session if the check passes, otherwise thrown `err` object.
 */
export const requireAuthAs = <ExpectedType extends User["type"] | "any">(
  expectedType: ExpectedType,
  options: RequireAuthAsOptions = {},
): MiddlewareHandler<HonoEnv> =>
  async (c, next) => {
    const getFirstOrganization = async (user: User, headers: Headers): Promise<Organization | undefined> => {
      if (user.type !== "recruiter") {
        return undefined;
      }

      const [ firstOrg ] = await auth.api.listOrganizations({
        headers,
      });

      return firstOrg;
    };

    try {
      const {
        allowUsersWithoutType = false,
        allowOrphanRecruiter = false,
      } = options;

      const { user, session } = await getSession({
        headers: c.req.raw.headers,
      }) ?? {};

      //
      // Error handling
      //
      if (!user || !session) {
        c.status(401);
        return c.json({
          code: "LOGIN_REQUIRED",
        });
      }

      if (!user.type && !allowUsersWithoutType) {
        c.status(401);
        return c.json({
          code: "SIGNUP_NOT_COMPLETED",
        });
      }

      if (expectedType !== "any" && expectedType !== user.type) {
        c.status(401);
        return c.json({
          code: "USER_TYPE_DISALLOWED",
          message: `This page is only allowed for ${ expectedType }, but you are ${ user.type }.`,
        });
      }

      const firstOrg = await getFirstOrganization(user, c.req.raw.headers);
      const isOrphanRecruiter = !firstOrg;

      if (expectedType === "recruiter" && !allowOrphanRecruiter && isOrphanRecruiter) {
        c.status(401);
        return c.json({
          code: "RECRUITER_WITHOUT_ORGS",
          message: "You are recruiter who does not belong to any organization. Ask your organization owner to invite, or create a new organization.",
        });
      }

      //
      // set active organization if user is a recruiter
      //
      if (
        expectedType === "recruiter" && user.type === "recruiter"
        && !session.activeOrganizationId && firstOrg
      ) {
        await auth.api.setActiveOrganization({
          body: {
            organizationId: firstOrg.id,
          },
          headers: c.req.raw.headers,
        });
      }

      //
      // Return user & session
      //
      c.set("user", user as ExpectedType extends "recruiter" ? Recruiter : User);
      c.set("session", session as ExpectedType extends "recruiter"
        ? Omit<typeof session, "activeOrganizationId"> & {
          activeOrganizationId: NonNullable<typeof session["activeOrganizationId"]>;
        } : typeof session);
      await next();
      return;
    } catch (err) {
      console.error(err);
      return c.json({
        code: "UNEXPECTED",
        message: `Unexpected error. Sorry, this is probably a bug of this website. Time: ${ new Date().toUTCString() }, Error code: GK-9JFG3`,
      });
    }
  };

export const getSession = async (...args: Parameters<typeof auth.api.getSession<false, false>>) => {
  const [ context, ...restArgs ] = args;
  return auth.api.getSession({
    ...context,
    asResponse: false,
    returnHeaders: false,
  }, ...restArgs);
};
