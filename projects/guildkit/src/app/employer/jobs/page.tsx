import { JobEditor } from "@/components/JobEditor.tsx";
import { JobList } from "@/components/JobList.tsx";
import { requireAuthAs } from "@/lib/auth/server.ts";
import { prisma } from "@/lib/prisma.ts";
import { GuildKitError } from "@guildkit/shared";
import type { JobCardInfo } from "@/components/JobCard.tsx";

export default async function EmployerJobsPage() {
  // TODO Do not run `requireAuthAs()` twice in src/app/employer/layout.tsx and here
  const { err, user, session } = await requireAuthAs("recruiter");

  if (err) {
    if (err instanceof GuildKitError && err.code === "RECRUITER_WITHOUT_ORGS") {
      return null; // The error would be processed in the layout
    } else {
      throw err;
    }
  }

  const jobs: JobCardInfo[] = await prisma.job.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      employer: {
        select: {
          name: true,
        },
      },
    },
    where: {
      employerId: session.activeOrganizationId,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const editable = user.type === "recruiter";

  return (
    <div className="flex flex-col items-center gap-y-10 w-full">
      <section className="flex justify-start bg-gray-100 shadow-lg rounded-lg w-[42.5rem] max-w-full p-4">
        <JobEditor job="new">
          Add job
        </JobEditor>
      </section>

      <JobList jobs={jobs} editable={editable} />
    </div>
  );
};
