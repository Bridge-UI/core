// ** External Imports
import type { Slot } from "vue";

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
   * The value of the textarea.
   *
   * @default undefined
   */
  modelValue?: string;

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
   * The variant of the textarea.
   *
   * @default "outline"
   */
  variant?: MergeProps<TextareaVariant, TextareaVariantOverrides>;
}

export interface TextareaSlots {
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
