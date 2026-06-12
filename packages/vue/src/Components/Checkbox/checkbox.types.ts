// ** External Imports
import type { InputHTMLAttributes } from "vue";

// ** Core Imports
import type {
  CheckboxColor,
  CheckboxRounded,
  CheckboxSize,
  MergeHtmlProps,
  MergeProps,
} from "@bridge-ui/core";

// ** Local Imports
import type {
  FormControlClasses,
  FormControlCustomProps,
  FormControlOwnProps,
  FormControlSlots,
} from "@/Components/FormControl/formControl.types";

export interface CheckboxSizeOverrides {}
export interface CheckboxColorOverrides {}
export interface CheckboxRoundedOverrides {}

export interface CheckboxClasses extends FormControlClasses {
  /**
   * The classes to apply to the custom control box.
   */
  control?: string;

  /**
   * The classes to apply to the check icon.
   */
  icon?: string;

  /**
   * The classes to apply to the native input (visually hidden).
   */
  input?: string;
}

export interface CheckboxCustomProps extends FormControlCustomProps {
  /**
   * Props forwarded to the custom control box.
   */
  control?: InputHTMLAttributes;

  /**
   * Props forwarded to the check icon wrapper.
   */
  icon?: InputHTMLAttributes;

  /**
   * Props forwarded to the native input.
   */
  input?: Partial<InputHTMLAttributes>;
}

export interface CheckboxEmits {
  /**
   * Emitted when `v-model` should update.
   */
  "update:modelValue": [value: boolean];
}

export interface CheckboxOwnProps extends Omit<
  FormControlOwnProps,
  "field" | "slots" | "classes" | "customProps"
> {
  /**
   * Whether the checkbox is checked.
   *
   * @default undefined
   */
  checked?: boolean;

  /**
   * Classes for the form control chrome and the checkbox control.
   *
   * @default undefined
   */
  classes?: CheckboxClasses;

  /**
   * The color to apply to the checkbox.
   *
   * @default "primary"
   */
  color?: MergeProps<CheckboxColor, CheckboxColorOverrides>;

  /**
   * Extra props for internal parts.
   *
   * @default undefined
   */
  customProps?: CheckboxCustomProps;

  /**
   * Whether the checkbox is in an indeterminate state.
   *
   * @default false
   */
  indeterminate?: boolean;

  /**
   * The roundedness of the checkbox control.
   *
   * @default "sm"
   */
  rounded?: MergeProps<CheckboxRounded, CheckboxRoundedOverrides>;

  /**
   * Size of the control and of form control labels (`2xs` … `2xl`, same scale as
   * `FormField`).
   *
   * @default "md"
   */
  size?: MergeProps<CheckboxSize, CheckboxSizeOverrides>;

  /**
   * Chrome slots and the control slot.
   *
   * @default undefined
   */
  slots?: CheckboxSlots;
}

export interface CheckboxSlots extends FormControlSlots {}

export type CheckboxProps = MergeHtmlProps<
  CheckboxOwnProps,
  Omit<InputHTMLAttributes, "size" | "color" | "rounded">
> & {
  /**
   * Bound with `v-model` on the component (`defineModel` internally).
   */
  modelValue?: boolean;
};
