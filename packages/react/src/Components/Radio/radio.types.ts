// ** External Imports
import type { ReactNode } from "react";

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
   * Whether the radio is checked.
   *
   * @default false
   */
  checked?: boolean;

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
   * Callback when the selection changes.
   *
   * @default undefined
   */
  onChange?: (value: string | number) => void;

  /**
   * Whether the radio is required.
   *
   * @default false
   */
  required?: boolean;

  /**
   * The size of the radio.
   *
   * @default "md"
   */
  size?: MergeProps<RadioSize, RadioSizeOverrides>;

  /**
   * The slots to apply to the radio.
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

export interface RadioSlots {
  /**
   * The slot for the description.
   */
  description?: ReactNode;

  /**
   * The slot for the error message.
   */
  error?: ReactNode;

  /**
   * The slot for the label.
   */
  label?: ReactNode;
}
