import { Link } from "@/components/generic/ButtonLink.tsx";
import { CenterBox } from "@/components/generic/CenterBox.tsx";
import { Nav } from "@/components/Nav.tsx";
import { Sidebar } from "@/components/Sidebar.tsx";
import { requireAuthAs } from "@/lib/auth/server.ts";
import { GuildKitError } from "@/lib/utils/errors.ts";
import type { ReactElement, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default async function EmployerLayout({ children }: Props): Promise<ReactElement> {
  // TODO Do not run `requireAuthAs()` twice in pages (e.g. src/app/employer/jobs/page.tsx) and here
  const { err, user } = await requireAuthAs("recruiter");

  if (err) {
    if (err instanceof GuildKitError && err.code === "RECRUITER_WITHOUT_ORGS") {
      return (
        <>
          <Nav for="guest" />
          <CenterBox>
            <p>
              You do not belong to any organization.<br />
              <Link href="/orgs/new" theme="linktext" prefetch>
                Create a new organization
              </Link> or ask your organization owner to add you.
              {/* TODO Add button to ask invitation to the org in the organization page */}
            </p>
          </CenterBox>
        </>
      );
    } else {
      throw err;
    }
  }

  return (
    <>
      <Nav for={user.props.type ?? "guest"} />
      <div className="flex justify-center w-full">
        <Sidebar />
        <main className="flex flex-col items-center gap-4 w-full">
          {children}
        </main>
      </div>
    </>
  );
}
