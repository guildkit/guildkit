"use server";

import { redirect, unauthorized } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { flattenError } from "zod";
import { requireAuthAs } from "@/lib/auth/server.ts";
import { db } from "@/lib/db/db.ts";
import { job as jobTable } from "@/lib/db/schema/job.ts";
import { jobSchema, type Job } from "@/lib/validations/job.ts";
import type { ActionState } from "@/lib/types.ts";

export const createJob = async (_initialState: ActionState<Job>, formData: FormData): Promise<ActionState<Job>> => {
  try {
    console.log("form", formData);
    const { session } = await requireAuthAs("recruiter");
    const {
      success,
      error,
      data: validatedNewJob,
    } = jobSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      applicationUrl: formData.get("applicationUrl"),
      location: formData.get("location"),
      salary: formData.get("salary"),
      salaryPer: formData.get("salaryPer"),
      currency: formData.get("currency"),
      expiresAt: formData.get("expiresAt"),
    });

    if (!success) {
      console.log("!tetete", flattenError(error));
      return {
        errors: flattenError(error),
      };
    }

    const [ createdJob ] = await db.insert(jobTable).values({
      ...validatedNewJob,
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
