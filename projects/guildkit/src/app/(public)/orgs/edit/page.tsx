import { forbidden } from "next/navigation";
import { OrgEditor } from "@/components/OrgEditor.client.tsx";
import { organization } from "@/lib/auth/client";
import { getBase64FromImageURL } from "@/lib/utils/utils";
import type { ReactElement } from "react";

export default async function EditOrgPage(): Promise<ReactElement> {
  const { error, data: org } = await organization.getFullOrganization();

  if (error) { // TODO check the error types if we should forbid the access or raise an unecpected error.
    forbidden();
  }

  const logoBase64 = org.logo ? await getBase64FromImageURL(org.logo) : undefined;

  return <OrgEditor org={org} initialLogoBase64={logoBase64} />;
}
