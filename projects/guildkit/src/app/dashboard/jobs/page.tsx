import { headers } from "next/headers";
import Link from "next/link";
import { deleteJob, publishJob } from "@/actions/jobs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Job Postings" };

const STATUS_BADGE: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  PUBLISHED: "bg-green-100 text-green-700",
  CLOSED: "bg-red-100 text-red-700",
};

// Void wrappers so the return value doesn't conflict with React's form action type
async function publishJobAction(id: string) {
  "use server";
  await publishJob(id);
}

async function deleteJobAction(id: string) {
  "use server";
  await deleteJob(id);
}

export default async function MyJobsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  const jobs = await prisma.job.findMany({
    where: { postedById: session!.user.id },
    include: {
      company: true,
      _count: { select: { applications: true }},
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Job Postings</h1>
        <Link
          href="/dashboard/jobs/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          + Post a Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 py-20 text-center">
          <p className="text-gray-500">You haven&apos;t posted any jobs yet.</p>
          <Link
            href="/dashboard/jobs/new"
            className="mt-3 inline-block text-sm text-blue-600 hover:text-blue-800"
          >
            Post your first job →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-lg border border-gray-200 bg-white p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/jobs/${ job.id }`}
                    className="text-base font-semibold text-gray-900 hover:text-blue-600"
                  >
                    {job.title}
                  </Link>
                  <p className="text-sm text-gray-500">{job.company.name}</p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-0.5 text-xs font-medium ${ STATUS_BADGE[job.status] ?? STATUS_BADGE.DRAFT }`}
                >
                  {job.status}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span>
                  {job._count.applications} application
                  {job._count.applications !== 1 ? "s" : ""}
                </span>
                <span>
                  Posted{" "}
                  {new Date(job.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>

                {/* Publish action */}
                {job.status === "DRAFT" && (
                  <form
                    action={publishJobAction.bind(null, job.id)}
                    className="contents"
                  >
                    <button
                      type="submit"
                      className="ml-auto text-sm font-medium text-green-600 hover:text-green-800"
                    >
                      Publish
                    </button>
                  </form>
                )}

                {/* Delete action */}
                <form
                  action={deleteJobAction.bind(null, job.id)}
                  className="contents"
                >
                  <button
                    type="submit"
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
