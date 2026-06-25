import { Button } from "@/components/generic/ButtonLink.tsx";
import { signInWith } from "@/lib/auth/client.ts";
import type { ReactElement } from "react";

export const AuthButtons = (): ReactElement => (
  <div className="flex flex-col items-center gap-2">
    <Button theme="button-deep" className="w-64" onClick={() => void signInWith("google")}>
      Signin with Google
    </Button>

    <Button theme="button-deep" className="w-64" onClick={() => void signInWith("github")}>
      Signin with GitHub
    </Button>
  </div>
);
