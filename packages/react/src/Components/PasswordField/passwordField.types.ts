// ** External Imports
import type { InputHTMLAttributes } from "react";

// ** Core Imports
import type { MergeHtmlProps } from "@bridge-ui/core";

// ** Local Imports
import type {
  TextFieldClasses,
  TextFieldOwnProps,
  TextFieldPartsProps,
  TextFieldSlots,
} from "@/Components/TextField/textField.types";

export interface PasswordFieldClasses extends TextFieldClasses {
  /**
   * The classes to apply to the visibility toggle button.
   */
  toggle?: string;
}

export interface PasswordFieldPartsProps extends TextFieldPartsProps {}

export interface PasswordFieldOwnProps extends Omit<TextFieldOwnProps, "type"> {
  /**
   * The classes to apply to the password field.
   */
  classes?: PasswordFieldClasses;

  /**
   * Callback when the visibility changes.
   */
  onVisibilityChange?: (visible: boolean) => void;

  /**
   * Whether the password is visible. Omit for uncontrolled mode.
   */
  visible?: boolean | null;
}

export interface PasswordFieldSlots extends TextFieldSlots {}

export type PasswordFieldProps = MergeHtmlProps<
  PasswordFieldOwnProps,
  InputHTMLAttributes<HTMLInputElement>
> & {
  /**
   * Bound value (Bridge naming; use with controlled updates via native `onChange`
   * or your form library).
   */
  modelValue?: string | null;
};
