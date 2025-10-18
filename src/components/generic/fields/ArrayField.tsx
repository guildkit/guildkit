"use client";

import Image from "next/image";
import { useState, type ComponentProps, type ReactElement } from "react";
import { Button } from "../ButtonLink.tsx";
import { ErrorMessage, FieldHeadings, type CommonFieldProps } from "./FieldCommons.tsx";
import type { ZodType } from "zod";

type Props = CommonFieldProps & {
  type?: ComponentProps<"input">["type"];
  itemName: string;
  validator?: ZodType;
} & Pick<ComponentProps<"input">, "placeholder" | "autoComplete">;

export const ArrayField = ({
  type = "text",
  label,
  itemName,
  description,
  placeholder,
  required = false,
  name,
  autoComplete = "on",
  validator,
  errorMessages: serverSideErrorMessages,
  className,
}: Props): ReactElement => {
  const [ fieldContents, setFieldContents ] = useState<string[]>(required ? [ "" ] : []);
  const [ errorMessages, setErrorMessages ] = useState<string[]>([]);

  const isValidContent = (val: unknown, i: number) => {
    if (!validator) {
      return;
    }

    const { success, error } = validator.safeParse(val);
    if (success) {
      if (errorMessages[i]) {
        const newErrorMessages = [ ...errorMessages ]; // clone
        newErrorMessages[i] = "";
        setErrorMessages(newErrorMessages);
      }
    } else {
      const newErrorMessages = [ ...errorMessages ]; // clone
      newErrorMessages[i] = error.issues[0].message;
      setErrorMessages(newErrorMessages);
    }
  };

  const addField = () => setFieldContents([ ...fieldContents, "" ]);
  const removeField = (removingIndex: number) => {
    // Disallow removal when `required` and only one field exists
    if (required && fieldContents.length <= 1) {
      return;
    }

    setFieldContents(fieldContents.filter((_, i) => i !== removingIndex));
  };
  const updateFieldContent = (val: string, i: number) => {
    isValidContent(val, i);

    const newFieldContents = [ ...fieldContents ]; // clone
    newFieldContents[i] = val;
    setFieldContents(newFieldContents);
  };

  return (
    <div className={className}>
      <FieldHeadings
        label={label}
        description={description}
        required={required}
        name={name}
      />

      <div className="space-y-2">
        {fieldContents.map((field, i) => (
          <div key={i}>
            <div className="flex items-center gap-2">
              <input
                type={type}
                id={`${ name }_${ i }`}
                name={name}
                placeholder={placeholder}
                className={`flex-1 px-3 py-3 border rounded-md text-base transition-colors duration-150 ease-in-out focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-100 ${
                  errorMessages[i]
                    ? "border-red-600 focus:border-red-600 focus:ring-red-100"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                value={field}
                autoComplete={autoComplete}
                onChange={(e) => updateFieldContent(e.target.value, i)}
              />
              {(fieldContents.length > 1 || !required) && (
                <Button
                  theme="none"
                  className="flex items-center justify-center w-8 h-8 border border-gray-300 rounded-md bg-gray-50 hover:bg-red-50 hover:border-red-400 transition-colors"
                  onClick={() => removeField(i)}
                  title={`Remove this ${ itemName }`}
                >
                  <Image
                    src="/vendor/octicons/x.svg"
                    alt={`Remove this ${ itemName }`}
                    width={24}
                    height={24}
                    decoding="async"
                  />
                </Button>
              )}
            </div>
            {errorMessages[i] && (
              <ErrorMessage key={i}>
                {errorMessages[i]}
              </ErrorMessage>
            )}
          </div>
        ))}

        {serverSideErrorMessages && 0 < serverSideErrorMessages.length && serverSideErrorMessages.map((msg, i) => (
          <ErrorMessage key={i}>
            {msg}
          </ErrorMessage>
        ))}

        <Button
          theme="none"
          className="flex items-center justify-center gap-1.5 mt-4 pl-1.5 pr-2 pt-2 pb-2 font-semibold hover:bg-gray-300 hover:rounded-md transition-colors"
          onClick={addField}
          title={`Add ${ itemName }`}
        >
          <Image
            src="/vendor/octicons/plus.svg"
            alt=""
            width={22}
            height={22}
            decoding="async"
          /> Add {itemName}
        </Button>
      </div>
    </div>
  );
};
