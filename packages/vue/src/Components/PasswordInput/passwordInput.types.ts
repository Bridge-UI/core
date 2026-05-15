// ** External Imports
import type { Slot } from "vue";

// ** Core Imports
import type {
  MergeProps,
  PasswordInputColor,
  PasswordInputRounded,
  PasswordInputSize,
  PasswordInputVariant,
} from "@bridge-ui/core";

export interface PasswordInputSizeOverrides {}
export interface PasswordInputColorOverrides {}
export interface PasswordInputRoundedOverrides {}
export interface PasswordInputVariantOverrides {}

export interface PasswordInputClasses {
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

  /**
   * The classes to apply to the visibility toggle button.
   */
  toggle?: string;
}

export interface PasswordInputProps {
  /**
   * The classes to apply to the password input.
   *
   * @default undefined
   */
  classes?: PasswordInputClasses;

  /**
   * The color to apply to the password input.
   *
   * @default "primary"
   */
  color?: MergeProps<PasswordInputColor, PasswordInputColorOverrides>;

  /**
   * The description text below the label.
   *
   * @default undefined
   */
  description?: string;

  /**
   * Whether the password input is disabled.
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
   * The label text for the password input.
   *
   * @default undefined
   */
  label?: string;

  /**
   * The value of the password input.
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
   * Whether the password input is required.
   *
   * @default false
   */
  required?: boolean;

  /**
   * The roundedness of the password input.
   *
   * @default "sm"
   */
  rounded?: MergeProps<PasswordInputRounded, PasswordInputRoundedOverrides>;

  /**
   * The size of the password input.
   *
   * @default "md"
   */
  size?: MergeProps<PasswordInputSize, PasswordInputSizeOverrides>;

  /**
   * The variant of the password input.
   *
   * @default "outline"
   */
  variant?: MergeProps<PasswordInputVariant, PasswordInputVariantOverrides>;

  /**
   * Whether the password is visible.
   *
   * @default false
   */
  visible?: boolean;
}

export interface PasswordInputSlots {
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
