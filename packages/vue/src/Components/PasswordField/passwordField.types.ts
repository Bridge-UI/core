// ** Local Imports
import type {
  TextFieldClasses,
  TextFieldProps,
  TextFieldSlots,
} from "@/Components/TextField/textField.types";

export type {
  TextFieldColorOverrides as PasswordFieldColorOverrides,
  TextFieldRoundedOverrides as PasswordFieldRoundedOverrides,
  TextFieldSizeOverrides as PasswordFieldSizeOverrides,
  TextFieldVariantOverrides as PasswordFieldVariantOverrides,
} from "@/Components/TextField/textField.types";

export interface PasswordFieldClasses extends TextFieldClasses {
  /**
   * The classes to apply to the visibility toggle button.
   */
  toggle?: string;
}

export interface PasswordFieldProps extends Omit<
  TextFieldProps,
  "type" | "classes"
> {
  /**
   * The classes to apply to the password field.
   *
   * @default undefined
   */
  classes?: PasswordFieldClasses;

  /**
   * Whether the password is visible.
   *
   * @default false
   */
  visible?: boolean;
}

export interface PasswordFieldSlots extends TextFieldSlots {}
