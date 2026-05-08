"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { ApplicationStatus } from "@/lib/prisma";

export async function createApplication(data: {
  jobId: string;
  coverLetter?: string;
  resumeUrl?: string;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const existing = await prisma.application.findUnique({
    where: {
      jobId_applicantId: {
        jobId: data.jobId,
        applicantId: session.user.id,
      },
    },
  });
  if (existing) {
    throw new Error("You have already applied for this job.");
  }

  const application = await prisma.application.create({
    data: { ...data, applicantId: session.user.id },
  });

  revalidatePath(`/jobs/${ data.jobId }`);
  revalidatePath("/dashboard/applications");
  return application;
}

export async function getMyApplications() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  return prisma.application.findMany({
    where: { applicantId: session.user.id },
    include: { job: { include: { company: true }}},
    orderBy: { createdAt: "desc" },
  });
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const application = await prisma.application.findUnique({
    where: { id },
    include: { job: true },
  });

  if (application?.job.postedById !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const updated = await prisma.application.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/dashboard/jobs");
  return updated;
}
