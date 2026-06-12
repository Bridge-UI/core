// ** External Imports
import type { InputHTMLAttributes } from "react";

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
  FormControlCustomProps,
  FormControlOwnProps,
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

export interface SwitchCustomProps extends FormControlCustomProps {
  /**
   * Props forwarded to the native input.
   */
  input?: Partial<InputHTMLAttributes<HTMLInputElement>>;

  /**
   * Props forwarded to the thumb element.
   */
  thumb?: InputHTMLAttributes<HTMLSpanElement>;

  /**
   * Props forwarded to the track element.
   */
  track?: InputHTMLAttributes<HTMLSpanElement>;
}

export interface SwitchOwnProps extends Omit<
  FormControlOwnProps,
  "field" | "slots" | "classes" | "children" | "customProps"
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
  customProps?: SwitchCustomProps;

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
  Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "color" | "rounded">
>;
