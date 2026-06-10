// ** External Imports
import type { InputHTMLAttributes } from "vue";

// ** Core Imports
import type {
  MergeHtmlProps,
  MergeProps,
  RadioColor,
  RadioRounded,
  RadioSize,
} from "@bridge-ui/core";

// ** Local Imports
import type {
  FormControlClasses,
  FormControlOwnProps,
  FormControlPartsProps,
  FormControlSlots,
} from "@/Components/FormControl/formControl.types";

export interface RadioSizeOverrides {}
export interface RadioColorOverrides {}
export interface RadioRoundedOverrides {}

export interface RadioClasses extends FormControlClasses {
  /**
   * The classes to apply to the custom control circle.
   */
  control?: string;

  /**
   * The classes to apply to the inner dot when checked.
   */
  dot?: string;

  /**
   * The classes to apply to the native input (visually hidden).
   */
  input?: string;
}

export interface RadioPartsProps extends FormControlPartsProps {
  /**
   * Props forwarded to the custom control circle.
   */
  control?: InputHTMLAttributes;

  /**
   * Props forwarded to the inner dot.
   */
  dot?: InputHTMLAttributes;

  /**
   * Props forwarded to the native input.
   */
  input?: Partial<InputHTMLAttributes>;
}

export interface RadioEmits {
  /**
   * Emitted when `v-model` should update.
   */
  "update:modelValue": [value: string | number];
}

export interface RadioOwnProps extends Omit<
  FormControlOwnProps,
  "field" | "slots" | "classes" | "partsProps"
> {
  /**
   * Whether the radio is checked.
   *
   * @default undefined
   */
  checked?: boolean;

  /**
   * Classes for the form control chrome and the radio control.
   *
   * @default undefined
   */
  classes?: RadioClasses;

  /**
   * The color to apply to the radio.
   *
   * @default "primary"
   */
  color?: MergeProps<RadioColor, RadioColorOverrides>;

  /**
   * The `name` attribute shared by radios in the same group.
   *
   * @default undefined
   */
  name?: string;

  /**
   * Extra props for internal parts.
   *
   * @default undefined
   */
  partsProps?: RadioPartsProps;

  /**
   * The roundedness of the radio control.
   *
   * @default "full"
   */
  rounded?: MergeProps<RadioRounded, RadioRoundedOverrides>;

  /**
   * Size of the control and of form control labels (`2xs` … `2xl`, same scale as
   * `FormField`).
   *
   * @default "md"
   */
  size?: MergeProps<RadioSize, RadioSizeOverrides>;

  /**
   * Chrome slots and the control slot.
   *
   * @default undefined
   */
  slots?: RadioSlots;

  /**
   * The value of this radio option.
   *
   * @default undefined
   */
  value?: string | number;
}

export interface RadioSlots extends FormControlSlots {}

export type RadioProps = MergeHtmlProps<
  RadioOwnProps,
  Omit<InputHTMLAttributes, "size" | "color" | "rounded">
> & {
  /**
   * Bound with `v-model` on the component (`defineModel` internally).
   */
  modelValue?: string | number;
};
