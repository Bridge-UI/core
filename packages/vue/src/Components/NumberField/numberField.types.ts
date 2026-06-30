// ** External Imports
import type { InputHTMLAttributes } from "vue";

// ** Core Imports
import type { MergeHtmlProps } from "@bridge-ui/core";

// ** Local Imports
import type {
  FormFieldClasses,
  FormFieldCustomProps,
  FormFieldOwnProps,
  FormFieldSlots,
} from "@/Components/FormField/formField.types";

export interface NumberFieldClasses extends FormFieldClasses {
  /**
   * The classes to apply to the decrement button.
   */
  decrement?: string;

  /**
   * The classes to apply to the increment button.
   */
  increment?: string;
}

export interface NumberFieldCustomProps extends FormFieldCustomProps {}

export interface NumberFieldEmits {
  /**
   * Emitted with the numeric value when it changes.
   * Listen with `@change` / `v-on:change`.
   */
  change: [value: number];

  /**
   * Emitted when `v-model` should update.
   */
  "update:modelValue": [value: null | number];
}

export interface NumberFieldOwnProps extends Omit<
  FormFieldOwnProps,
  "field" | "classes" | "endIcon" | "startIcon"
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

export interface NumberFieldSlots extends FormFieldSlots {}

export type NumberFieldProps = MergeHtmlProps<
  NumberFieldOwnProps,
  Omit<InputHTMLAttributes, "value" | "onChange" | "defaultValue">
> & {
  /**
   * Bound with `v-model` on the component (`defineModel` internally).
   */
  modelValue?: null | number;
};
