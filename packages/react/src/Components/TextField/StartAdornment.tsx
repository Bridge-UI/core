// ** Core Imports
import { cn } from "@bridge-ui/core";
import type { HTMLAttributes, ReactNode } from "react";

export type StartAdornmentProps = HTMLAttributes<HTMLDivElement>;

function StartAdornment({
  className,
  children,
  ...props
}: StartAdornmentProps) {
  return (
    <div
      {...props}
      className={cn("flex h-full min-h-0 w-full items-stretch", className)}
    >
      {children as ReactNode}
    </div>
  );
}

export default StartAdornment;
