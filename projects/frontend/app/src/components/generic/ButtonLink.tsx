import { useState, type ComponentProps, type ReactElement } from "react";

type Theme = "none" | "button-deep" | "button-pale" | "linktext";

const getThemeClasses = (theme: Theme): string => {
  switch (theme) {
    case "none":
      return "button-common";
    case "linktext":
    case "button-deep":
    case "button-pale":
      return theme;
    default:
      return "button-pale";
  }
};

type LinkProps = ComponentProps<"a"> & {
  theme?: Theme;
};

export const Link = ({
  theme = "linktext",
  className,
  children,
  ...props
}: LinkProps): ReactElement => (
  <a
    className={`${ getThemeClasses(theme) } ${ className ?? "" }`}
    rel="noopener"
    {...props}
  >
    {children}
  </a>
);

type ButtonProps = Omit<ComponentProps<"button">, "type" | "onClick"> & {
  theme: Theme;
} & (
  {
    // disallow onClick if type === "submit" | "reset"
    type: "submit" | "reset";
    onClick?: undefined;
  } | {
    type?: Exclude<ComponentProps<"button">["type"], "submit" | "reset">;
    onClick?: ComponentProps<"button">["onClick"];
  }
);

export const Button = ({
  type = "button",
  theme,
  className,
  onClick: onClickMain,
  children,
  ...props
}: ButtonProps): ReactElement => {
  const [ isProcessing, setProcessingStatus ] = useState(false);
  const onClick: ComponentProps<"button">["onClick"] | undefined = onClickMain
    ? (...args) => {
      setProcessingStatus(true);

      try {
        onClickMain(...args);
      } finally {
        setProcessingStatus(false);
      }
    }
    : undefined;

  return (
    <button
      type={type}
      className={`${ getThemeClasses(theme) } ${ className ?? "" }`}
      onClick={onClick}
      disabled={isProcessing}
      {...props}
    >
      {children}
    </button>
  );
};
