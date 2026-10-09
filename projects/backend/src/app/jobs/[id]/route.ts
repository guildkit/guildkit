import { NextResponse, type NextRequest } from "next/server";
import { requireAuthAs } from "../../../lib/auth-guard.ts";
import { prisma } from "../../../lib/prisma.ts";

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
