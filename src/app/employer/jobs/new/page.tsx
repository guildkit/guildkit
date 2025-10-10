"use client";

import { useActionState, type ReactElement } from "react";
import { Button } from "@/components/generic/ButtonLink.tsx";
import { Field } from "@/components/generic/fields/Field.tsx";
import { createJob } from "@/lib/actions/jobs.ts";
import { useActiveOrganization } from "@/lib/auth/client.ts";
import {
  jobApplicationUrlSchema,
  jobDescriptionSchema,
  jobExpiresAtSchema,
  jobLocationSchema,
  jobSalarySchema,
  jobTitleSchema,
} from "@/lib/validations/job.ts";

export default function NewJobPage(): ReactElement {
  const [ state, formAction, isCreatingJob ] = useActionState(createJob, {});
  const { data: activeOrg } = useActiveOrganization();

  if (!activeOrg) {
    // This error should not happen because active organization is set
    // in `databaseHooks.session.create` of betterAuth instanciation in src/lib/auth.ts
    throw new Error("You don't belong to any organization. Error code: GK-P683B");
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold flex justify-center mb-5">Create a new job for {activeOrg.name}</h1>
      <form action={formAction}>
        <Field
          type="text"
          label="Title"
          placeholder="Job Title"
          name="title"
          validator={jobTitleSchema}
          errorMessages={state.errors?.title}
          required
          className="mb-6"
        />

        <Field
          type="textarea"
          label="Description"
          placeholder="Job Description"
          name="description"
          validator={jobDescriptionSchema}
          errorMessages={state.errors?.description}
          required
          className="mb-6"
        />

        <Field
          type="url"
          label="Application URL"
          placeholder="https://yourcompany.com/careers/1"
          name="applicationUrl"
          validator={jobApplicationUrlSchema}
          errorMessages={state.errors?.applicationUrl}
          required
          className="mb-6"
        />

        <div className="grid grid-cols-2 gap-6 mb-6">
          <Field
            type="text"
            label="Location"
            placeholder="Remote"
            name="location"
            validator={jobLocationSchema}
            errorMessages={state.errors?.location}
            required
            className="mb-6"
          />

          <Field
            type="number"
            label="Salary"
            placeholder="800000"
            step="100"
            name="salary"
            validator={jobSalarySchema}
            errorMessages={state.errors?.salary}
            required
            className="mb-6"
          />
        </div>

        <Field
          type="date"
          label="Deadline"
          name="expiresAt"
          validator={jobExpiresAtSchema}
          errorMessages={state.errors?.expiresAt}
          required
          className="mb-6"
        />

        <Button
          theme="button-deep"
          className="w-full"
          type="submit"
          disabled={isCreatingJob}
        >
          {isCreatingJob ? "Creating..." : "Create Job"}
        </Button>
      </form>
    </section>
  );
}
