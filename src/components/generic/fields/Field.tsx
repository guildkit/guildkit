"use client";

import {
  useState,
  type ChangeEventHandler,
  type ComponentProps,
  type HTMLInputTypeAttribute,
  type ReactElement,
} from "react";
import { commonClasses, errorClasses, ErrorMessage, FieldHeadings, validClasses, type CommonFieldProps } from "./FieldCommons.tsx";
import type { ZodType } from "zod";

type Props<T extends (HTMLInputTypeAttribute | "textarea")> = CommonFieldProps & {
  type: T;
  validator?: ZodType;
} & (
  T extends "textarea"
    ? ComponentProps<T>
    : Omit<ComponentProps<"input">, "type">
);

export const Field = <T extends (HTMLInputTypeAttribute | "textarea")>({
  type,
  label,
  description,
  required = false,
  name,
  autoComplete = "on",
  validator,
  className,
  errorMessages: serverSideErrorMessages,
  ...formProps
}: Props<T>): ReactElement<Props<T>> => {
  const [ errorMessage, setErrorMessage ] = useState<string>("");

  const onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (evt) => {
    if (!validator) {
      return;
    }

    const { success, error } = validator.safeParse(evt.target.value);
    if (success) {
      setErrorMessage("");
    } else {
      setErrorMessage(error.issues[0].message);
    }
  };

  return (
    <div className={className}>
      <FieldHeadings
        label={label}
        description={description}
        required={required}
        name={name}
      />

      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          className={`${ commonClasses } ${ errorMessage ? errorClasses : validClasses } min-h-[100px] resize-y`}
          autoComplete={autoComplete}
          onChange={onChange}
          {...formProps as ComponentProps<"textarea">}
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          className={commonClasses + " " + (errorMessage ? errorClasses : validClasses)}
          autoComplete={autoComplete}
          onChange={onChange}
          {...formProps as ComponentProps<"input">}
        />
      )}

      <ErrorMessage>
        {serverSideErrorMessages?.[0] ?? errorMessage}
      </ErrorMessage>
    </div>
  );
};
