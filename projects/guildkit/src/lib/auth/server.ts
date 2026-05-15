import { headers } from "next/headers";
import { redirect, unauthorized } from "next/navigation";
import { auth } from "@/lib/auth.ts";
import { GuildKitError } from "../utils/errors.ts";
import type { Organization, User } from "@/lib/auth/types.ts";

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
export const requireAuthAs = async <ExpectedType extends User["type"] | "any">(
  expectedType: ExpectedType,
  options: RequireAuthAsOptions = {},
) => {
  const getFirstOrganization = async (user: User): Promise<Organization | undefined> => {
    if (user.type !== "recruiter") {
      return undefined;
    }

    const [ firstOrg ] = await auth.api.listOrganizations({
      headers: await headers(),
    });

    return firstOrg;
  };

  try {
    const {
      allowUsersWithoutType = false,
      allowOrphanRecruiter = false,
    } = options;

    const { user, session } = await getSession({
      headers: await headers(),
    }) ?? {};

    //
    // Error handling
    //
    if (!user || !session) {
      return redirect("/auth");
    }

    if (!user.type && !allowUsersWithoutType) {
      return redirect("/auth/signup");
    }

    if (expectedType !== "any" && expectedType !== user.type) {
      return unauthorized();
    }

    const firstOrg = await getFirstOrganization(user);
    const isOrphanRecruiter = !firstOrg;

    if (expectedType === "recruiter" && !allowOrphanRecruiter && isOrphanRecruiter) {
      return {
        err: new GuildKitError("You are recruiter who does not belong to any organization. Ask your organization owner to invite, or create a new organization.", {
          code: "RECRUITER_WITHOUT_ORGS",
        }),
      };
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
        headers: await headers(),
      });
    }

    //
    // Return user & session
    //
    return {
      user: user as ExpectedType extends "recruiter" ? Recruiter : User,
      session: session as ExpectedType extends "recruiter"
        ? Omit<typeof session, "activeOrganizationId"> & {
          activeOrganizationId: NonNullable<typeof session["activeOrganizationId"]>;
        } : typeof session,
    };
  } catch (err) {
    if (err instanceof Error) {
      return { err };
    } else {
      throw err;
    }
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
