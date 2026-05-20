// ** External Imports
import type { LucideIcon } from "lucide-vue-next";
import type { Slot } from "vue";

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
   * The value of the text input.
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
   * @default "sm"
   */
  rounded?: MergeProps<TextFieldRounded, TextFieldRoundedOverrides>;

  /**
   * The size of the text input.
   *
   * @default "md"
   */
  size?: MergeProps<TextFieldSize, TextFieldSizeOverrides>;

  /**
   * The HTML input type.
   *
   * @default "text"
   */
  type?: string;

  /**
   * The variant of the text input.
   *
   * @default "outline"
   */
  variant?: MergeProps<TextFieldVariant, TextFieldVariantOverrides>;
}

export interface TextFieldSlots {
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

  /**
   * Custom content for the left section.
   */
  left?: Slot<undefined>;

  /**
   * Custom content for the right section.
   */
  right?: Slot<undefined>;
}
