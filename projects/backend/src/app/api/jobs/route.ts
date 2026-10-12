import { NextResponse, type NextRequest } from "next/server";
import { flattenError } from "zod";
import { auth } from "@/lib/auth.ts";
import { prisma } from "@/lib/prisma.ts";
import { JobsQuery } from "@/schemas/job.ts";
import type { JobListItem } from "@guildkit/shared/zod";

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

/**
 * List active job postings
 * @tag job
 * @query JobsQuery
 * @response JobsResponseSchema:A list of active job postings
 * @add 400:BadRequestResponse:The query is invalid or `?employer=us` is given although the requesting user does not have an active organization.
 */
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  const { success, data: query, error } = JobsQuery.safeParse(Object.fromEntries(request.nextUrl.searchParams));

  if (!success) {
    return NextResponse.json({ errors: flattenError(error) }, { status: 400 });
  }

  let employerId: string | undefined;

  if (query.employer === "us") {
    const { session } = await auth.api.getSession({
      headers: request.headers,
    }) ?? {};

    if (!session?.activeOrganizationId) {
      return NextResponse.json({ code: "ACTIVE_ORGANIZATION_NOT_SET" }, { status: 400 });
    }

    employerId = session.activeOrganizationId;
  } else {
    employerId = query.employer;
  }

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
      },
    },
    where: {
      expiresAt: { gte: new Date() },
      employerId,
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(jobs.map(toJobListItem));
};
