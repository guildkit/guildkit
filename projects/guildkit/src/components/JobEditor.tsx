import { headers } from "next/headers";
import { auth } from "@/lib/auth.ts";
import { JobEditorClient } from "./JobEditor.client.tsx";
import type { Job } from "@guildkit/shared/zod";
import type { ReactElement, ReactNode } from "react";

type Props = {
  job: Job | "new";
  children: ReactNode;
};

export const JobEditor = async ({ job, children }: Props): Promise<ReactElement> => {
  const activeOrg = await auth.api.getFullOrganization({
    query: {
      membersLimit: 0,
    },
    headers: await headers(),
  });

  if (!activeOrg) {
    throw new Error("Your organization was not recognized. Error code: GK-A922R");
  }

  return (
    <JobEditorClient
      job={job}
      activeOrg={{
        name: activeOrg.name,
      }}
    >
      {children}
    </JobEditorClient>
  );
};
