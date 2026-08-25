// ** External Imports
import type { ButtonHTMLAttributes, InputHTMLAttributes } from "react";

// ** Core Imports
import type { NumberFieldControlVariant } from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  FormFieldClasses,
  FormFieldCustomProps,
  FormFieldOwnProps,
  FormFieldSlots,
} from "@/Components/FormField/formField.types";
import type { IconProps } from "@/Components/Icon";

export interface NumberFieldControlVariantOverrides {}

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
  decrement?: ButtonHTMLAttributes<HTMLButtonElement>;

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
  increment?: ButtonHTMLAttributes<HTMLButtonElement>;

  /**
   * Props forwarded to the increment `Icon` (`icon` is set by the field).
   *
   * @default undefined
   */
  incrementIcon?: Partial<Omit<IconProps, "icon">>;
}

export interface NumberFieldOwnProps extends Omit<
  FormFieldOwnProps,
  "field" | "classes" | "endIcon" | "children" | "onChange" | "startIcon"
> {
  /**
   * The classes to apply to the number field.
   */
  classes?: NumberFieldClasses;

  /**
   * Layout of the increment and decrement controls.
   *
   * `stacked` places them in a column at the end. `inline` places them in a
   * row at the end. `split` places decrement at the start and increment at the
   * end, and reserves the start slot (`start` / `startIcon`) for decrement.
   *
   * @default "stacked"
   */
  controlVariant?: MergeProps<
    NumberFieldControlVariant,
    NumberFieldControlVariantOverrides
  >;

  /**
   * Extra props for FormField parts and the stepper buttons.
   *
   * @default undefined
   */
  customProps?: NumberFieldCustomProps;

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

export interface NumberFieldSlots extends FormFieldSlots {}

export type NumberFieldProps = MergeHtmlProps<
  NumberFieldOwnProps,
  Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">
>;
