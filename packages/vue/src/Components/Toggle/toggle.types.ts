// ** External Imports
import type { InputHTMLAttributes } from "vue";

// ** Core Imports
import type { MergeProps, ToggleColor, ToggleSize } from "@bridge-ui/core";

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

export interface ToggleOwnProps extends Omit<
  SwitcherOwnProps,
  "field" | "classes" | "partsProps"
> {
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
   * Chrome slots (`label`, `description`, `errorMessage`, …).
   *
   * @default undefined
   */
  slots?: ToggleSlots;
}

export interface ToggleSlots extends SwitcherSlots {}

export type ToggleProps = ToggleOwnProps;
