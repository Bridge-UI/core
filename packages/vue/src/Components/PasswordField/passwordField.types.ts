// ** Local Imports
import type {
  TextFieldClasses,
  TextFieldOwnProps,
  TextFieldSlots,
} from "@/Components/TextField/textField.types";

export type {
  FormFieldColorOverrides as PasswordFieldColorOverrides,
  FormFieldRoundedOverrides as PasswordFieldRoundedOverrides,
  FormFieldSizeOverrides as PasswordFieldSizeOverrides,
  FormFieldVariantOverrides as PasswordFieldVariantOverrides,
} from "@/Components/FormField/formField.types";

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
