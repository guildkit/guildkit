import { Nav } from "@/components/Nav.tsx";
import { getSession } from "@/lib/auth/client.ts";
import type { ReactElement, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default async function PublicLayout({ children }: Props): Promise<ReactElement> {
  const { error, data } = await getSession();

  if (error) {
    console.error(error);
    throw new Error();
  }

  return (
    <>
      <Nav for={data?.user?.type ?? "guest"} />
      <main className="flex flex-col items-center gap-4 w-full">
        {children}
      </main>
    </>
  );
}
