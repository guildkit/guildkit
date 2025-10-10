import NewJobPageClient from "./page.client.tsx";
import type { ReactElement } from "react";

export default async function NewJobPage(): Promise<ReactElement> {
  return <NewJobPageClient />;
}
