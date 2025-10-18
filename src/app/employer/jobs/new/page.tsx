"use client";

import { useActionState, type ReactElement } from "react";
import { Button } from "@/components/generic/ButtonLink.tsx";
import { createJob } from "@/lib/actions/jobs.ts";
import { useActiveOrganization } from "@/lib/auth/client.ts";

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
        <div className="mb-6">
          <label className="block w-full" htmlFor="title">
            <span className="font-bold block mb-2">
              Title <span className="text-red-400">*</span>
            </span>
            <input
              className={`block w-full px-3 py-3 border rounded-md text-base transition-all duration-150 ease-in-out focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] ${
                state.errors?.title ? "border-red-600 shadow-[0_0_0_3px_rgba(220,38,38,0.1)]" : "border-gray-300"
              }`}
              type="text"
              placeholder="Job Title"
              name="title"
              id="title"
            />
          </label>
          {state.errors?.title && (
            <small className="text-red-600 text-sm block mt-1">
              {state.errors?.title.map((errMsg) => <p>{errMsg}</p>)}
            </small>
          )}
        </div>

        <div className="mb-6">
          <label className="block w-full" htmlFor="description">
            <span className="font-bold block mb-2">
              Description <span className="text-red-400">*</span>
            </span>
            <textarea
              className={`block w-full px-3 py-3 border rounded-md text-base transition-all duration-150 ease-in-out focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] min-h-[100px] resize-y ${
                state.errors?.description ? "border-red-600 shadow-[0_0_0_3px_rgba(220,38,38,0.1)]" : "border-gray-300"
              }`}
              placeholder="Job Description"
              name="description"
              id="description"
            />
          </label>
          {state.errors?.description && (
            <small className="text-red-600 text-sm block mt-1">
              {state.errors?.description.map((errMsg) => <p>{errMsg}</p>)}
            </small>
          )}
        </div>

        <div className="mb-6">
          <label className="block w-full" htmlFor="applicationUrl">
            <span className="font-bold block mb-2">
              Application URL <span className="text-red-400">*</span>
            </span>
            <input
              className={`block w-full px-3 py-3 border rounded-md text-base transition-all duration-150 ease-in-out focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] ${
                state.errors?.applicationUrl ? "border-red-600 shadow-[0_0_0_3px_rgba(220,38,38,0.1)]" : "border-gray-300"
              }`}
              type="url"
              placeholder="https://yourcompany.com/careers/1"
              name="applicationUrl"
              id="applicationUrl"
            />
          </label>
          {state.errors?.applicationUrl && (
            <small className="text-red-600 text-sm block mt-1">
              {state.errors?.applicationUrl.map((errMsg) => <p>{errMsg}</p>)}
            </small>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="mb-6">
            <label className="block w-full" htmlFor="location">
              <span className="font-bold block mb-2">
                Location <span className="text-red-400">*</span>
              </span>
              <input
                className={`block w-full px-3 py-3 border rounded-md text-base transition-all duration-150 ease-in-out focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] ${
                  state.errors?.location ? "border-red-600 shadow-[0_0_0_3px_rgba(220,38,38,0.1)]" : "border-gray-300"
                }`}
                type="text"
                placeholder="Remote"
                name="location"
                id="location"
              />
            </label>
            {state.errors?.location && (
              <small className="text-red-600 text-sm block mt-1">
                {state.errors?.location.map((errMsg) => <p>{errMsg}</p>)}
              </small>
            )}
          </div>

          <div className="mb-6">
            <label className="block w-full" htmlFor="salary">
              <span className="font-bold block mb-2">
                Salary <span className="text-red-400">*</span>
              </span>
              <input
                className={`block w-full px-3 py-3 border rounded-md text-base transition-all duration-150 ease-in-out focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] ${
                  state.errors?.salary ? "border-red-600 shadow-[0_0_0_3px_rgba(220,38,38,0.1)]" : "border-gray-300"
                }`}
                type="number"
                placeholder="800000"
                step="100"
                name="salary"
                id="salary"
              />
            </label>
            {state.errors?.salary && (
              <small className="text-red-600 text-sm block mt-1">
                {state.errors?.salary.map((errMsg) => <p>{errMsg}</p>)}
              </small>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block w-full" htmlFor="expiresAt">
            <span className="font-bold block mb-2">
              Deadline <span className="text-red-400">*</span>
            </span>
            <input
              className={`block w-full px-3 py-3 border rounded-md text-base transition-all duration-150 ease-in-out focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] ${
                state.errors?.expiresAt ? "border-red-600 shadow-[0_0_0_3px_rgba(220,38,38,0.1)]" : "border-gray-300"
              }`}
              type="date"
              name="expiresAt"
              id="expiresAt"
            />
          </label>
          {state.errors?.expiresAt && (
            <small className="text-red-600 text-sm block mt-1">
              {state.errors?.expiresAt.map((errMsg) => <p>{errMsg}</p>)}
            </small>
          )}
        </div>

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
