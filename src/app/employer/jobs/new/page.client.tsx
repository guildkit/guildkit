"use client";

import Form from "next/form";
import {
  startTransition,
  useActionState,
  type FormEvent,
  type ReactElement,
} from "react";
import { Button } from "@/components/generic/ButtonLink.tsx";
import { Field } from "@/components/generic/fields/Field.tsx";
import { createJob } from "@/lib/actions/jobs.ts";
import {
  jobApplicationUrlSchema,
  jobDescriptionSchema,
  jobExpiresAtSchema,
  jobLocationSchema,
  jobSalarySchema,
  jobTitleSchema,
} from "@/lib/validations/job.ts";
import { NumberField } from "@/components/generic/fields/NumberField.tsx";
import { TagField } from "@/components/generic/fields/TagField.tsx";
import type { Currency } from "@/lib/types.ts";
import type { Tag } from "react-tag-input";

type Props = {
  activeOrg: {
    name: string;
    currencies: Currency[];
  };
};

export default function NewJobPageClient({ activeOrg }: Props): ReactElement {
  const [ state, formAction, isCreatingJob ] = useActionState(createJob, {});
  const { formErrors, fieldErrors } = state.errors ?? {};

  const currencyTags: Tag[] = activeOrg.currencies.map((currencyCode) => ({
    id: currencyCode,
    text: currencyCode,
    className: "",
  }));

  const onSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    startTransition(() => formAction(new FormData(evt.currentTarget)));
  };

  return (
    <section className="w-full max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold flex justify-center mb-5">Create a new job for {activeOrg.name}</h1>

      {formErrors?.map((formError) => (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{formError}</p>
        </div>
      ))}

      <Form action={formAction} onSubmit={onSubmit}>
        <Field
          type="text"
          label="Title"
          placeholder="Job Title"
          name="title"
          validator={jobTitleSchema}
          errorMessages={fieldErrors?.title}
          required
          className="mb-6"
        />

        <Field
          type="textarea"
          label="Description"
          placeholder="Job Description"
          name="description"
          validator={jobDescriptionSchema}
          errorMessages={fieldErrors?.description}
          required
          className="mb-6"
        />

        <Field
          type="url"
          label="Application URL"
          placeholder="https://yourcompany.com/careers/1"
          name="applicationUrl"
          validator={jobApplicationUrlSchema}
          errorMessages={fieldErrors?.applicationUrl}
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
            errorMessages={fieldErrors?.location}
            required
            className="mb-6"
          />

          <NumberField
            label="Salary"
            placeholder="800000"
            step="100"
            name="salary"
            validator={jobSalarySchema}
            errorMessages={fieldErrors?.salary}
            required
            className="mb-6"
          />
        </div>

        {currencyTags.length === 1 ? (
          <input type="hidden" name="currency" value={currencyTags[0].id} />
        ) : ( // TODO Consider replacing this TagField with a combobox
          <TagField
            label="Payment Currency"
            tags={currencyTags}
            name="currency"
            errorMessages={fieldErrors?.currency}
            required
            maxTags={1}
            className="mb-6"
          />
        )}

        <Field
          type="date"
          label="Deadline"
          name="expiresAt"
          validator={jobExpiresAtSchema}
          errorMessages={fieldErrors?.expiresAt}
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
      </Form>
    </section>
  );
}
