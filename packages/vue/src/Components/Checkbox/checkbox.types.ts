// ** External Imports
import type { Slot } from "vue";

// ** Core Imports
import type {
  CheckboxColor,
  CheckboxRounded,
  CheckboxSize,
  MergeProps,
} from "@bridge-ui/core";

export interface CheckboxSizeOverrides {}
export interface CheckboxColorOverrides {}
export interface CheckboxRoundedOverrides {}

export interface CheckboxClasses {
  /**
   * The classes to apply to the description.
   */
  description?: string;

  /**
   * The classes to apply to the error message.
   */
  error?: string;

  /**
   * The classes to apply to the input.
   */
  input?: string;

  /**
   * The classes to apply to the label.
   */
  label?: string;

  /**
   * The classes to apply to the root.
   */
  root?: string;
}

export interface CheckboxProps {
  /**
   * The classes to apply to the checkbox.
   *
   * @default undefined
   */
  classes?: CheckboxClasses;

  /**
   * The color to apply to the checkbox.
   *
   * @default "primary"
   */
  color?: MergeProps<CheckboxColor, CheckboxColorOverrides>;

  /**
   * The description text below the label.
   *
   * @default undefined
   */
  description?: string;

  /**
   * Whether the checkbox is disabled.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * The error message to display.
   *
   * @default undefined
   */
  error?: string;

  /**
   * Whether the checkbox is in an indeterminate state.
   *
   * @default false
   */
  indeterminate?: boolean;

  /**
   * The label text for the checkbox.
   *
   * @default undefined
   */
  label?: string;

  /**
   * Whether the checkbox is checked.
   *
   * @default false
   */
  modelValue?: boolean;

  /**
   * Whether the checkbox is required.
   *
   * @default false
   */
  required?: boolean;

  /**
   * The roundedness of the checkbox.
   *
   * @default "sm"
   */
  rounded?: MergeProps<CheckboxRounded, CheckboxRoundedOverrides>;

  /**
   * The size of the checkbox.
   *
   * @default "md"
   */
  size?: MergeProps<CheckboxSize, CheckboxSizeOverrides>;
}

export interface CheckboxSlots {
  /**
   * Custom description content.
   */
  description?: Slot<undefined>;

  /**
   * Custom error message content.
   */
  error?: Slot<undefined>;

  /**
   * Custom label content.
   */
  label?: Slot<undefined>;
}
