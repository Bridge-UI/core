// ** External Imports
import type { ButtonHTMLAttributes, InputHTMLAttributes } from "react";

// ** Core Imports
import type { MergeHtmlProps } from "@bridge-ui/core";

// ** Local Imports
import type {
  FormFieldClasses,
  FormFieldCustomProps,
  FormFieldOwnProps,
  FormFieldSlots,
} from "@/Components/FormField/formField.types";
import type { IconProps } from "@/Components/Icon";

export interface PasswordFieldClasses extends FormFieldClasses {
  /**
   * The classes to apply to the visibility toggle button.
   */
  toggle?: string;
}

export interface PasswordFieldCustomProps extends FormFieldCustomProps {
  /**
   * Props forwarded to the visibility toggle button.
   *
   * @default undefined
   */
  toggle?: ButtonHTMLAttributes<HTMLButtonElement>;

  /**
   * Props forwarded to the visibility toggle `Icon` (`icon` is set by the field).
   *
   * @default undefined
   */
  toggleIcon?: Partial<Omit<IconProps, "icon">>;
}

export interface PasswordFieldOwnProps extends Omit<
  FormFieldOwnProps,
  "type" | "field" | "classes" | "children"
> {
  /**
   * The classes to apply to the password field.
   */
  classes?: PasswordFieldClasses;

  /**
   * Extra props for FormField parts and the visibility toggle.
   *
   * @default undefined
   */
  customProps?: PasswordFieldCustomProps;

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
