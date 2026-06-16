import { getJobs } from "@guildkit/client";
import { JobList } from "@/components/JobList.tsx";

export default async function Index() {
  const jobs = await getJobs(undefined);

  return (
    <JobList jobs={jobs} />
  );
}
