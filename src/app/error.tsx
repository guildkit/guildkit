"use client"; // error.tsx must be a Client Component

import { Button, Link } from "@/components/generic/ButtonLink.tsx";
import { CenterBox } from "@/components/generic/CenterBox.tsx";

export default function Error({ error, reset }: {
  error: Error & { digest?: string; };
  reset: () => void;
}) {
  return (
    <>
      <CenterBox>
        <h1>{ error.message }</h1>
        <p>Sorry, this is probably a bug in this website.</p>

        <Button onClick={() => reset()} theme="button-deep">
          Try again
        </Button>
        <Link href="/" theme="button-deep">
          Go back to home
        </Link>
      </CenterBox>
    </>
  );
}
