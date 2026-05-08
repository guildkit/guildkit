import Link from "next/link";
import { getMyApplications } from "@/actions/applications";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Applications" };

const STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  REVIEWED: "bg-blue-100 text-blue-700",
  SHORTLISTED: "bg-purple-100 text-purple-700",
  REJECTED: "bg-red-100 text-red-700",
  ACCEPTED: "bg-green-100 text-green-700",
};

export default async function ApplicationsPage() {
  const applications = await getMyApplications();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Applications</h1>

      {applications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 py-20 text-center">
          <p className="text-gray-500">
            You haven&apos;t applied to any jobs yet.
          </p>
          <Link
            href="/jobs"
            className="mt-3 inline-block text-sm text-blue-600 hover:text-blue-800"
          >
            Browse available jobs →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="rounded-lg border border-gray-200 bg-white p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/jobs/${ app.job.id }`}
                    className="font-semibold text-gray-900 hover:text-blue-600"
                  >
                    {app.job.title}
                  </Link>
                  <p className="text-sm text-gray-500">{app.job.company.name}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-0.5 text-xs font-medium ${ STATUS_BADGE[app.status] ?? STATUS_BADGE.PENDING }`}
                >
                  {app.status}
                </span>
              </div>

              <p className="mt-2 text-xs text-gray-400">
                Applied{" "}
                {new Date(app.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>

              {app.coverLetter && (
                <p className="mt-3 line-clamp-2 text-sm text-gray-600">
                  {app.coverLetter}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
