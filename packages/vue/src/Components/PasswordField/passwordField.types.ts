// ** External Imports
import type { ButtonHTMLAttributes, InputHTMLAttributes } from "vue";

// ** Core Imports
import type { MergeHtmlProps } from "@bridge-ui/core/Utils";

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
  toggle?: ButtonHTMLAttributes;

  /**
   * Props forwarded to the visibility toggle `Icon` (`icon` is set by the field).
   *
   * @default undefined
   */
  toggleIcon?: Partial<Omit<IconProps, "icon">>;
}

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
   * Extra props for FormField parts and the visibility toggle.
   *
   * @default undefined
   */
  customProps?: PasswordFieldCustomProps;

  /**
   * Initial value for uncontrolled usage (when `v-model` / `modelValue` is
   * not bound).
   *
   * @default undefined
   */
  defaultValue?: string;

  /**
   * Whether the password is visible. Omit for uncontrolled mode.
   */
  visible?: null | boolean;
}

export interface PasswordFieldSlots extends FormFieldSlots {}

export type PasswordFieldProps = MergeHtmlProps<
  PasswordFieldOwnProps,
  InputHTMLAttributes
> & {
  /**
   * Bound with `v-model` on the component (`defineModel` internally).
   */
  modelValue?: null | string;
};
