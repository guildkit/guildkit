import { JobCreateSchema } from "@guildkit/shared/zod";
import { NextResponse, type NextRequest } from "next/server";
import { flattenError } from "zod";
import { requireAuthAs } from "../../lib/auth-guard.ts";
import { prisma } from "../../lib/prisma.ts";

/**
 * Create a job
 * @tag job
 * @body JobCreateSchema
 * @response 201:CreatedJobResponse:Successfully created a job
 * @add 400:BadRequestResponse:The request body is invalid or the recruiter who is requesting to create a job does not belong to any organizations.
 * @add 401:ErrorResponse:The user is not logged in or is not a recruiter.
 * @add 500:ErrorResponse:Failed to create a job (Unexpected error)
 */
export const POST = async (request: NextRequest): Promise<NextResponse> => {
  const authResult = await requireAuthAs(request, "recruiter");

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const employerId = authResult.session.activeOrganizationId;

  if (!employerId) {
    return NextResponse.json({ code: "EMPLOYER_NOT_SET" }, { status: 400 });
  }

  const body: unknown = await request.json().catch(() => undefined);
  const { success, data: validatedNewJob, error } = JobCreateSchema.safeParse(body);

  if (!success) {
    return NextResponse.json({ errors: flattenError(error) }, { status: 400 });
  }

  const createdJob = await prisma.job.create({
    data: {
      ...validatedNewJob,
      expiresAt: new Date(validatedNewJob.expiresAt),
      employerId,
    },
    select: { id: true },
  });

  if (!createdJob?.id) {
    return NextResponse.json({
      code: "UNEXPECTED",
      message: `Failed to create job. Time: ${ new Date().toUTCString() }, Error code: GK-9JFB6`,
    }, { status: 500 });
  }

  return NextResponse.json({ newJobId: createdJob.id }, { status: 201 });
};
