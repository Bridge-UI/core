// ** External Imports
import { get } from "es-toolkit/compat";

// ** Core Imports
import { cn, mergeBridgeUILayeredClasses } from "@bridge-ui/core";
import {
  colorProps,
  roundedProps,
  type TextFieldColor,
  type TextFieldRounded,
  type TextFieldVariant,
} from "@bridge-ui/core/Components/TextField";

export type ResolveEndAdornmentClassesOptions = {
  color: keyof TextFieldColor;
  rounded: keyof TextFieldRounded;
  variant: keyof TextFieldVariant;
  invalidated: boolean;
  bridgeColor?: Partial<TextFieldColor>;
  bridgeRounded?: Partial<TextFieldRounded>;
};

/**
 * Resolve the color and rounded classes for the end adornment shell.
 */
function resolveColorAndRounded(options: ResolveEndAdornmentClassesOptions) {
  const isUnderlined = options.variant === "underlined";

  const colorClasses = get(
    mergeBridgeUILayeredClasses(colorProps, options.bridgeColor),
    options.invalidated ? "error" : options.color,
  );

  const roundedClasses = get(
    mergeBridgeUILayeredClasses(roundedProps, options.bridgeRounded),
    options.rounded,
  );

  return { colorClasses, isUnderlined, roundedClasses };
}

/**
 * Rounded and color on the adornment shell (stepper column or single control).
 */
export function resolveEndAdornmentShellClasses(
  options: ResolveEndAdornmentClassesOptions,
) {
  const { colorClasses, isUnderlined, roundedClasses } =
    resolveColorAndRounded(options);

  return cn({
    "shrink-0 flex h-full min-h-0 self-stretch text-gray-500": true,
    [roundedClasses?.end ?? ""]: !isUnderlined,
    [colorClasses?.end ?? ""]: !options.invalidated,
    "group-data-[invalid]:text-error-500": !options.invalidated,
    "text-error-500": options.invalidated,
  });
}

/**
 * Per-button hover/focus; use inside a shell that owns rounded and color.
 */
export function resolveEndAdornmentButtonClasses() {
  return cn({
    "cursor-pointer transition-colors": true,
    "dark:hover:bg-gray-700/50 dark:active:bg-gray-600": true,
    "inline-flex items-center justify-center text-inherit": true,
    "hover:bg-gray-100 hover:text-gray-700 active:bg-gray-200": true,
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50": true,
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary-500/40": true,
  });
}

/**
 * Single interactive control (e.g. password toggle).
 */
export function resolveEndAdornmentClasses(
  options: ResolveEndAdornmentClassesOptions,
) {
  return cn(
    resolveEndAdornmentShellClasses(options),
    resolveEndAdornmentButtonClasses(),
  );
}
