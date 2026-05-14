// ** External Imports
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

// ** Core Imports
import type {
  MergeProps,
  TextInputColor,
  TextInputRounded,
  TextInputSize,
  TextInputVariant,
} from "@bridge-ui/core";

export interface TextInputSizeOverrides {}
export interface TextInputColorOverrides {}
export interface TextInputRoundedOverrides {}
export interface TextInputVariantOverrides {}

export interface TextInputClasses {
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
   * The classes to apply to the left section.
   */
  leftSection?: string;

  /**
   * The classes to apply to the right section.
   */
  rightSection?: string;

  /**
   * The classes to apply to the root.
   */
  root?: string;
}

export interface TextInputProps {
  /**
   * The classes to apply to the text input.
   *
   * @default undefined
   */
  classes?: TextInputClasses;

  /**
   * The color to apply to the text input.
   *
   * @default "primary"
   */
  color?: MergeProps<TextInputColor, TextInputColorOverrides>;

  /**
   * The description text below the label.
   *
   * @default undefined
   */
  description?: string;

  /**
   * Whether the text input is disabled.
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
   * The label text for the text input.
   *
   * @default undefined
   */
  label?: string;

  /**
   * The icon to display on the left side.
   *
   * @default undefined
   */
  leftIcon?: LucideIcon;

  /**
   * Callback when the value changes.
   *
   * @default undefined
   */
  onChange?: (value: string) => void;

  /**
   * The placeholder text.
   *
   * @default undefined
   */
  placeholder?: string;

  /**
   * Whether the text input is required.
   *
   * @default false
   */
  required?: boolean;

  /**
   * The icon to display on the right side.
   *
   * @default undefined
   */
  rightIcon?: LucideIcon;

  /**
   * The roundedness of the text input.
   *
   * @default "md"
   */
  rounded?: MergeProps<TextInputRounded, TextInputRoundedOverrides>;

  /**
   * The size of the text input.
   *
   * @default "md"
   */
  size?: MergeProps<TextInputSize, TextInputSizeOverrides>;

  /**
   * The slots to apply to the text input.
   *
   * @default undefined
   */
  slots?: TextInputSlots;

  /**
   * The HTML input type.
   *
   * @default "text"
   */
  type?: string;

  /**
   * The value of the text input.
   *
   * @default undefined
   */
  value?: string;

  /**
   * The variant of the text input.
   *
   * @default "outline"
   */
  variant?: MergeProps<TextInputVariant, TextInputVariantOverrides>;
}

export interface TextInputSlots {
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

  /**
   * The slot for the left section.
   */
  left?: ReactNode;

  /**
   * The slot for the right section.
   */
  right?: ReactNode;
}
