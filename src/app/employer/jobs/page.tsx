import { Link } from "@/components/generic/ButtonLink.tsx";
import { JobList } from "@/components/JobList.tsx";
import { requireAuthAs } from "@/lib/auth/server.ts";
import { db } from "@/lib/db/db.ts";
import { GuildKitError } from "@/lib/utils/errors.ts";
import type { JobCardInfo } from "@/components/JobCard.tsx";

export default async function EmployerJobsPage() {
  // TODO Do not run `requireAuthAs()` twice in src/app/employer/layout.tsx and here
  const { err, user, session } = await requireAuthAs("recruiter");

  if (err) {
    if (err instanceof GuildKitError && err.code === "RECRUITER_WITHOUT_ORGS") {
      return (<></>); // The error would be processed in the layout
    } else {
      throw err;
    }
  }

  const jobs: JobCardInfo[] = await db.query.job.findMany({
    columns: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
    with: {
      employer: {
        columns: {
          name: true,
        },
      },
    },
    where: (job, { eq }) => eq(job.employer, session.activeOrganizationId),
    orderBy: (job, { desc }) => [ desc(job.updatedAt) ],
  });

  const editable = user.props.type === "recruiter";

  return (
    <div className="flex flex-col items-center gap-y-10 w-full">
      <section className="flex justify-start bg-gray-100 shadow-lg rounded-lg w-[42.5rem] max-w-full p-4">
        <Link href="/employer/jobs/new" theme="button-deep" prefetch>
          Add job
        </Link>
      </section>

      <JobList jobs={jobs} editable={editable} />
    </div>
  );
};
