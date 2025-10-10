"use client";

import {
  useEffect,
  useState,
  type ChangeEventHandler,
  type ComponentProps,
  type ReactElement,
} from "react";
import { commonClasses, errorClasses, ErrorMessage, FieldHeadings, validClasses, type CommonFieldProps } from "./FieldCommons.tsx";
import type { ZodType } from "zod";

type Props = CommonFieldProps & Omit<ComponentProps<"input">, "type"> & {
  validator?: ZodType;
};

export const NumberField = ({
  label,
  description,
  required = false,
  name,
  autoComplete = "off",
  validator,
  className,
  errorMessages: serverSideErrorMessages,
  ...formProps
}: Props): ReactElement => {
  const [ errorMessage, setErrorMessage ] = useState<string>(serverSideErrorMessages?.[0] ?? "");

  useEffect(() => {
    setErrorMessage(serverSideErrorMessages?.[0] ?? "");
  }, [ serverSideErrorMessages ]);

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

      <input
        type="number"
        id={name}
        name={name}
        className={commonClasses + " " + (errorMessage ? errorClasses : validClasses)}
        autoComplete={autoComplete}
        onChange={onChange}
        {...formProps as ComponentProps<"input">}
      />

      <ErrorMessage>
        {errorMessage}
      </ErrorMessage>
    </div>
  );
};
