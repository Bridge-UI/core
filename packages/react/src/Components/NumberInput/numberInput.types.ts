// ** External Imports
import type { ReactNode } from "react";

// ** Core Imports
import type {
  MergeProps,
  NumberInputColor,
  NumberInputRounded,
  NumberInputSize,
  NumberInputVariant,
} from "@bridge-ui/core";

export interface NumberInputSizeOverrides {}
export interface NumberInputColorOverrides {}
export interface NumberInputRoundedOverrides {}
export interface NumberInputVariantOverrides {}

export interface NumberInputClasses {
  /**
   * The classes to apply to the decrement button.
   */
  decrement?: string;

  /**
   * The classes to apply to the description.
   */
  description?: string;

  /**
   * The classes to apply to the error message.
   */
  error?: string;

  /**
   * The classes to apply to the increment button.
   */
  increment?: string;

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

export interface NumberInputProps {
  /**
   * The classes to apply to the number input.
   *
   * @default undefined
   */
  classes?: NumberInputClasses;

  /**
   * The color to apply to the number input.
   *
   * @default "primary"
   */
  color?: MergeProps<NumberInputColor, NumberInputColorOverrides>;

  /**
   * The description text below the label.
   *
   * @default undefined
   */
  description?: string;

  /**
   * Whether the number input is disabled.
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
   * The label text for the number input.
   *
   * @default undefined
   */
  label?: string;

  /**
   * The maximum value.
   *
   * @default undefined
   */
  max?: number;

  /**
   * The minimum value.
   *
   * @default undefined
   */
  min?: number;

  /**
   * Callback when the value changes.
   *
   * @default undefined
   */
  onChange?: (value: number) => void;

  /**
   * The placeholder text.
   *
   * @default undefined
   */
  placeholder?: string;

  /**
   * Whether the number input is required.
   *
   * @default false
   */
  required?: boolean;

  /**
   * The roundedness of the number input.
   *
   * @default "md"
   */
  rounded?: MergeProps<NumberInputRounded, NumberInputRoundedOverrides>;

  /**
   * The size of the number input.
   *
   * @default "md"
   */
  size?: MergeProps<NumberInputSize, NumberInputSizeOverrides>;

  /**
   * The slots to apply to the number input.
   *
   * @default undefined
   */
  slots?: NumberInputSlots;

  /**
   * The step increment value.
   *
   * @default 1
   */
  step?: number;

  /**
   * The value of the number input.
   *
   * @default undefined
   */
  value?: number;

  /**
   * The variant of the number input.
   *
   * @default "outline"
   */
  variant?: MergeProps<NumberInputVariant, NumberInputVariantOverrides>;
}

export interface NumberInputSlots {
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
