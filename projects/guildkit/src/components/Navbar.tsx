import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import NavbarActions from "./NavbarActions";

export default async function Navbar() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user
    ? { name: session.user.name, email: session.user.email }
    : null;

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-blue-600">
              GuildKit
            </Link>
            <Link
              href="/jobs"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Browse Jobs
            </Link>
          </div>
          <NavbarActions user={user} />
        </div>
      </div>
    </nav>
  );
}
