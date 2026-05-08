import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-48 shrink-0">
          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Overview
            </Link>
            <Link
              href="/dashboard/jobs"
              className="flex items-center rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              My Job Postings
            </Link>
            <Link
              href="/dashboard/applications"
              className="flex items-center rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              My Applications
            </Link>
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
