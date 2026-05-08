"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function createCompany(data: {
  name: string;
  description?: string;
  website?: string;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const company = await prisma.company.create({
    data: { ...data, ownerId: session.user.id },
  });

  revalidatePath("/dashboard");
  return company;
}

export async function getMyCompanies() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  return prisma.company.findMany({
    where: { ownerId: session.user.id },
    include: { _count: { select: { jobs: true }}},
    orderBy: { createdAt: "asc" },
  });
}
