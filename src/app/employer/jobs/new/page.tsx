import { headers } from "next/headers";
import { auth } from "@/lib/auth.ts";
import NewJobPageClient from "./page.client.tsx";
import type { ReactElement } from "react";

export default async function NewJobPage(): Promise<ReactElement> {
  const activeOrg = await auth.api.getFullOrganization({
    query: {
      membersLimit: 100,
    },
    headers: await headers(),
  });

  if (!activeOrg) {
    throw new Error("Your organization was not recognized. Error code: GK-A922R");
  }

  return (
    <NewJobPageClient
      activeOrg={{
        name: activeOrg.name,
      }}
    />
  );
}
