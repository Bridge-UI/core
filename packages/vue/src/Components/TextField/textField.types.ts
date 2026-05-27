// ** External Imports
import type { InputHTMLAttributes } from "vue";

// ** Core Imports
import type { MergeHtmlProps } from "@bridge-ui/core";

// ** Local Imports
import type {
  FormFieldClasses,
  FormFieldOwnProps,
  FormFieldPartsProps,
  FormFieldSlots,
} from "@/Components/FormField/formField.types";

export type TextFieldClasses = FormFieldClasses;
export type TextFieldPartsProps = FormFieldPartsProps;
export type TextFieldOwnProps = FormFieldOwnProps;
export type TextFieldSlots = FormFieldSlots;

export type TextFieldProps = MergeHtmlProps<
  TextFieldOwnProps,
  InputHTMLAttributes
> & {
  /**
   * Bound with `v-model` on the component (`defineModel` internally).
   *
   * @default undefined
   */
  modelValue?: string | null;
};
