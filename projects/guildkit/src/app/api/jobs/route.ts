import { NextResponse, type NextRequest } from "next/server";
import { flattenError } from "zod";
import { requireAuthAs } from "@/lib/auth/server.ts";
import { prisma } from "@/lib/prisma.ts";
import { jobSchema } from "@/lib/validations/job.ts";

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  const { err, session } = await requireAuthAs("recruiter");

  if (err) {
    return NextResponse.json({
      error: "Unauthorized",
    }, { status: 401 });
  }

  const body: unknown = await request.json() as unknown;
  const { error, success, data: validatedNewJob } = jobSchema.safeParse(body);

  if (!success) {
    return NextResponse.json({
      errors: flattenError(error),
    }, { status: 400 });
  }

  const createdJob = await prisma.job.create({
    data: {
      ...validatedNewJob,
      employerId: session.activeOrganizationId,
    },
    select: { id: true },
  });

  if (!createdJob?.id) {
    return NextResponse.json({
      error: "Failed to create job. Error code: GK-9JFB6",
    }, { status: 500 });
  }

  return NextResponse.json({
    redirectUrl: `/jobs/${ createdJob.id }`,
  }, { status: 302 });
};

export const DELETE = async (request: NextRequest): Promise<NextResponse> => {
  const { err, session } = await requireAuthAs("recruiter");

  if (err) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json() as unknown;

  if (!body || typeof body !== "object" || !("id" in body)) {
    console.error("Something not an object was given as a POST data.");

    return NextResponse.json(
      {
        error: "Something technically wrong. Sorry, this is probably a bug of this website. If you report this issue, tell us the following error code: GK-U377H.",
      },
      { status: 400 },
    );
  }

  const { id } = body;

  if (!id || typeof id !== "string") {
    console.error("`id` of the job to delete was not given or is invalid.");

    return NextResponse.json(
      {
        error: "Something technically wrong. Sorry, this is probably a bug of this website. If you report this issue, tell us the following error code: GK-L587W",
      },
      { status: 400 },
    );
  }

  await prisma.job.deleteMany({
    where: {
      id,
      employerId: session.activeOrganizationId,
    },
  });

  return NextResponse.json({ redirectUrl: "/employer/jobs" }, { status: 200 });
};
