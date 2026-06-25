import { Link } from "@/components/generic/ButtonLink.tsx";
import { TopBar } from "@/components/generic/TopBar.tsx";
import { SignOutButton } from "@/components/SignOutButton.tsx";
import { siteName } from "@/lib/config";
import type { UserType } from "@guildkit/shared";
import type { ReactElement } from "react";

type Props = {
  userType: UserType | "guest";
  activeOrg: { name: string; slug: string; } | null;
};

export const Nav = ({ userType, activeOrg }: Props): ReactElement => {
  const isRecruiter = userType === "recruiter" || userType === "administrative";

  return (
    <>
      {/* ▼▼ TODO Pre-alpha caution: Delete on the official release ▼▼ */}
      <TopBar>
        Caution: GuildKit is still pre-alpha state and there are probably a lot of bugs. Do not enter any private information for your security.
      </TopBar>
      {/* ▲▲ Pre-alpha caution ▲▲ */}

      <nav className="flex items-center justify-between flex-wrap py-6 px-20">
        <Link href="/" className="flex items-center gap-3 text-gray-900 text-xl font-semibold">
          <img
            src="/logo.png"
            width={64}
            height={64}
            alt=""
            decoding="async"
          />
          <span>{ siteName }</span>
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
