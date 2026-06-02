// ** External Imports
import type { InputHTMLAttributes } from "react";

// ** Core Imports
import type {
  MergeHtmlProps,
  MergeProps,
  ToggleColor,
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

export interface ToggleSlots extends SwitcherSlots {}

export interface ToggleOwnProps extends Omit<
  SwitcherOwnProps,
  "field" | "children" | "classes" | "partsProps" | "slots"
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
   * Size of the control and of switcher labels (`2xs` … `2xl`, same scale as
   * `FormField`).
   *
   * @default "sm"
   */
  size?: MergeProps<ToggleSize, ToggleSizeOverrides>;

  /**
   * Chrome slots and the control slot.
   *
   * @default undefined
   */
  slots?: ToggleSlots;
}

export type ToggleProps = MergeHtmlProps<
  ToggleOwnProps,
  Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "color">
>;
