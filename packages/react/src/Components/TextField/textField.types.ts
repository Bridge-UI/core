// ** External Imports
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

// ** Core Imports
import type {
  MergeProps,
  TextFieldColor,
  TextFieldRounded,
  TextFieldSize,
  TextFieldVariant,
} from "@bridge-ui/core";

export interface TextFieldSizeOverrides {}
export interface TextFieldColorOverrides {}
export interface TextFieldRoundedOverrides {}
export interface TextFieldVariantOverrides {}

export interface TextFieldClasses {
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

export interface TextFieldProps {
  /**
   * The classes to apply to the text input.
   *
   * @default undefined
   */
  classes?: TextFieldClasses;

  /**
   * The color to apply to the text input.
   *
   * @default "primary"
   */
  color?: MergeProps<TextFieldColor, TextFieldColorOverrides>;

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
  rounded?: MergeProps<TextFieldRounded, TextFieldRoundedOverrides>;

  /**
   * The size of the text input.
   *
   * @default "md"
   */
  size?: MergeProps<TextFieldSize, TextFieldSizeOverrides>;

  /**
   * The slots to apply to the text input.
   *
   * @default undefined
   */
  slots?: TextFieldSlots;

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
  variant?: MergeProps<TextFieldVariant, TextFieldVariantOverrides>;
}

export interface TextFieldSlots {
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
