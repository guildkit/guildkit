import { OrgEditor } from "@/components/OrgEditor.client.tsx";
import type { ReactElement } from "react";

export default async function NewOrgPage(): Promise<ReactElement> {
  return <OrgEditor />;
}
