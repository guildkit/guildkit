import { adminAc, adminRoles, recruiterAc, recruiterRoles, type initAuth } from "@guildkit/db";
import { adminClient, inferAdditionalFields, inferOrgAdditionalFields, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { backendBaseURL } from "@/lib/config";
import type { UserType } from "@guildkit/shared";

type Auth = ReturnType<typeof initAuth>;

const { signIn, signOut, organization, getSession } = createAuthClient({
  baseURL: backendBaseURL,
  plugins: [
    adminClient({
      ac: adminAc,
      roles: adminRoles,
    }),
    organizationClient({
      ac: recruiterAc,
      roles: recruiterRoles,
      schema: inferOrgAdditionalFields<Auth>(),
    }),
    inferAdditionalFields<Auth>(),
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

export const useSignOut = () => ({
  signOut: async () => signOut({
    fetchOptions: {
      onSuccess: () => window.location.reload(),
    },
  }),
});

export {
  organization,
  getSession,
};
