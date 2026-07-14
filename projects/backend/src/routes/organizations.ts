import { JobResponseSchema, orgSchema } from "@guildkit/shared/zod";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
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
      method: "get",
      path: "/organizations/{slug}",
      summary: "Get an organization and its job postings",
      tags: [ "organization" ],
      request: {
        params: z.object({
          slug: z
            .string()
            .openapi({
              param: {
                name: "slug",
                in: "path",
              },
              example: "your-company-inc",
            }),
        }),
      },
      responses: {
        200: {
          description: "The requested organization and its recent job postings",
          content: {
            "application/json": {
              schema: z.object({
                id: z.string(),
                name: z.string(),
                slug: z.string(),
                logo: z.string().nullable(),
                url: z.string(),
                about: z.string().nullable(),
                addresses: z.array(z.string()),
                emails: z.array(z.string()),
                currencies: z.array(z.string()),
                createdAt: z.iso.datetime(),
                jobs: z.array(JobResponseSchema),
              }).openapi("OrganizationWithJobs"),
            },
          },
        },
        404: {
          description: "No organization was found for the given slug.",
        },
      },
    }),
    async (c) => {
      const { slug } = c.req.valid("param");
      const prisma = c.get("prisma");

      if (!prisma) {
        c.status(500);
        return c.json({
          code: "PRISMA_NOT_INITIATED",
        });
      }

      const org = await prisma.organization.findFirst({
        where: { slug },
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
          url: true,
          about: true,
          addresses: true,
          emails: true,
          currencies: true,
          createdAt: true,
          jobs: {
            take: 6,
            select: {
              id: true,
              title: true,
              description: true,
              createdAt: true,
              updatedAt: true,
            },
            orderBy: { updatedAt: "desc" },
          },
        },
      });

      if (!org) {
        return c.json({ code: "ORGANIZATION_NOT_FOUND" }, 404);
      }

      return c.json({
        ...org,
        createdAt: org.createdAt.toISOString(),
        jobs: org.jobs.map((job) => ({
          id: job.id,
          title: job.title,
          description: job.description,
          createdAt: job.createdAt.toISOString(),
          updatedAt: job.updatedAt.toISOString(),
          employer: { name: org.name },
        })),
      }, 200);
    }
  )
  .openapi(
    createRoute({
      method: "post",
      path: "/organization",
      summary: "Create an organization",
      tags: [ "organization" ],
      middleware: requireAuthAs("recruiter", { allowOrphanRecruiter: true }),
      request: {
        body: {
          content: {
            "multipart/form-data": {
              schema: orgSchema.openapi("Organization"),
            },
          },
        },
      },
      responses: {
        201: {
          description: "Successfully created an organization",
        },
        409: {
          description: "The slug or the organization already exists.",
        },
        500: {
          description: "Failed to create an organization (Unexpected error)",
        },
      },
    }),
    async (c) => {
      const { logo, ...newOrgData } = c.req.valid("form");
      const { servers: { storage: storageConfig }} = c.get("config");

      try {
        const storage = new StorageClient(storageConfig);

        // Casting `logo` as `File` due to Zod's bug?
        const logoURL = logo ? await uploadLogo(logo, storage) : undefined;

        const auth = c.get("auth");

        if (!auth) {
          c.status(500);
          return c.json({
            code: "AUTH_SYSTEM_NOT_INITIATED",
          });
        }

        await auth.api.createOrganization({
          body: {
            ...newOrgData,
            logo: logoURL,
          },
          headers: c.req.raw.headers,
        });

        return c.json({ success: true }, 201);
      } catch (err) {
        if (err instanceof APIError) {
          if (err.body?.code === "SLUG_IS_TAKEN") {
            return c.json({
              errors: {
                formErrors: [],
                fieldErrors: { slug: [ "This slug is already taken." ]},
              },
            }, 409);
          } else if (err.body?.code === "ORGANIZATION_ALREADY_EXISTS") {
            return c.json({
              errors: {
                formErrors: [ "The organization already exists." ],
                fieldErrors: {},
              },
            }, 409);
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
        }, 500);
      }
    }
  ).doc("/doc", {
    openapi: "3.1.2",
    info: {
      version: "1.0.0",
      title: "GuildKit Organizations API",
    },
  });
