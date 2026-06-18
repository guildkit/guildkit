import { Link } from "@/components/generic/ButtonLink.tsx";
import { CenterBox } from "@/components/generic/CenterBox.tsx";
import { Nav } from "@/components/Nav.tsx";
import { Sidebar } from "@/components/Sidebar.tsx";
import { getSession, organization } from "@/lib/auth/client";
import { unauthorized } from "next/navigation";
import type { ReactElement, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default async function EmployerLayout({ children }: Props): Promise<ReactElement> {
  const { error, data } = await getSession();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  const userType = data?.user.type;

  const { error: orgError, data: org } = await organization.getFullOrganization({ query: { membersLimit: 0 }});

  if (orgError) {
    console.error(orgError);
    throw new Error(orgError.message);
  }

  if (userType !== "recruiter" && userType !== "administrative") {
    return unauthorized();
  }

  if (!org) {
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
  }

  return (
    <>
      <Nav for={userType} />
      <div className="flex justify-center w-full">
        <Sidebar />
        <main className="flex flex-col items-center gap-4 w-full">
          {children}
        </main>
      </div>
    </>
  );
}
