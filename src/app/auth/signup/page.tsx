"use client";

import { Button, Link } from "@/components/generic/ButtonLink.tsx";
import { signUpWith } from "@/lib/auth/client.ts";
import type { ReactElement } from "react";

export default function SignUpPage(): ReactElement {
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Create new user?</h1>

      <p className="mb-5 text-center">
        Your account is not associated with GuildKit account.<br />
        Create new user or login with another account.
      </p>

      <div className="flex flex-col items-center gap-2">
        <Button
          theme="button-deep"
          className="w-64"
          onClick={() => void signUpWith("github", "candidate")}
        >
          Create account as a <strong>candidate</strong>
        </Button>

        <Button
          theme="button-deep"
          className="w-64"
          onClick={() => void signUpWith("github", "recruiter")}
        >
          Create account as a <strong>recruiter</strong>
        </Button>

        <Link href="/auth">
          Login with another account
        </Link>
      </div>
    </>
  );
}
