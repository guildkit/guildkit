"use client";

import { Button } from "@/components/generic/ButtonLink.tsx";
import { useSignOut } from "@/lib/auth/client.ts";

export const SignOutButton = () => {
  const { signOut } = useSignOut();

  return (
    <Button theme="button-pale" onClick={() => void signOut()}>
      Log out
    </Button>
  );
};
