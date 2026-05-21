// ** Core Imports
import { cn } from "@bridge-ui/core";
import type { HTMLAttributes, ReactNode } from "react";

// prettier-ignore
const buttonChildClass = "[&_button]:h-full [&_button]:min-h-0 [&_button]:rounded-s-none [&_button]:rounded-e-none";

export type StartAdornmentProps = HTMLAttributes<HTMLDivElement>;

function StartAdornment({
  className,
  children,
  ...props
}: StartAdornmentProps) {
  return (
    <div
      {...props}
      className={cn(
        "flex h-full min-h-0 items-stretch",
        buttonChildClass,
        className,
      )}
    >
      {children as ReactNode}
    </div>
  );
}

export default StartAdornment;
