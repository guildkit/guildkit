import { useState, type ReactElement } from "react";
import { Button, Link } from "@/components/generic/ButtonLink.tsx";
import { signUpWith } from "@/lib/auth/client.ts";

export const SignupForm = (): ReactElement => {
  const [ provider, setProvider ] = useState<"google" | "github" | undefined>(undefined);

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Create new user?</h1>

      <p className="mb-8 text-center">
        Your account is not associated with GuildKit account.<br />
        Create new user or login with another account.
      </p>

      <h2 className="text-xl font-bold mb-4">
        Choose account type to login
      </h2>

      <div className="flex items-center gap-2 mb-6">
        <input
          type="radio"
          id="provider-google"
          name="provider"
          value="google"
          checked={provider === "google"}
          onChange={(e) => e.target.checked && setProvider("google")}
          className="sr-only peer/google"
        />
        <label
          htmlFor="provider-google"
          className="button-pale peer-checked/google:button-deep min-w-24"
        >
          Google
        </label>

        <input
          type="radio"
          id="provider-github"
          name="provider"
          value="github"
          checked={provider === "github"}
          onChange={(e) => e.target.checked && setProvider("github")}
          className="sr-only peer/github"
        />
        <label
          htmlFor="provider-github"
          className="button-pale peer-checked/github:button-deep min-w-24"
        >
          GitHub
        </label>
      </div>

      { provider && (
        <div className="flex flex-col items-center gap-2">
          <Button
            theme="button-deep"
            className="w-64"
            onClick={() => void signUpWith(provider, "candidate")}
          >
            Create account as a <strong>candidate</strong>
          </Button>

          <Button
            theme="button-deep"
            className="w-64"
            onClick={() => void signUpWith(provider, "recruiter")}
          >
            Create account as a <strong>recruiter</strong>
          </Button>

          <Link href="/auth">
            Login with another account
          </Link>
        </div>
      )}
    </>
  );
};
