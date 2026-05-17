import { prisma } from "@guildkit/shared/prisma";
import { jobSchema } from "@guildkit/shared/zod";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { requireAuthAs } from "../middleware/auth.ts";
import type { HonoEnv } from "../lib/env.ts";

export const jobs = new OpenAPIHono<HonoEnv>()
  .openapi(
    createRoute({
      method: "post",
      path: "/job",
      middleware: requireAuthAs("recruiter"),
      request: {
        params: jobSchema,
      },
      responses: {
        201: {
          description: "Successfully created a job",
        },
        400: {
          description: "The recruiter who is requesting to create a job does not belong to any organizations.",
        },
        500: {
          description: "Failed to create a job (Unexpected error)",
        },
      },
    }),
    async (c) => {
      const employerId = c.get("session")?.activeOrganizationId;

      if (!employerId) {
        return c.json({
          code: "EMPLOYER_NOT_SET",
        }, { status: 400 });
      }

      const validatedNewJob = c.req.valid("param");
      const createdJob = await prisma.job.create({
        data: {
          ...validatedNewJob,
          employerId,
        },
        select: { id: true },
      });

      if (!createdJob?.id) {
        return c.json({
          error: `Failed to create job. Time: ${ new Date().toUTCString() }, Error code: GK-9JFB6`,
        }, { status: 500 });
      }

      return c.json({
        newJobId: createdJob.id,
      }, { status: 201 });
    }
  ).openapi(
    createRoute({
      method: "delete",
      path: "/job",
      middleware: requireAuthAs("recruiter"),
      request: {
        params: z.object({
          id: z
            .string()
            .openapi({
              param: {
                name: "id",
              },
              example: "6d980b9e-582d-11f1-b6c2-63f8127cddf7",
            }),
        }),
      },
      responses: {
        200: {
          description: "Successfully deleted a job",
        },
        400: {
          description: "The recruiter who is requesting to create a job does not belong to any organizations.",
        },
      },
    }),
    async (c) => {
      const employerId = c.get("session")?.activeOrganizationId;

      if (!employerId) {
        return c.json({
          code: "EMPLOYER_NOT_SET",
        }, { status: 400 });
      }

      const { id } = c.req.valid("param");

      await prisma.job.deleteMany({
        where: {
          id,
          employerId,
        },
      });

      return c.json({}, { status: 200 });
    }
  ).doc("/doc", {
    openapi: "3.1.2",
    info: {
      version: "1.0.0",
      title: "GuildKit API",
    },
  });
