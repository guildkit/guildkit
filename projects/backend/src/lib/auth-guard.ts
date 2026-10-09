import { NextResponse } from "next/server";
import { auth } from "./auth.ts";
import type { Organization, Session, User } from "@guildkit/db";

type Recruiter = Omit<User, "type"> & {
  type: "recruiter";
};
type RequireAuthAsOptions = {
  allowUsersWithoutType?: boolean;
  allowOrphanRecruiter?: boolean;
};
type AuthenticatedAs<ExpectedType extends User["type"] | "any"> = {
  user: ExpectedType extends "recruiter" ? Recruiter : User;
  session: Session;
};

const getFirstOrganization = async (user: User, headers: Headers): Promise<Organization | undefined> => {
  if (user.type !== "recruiter") {
    return undefined;
  }

  const [ firstOrg ] = await auth.api.listOrganizations({
    headers,
  });

  return firstOrg;
};

/**
 * Check if the user is authenticated and have the specified role.
 * Returns the authenticated user and session if the check passes, otherwise an error response.
 * @param request - The request to the Route Handler.
 * @param expectedType - The expected user type to check against.
 * @param options - Options for the authentication check.
 * @param options.allowUsersWithoutType - Set true to allow users without a type to pass the check.
 * @param options.allowOrphanRecruiter - Set true to allow the recruiters which does not belong to any organizations.
 * @returns - The object with authenticated user and session if the check passes, otherwise the error response to return.
 */
export const requireAuthAs = async <ExpectedType extends User["type"] | "any">(
  request: Request,
  expectedType: ExpectedType,
  options: RequireAuthAsOptions = {},
): Promise<AuthenticatedAs<ExpectedType> | NextResponse> => {
  try {
    const {
      allowUsersWithoutType = false,
      allowOrphanRecruiter = false,
    } = options;

    const { user, session } = await auth.api.getSession({
      headers: request.headers,
    }) ?? {};

    //
    // Error handling
    //
    if (!user || !session) {
      return NextResponse.json({
        code: "LOGIN_REQUIRED",
      }, { status: 401 });
    }

    if (!user.type && !allowUsersWithoutType) {
      return NextResponse.json({
        code: "SIGNUP_NOT_COMPLETED",
      }, { status: 401 });
    }

    if (expectedType !== "any" && expectedType !== user.type) {
      return NextResponse.json({
        code: "USER_TYPE_DISALLOWED",
        message: `This page is only allowed for ${ expectedType }, but you are ${ user.type }.`,
      }, { status: 401 });
    }

    const firstOrg = await getFirstOrganization(user, request.headers);
    const isOrphanRecruiter = !firstOrg;

    if (expectedType === "recruiter" && !allowOrphanRecruiter && isOrphanRecruiter) {
      return NextResponse.json({
        code: "RECRUITER_WITHOUT_ORGS",
        message: "You are recruiter who does not belong to any organization. Ask your organization owner to invite, or create a new organization.",
      }, { status: 401 });
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
        headers: request.headers,
      });

      session.activeOrganizationId = firstOrg.id;
    }

    //
    // Return user & session
    //
    return {
      user: user as AuthenticatedAs<ExpectedType>["user"],
      session,
    };
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      code: "UNEXPECTED",
      message: `Unexpected error. Sorry, this is probably a bug of this website. Time: ${ new Date().toUTCString() }, Error code: GK-9JFG3`,
    }, { status: 500 });
  }
};
