import { NextResponse, type NextRequest } from "next/server";
import { requireAuthAs } from "../../../lib/auth-guard.ts";
import { prisma } from "../../../lib/prisma.ts";

/**
 * Delete a job
 * @tag job
 * @path JobIdParams
 * @response 200:DeletedJobResponse:Successfully deleted a job
 * @add 400:ErrorResponse:The recruiter who is requesting to delete a job does not belong to any organizations.
 * @add 401:ErrorResponse:The user is not logged in or is not a recruiter.
 */
export const DELETE = async (request: NextRequest, { params }: RouteContext<"/jobs/[id]">): Promise<NextResponse> => {
  const authResult = await requireAuthAs(request, "recruiter");

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const employerId = authResult.session.activeOrganizationId;

  if (!employerId) {
    return NextResponse.json({ code: "EMPLOYER_NOT_SET" }, { status: 400 });
  }

  const { id } = await params;

  await prisma.job.deleteMany({
    where: {
      id,
      employerId,
    },
  });

  return NextResponse.json({});
};
