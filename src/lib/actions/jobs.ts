"use server";

import { and, eq } from "drizzle-orm";
import { redirect, unauthorized } from "next/navigation";
import { requireAuthAs } from "@/lib/auth/server.ts";
import { db } from "@/lib/db/db.ts";
import { job as jobTable } from "@/lib/db/schema/job.ts";
import { jobSchema, type Job } from "@/lib/validation/job.validation.ts";

type CreateJobState = {
  errors?: Partial<Record<keyof Job, string[] | undefined>>;
};

export const createJob = async (_initialState: CreateJobState, formData: FormData): Promise<CreateJobState> => {
  try {
    const { session } = await requireAuthAs("recruiter");
    const jobValidation = jobSchema.safeParse(formData);

    if (!jobValidation.success) {
      return {
        errors: jobValidation.error.flatten().fieldErrors,
      };
    }

    const { expiresAt, ...validatedNewJob } = jobValidation.data;

    const [ createdJob ] = await db.insert(jobTable).values({
      ...validatedNewJob,
      expiresAt: new Date(expiresAt),
      employer: session.activeOrganizationId,
    }).returning({ id: jobTable.id });

    redirect(`/jobs/${ createdJob.id }`);
  } catch {
    unauthorized();
  }
};

type DeleteJobState = {
  error?: string;
};

export const deleteJob = async (_initialState: DeleteJobState, formData: FormData): Promise<DeleteJobState> => {
  try {
    const { session } = await requireAuthAs("recruiter");
    const id = formData.get("id");

    if (!id) {
      console.error("`id` of the job to delete was not given.");
      return {
        error: "Something technically wrong. Sorry, this is probably a bug of this website. If you report this issue, tell us the following error code: GK-L587W",
      };
    }

    if (id instanceof File) {
      console.error("`id` must not be a File.");
      return {
        error: "Something technically wrong. Sorry, this is probably a bug of this website. If you report this issue, tell us the following error code: GK-B324R",
      };
    }

    await db
      .delete(jobTable)
      .where(
        and(
          eq(jobTable.id, id),
          eq(jobTable.employer, session.activeOrganizationId),
        )
      );

    redirect("/employer/jobs");
  } catch {
    unauthorized();
  }
};
