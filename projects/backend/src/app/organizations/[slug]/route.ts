import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "../../../lib/prisma.ts";

/**
 * Get an organization and its job postings
 * @tag organization
 * @path OrgSlugParams
 * @response OrganizationWithJobsSchema:The requested organization and its recent job postings
 * @add 404:ErrorResponse:No organization was found for the given slug.
 */
export const GET = async (_request: NextRequest, { params }: RouteContext<"/organizations/[slug]">): Promise<NextResponse> => {
  const { slug } = await params;

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
    return NextResponse.json({ code: "ORGANIZATION_NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json({
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
  });
};
