// ** External Imports
import type { Slot } from "vue";

// ** Core Imports
import type { MergeProps, ToggleColor, ToggleSize } from "@bridge-ui/core";

export interface ToggleSizeOverrides {}
export interface ToggleColorOverrides {}

export interface ToggleClasses {
  /**
   * The classes to apply to the description.
   */
  description?: string;

  /**
   * The classes to apply to the label.
   */
  label?: string;

  /**
   * The classes to apply to the root.
   */
  root?: string;

  /**
   * The classes to apply to the thumb.
   */
  thumb?: string;

  /**
   * The classes to apply to the track.
   */
  track?: string;
}

export interface ToggleProps {
  /**
   * The classes to apply to the toggle.
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
   * The description text below the label.
   *
   * @default undefined
   */
  description?: string;

  /**
   * Whether the toggle is disabled.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * The label text for the toggle.
   *
   * @default undefined
   */
  label?: string;

  /**
   * Whether the toggle is on.
   *
   * @default false
   */
  modelValue?: boolean;

  /**
   * Whether the toggle is required.
   *
   * @default false
   */
  required?: boolean;

  /**
   * The size of the toggle.
   *
   * @default "md"
   */
  size?: MergeProps<ToggleSize, ToggleSizeOverrides>;
}

export interface ToggleSlots {
  /**
   * Custom description content.
   */
  description?: Slot<undefined>;

  /**
   * Custom label content.
   */
  label?: Slot<undefined>;
}
