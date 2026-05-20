// ** Local Imports
import type {
  TextFieldClasses,
  TextFieldProps,
  TextFieldSlots,
} from "@/Components/TextField/textField.types";

export type {
  TextFieldColorOverrides as NumberFieldColorOverrides,
  TextFieldRoundedOverrides as NumberFieldRoundedOverrides,
  TextFieldSizeOverrides as NumberFieldSizeOverrides,
  TextFieldVariantOverrides as NumberFieldVariantOverrides,
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

export interface NumberFieldProps extends Omit<
  TextFieldProps,
  "type" | "modelValue" | "classes"
> {
  /**
   * The classes to apply to the number field.
   *
   * @default undefined
   */
  classes?: NumberFieldClasses;

  /**
   * The maximum value.
   *
   * @default undefined
   */
  max?: number;

  /**
   * The minimum value.
   *
   * @default undefined
   */
  min?: number;

  /**
   * The value of the number field.
   *
   * @default undefined
   */
  modelValue?: number;

  /**
   * The step increment value.
   *
   * @default 1
   */
  step?: number;
}

export interface NumberFieldSlots extends TextFieldSlots {}
