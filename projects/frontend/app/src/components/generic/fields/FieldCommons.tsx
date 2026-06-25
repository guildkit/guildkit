import type { ReactElement, ReactNode } from "react";

export const commonClasses = `
  w-full px-3 py-3 border rounded-md text-base
  transition-colors duration-150 ease-in-out
  focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-100
`.trim();

export const validClasses = "border-gray-300 focus:border-blue-500";
export const errorClasses = "border-red-600 focus:border-red-600 focus:ring-red-100";

export type CommonFieldProps = {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
  errorMessages?: string[];
  className?: string;
};

type Props = Pick<CommonFieldProps, "label" | "description" | "required" | "name">;

export const FieldHeadings = ({
  label,
  description,
  required,
  name,
}: Props): ReactElement => (
  <>
    <label htmlFor={name} className="block font-bold mb-2">
      {label}
      {required && <span title="This field is required." className="text-red-400 ml-1">*</span>}
    </label>

    { description && (
      <span className="block text-sm text-gray-500 mb-2">
        {description}
      </span>
    )}
  </>
);

type ErrorMessageProps = {
  className?: string;
  children: ReactNode;
};

export const ErrorMessage = ({ className, children }: ErrorMessageProps): ReactElement | null => children ? (
  <small className={`block text-red-600 text-sm mt-1 ${ className ?? "" }`}>
    {children}
  </small>
) : null;
