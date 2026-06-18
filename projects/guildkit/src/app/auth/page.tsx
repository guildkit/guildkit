"use client";

import { redirect } from "next/navigation";
import { Button } from "@/components/generic/ButtonLink.tsx";
import { getSession } from "@/lib/auth/client.ts";
import { signInWith } from "@/lib/auth/client.ts";

export default async function AuthPage() {
  const { error, data } = await getSession();

  if (error) {
    throw new Error(`${ error.status } ${ error.statusText }: ${ error.message } (error code: ${ error.code })`);
  }

  const userType = data?.user.type;

  if (userType === "candidate") {
    redirect("/");
  } else if (userType === "recruiter") {
    redirect("/employer/jobs");
  } else if (userType === "administrative") {
    redirect("/"); // TODO redirect to the better path
  }

  return (
    <>
      <h1 className="text-3xl mb-6">Sign in or Sign up</h1>

      <div className="flex flex-col items-center gap-2">
        <Button theme="button-deep" className="w-64" onClick={() => void signInWith("google")}>
          Signin with Google
        </Button>

        <Button theme="button-deep" className="w-64" onClick={() => void signInWith("github")}>
          Signin with GitHub
        </Button>
      </div>
    </>
  );
}
