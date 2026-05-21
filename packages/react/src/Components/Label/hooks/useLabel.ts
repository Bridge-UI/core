// ** External Imports
import { get } from "es-toolkit/compat";
import type { LabelHTMLAttributes } from "react";

// ** Core Imports
import { cn } from "@bridge-ui/core";
import { sizeProps, type LabelSize } from "@bridge-ui/core/Components/Label";

// ** Local Imports
import type { LabelProps } from "@/Components/Label/label.types";
import { derived, mergePartBind } from "@/Utils";

export function useLabel(props: LabelProps) {
  const sizeKey = derived(() => {
    return (props.size ?? "md") as keyof LabelSize;
  });

  const rootClass = derived(() => {
    return cn(
      "inline-flex items-center gap-x-0.5 font-medium leading-none",
      { "text-error-600 dark:text-error-400": props.error },
      { "text-gray-700 dark:text-gray-300": !props.error },
      get(sizeProps, sizeKey),
      props.classes?.root,
      props.className,
    );
  });

  const requiredClass = derived(() => {
    return cn(
      "text-error-500 dark:text-error-500 select-none",
      props.classes?.required,
    );
  });

  const rootBind = derived(() => {
    const part: LabelHTMLAttributes<HTMLLabelElement> = {};

    if (props.htmlFor) {
      part.htmlFor = props.htmlFor;
    }

    return mergePartBind(part, rootClass);
  });

  const requiredBind = derived(() => {
    return { className: requiredClass, "aria-hidden": true as const };
  });

  const showRequired = derived(() => Boolean(props.required));

  return {
    rootBind,
    requiredBind,
    showRequired,
  };
}
