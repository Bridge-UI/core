// ** External Imports
import type { InputHTMLAttributes } from "react";

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

export interface PasswordFieldOwnProps extends Omit<
  FormFieldOwnProps,
  "type" | "field" | "classes" | "children"
> {
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
  visible?: null | boolean;
}

export interface PasswordFieldSlots extends FormFieldSlots {}

export type PasswordFieldProps = MergeHtmlProps<
  PasswordFieldOwnProps,
  InputHTMLAttributes<HTMLInputElement>
>;
