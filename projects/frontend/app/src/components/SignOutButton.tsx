import { Button } from "@/components/generic/ButtonLink.tsx";
import { useSignOut } from "@/lib/auth/client.ts";
import type { ReactElement } from "react";

export const SignOutButton = (): ReactElement => {
  const { signOut } = useSignOut();

  return (
    <Button theme="button-pale" onClick={() => void signOut()}>
      Log out
    </Button>
  );
};
