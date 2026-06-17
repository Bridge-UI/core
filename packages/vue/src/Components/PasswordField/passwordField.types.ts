// ** External Imports
import type { InputHTMLAttributes } from "vue";

// ** Core Imports
import type { MergeHtmlProps } from "@bridge-ui/core";

// ** Local Imports
import type {
  TextFieldClasses,
  TextFieldCustomProps,
  TextFieldOwnProps,
  TextFieldSlots,
} from "@/Components/TextField/textField.types";

export interface PasswordFieldClasses extends TextFieldClasses {
  /**
   * The classes to apply to the visibility toggle button.
   */
  toggle?: string;
}

export interface PasswordFieldCustomProps extends TextFieldCustomProps {}

export interface PasswordFieldEmits {
  /**
   * Emitted when password visibility changes.
   * Listen with `@visibility-change` / `v-on:visibility-change`.
   */
  "visibility-change": [visible: boolean];
}

export interface PasswordFieldOwnProps extends Omit<TextFieldOwnProps, "type"> {
  /**
   * The classes to apply to the password field.
   */
  classes?: PasswordFieldClasses;

  /**
   * Whether the password is visible. Omit for uncontrolled mode.
   */
  visible?: boolean | null;
}

export interface PasswordFieldSlots extends TextFieldSlots {}

export type PasswordFieldProps = MergeHtmlProps<
  PasswordFieldOwnProps,
  InputHTMLAttributes
> & {
  /**
   * Bound with `v-model` on the component (`defineModel` internally).
   */
  modelValue?: string | null;
};
