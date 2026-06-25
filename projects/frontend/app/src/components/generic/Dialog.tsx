import { Dialog as RACDialog, type DialogProps } from "react-aria-components";
import { twMerge } from "tailwind-merge";
import type { ReactElement } from "react";

export const Dialog = (props: DialogProps): ReactElement => (
  <RACDialog
    {...props}
    className={twMerge(
      "outline outline-0 p-6 [[data-placement]>&]:p-4 max-h-[inherit] overflow-auto relative",
      props.className
    )}
  />
);
