import { JobEditor } from "@/components/JobEditor.tsx";
import { JobList } from "@/components/JobList.tsx";
import type { JobCardInfo } from "@/components/JobCard.tsx";
import { getJobs } from "@guildkit/client";
import { authClient } from "@/lib/auth/client";
import { redirect } from "next/navigation";

export default async function EmployerJobsPage() {
  const { error, data } = await authClient.getSession();
  const { user } = data ?? {};

  if (error || !user) {
    redirect("/auth");
  }

  const jobs: JobCardInfo[] = await getJobs({ employer: "us" });
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
