import type { ReactElement, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const TopBar = ({ children }: Props): ReactElement => (
  <div className="flex justify-center items-center bg-red-50 text-red-500 w-full min-h-10 p-3">
    {children}
  </div>
);
