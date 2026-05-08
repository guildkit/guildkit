"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

type NavbarActionsProps = {
  user: { name: string; email: string; } | null;
};

export default function NavbarActions({ user }: NavbarActionsProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.refresh();
  };

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/sign-in"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Sign In
        </Link>
        <Link
          href="/sign-up"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/dashboard"
        className="text-sm text-gray-600 hover:text-gray-900"
      >
        Dashboard
      </Link>
      <span className="text-sm text-gray-500">{user.name}</span>
      <button
        onClick={() => {
          void handleSignOut();
        }}
        className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
      >
        Sign Out
      </button>
    </div>
  );
}
