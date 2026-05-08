import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session!.user.id;

  const [ jobCount, applicationCount ] = await Promise.all([
    prisma.job.count({ where: { postedById: userId }}),
    prisma.application.count({ where: { applicantId: userId }}),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">
        Welcome back, {session!.user.name}!
      </h1>
      <p className="mt-1 text-gray-600">Manage your jobs and applications.</p>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-3xl font-bold text-blue-600">{jobCount}</p>
          <p className="mt-1 text-sm text-gray-600">Job Postings</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-3xl font-bold text-blue-600">{applicationCount}</p>
          <p className="mt-1 text-sm text-gray-600">Applications Submitted</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-gray-900">Post a Job</h2>
          <p className="mt-2 text-sm text-gray-600">
            Create a new job listing for your company and start receiving applications.
          </p>
          <Link
            href="/dashboard/jobs/new"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Post a Job →
          </Link>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-gray-900">Browse Jobs</h2>
          <p className="mt-2 text-sm text-gray-600">
            Explore available opportunities and apply to jobs that match your profile.
          </p>
          <Link
            href="/jobs"
            className="mt-4 inline-block rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Browse Jobs →
          </Link>
        </div>
      </div>
    </div>
  );
}
