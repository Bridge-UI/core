// ** Local Imports
import type { FormFieldSize } from "@/Tokens/FormField";
import type { IconSize } from "@/Tokens/Icon";
import type { NumberFieldControlVariant } from "@/Tokens/NumberField";

/**
 * Icons and placement flags for NumberField stepper controls.
 */
export interface NumberFieldStepper {
  /**
   * Semantic icon for the decrement control.
   */
  decrementIcon: "minus" | "chevronDown";

  /**
   * When true, render increment before decrement (stacked column).
   */
  incrementFirst: boolean;

  /**
   * Semantic icon for the increment control.
   */
  incrementIcon: "plus" | "chevronUp";

  /**
   * When true, decrement is in the start slot and increment in the end slot.
   */
  isSplit: boolean;
}

// prettier-ignore
const stackedIconByFieldSize = {
  "lg": "sm",
  "xl": "sm",
  "md": "xs",
  "sm": "xs",
  "xs": "xs",
  "2xl": "md",
  "2xs": "xs",
} as const satisfies Record<keyof FormFieldSize, keyof IconSize>;

// prettier-ignore
const inlineIconByFieldSize = {
  "lg": "md",
  "md": "sm",
  "sm": "sm",
  "xl": "md",
  "xs": "xs",
  "2xl": "lg",
  "2xs": "xs",
} as const satisfies Record<keyof FormFieldSize, keyof IconSize>;

/**
 * Icons and placement flags for a NumberField `controlVariant`.
 */
export function getNumberFieldStepper(
  controlVariant: keyof NumberFieldControlVariant = "stacked",
): NumberFieldStepper {
  if (controlVariant === "split") {
    return {
      isSplit: true,
      incrementFirst: false,
      incrementIcon: "plus",
      decrementIcon: "minus",
    };
  }

  if (controlVariant === "inline") {
    return {
      isSplit: false,
      incrementFirst: false,
      incrementIcon: "chevronUp",
      decrementIcon: "chevronDown",
    };
  }

  return {
    isSplit: false,
    incrementFirst: true,
    incrementIcon: "chevronUp",
    decrementIcon: "chevronDown",
  };
}

/**
 * Icon size for NumberField steppers. Stacked controls use a smaller glyph
 * so chevrons sit away from the field edges.
 */
export function resolveNumberFieldStepperIconSize(
  fieldSize: keyof FormFieldSize = "md",
  controlVariant: keyof NumberFieldControlVariant = "stacked",
): keyof IconSize {
  if (controlVariant === "stacked") {
    return stackedIconByFieldSize[fieldSize];
  }

  return inlineIconByFieldSize[fieldSize];
}
