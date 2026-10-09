import createClient, { type HeadersOptions } from "openapi-fetch";
import type { components, paths } from "./generated/openapi.ts";

export const client = createClient<paths>({
  baseUrl: "http://localhost:3001", // TODO allow configuring backend URL
});

type RequestOptions = {
  /** Request headers, e.g. `cookie` to call the API on behalf of the user */
  headers?: HeadersOptions;
};

// Dates are serialized as ISO `date-time` strings on the wire. The wrappers
// below convert them back into `Date` objects so consumers receive domain data.
const withJobDates = <Job extends { createdAt: string; updatedAt: string; }>(job: Job) => ({
  ...job,
  createdAt: new Date(job.createdAt),
  updatedAt: new Date(job.updatedAt),
});

// Jobs

export const getJobs = async (
  options?: {
    employer?: string;
  } & RequestOptions
) => {
  const { data: rawJobs, response } = await client.GET("/api/jobs", {
    params: { query: { employer: options?.employer }},
    headers: options?.headers,
  });

  if (!rawJobs) {
    throw new Error(`Failed to fetch jobs: ${ response.status }`);
  }

  return rawJobs.map(withJobDates);
};

export const getJob = async (
  jobId: string,
  options?: RequestOptions
) => {
  const { data: rawJob, response } = await client.GET("/api/job/{id}", {
    params: { path: { id: jobId }},
    headers: options?.headers,
  });

  if (response.status === 404) {
    return undefined;
  }

  if (!rawJob) {
    throw new Error(`Failed to fetch job ${ jobId }.`);
  }

  return withJobDates(rawJob);
};

export const createJob = async (
  job: components["schemas"]["JobCreateSchema"],
  options?: RequestOptions
): Promise<{ newJobId: string; }> => {
  const { data, response } = await client.POST("/api/job", {
    body: job,
    headers: options?.headers,
  });

  if (!data) {
    throw new Error(`Failed to create a job: ${ response.status }`);
  }

  return data;
};

export const deleteJob = async (
  jobId: string,
  options?: RequestOptions
): Promise<void> => {
  const { response } = await client.DELETE("/api/jobs/{id}", {
    params: { path: { id: jobId }},
    headers: options?.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to delete job ${ jobId }.`);
  }
};

// Organizations

export const getOrganization = async (
  slug: string,
  options?: RequestOptions
) => {
  const { data: rawOrg, response } = await client.GET("/api/organizations/{slug}", {
    params: { path: { slug }},
    headers: options?.headers,
  });

  if (response.status === 404) {
    return undefined;
  }

  if (!rawOrg) {
    throw new Error(`Failed to fetch organization ${ slug }.`);
  }

  return {
    ...rawOrg,
    createdAt: new Date(rawOrg.createdAt),
    jobs: rawOrg.jobs.map(withJobDates),
  };
};
