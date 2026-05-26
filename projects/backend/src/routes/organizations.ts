import { auth } from "@guildkit/shared/auth";
import { orgSchema } from "@guildkit/shared/zod";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { pseudoRandomString } from "@phanect/utils";
import { APIError } from "better-auth";
import { logoDirName, StorageClient } from "../lib/storage.ts";
import { requireAuthAs } from "../middleware/auth.ts";
import type { HonoEnv } from "../lib/env.ts";

const uploadLogo = async (logoFile: File, storageClient: StorageClient): Promise<string> => {
  const fileExt = logoFile.name.split(".").pop() ?? "";
  const destPath = `${ logoDirName }/${ pseudoRandomString(32) }.${ fileExt }`;
  return storageClient.putObject(destPath, logoFile);
};

export const organizations = new OpenAPIHono<HonoEnv>()
  .openapi(
    createRoute({
      method: "post",
      path: "/organization",
      middleware: requireAuthAs("recruiter", { allowOrphanRecruiter: true }),
      request: {
        params: orgSchema,
      },
      responses: {
        200: {
          description: "Create an organization",
        },
        // 400: {
        //   description: "The recruiter who is requesting to create a job does not belong to any organizations.",
        // },
        // 500: {
        //   description: "Failed to create a job (Unexpected error)",
        // },
      },
    }),
    async (c) => {
      const { logo, ...newOrgData } = c.req.valid("param");

      try {
        const storage = new StorageClient(c.get("config").storage);

        // Casting `logo` as `File` due to Zod's bug?
        const logoURL = logo ? await uploadLogo(logo as File, storage) : undefined;

        await auth.api.createOrganization({
          body: {
            ...newOrgData,
            logo: logoURL,
          },
          headers: c.req.raw.headers,
        });

        return c.json({ success: true }, { status: 201 });
      } catch (err) {
        if (err instanceof APIError) {
          if (err.body?.code === "SLUG_IS_TAKEN") {
            return c.json({
              errors: {
                formErrors: [],
                fieldErrors: { slug: [ "This slug is already taken." ]},
              },
            }, { status: 409 });
          } else if (err.body?.code === "ORGANIZATION_ALREADY_EXISTS") {
            return c.json({
              errors: {
                formErrors: [ "The organization already exists." ],
                fieldErrors: {},
              },
            }, { status: 409 });
          }
        }

        console.error(
          "Unexpected error on creating organization:", err,
          ...(err instanceof APIError ? [ "\n\nerr.body:", err.body ] : []),
        );

        return c.json({
          errors: {
            formErrors: [ "Failed to create organization. Sorry, this is probably a bug of our website. Error code: GK-BQ7CX" ],
            fieldErrors: {},
          },
        }, { status: 500 });
      }
    }
  ).doc("/doc", {
    openapi: "3.1.2",
    info: {
      version: "1.0.0",
      title: "GuildKit API",
    },
  });
