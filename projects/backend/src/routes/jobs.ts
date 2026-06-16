import { jobDetailSchema, JobResponseSchema, JobCreateSchema } from "@guildkit/shared/zod";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { requireAuthAs } from "../middleware/auth.ts";
import type { JobListItem } from "@guildkit/shared/zod";
import type { HonoEnv } from "../lib/env.ts";
import { initPrisma } from "../lib/prisma.ts";

const jobIdParam = z.object({
  id: z
    .string()
    .openapi({
      param: {
        name: "id",
        in: "path",
      },
      example: "6d980b9e-582d-11f1-b6c2-63f8127cddf7",
    }),
});

const toJobListItem = (job: {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  employer: { name: string; };
}): JobListItem => ({
  id: job.id,
  title: job.title,
  description: job.description,
  createdAt: job.createdAt.toISOString(),
  updatedAt: job.updatedAt.toISOString(),
  employer: { name: job.employer.name },
});

export const jobs = new OpenAPIHono<HonoEnv>()
  .openapi(
    createRoute({
      method: "get",
      path: "/jobs",
      summary: "List active job postings",
      tags: [ "job" ],
      request: {
        query: z.object({
          employer: z.uuid().or(z.literal("us")).optional(),
        }),
      },
      responses: {
        200: {
          description: "A list of active job postings",
          content: {
            "application/json": {
              schema: z.array(JobResponseSchema),
            },
          },
        },
        400: {
          description: "`?employer=us` is given although the recruiter who is requesting does not belong to any organization.",
        },
      },
    }),
    async (c) => {
      const { employer } = c.req.valid("query");
      const activeOrganizationId = c.get("session")?.activeOrganizationId ?? undefined;

      if (employer === "us" && !activeOrganizationId) {
        return c.json({ code: "ACTIVE_ORGANIZATION_NOT_SET" }, 400);
      }

      const employerId = employer === "us" ? activeOrganizationId
        : typeof employer === "string" ? employer
        : undefined;

      const appServerName = c.get("config").servers.app;
      const prisma = await initPrisma(c.env, appServerName);

      const jobs = await prisma.job.findMany({
        select: {
          id: true,
          title: true,
          description: true,
          createdAt: true,
          updatedAt: true,
          employer: {
            select: {
              name: true,
            },
            where: {
              id: employerId,
            },
          },
        },
        where: {
          expiresAt: { gte: new Date() },
        },
        orderBy: { updatedAt: "desc" },
      });

      return c.json(jobs.map(toJobListItem), 200);
    }
  )
  .openapi(
    createRoute({
      method: "get",
      path: "/job/{id}",
      summary: "Get a single job posting",
      tags: [ "job" ],
      request: {
        params: jobIdParam,
      },
      responses: {
        200: {
          description: "The requested job posting",
          content: {
            "application/json": {
              schema: jobDetailSchema,
            },
          },
        },
        404: {
          description: "No job posting was found for the given id.",
        },
      },
    }),
    async (c) => {
      const { id } = c.req.valid("param");

      const appServerName = c.get("config").servers.app;
      const prisma = await initPrisma(c.env, appServerName);

      const job = await prisma.job.findFirst({
        where: { id },
        select: {
          id: true,
          title: true,
          description: true,
          location: true,
          salary: true,
          salaryPer: true,
          currency: true,
          applicationUrl: true,
          createdAt: true,
          updatedAt: true,
          employer: {
            select: {
              slug: true,
              name: true,
            },
          },
        },
      });

      if (!job) {
        return c.json({ code: "JOB_NOT_FOUND" }, 404);
      }

      return c.json({
        ...job,
        createdAt: job.createdAt.toISOString(),
        updatedAt: job.updatedAt.toISOString(),
      }, 200);
    }
  )
  .openapi(
    createRoute({
      method: "post",
      path: "/job",
      summary: "Create a job",
      tags: [ "job" ],
      middleware: requireAuthAs("recruiter"),
      request: {
        body: {
          content: {
            "application/json": {
              schema: JobCreateSchema,
            },
          },
        },
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
        return c.json({ code: "EMPLOYER_NOT_SET" }, 400);
      }

      const validatedNewJob = c.req.valid("json");

      const appServerName = c.get("config").servers.app;
      const prisma = await initPrisma(c.env, appServerName);

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
        }, 500);
      }

      return c.json({ newJobId: createdJob.id }, 201);
    }
  )
  .openapi(
    createRoute({
      method: "delete",
      path: "/jobs/{id}",
      summary: "Delete a job",
      tags: [ "job" ],
      middleware: requireAuthAs("recruiter"),
      request: {
        params: jobIdParam,
      },
      responses: {
        200: {
          description: "Successfully deleted a job",
        },
        400: {
          description: "The recruiter who is requesting to delete a job does not belong to any organizations.",
        },
      },
    }),
    async (c) => {
      const employerId = c.get("session")?.activeOrganizationId;

      if (!employerId) {
        return c.json({ code: "EMPLOYER_NOT_SET" }, 400);
      }

      const { id } = c.req.valid("param");

      const appServerName = c.get("config").servers.app;
      const prisma = await initPrisma(c.env, appServerName);

      await prisma.job.deleteMany({
        where: {
          id,
          employerId,
        },
      });

      return c.json({}, 200);
    }
  );
