// ** External Imports
import type { InputHTMLAttributes } from "vue";

// ** Core Imports
import type { MergeHtmlProps } from "@bridge-ui/core";

// ** Local Imports
import type {
  FormFieldClasses,
  FormFieldCustomProps,
  FormFieldOwnProps,
  FormFieldSlots,
} from "@/Components/FormField/formField.types";

export interface PasswordFieldClasses extends FormFieldClasses {
  /**
   * The classes to apply to the visibility toggle button.
   */
  toggle?: string;
}

export interface PasswordFieldCustomProps extends FormFieldCustomProps {}

export interface PasswordFieldEmits {
  /**
   * Emitted when password visibility changes.
   * Listen with `@visibility-change` / `v-on:visibility-change`.
   */
  "visibility-change": [visible: boolean];
}

export interface PasswordFieldOwnProps extends Omit<
  FormFieldOwnProps,
  "type" | "field" | "classes"
> {
  /**
   * The classes to apply to the password field.
   */
  classes?: PasswordFieldClasses;

  /**
   * Whether the password is visible. Omit for uncontrolled mode.
   */
  visible?: boolean | null;
}

export interface PasswordFieldSlots extends FormFieldSlots {}

export type PasswordFieldProps = MergeHtmlProps<
  PasswordFieldOwnProps,
  InputHTMLAttributes
> & {
  /**
   * Bound with `v-model` on the component (`defineModel` internally).
   */
  modelValue?: string | null;
};
