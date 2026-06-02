// ** External Imports
import type { InputHTMLAttributes } from "react";

// ** Core Imports
import type {
  MergeHtmlProps,
  MergeProps,
  ToggleColor,
  ToggleRounded,
  ToggleSize,
} from "@bridge-ui/core";

// ** Local Imports
import type {
  SwitcherClasses,
  SwitcherOwnProps,
  SwitcherPartsProps,
  SwitcherSlots,
} from "@/Components/Switcher/switcher.types";

export interface ToggleSizeOverrides {}
export interface ToggleColorOverrides {}
export interface ToggleRoundedOverrides {}

export interface ToggleClasses extends SwitcherClasses {
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

export interface TogglePartsProps extends SwitcherPartsProps {
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

export interface ToggleOwnProps extends Omit<
  SwitcherOwnProps,
  "field" | "slots" | "classes" | "children" | "partsProps"
> {
  /**
   * Whether the toggle is on.
   *
   * @default undefined
   */
  checked?: boolean;

  /**
   * Classes for the switcher chrome and the toggle control.
   *
   * @default undefined
   */
  classes?: ToggleClasses;

  /**
   * The color to apply to the toggle.
   *
   * @default "primary"
   */
  color?: MergeProps<ToggleColor, ToggleColorOverrides>;

  /**
   * Extra props for internal parts.
   *
   * @default undefined
   */
  partsProps?: TogglePartsProps;

  /**
   * The roundedness of the toggle track.
   *
   * @default "full"
   */
  rounded?: MergeProps<ToggleRounded, ToggleRoundedOverrides>;

  /**
   * Size of the control and of switcher labels (`2xs` … `2xl`, same scale as
   * `FormField`).
   *
   * @default "md"
   */
  size?: MergeProps<ToggleSize, ToggleSizeOverrides>;

  /**
   * Chrome slots and the control slot.
   *
   * @default undefined
   */
  slots?: ToggleSlots;
}

export interface ToggleSlots extends SwitcherSlots {}

export type ToggleProps = MergeHtmlProps<
  ToggleOwnProps,
  Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "color" | "rounded">
>;
