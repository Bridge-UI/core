// ** External Imports
import type { InputHTMLAttributes } from "vue";

// ** Core Imports
import type { MergeHtmlProps } from "@bridge-ui/core";

// ** Local Imports
import type {
  TextFieldClasses,
  TextFieldOwnProps,
  TextFieldPartsProps,
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

export interface NumberFieldPartsProps extends TextFieldPartsProps {}

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
   * The step increment value.
   *
   * @default 1
   */
  step?: number;
}

export interface NumberFieldSlots extends TextFieldSlots {}

export type NumberFieldProps = MergeHtmlProps<
  NumberFieldOwnProps,
  InputHTMLAttributes
> & {
  /**
   * Bound with `v-model` on the component (`defineModel` internally).
   */
  modelValue?: number | null;
};
