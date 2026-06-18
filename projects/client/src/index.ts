import { hc } from "hono/client";
import type { guildKitBackend } from "@guildkit/backend";

type BackendApp = ReturnType<typeof guildKitBackend>;

export const client = hc<BackendApp>("http://localhost:3001/");

// Dates are serialized as ISO `date-time` strings on the wire. The wrappers
// below convert them back into `Date` objects so consumers receive domain data.
const withJobDates = <Job extends { createdAt: string; updatedAt: string; }>(job: Job) => ({
  ...job,
  createdAt: new Date(job.createdAt),
  updatedAt: new Date(job.updatedAt),
});

// Organizations

export const getOrganization = async (
  slug: Parameters<typeof client["organizations"][":slug"]["$get"]>[0]["param"]["slug"],
  options?: Parameters<typeof client["organizations"][":slug"]["$get"]>[1]
) => {
  const res = await client.organizations[":slug"].$get({ param: { slug }}, options);

  if (res.status === 404) {
    return undefined;
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch organization ${ slug }.`);
  }

  const rawOrg = await res.json();

  return {
    ...rawOrg,
    createdAt: new Date(rawOrg.createdAt),
    jobs: rawOrg.jobs.map(withJobDates),
  };
};

export const createOrganization = async (
  org: Parameters<typeof client["organization"]["$post"]>[0]["form"],
  options?: Parameters<typeof client["organization"]["$post"]>[1]
): Promise<
  | { ok: true; }
  | { ok: false; errors: { formErrors: string[]; fieldErrors: Record<string, string[]>; }; }
> => {
  const res = await client.organization.$post({ form: org }, options);

  if (res.ok) {
    return { ok: true };
  }

  // The backend returns `{ errors: { formErrors, fieldErrors } }` for 409/500,
  // but does not declare those response bodies in its OpenAPI route, so they are
  // typed as `{}` on the client. Cast to the documented runtime shape.
  const { errors } = await res.json() as {
    errors: { formErrors: string[]; fieldErrors: Record<string, string[]>; };
  };

  return { ok: false, errors };
};

// Jobs

export const getJobs = async (
  options?: {
    employer?: string;
  } & Parameters<typeof client["jobs"]["$get"]>[1]
) => {
  const res = await client.jobs.$get({ query: { employer: options?.employer }}, options);

  if (!res.ok) {
    throw new Error(`Failed to fetch jobs: ${ res.status }`);
  }

  const rawJobs = await res.json();

  return rawJobs.map(withJobDates);
};

export const getJob = async (
  jobId: Parameters<typeof client["job"][":id"]["$get"]>[0]["param"]["id"],
  options?: Parameters<typeof client["job"][":id"]["$get"]>[1]
) => {
  const res = await client.job[":id"].$get({ param: { id: jobId }}, options);

  if (res.status === 404) {
    return undefined;
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch job ${ jobId }.`);
  }

  const rawJob = await res.json();

  return withJobDates(rawJob);
};

export const createJob = async (
  job: Parameters<typeof client["job"]["$post"]>[0]["json"],
  options?: Parameters<typeof client["job"]["$post"]>[1]
): Promise<{ newJobId: string; }> => {
  const res = await client.job.$post({ json: job }, options);

  if (!res.ok) {
    throw new Error(`Failed to create a job: ${ res.status }`);
  }

  // The backend returns `{ newJobId }` on 201, but does not declare the response
  // body in its OpenAPI route, so it is typed as `{}` on the client. Cast to the
  // documented runtime shape.
  return await res.json() as { newJobId: string; };
};

export const deleteJob = async (
  jobId: Parameters<typeof client["jobs"][":id"]["$delete"]>[0]["param"]["id"],
  options?: Parameters<typeof client["jobs"][":id"]["$delete"]>[1]
): Promise<void> => {
  const res = await client.jobs[":id"].$delete({ param: { id: jobId }}, options);

  if (!res.ok) {
    throw new Error(`Failed to delete job ${ jobId }.`);
  }
};
