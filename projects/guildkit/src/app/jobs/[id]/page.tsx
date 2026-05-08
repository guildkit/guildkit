import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJob } from "@/actions/jobs";
import { auth } from "@/lib/auth";
import ApplyButton from "./ApplyButton";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ id: string; }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const job = await getJob(id);
  return { title: job?.title ?? "Job Not Found" };
}

const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  FREELANCE: "Freelance",
  INTERNSHIP: "Internship",
};

export default async function JobPage({ params }: Props) {
  const { id } = await params;
  const [ job, session ] = await Promise.all([
    getJob(id),
    auth.api.getSession({ headers: await headers() }),
  ]);

  if (job?.status !== "PUBLISHED") {
    notFound();
  }

  const salary
    = job.salaryMin && job.salaryMax
      ? `$${ job.salaryMin.toLocaleString() } – $${ job.salaryMax.toLocaleString() }`
      : null;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/jobs"
        className="text-sm text-blue-600 hover:text-blue-800"
      >
        ← Back to Jobs
      </Link>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-8">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
            <p className="mt-1 text-lg text-gray-600">{job.company.name}</p>
          </div>

          {/* Apply CTA */}
          <div className="shrink-0">
            {session ? (
              <ApplyButton jobId={job.id} />
            ) : (
              <Link
                href="/sign-in"
                className="inline-block rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Sign in to Apply
              </Link>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
            {JOB_TYPE_LABELS[job.type] ?? job.type}
          </span>
          {job.remote && (
            <span className="rounded-full bg-teal-50 px-3 py-1 text-sm text-teal-700">
              Remote
            </span>
          )}
          {job.location && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
              {job.location}
            </span>
          )}
          {salary && (
            <span className="rounded-full bg-green-50 px-3 py-1 text-sm text-green-700">
              {salary}
            </span>
          )}
        </div>

        {/* Description */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">
            Job Description
          </h2>
          <p className="mt-4 whitespace-pre-wrap text-gray-700">
            {job.description}
          </p>
        </div>

        {job.requirements && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900">
              Requirements
            </h2>
            <p className="mt-4 whitespace-pre-wrap text-gray-700">
              {job.requirements}
            </p>
          </div>
        )}

        {/* Company */}
        <div className="mt-8 border-t border-gray-100 pt-8">
          <h2 className="text-lg font-semibold text-gray-900">About the Company</h2>
          <p className="mt-1 text-gray-600">{job.company.name}</p>
          {job.company.description && (
            <p className="mt-2 text-sm text-gray-600">{job.company.description}</p>
          )}
          {job.company.website && (
            <a
              href={job.company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-800"
            >
              {job.company.website} ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
