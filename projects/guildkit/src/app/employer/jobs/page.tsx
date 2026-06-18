import { getJobs } from "@guildkit/client";
import { redirect } from "next/navigation";
import { JobEditor } from "@/components/JobEditor.client.tsx";
import { JobList } from "@/components/JobList.tsx";
import type { JobCardInfo } from "@/components/JobCard.tsx";
import { getSession, organization } from "@/lib/auth/client.ts";

export default async function EmployerJobsPage() {
  const { error: sessionError, data } = await getSession();
  const { user } = data ?? {};

  if (sessionError || !user) {
    redirect("/auth");
  }

  const { error: orgError, data: activeOrg } = await organization.getFullOrganization({
    query: {
      membersLimit: 0,
    },
  });

  if (orgError) {
    console.error(orgError);
    throw new Error(orgError.message);
  }

  const jobs: JobCardInfo[] = await getJobs({ employer: "us" });
  const editable = user.type === "recruiter";

  return (
    <div className="flex flex-col items-center gap-y-10 w-full">
      <section className="flex justify-start bg-gray-100 shadow-lg rounded-lg w-[42.5rem] max-w-full p-4">
        <JobEditor job="new" activeOrgName={activeOrg.name}>
          Add job
        </JobEditor>
      </section>

      <JobList jobs={jobs} editable={editable} />
    </div>
  );
};
