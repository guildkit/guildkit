import type { ReactElement, ReactNode } from "react";

type Props = {
  className?: string;
  children: ReactNode;
};

export const CenterBox = ({ className, children }: Props): ReactElement => (
  <div className={`flex flex-col items-center mt-16 ${ className ?? "" }`}>
    {children}
  </div>
);
