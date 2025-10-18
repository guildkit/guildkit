import { env } from "node:process";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin, organization } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { adminAc, adminRoles, recruiterAc, recruiterRoles } from "./auth/roles.ts";
import { db } from "./db/db.ts";
import { currencies } from "../intermediate/currencies.ts";
import * as schema from "./db/schema/index.ts";

if (
  !env.GOOGLE_CLIENT_ID
  || !env.GOOGLE_CLIENT_SECRET
  || !env.GITHUB_CLIENT_ID
  || !env.GITHUB_CLIENT_SECRET
) {
  throw new Error(`Required environment variable(s) are not set.
    Did you set all of the { GOOGLE | GITHUB }_CLIENT_ID and {GOOGLE | GITHUB }_CLIENT_SECRET?`);
}

//
// auth setup
//
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

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  baseURL,
  user: {
    additionalFields: {
      propsId: {
        type: "string",
        required: true,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (user.propsId) {
            return {
              data: user,
            };
          } else {
            const [{ propsId }] = await db
              .insert(schema.userProps).values({})
              .returning({ propsId: schema.userProps.id });

            return {
              data: {
                ...user,
                propsId,
              },
            };
          }
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
            const { organizationId } = await db.query.member.findFirst({
              columns: {
                organizationId: true,
              },
              where: eq(schema.member.userId, session.userId),
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
        const user = await db.query.user.findFirst({
          columns: {
            propsId: true,
          },
          where: (userTable, { eq }) => eq(userTable.id, baUser.id),
          with: {
            props: {
              columns: {
                type: true,
              },
            },
          },
        });

        return user?.props.type === "recruiter";
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
});
