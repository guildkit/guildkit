import { JobCreateSchema } from "@guildkit/shared/zod";
import { NextResponse, type NextRequest } from "next/server";
import { flattenError } from "zod";
import { requireAuthAs } from "../../lib/auth-guard.ts";
import { prisma } from "../../lib/prisma.ts";

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
