import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect, unauthorized } from "next/navigation";
import { auth } from "@/lib/auth.ts";
import { db } from "@/lib/db/db.ts";
import { userProps } from "@/lib/db/schema/user.ts";
import { GuildKitError } from "../utils/errors.ts";
import type { Organization, User } from "@/lib/auth/types.ts";

type Recruiter = Omit<User, "props"> & {
  props: User["props"] & {
    type: "recruiter";
  };
};
type RequireAuthAsOptions = {
  allowUsersWithoutType?: boolean;
  allowOrphanRecruiter?: boolean;
};

export const requireAuthAs = async <ExpectedType extends NonNullable<User["props"]["type"]> | "any">(
  expectedType: ExpectedType,
  options: RequireAuthAsOptions = {},
) => {
  const getFirstOrganization = async (user: User): Promise<Organization | undefined> => {
    if (user.props.type !== "recruiter") {
      return undefined;
    }

    const [ firstOrg ] = await auth.api.listOrganizations({
      headers: await headers(),
    });

    return firstOrg;
  };

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

  if (!user.props.type && !allowUsersWithoutType) {
    return redirect("/auth/signup");
  }

  if (expectedType !== "any" && expectedType !== user.props.type) {
    return unauthorized();
  }

  const firstOrg = await getFirstOrganization(user);
  const isOrphanRecruiter = !firstOrg;

  if (expectedType === "recruiter" && !allowOrphanRecruiter && isOrphanRecruiter) {
    throw new GuildKitError("You are recruiter who does not belong to any organization. Ask your organization owner to invite, or create a new organization.", {
      code: "RECRUITER_WITHOUT_ORGS",
    });
  }

  //
  // set active organization if user is a recruiter
  //
  if (
    expectedType === "recruiter" && user.props.type === "recruiter"
    && !session.activeOrganizationId && firstOrg
  ) {
    await auth.api.setActiveOrganization({
      body: {
        organizationId: firstOrg.id,
      },
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
};

export const getSession = async (...args: Parameters<typeof auth.api.getSession>) => {
  const [ context, ...restArgs ] = args;
  const { user, session } = await auth.api.getSession({
    ...context,
    asResponse: false,
    returnHeaders: false,
  }, ...restArgs) ?? {};

  if (!user) {
    return;
  }

  const props = await db.select().from(userProps)
    .where(eq(userProps.id, user?.propsId))
    .limit(1);

  return {
    user: {
      ...user,
      props: props[0],
    },
    session,
  };
};
