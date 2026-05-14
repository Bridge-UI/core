// ** External Imports
import type { ReactNode } from "react";

// ** Core Imports
import type {
  MergeProps,
  TextareaColor,
  TextareaRounded,
  TextareaSize,
  TextareaVariant,
} from "@bridge-ui/core";

export interface TextareaSizeOverrides {}
export interface TextareaColorOverrides {}
export interface TextareaRoundedOverrides {}
export interface TextareaVariantOverrides {}

export interface TextareaClasses {
  /**
   * The classes to apply to the description.
   */
  description?: string;

  /**
   * The classes to apply to the error message.
   */
  error?: string;

  /**
   * The classes to apply to the textarea.
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

export interface TextareaProps {
  /**
   * Whether the textarea automatically resizes.
   *
   * @default false
   */
  autosize?: boolean;

  /**
   * The classes to apply to the textarea.
   *
   * @default undefined
   */
  classes?: TextareaClasses;

  /**
   * The color to apply to the textarea.
   *
   * @default "primary"
   */
  color?: MergeProps<TextareaColor, TextareaColorOverrides>;

  /**
   * The description text below the label.
   *
   * @default undefined
   */
  description?: string;

  /**
   * Whether the textarea is disabled.
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
   * The label text for the textarea.
   *
   * @default undefined
   */
  label?: string;

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
   * Whether the textarea is required.
   *
   * @default false
   */
  required?: boolean;

  /**
   * The roundedness of the textarea.
   *
   * @default "md"
   */
  rounded?: MergeProps<TextareaRounded, TextareaRoundedOverrides>;

  /**
   * The number of visible text rows.
   *
   * @default undefined
   */
  rows?: number;

  /**
   * The size of the textarea.
   *
   * @default "md"
   */
  size?: MergeProps<TextareaSize, TextareaSizeOverrides>;

  /**
   * The slots to apply to the textarea.
   *
   * @default undefined
   */
  slots?: TextareaSlots;

  /**
   * The value of the textarea.
   *
   * @default undefined
   */
  value?: string;

  /**
   * The variant of the textarea.
   *
   * @default "outline"
   */
  variant?: MergeProps<TextareaVariant, TextareaVariantOverrides>;
}

export interface TextareaSlots {
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
