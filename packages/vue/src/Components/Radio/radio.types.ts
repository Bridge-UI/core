// ** External Imports
import type { InputHTMLAttributes } from "vue";

// ** Core Imports
import type {
  MergeProps,
  RadioColor,
  RadioRounded,
  RadioSize,
} from "@bridge-ui/core";

// ** Local Imports
import type {
  SwitcherClasses,
  SwitcherOwnProps,
  SwitcherPartsProps,
  SwitcherSlots,
} from "@/Components/Switcher/switcher.types";

export interface RadioSizeOverrides {}
export interface RadioColorOverrides {}
export interface RadioRoundedOverrides {}

export interface RadioClasses extends SwitcherClasses {
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

export interface RadioPartsProps extends SwitcherPartsProps {
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

export interface RadioOwnProps extends Omit<
  SwitcherOwnProps,
  "field" | "classes" | "partsProps"
> {
  /**
   * Classes for the switcher chrome and the radio control.
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
   * Size of the control and of switcher labels (`2xs` … `2xl`, same scale as
   * `FormField`).
   *
   * @default "md"
   */
  size?: MergeProps<RadioSize, RadioSizeOverrides>;

  /**
   * Chrome slots (`startLabel`, `mainLabel`, `endLabel`, `description`, `errorMessage`, …).
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

export interface RadioSlots extends SwitcherSlots {}

export type RadioProps = RadioOwnProps;
