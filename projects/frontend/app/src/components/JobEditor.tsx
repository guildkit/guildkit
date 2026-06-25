import { createJob } from "@guildkit/client";
import {
  jobApplicationUrlSchema,
  jobDescriptionSchema,
  jobExpiresAtSchema,
  jobLocationSchema,
  jobSalarySchema,
  jobTitleSchema,
  type Job,
} from "@guildkit/shared/zod";
import {
  useState,
  useTransition,
  type FormEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { DialogTrigger } from "react-aria-components";
import { Button } from "@/components/generic/ButtonLink.tsx";
import { Dialog } from "@/components/generic/Dialog.tsx";
import { Field } from "@/components/generic/fields/Field.tsx";
import { Modal } from "@/components/generic/Modal.tsx";
import type { ActionState } from "@/lib/types.ts";

type Props = {
  job: Job | "new";
  activeOrgName: string;
  children: ReactNode;
};

export const JobEditor = ({ job, activeOrgName, children }: Props): ReactElement => {
  const [ state, setState ] = useState<ActionState<Job>>({});
  const [ isCreatingJob, startTransition ] = useTransition();
  const { formErrors, fieldErrors } = state.errors ?? {};

  const onSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const formData = new FormData(evt.currentTarget);
    // TODO: the form is missing `currency` and `salaryPer` inputs (pre-existing
    // gap carried over from the legacy editor), so the values are sent as-is and
    // validated by the backend.
    const values = {
      title: formData.get("title"),
      description: formData.get("description"),
      applicationUrl: formData.get("applicationUrl"),
      location: formData.get("location"),
      salary: formData.get("salary"),
      currency: formData.get("currency"),
      salaryPer: formData.get("salaryPer"),
      expiresAt: formData.get("expiresAt"),
    };

    startTransition(async () => {
      try {
        await createJob(
          values as unknown as Parameters<typeof createJob>[0],
          { init: { credentials: "include" } }
        );
        window.location.href = "/employer/jobs";
      } catch {
        setState({ errors: { formErrors: [ "Something went wrong. Please try again." ], fieldErrors: {}}});
      }
    });
  };

  return (
    <DialogTrigger>
      <Button theme="button-deep">
        {children}
      </Button>
      <Modal>
        <Dialog className="w-full max-w-3xl px-4 py-8">
          <h1 className="text-2xl font-bold flex justify-center mb-5">
            {job === "new" ? `Create a new job for ${ activeOrgName }` : `Update job: ${ job.title }` }
          </h1>

          {formErrors?.map((formError) => (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md" key={formError}>
              <p className="text-red-800">{formError}</p>
            </div>
          ))}

          <form onSubmit={onSubmit}>
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

              <Field
                type="number"
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
              {
                job === "new"
                  ? (isCreatingJob ? "Creating..." : "Add item")
                  : (isCreatingJob ? "Updating..." : "Update this item")
              }
            </Button>
          </form>
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
};
