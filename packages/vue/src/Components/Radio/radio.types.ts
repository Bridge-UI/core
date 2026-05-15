// ** External Imports
import type { Slot } from "vue";

// ** Core Imports
import type { MergeProps, RadioColor, RadioSize } from "@bridge-ui/core";

export interface RadioSizeOverrides {}
export interface RadioColorOverrides {}

export interface RadioClasses {
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

export interface RadioProps {
  /**
   * The classes to apply to the radio.
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
   * The description text below the label.
   *
   * @default undefined
   */
  description?: string;

  /**
   * Whether the radio is disabled.
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
   * The label text for the radio.
   *
   * @default undefined
   */
  label?: string;

  /**
   * The currently selected value in the radio group.
   *
   * @default undefined
   */
  modelValue?: string | number;

  /**
   * Whether the radio is required.
   *
   * @default false
   */
  required?: boolean;

  /**
   * The size of the radio.
   *
   * @default "sm"
   */
  size?: MergeProps<RadioSize, RadioSizeOverrides>;

  /**
   * The value of this radio option.
   *
   * @default undefined
   */
  value?: string | number;
}

export interface RadioSlots {
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
