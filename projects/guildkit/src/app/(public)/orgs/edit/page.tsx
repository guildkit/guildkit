import { initAuth } from "@guildkit/shared/auth";
import { headers } from "next/headers";
import { forbidden } from "next/navigation";
import { OrgEditor } from "@/components/OrgEditor.tsx";
import { requireAuthAs } from "@/lib/auth/server.ts";
import type { ReactElement } from "react";

export default async function EditOrgPage(): Promise<ReactElement> {
  const { session } = await requireAuthAs("recruiter");

  const org = await auth.api.getFullOrganization({
    query: {
      organizationId: session?.activeOrganizationId ?? undefined,
      membersLimit: 0,
    },
    headers: await headers(),
  });

  if (!org) {
    forbidden();
  }

  return <OrgEditor org={org} />;
}
