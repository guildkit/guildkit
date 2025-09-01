import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/server.ts";
import { Client } from "./page.client.tsx";

export default async function AuthPage() {
  const { user } = await getSession({
    headers: await headers(),
  }) ?? {};

  if (user) {
    if (user.props.type === "candidate") {
      redirect("/");
    } else if (user.props.type === "recruiter") {
      redirect("/employer/jobs");
    } else if (user.props.type === "administrative") {
      redirect("/"); // TODO redirect to the better path
    }
  }

  return <Client />;
}
