import { getJobs } from "@/actions/jobs";
import JobCard from "@/components/JobCard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Browse Jobs" };

export default async function JobsPage() {
  const jobs = await getJobs({ status: "PUBLISHED" });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Browse Jobs</h1>
        <p className="mt-2 text-gray-600">
          {jobs.length} {jobs.length === 1 ? "job" : "jobs"} available
        </p>
      </div>

      {jobs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 py-20 text-center">
          <p className="text-gray-500">No jobs have been posted yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
