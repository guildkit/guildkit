import { redirect } from "next/navigation";
import { requireAuthAs } from "@/lib/auth/server.ts";
import { updateUserProps } from "@/lib/db/helpers.ts";
import type { ReactElement } from "react";

type Props = {
  params: Promise<unknown>;
};

const getUserType = async (params: Promise<unknown>) => {
  const data = await params;

  if (
    data
    && typeof data == "object"
    && "type" in data
    && (data.type === "candidate" || data.type === "recruiter")
  ) {
    return data.type;
  } else {
    return undefined;
  }
};

export default async function SignUpPage({ params }: Props): Promise<ReactElement> {
  const userType = await getUserType(params);

  if (!userType) {
    throw new Error("Invalid user type. Must be 'candidate' or 'recruiter'.");
  }

  const { err, user } = await requireAuthAs("any", { allowUsersWithoutType: true });

  if (err) {
    throw err;
  }

  if (user.props.type) {
    redirect(user.props.type === "recruiter" ? "/employer/jobs" : "/");
  }

  await updateUserProps(user).set({ type: userType });
  redirect(userType === "recruiter" ? "/employer/jobs" : "/");
}
