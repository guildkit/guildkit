import { currencies, userTypes, type Env, type UserType } from "@guildkit/shared";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { getOAuthState } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin, organization } from "better-auth/plugins";
import { z } from "zod";
import { adminAc, adminRoles, recruiterAc, recruiterRoles } from "./roles.js";
import type { PrismaClient as CloudflarePrismaClient } from "../prisma/clients/cloudflare/client.ts";
import type { PrismaClient as NodeJsPrismaClient } from "../prisma/clients/nodejs/client.ts";

type PrismaClient = NodeJsPrismaClient | CloudflarePrismaClient;

class AuthInitializer {
  private static instance: AuthInitializer;
  #auth;

  constructor(env: Env, prisma: PrismaClient) {
    if (AuthInitializer.instance) {
      return AuthInitializer.instance;
    }

    if (
      !env.GOOGLE_CLIENT_ID
      || !env.GOOGLE_CLIENT_SECRET
      || !env.GITHUB_CLIENT_ID
      || !env.GITHUB_CLIENT_SECRET
    ) {
      throw new Error(`Required environment variable(s) are not set.
      Did you set all of the { GOOGLE | GITHUB }_CLIENT_ID and {GOOGLE | GITHUB }_CLIENT_SECRET?`);
    }

    const baseURL = env.BETTER_AUTH_URL ?? (
      env.VERCEL_URL ? `https://${ env.VERCEL_URL }` // TODO Make it independent to Vercel
      : undefined
    );

    if (!baseURL) {
      throw new Error("baseURL is not set. Is BETTER_AUTH_URL set?");
    }

    const oAuthConfigs = {
      disableImplicitSignUp: true,
    };

    this.#auth = betterAuth({
      database: prismaAdapter(prisma, {
        provider: "postgresql",
      }),
      appName: "GuildKit", // TODO Make it modifiable
      baseURL: env.BASE_URL,
      advanced: {
        database: {
          generateId: false, // Let DB handle automatic ID generation
        },
      },
      user: {
        additionalFields: {
          type: {
            type: [ ...userTypes ], // clone array to remove `readonly`
            required: true,
          },
        },
      },
      databaseHooks: {
        user: {
          create: {
            before: async (user) => {
              const additionalData = await getOAuthState();

              return {
                data: {
                  ...user,
                  type: additionalData?.type as UserType,
                },
              };
            },
          },
        },
        session: {
          create: {
            // Set first organization as active organization on login
            before: async (session) => {
              if (session.activeOrganizationId) {
                return {
                  data: session,
                };
              } else {
                const { organizationId } = await prisma.member.findFirst({
                  select: {
                    organizationId: true,
                  },
                  where: {
                    user: {
                      id: session.userId,
                    },
                  },
                }) ?? {};

                if (!organizationId) {
                  return {
                    data: session,
                  };
                }

                return {
                  data: {
                    ...session,
                    activeOrganizationId: organizationId,
                  },
                };
              }
            },
          },
        },
      },
      plugins: [
        organization({
          defaultRole: "recruiter",
          adminRoles: [ "recruiterAdmin" ],
          creatorRole: "recruiterAdmin",
          ac: recruiterAc,
          roles: recruiterRoles,
          schema: {
            organization: {
              additionalFields: {
                url: {
                  type: "string",
                  required: true,
                  unique: true,
                },
                addresses: {
                  type: "string[]",
                  required: true,
                },
                currencies: {
                  type: "string[]",
                  required: true,
                  validator: {
                    input: z.array(z.enum(currencies)),
                  },
                },
                emails: {
                  type: "string[]",
                  required: false,
                },
                about: {
                  type: "string",
                  required: false,
                },
              },
            },
          },
          allowUserToCreateOrganization: async (baUser) => {
            const user = await prisma.user.findFirst({
              select: {
                type: true,
              },
              where: {
                id: baUser.id,
              },
            });

            return user?.type === "recruiter";
          },
        }),
        adminPlugin({
          defaultRole: "none",
          adminRoles: [ "gkAdmin" ],
          defaultBanReason: "Unspecified",
          ac: adminAc,
          roles: adminRoles,
        }),
        nextCookies(), // this plugin has to be the last plugin in the array
      ],
      socialProviders: {
        google: {
          prompt: "select_account",
          clientId: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
          ...oAuthConfigs,
        },
        github: {
          clientId: env.GITHUB_CLIENT_ID,
          clientSecret: env.GITHUB_CLIENT_SECRET,
          ...oAuthConfigs,
        },
      },
      emailAndPassword: {
        enabled: false,
      },
      telemetry: {
        enabled: false,
      },
    });

    AuthInitializer.instance = this;
  }

  get auth() {
    if (!this.#auth) {
      throw new Error(`auth instance was not initizlized properly. This is probably a bug in this website. Time: ${ new Date().toUTCString() }; Error code: GK-PT22F`);
    }

    return this.#auth;
  }
}

/**
 * Initialize BetterAuth's `auth` object.
 * @param env - Environmental variables
 * @param prisma - Prisma client instance
 * @returns BetterAuth's auth object
 */
export const initAuth = (env: Env, prisma: PrismaClient) => new AuthInitializer(env, prisma).auth;

export * from "./roles.js";
export * from "./types.js";
