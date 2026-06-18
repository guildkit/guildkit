import { headers } from "next/headers";
import { forbidden } from "next/navigation";
import { OrgEditor } from "@/components/OrgEditor.client.tsx";
import { requireAuthAs } from "@/lib/auth/server.ts";
import { getBase64FromImageURL } from "@/lib/utils/utils";
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

  const logoBase64 = org.logo ? await getBase64FromImageURL(org.logo) : undefined;

  return <OrgEditor org={org} initialLogoBase64={logoBase64} />;
}
