"use client";

import {
  useEffect,
  useState,
  type ChangeEventHandler,
  type ComponentProps,
  type ReactElement,
} from "react";
import { errorClasses, ErrorMessage, FieldHeadings, validClasses, type CommonFieldProps } from "./FieldCommons.tsx";
import type { ZodType } from "zod";

type Props = CommonFieldProps & Omit<ComponentProps<"input">, "type"> & {
  validator?: ZodType;
  currencyName?: string;
  salaryPerName?: string;
  currencies?: readonly string[];
  defaultCurrency?: string;
  defaultSalaryPer?: "HOUR" | "DAY" | "MONTH" | "YEAR";
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
  currencyName = "currency",
  salaryPerName = "salaryPer",
  currencies = [ "JPY", "USD" ],
  defaultCurrency,
  defaultSalaryPer = "YEAR",
  ...formProps
}: Props): ReactElement => {
  const [ errorMessage, setErrorMessage ] = useState<string>(serverSideErrorMessages?.[0] ?? "");
  const [ currency, setCurrency ] = useState<string>(defaultCurrency ?? currencies[0] ?? "JPY");
  const [ salaryPer, setSalaryPer ] = useState<string>(defaultSalaryPer);

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

  const borderClasses = errorMessage ? errorClasses : validClasses;

  return (
    <div className={className}>
      <FieldHeadings
        label={label}
        description={description}
        required={required}
        name={name}
      />

      <div
        className={`
          flex items-stretch w-full border rounded-md
          transition-colors duration-150 ease-in-out
          focus-within:outline-none focus-within:ring focus-within:ring-blue-100
          ${ borderClasses }
        `.trim()}
      >
        {/* Currency select (left) */}
        <select
          name={currencyName}
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="
            px-2 py-3 border-r border-gray-300 bg-gray-50 text-base
            focus:outline-none focus:bg-gray-100
            rounded-l-md
          "
        >
          {currencies.map((curr) => (
            <option key={curr} value={curr}>
              {curr}
            </option>
          ))}
        </select>

        {/* Number input (center) */}
        <input
          type="number"
          id={name}
          name={name}
          className="
            flex-1 px-3 py-3 text-base
            border-0 focus:outline-none
            [appearance:textfield]
            [&::-webkit-outer-spin-button]:appearance-none
            [&::-webkit-inner-spin-button]:appearance-none
          "
          autoComplete={autoComplete}
          onChange={onChange}
          {...formProps as ComponentProps<"input">}
        />

        {/* Salary period select (right) */}
        <select
          name={salaryPerName}
          value={salaryPer}
          onChange={(e) => setSalaryPer(e.target.value)}
          className="
            px-2 py-3 border-l border-gray-300 bg-gray-50 text-base
            focus:outline-none focus:bg-gray-100
            rounded-r-md
          "
        >
          <option value="HOUR">/hour</option>
          <option value="DAY">/day</option>
          <option value="MONTH">/month</option>
          <option value="YEAR">/year</option>
        </select>
      </div>

      <ErrorMessage>
        {errorMessage}
      </ErrorMessage>
    </div>
  );
};
