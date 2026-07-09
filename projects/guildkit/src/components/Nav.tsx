import { headers } from "next/headers";
import Image from "next/image";
import { Link } from "@/components/generic/ButtonLink.tsx";
import { TopBar } from "@/components/generic/TopBar.tsx";
import { SignOutButton } from "@/components/SignOutButton.tsx";
import { auth } from "@/lib/auth.ts";
import config from "../../../../guildkit.config.ts";
import type { ReactElement } from "react";
import type { UserType } from "@/lib/prisma/enums.ts";

type Props = {
  for: UserType | "guest";
};

export const Nav = async ({ for: userType }: Props): Promise<ReactElement> => {
  const isRecruiter = userType === "recruiter" || userType === "administrative";
  const activeOrg = isRecruiter && await auth.api.getFullOrganization({
    query: {
      membersLimit: 0,
    },
    headers: await headers(),
  });

  return (
    <>
      {/* ▼▼ TODO Pre-alpha caution: Delete on the official release ▼▼ */}
      <TopBar>
        Caution: GuildKit is still pre-alpha state and there are probably a lot of bugs. Do not enter any private information for your security.
      </TopBar>
      {/* ▲▲ Pre-alpha caution ▲▲ */}

      <nav className="flex items-center justify-between flex-wrap py-6 px-20">
        <Link href="/" className="flex items-center gap-3 text-gray-900 text-xl font-semibold">
          <Image
            src="https://brand.guildkit.net/generated/text-light.svg"
            width={384}
            height={96}
            alt={config.siteName}
            decoding="async"
          />
        </Link>
        <div className="flex items-center gap-4">
          { isRecruiter && (
            activeOrg ? (
              <>
                <Link href="/employer/jobs" theme="none" className="mr-8 font-bold">
                  Dashboard
                </Link>
                <Link href={`/orgs/${ activeOrg.slug }`}>
                  {activeOrg.name}
                </Link>
              </>
            ) : (
              <p>
                <Link href="/orgs/new" theme="linktext">Create your company</Link><br />
                or ask your boss to invite
              </p>
            )
          )}

          {userType === "guest" ? (
            <Link href="/auth" theme="button-deep">Log in <span className="after:content-['|'] after:text-gray-500"></span> Sign up</Link>
          ) : (
            <SignOutButton />
          )}
        </div>
      </nav>
    </>
  );
};
