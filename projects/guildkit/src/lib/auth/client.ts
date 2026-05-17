"use client";

import { adminAc, adminRoles, recruiterAc, recruiterRoles, type auth } from "@guildkit/shared/auth";
import { adminClient, inferAdditionalFields, inferOrgAdditionalFields, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { useRouter } from "next/navigation";
import type { UserType } from "@guildkit/shared/prisma";

const { signIn, signOut, organization, useActiveOrganization } = createAuthClient({
  plugins: [
    adminClient({
      ac: adminAc,
      roles: adminRoles,
    }),
    organizationClient({
      ac: recruiterAc,
      roles: recruiterRoles,
      schema: inferOrgAdditionalFields<typeof auth>(),
    }),
    inferAdditionalFields<typeof auth>(),
  ],
});

export const signInWith = async (provider: "google" | "github") => signIn.social({
  provider,
  errorCallbackURL: "/auth/error",
  requestSignUp: false,
});

export const signUpWith = async (
  provider: "google" | "github",
  userType: UserType,
) => signIn.social({
  provider,
  callbackURL: userType === "recruiter" ? "/employer/jobs" : "/",
  newUserCallbackURL: userType === "recruiter" ? "/employer/jobs" : "/",
  errorCallbackURL: "/auth/error",
  requestSignUp: true,
  additionalData: {
    type: userType,
  },
});

export const useSignOut = () => {
  const router = useRouter();

  return {
    signOut: async () => signOut({
      fetchOptions: {
        onSuccess: () => router.refresh(),
      },
    }),
  };
};

export {
  organization,
  useActiveOrganization,
};
