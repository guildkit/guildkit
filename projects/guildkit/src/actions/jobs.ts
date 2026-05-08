"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { JobStatus, JobType, Prisma } from "@/lib/prisma";

// ─── Read ──────────────────────────────────────────────────────────────────

export async function getJobs(filters?: {
  status?: JobStatus;
  type?: JobType;
  search?: string;
}) {
  const where: Prisma.JobWhereInput = {
    status: filters?.status ?? "PUBLISHED",
    ...(filters?.type ? { type: filters.type } : {}),
    ...(filters?.search
      ? {
        OR: [
          { title: { contains: filters.search, mode: "insensitive" }},
          { description: { contains: filters.search, mode: "insensitive" }},
        ],
      }
      : {}),
  };

  return prisma.job.findMany({
    where,
    include: { company: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getJob(id: string) {
  return prisma.job.findUnique({
    where: { id },
    include: { company: true, postedBy: true },
  });
}

// ─── Mutations ──────────────────────────────────────────────────────────────

export async function createJob(data: {
  title: string;
  description: string;
  requirements?: string;
  location?: string;
  remote?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  type: JobType;
  companyId: string;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const job = await prisma.job.create({
    data: {
      ...data,
      status: "DRAFT",
      postedById: session.user.id,
    },
  });

  revalidatePath("/dashboard/jobs");
  return job;
}

export async function updateJob(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    requirements: string;
    location: string;
    remote: boolean;
    salaryMin: number;
    salaryMax: number;
    type: JobType;
    status: JobStatus;
  }>,
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const existing = await prisma.job.findUnique({ where: { id }});
  if (existing?.postedById !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const job = await prisma.job.update({ where: { id }, data });

  revalidatePath("/jobs");
  revalidatePath(`/jobs/${ id }`);
  revalidatePath("/dashboard/jobs");
  return job;
}

export async function publishJob(id: string) {
  return updateJob(id, { status: "PUBLISHED" });
}

export async function deleteJob(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const existing = await prisma.job.findUnique({ where: { id }});
  if (existing?.postedById !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.job.delete({ where: { id }});

  revalidatePath("/jobs");
  revalidatePath("/dashboard/jobs");
}
