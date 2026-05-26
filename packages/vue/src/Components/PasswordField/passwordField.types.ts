// ** Local Imports
import type {
  TextFieldClasses,
  TextFieldOwnProps,
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

export interface PasswordFieldProps extends Omit<TextFieldOwnProps, "type"> {
  /**
   * The classes to apply to the password field.
   *
   * @default undefined
   */
  classes?: PasswordFieldClasses;

  /**
   * Bound with `v-model` on the component.
   *
   * @default undefined
   */
  modelValue?: string | null;

  /**
   * Callback when the visibility changes.
   *
   * @default undefined
   */
  onVisibilityChange?: (visible: boolean) => void;

  /**
   * Whether the password is visible. Use `null` (default) for uncontrolled mode.
   *
   * @default null
   */
  visible?: boolean | null;
}

export interface PasswordFieldSlots extends TextFieldSlots {}
