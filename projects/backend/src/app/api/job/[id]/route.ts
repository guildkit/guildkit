import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma.ts";

/**
 * Get a single job posting
 * @tag job
 * @path JobIdParams
 * @response jobDetailSchema:The requested job posting
 * @add 404:ErrorResponse:No job posting was found for the given id.
 */
export const GET = async (_request: NextRequest, { params }: RouteContext<"/api/job/[id]">): Promise<NextResponse> => {
  const { id } = await params;

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
    return NextResponse.json({ code: "JOB_NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json({
    ...job,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
  });
};
