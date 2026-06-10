// ** External Imports
import type { InputHTMLAttributes } from "vue";

// ** Core Imports
import type {
  MergeHtmlProps,
  MergeProps,
  SwitchColor,
  SwitchRounded,
  SwitchSize,
} from "@bridge-ui/core";

// ** Local Imports
import type {
  FormControlClasses,
  FormControlOwnProps,
  FormControlPartsProps,
  FormControlSlots,
} from "@/Components/FormControl/formControl.types";

export interface SwitchSizeOverrides {}
export interface SwitchColorOverrides {}
export interface SwitchRoundedOverrides {}

export interface SwitchClasses extends FormControlClasses {
  /**
   * The classes to apply to the native input (visually hidden).
   */
  input?: string;

  /**
   * The classes to apply to the sliding thumb.
   */
  thumb?: string;

  /**
   * The classes to apply to the track.
   */
  track?: string;
}

export interface SwitchPartsProps extends FormControlPartsProps {
  /**
   * Props forwarded to the native input.
   */
  input?: Partial<InputHTMLAttributes>;

  /**
   * Props forwarded to the thumb element.
   */
  thumb?: InputHTMLAttributes;

  /**
   * Props forwarded to the track element.
   */
  track?: InputHTMLAttributes;
}

export interface SwitchEmits {
  /**
   * Emitted when `v-model` should update.
   */
  "update:modelValue": [value: boolean];
}

export interface SwitchOwnProps extends Omit<
  FormControlOwnProps,
  "field" | "slots" | "classes" | "partsProps"
> {
  /**
   * Whether the switch is on.
   *
   * @default undefined
   */
  checked?: boolean;

  /**
   * Classes for the form control chrome and the switch control.
   *
   * @default undefined
   */
  classes?: SwitchClasses;

  /**
   * The color to apply to the switch.
   *
   * @default "primary"
   */
  color?: MergeProps<SwitchColor, SwitchColorOverrides>;

  /**
   * Extra props for internal parts.
   *
   * @default undefined
   */
  partsProps?: SwitchPartsProps;

  /**
   * The roundedness of the switch track.
   *
   * @default "full"
   */
  rounded?: MergeProps<SwitchRounded, SwitchRoundedOverrides>;

  /**
   * Size of the control and of form control labels (`2xs` … `2xl`, same scale as
   * `FormField`).
   *
   * @default "md"
   */
  size?: MergeProps<SwitchSize, SwitchSizeOverrides>;

  /**
   * Chrome slots and the control slot.
   *
   * @default undefined
   */
  slots?: SwitchSlots;
}

export interface SwitchSlots extends FormControlSlots {}

export type SwitchProps = MergeHtmlProps<
  SwitchOwnProps,
  Omit<InputHTMLAttributes, "size" | "color" | "rounded">
> & {
  /**
   * Bound with `v-model` on the component (`defineModel` internally).
   */
  modelValue?: boolean;
};
