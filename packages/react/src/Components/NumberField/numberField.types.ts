// ** External Imports
import type { InputHTMLAttributes } from "react";

// ** Core Imports
import type { MergeHtmlProps } from "@bridge-ui/core";

// ** Local Imports
import type {
  TextFieldClasses,
  TextFieldCustomProps,
  TextFieldOwnProps,
  TextFieldSlots,
} from "@/Components/TextField/textField.types";

export interface NumberFieldClasses extends TextFieldClasses {
  /**
   * The classes to apply to the decrement button.
   */
  decrement?: string;

  /**
   * The classes to apply to the increment button.
   */
  increment?: string;
}

export interface NumberFieldCustomProps extends TextFieldCustomProps {}

export interface NumberFieldOwnProps extends Omit<
  TextFieldOwnProps,
  "startIcon" | "endIcon"
> {
  /**
   * The classes to apply to the number field.
   */
  classes?: NumberFieldClasses;

  /**
   * The maximum value.
   */
  max?: number;

  /**
   * The minimum value.
   */
  min?: number;

  /**
   * Emits the numeric value when it changes.
   */
  onChange?: (value: number) => void;

  /**
   * The step increment value.
   *
   * @default 1
   */
  step?: number;
}

export interface NumberFieldSlots extends TextFieldSlots {}

export type NumberFieldProps = MergeHtmlProps<
  NumberFieldOwnProps,
  Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">
>;
