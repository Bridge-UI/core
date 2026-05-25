import type { IconSize } from "@bridge-ui/core/Components/Icon";
import type { TextFieldSize } from "@bridge-ui/core/Components/TextField";

export type FieldSize = keyof TextFieldSize;

export type AdornmentIconSize = keyof IconSize;

/** Single end adornment (e.g. password toggle). */
export const adornmentIconSizeByFieldSize: Record<
  FieldSize,
  AdornmentIconSize
> = {
  "2xs": "xs",
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "md",
  xl: "lg",
  "2xl": "lg",
};

/** Stacked stepper buttons — slightly smaller than toggle at the largest sizes. */
export const stepperIconSizeByFieldSize: Record<FieldSize, AdornmentIconSize> =
  {
    "2xs": "xs",
    xs: "xs",
    sm: "sm",
    md: "sm",
    lg: "md",
    xl: "md",
    "2xl": "lg",
  };

export function resolveAdornmentIconSize(
  fieldSize?: FieldSize,
): AdornmentIconSize {
  return adornmentIconSizeByFieldSize[fieldSize ?? "md"];
}

export function resolveStepperIconSize(
  fieldSize?: FieldSize,
): AdornmentIconSize {
  return stepperIconSizeByFieldSize[fieldSize ?? "md"];
}

export const fieldAdornmentButtonBase =
  "cursor-pointer rounded-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 active:bg-gray-200 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-700/50 dark:hover:text-gray-300 dark:active:bg-gray-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary-500/40";

export const fieldStepperButtonClasses = `inline-flex min-h-0 min-w-0 flex-1 items-center justify-center ${fieldAdornmentButtonBase}`;

export const fieldToggleButtonClasses = `inline-flex h-full min-h-0 shrink-0 items-center justify-center self-stretch px-2.5 ${fieldAdornmentButtonBase}`;

export const numberFieldStepperWrapperClasses =
  "flex h-full min-h-0 w-full flex-col overflow-hidden gap-px";
