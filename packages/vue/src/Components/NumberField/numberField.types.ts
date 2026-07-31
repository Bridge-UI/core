// ** External Imports
import type { ButtonHTMLAttributes, InputHTMLAttributes } from "vue";

// ** Core Imports
import type { MergeHtmlProps } from "@bridge-ui/core";

// ** Local Imports
import type {
  FormFieldClasses,
  FormFieldCustomProps,
  FormFieldOwnProps,
  FormFieldSlots,
} from "@/Components/FormField/formField.types";
import type { IconProps } from "@/Components/Icon";

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

export interface NumberFieldCustomProps extends FormFieldCustomProps {
  /**
   * Props forwarded to the decrement button.
   *
   * @default undefined
   */
  decrement?: ButtonHTMLAttributes;

  /**
   * Props forwarded to the decrement `Icon` (`icon` is set by the field).
   *
   * @default undefined
   */
  decrementIcon?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the increment button.
   *
   * @default undefined
   */
  increment?: ButtonHTMLAttributes;

  /**
   * Props forwarded to the increment `Icon` (`icon` is set by the field).
   *
   * @default undefined
   */
  incrementIcon?: Partial<Omit<IconProps, "icon">>;
}

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
   * Extra props for FormField parts and the stepper buttons.
   *
   * @default undefined
   */
  customProps?: NumberFieldCustomProps;

  /**
   * Initial value for uncontrolled usage (when `v-model` / `modelValue` is
   * not bound).
   *
   * @default undefined
   */
  defaultValue?: number;

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
