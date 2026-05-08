import Link from "next/link";
import { getJobs } from "@/actions/jobs";
import JobCard from "@/components/JobCard";

export default async function HomePage() {
  const jobs = await getJobs({ status: "PUBLISHED" });
  const featured = jobs.slice(0, 6);

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Find Your Next Opportunity
          </h1>
          <p className="mt-4 text-xl text-blue-100">
            Discover jobs that match your skills and ambitions.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/jobs"
              className="rounded-lg bg-white px-6 py-3 font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
            >
              Browse Jobs
            </Link>
            <Link
              href="/sign-up"
              className="rounded-lg border border-white px-6 py-3 font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </section>

      {/* ── Latest Jobs ──────────────────────────────── */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Latest Jobs</h2>
            <Link
              href="/jobs"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              View all →
            </Link>
          </div>

          {featured.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center">
              <p className="text-gray-500">No jobs posted yet.</p>
              <Link
                href="/sign-up"
                className="mt-3 inline-block text-sm text-blue-600 hover:text-blue-800"
              >
                Be the first to post one →
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────── */}
      <section className="bg-white border-t border-gray-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
            <div>
              <p className="text-4xl font-bold text-blue-600">{jobs.length}+</p>
              <p className="mt-2 text-sm text-gray-600">Active Jobs</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600">Free</p>
              <p className="mt-2 text-sm text-gray-600">To Apply</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600">Easy</p>
              <p className="mt-2 text-sm text-gray-600">Application Process</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
