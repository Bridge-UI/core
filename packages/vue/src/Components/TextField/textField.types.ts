// ** External Imports
import type { InputHTMLAttributes } from "vue";

// ** Core Imports
import type { MergeHtmlProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  FormFieldClasses,
  FormFieldCustomProps,
  FormFieldOwnProps,
  FormFieldSlots,
} from "@/Components/FormField/formField.types";

export interface TextFieldClasses extends FormFieldClasses {}

export interface TextFieldCustomProps extends FormFieldCustomProps {}

export interface TextFieldOwnProps extends Omit<FormFieldOwnProps, "field"> {
  /**
   * Initial value for uncontrolled usage (when `v-model` / `modelValue` is
   * not bound).
   *
   * @default undefined
   */
  defaultValue?: string;
}

export interface TextFieldSlots extends FormFieldSlots {}

export type TextFieldProps = MergeHtmlProps<
  TextFieldOwnProps,
  InputHTMLAttributes
> & {
  /**
   * Bound with `v-model` on the component (`defineModel` internally).
   *
   * @default undefined
   */
  modelValue?: null | string;
};
