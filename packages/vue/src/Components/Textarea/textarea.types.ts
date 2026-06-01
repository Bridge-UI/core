// ** External Imports
import type { TextareaHTMLAttributes } from "vue";

// ** Core Imports
import type { MergeHtmlProps } from "@bridge-ui/core";

// ** Local Imports
import type {
  FormFieldClasses,
  FormFieldOwnProps,
  FormFieldPartsProps,
  FormFieldSlots,
} from "@/Components/FormField/formField.types";

export interface TextareaClasses extends FormFieldClasses {}

export interface TextareaPartsProps extends FormFieldPartsProps {}

export interface TextareaOwnProps extends Omit<FormFieldOwnProps, "field"> {
  /**
   * Whether the textarea automatically resizes with its content.
   *
   * @default false
   */
  autosize?: boolean;

  /**
   * Native resize handle (`resize` CSS). Ignored when `autosize` is `true`.
   *
   * @default "none"
   */
  resize?: "both" | "none" | "vertical" | "horizontal";
}

export interface TextareaSlots extends FormFieldSlots {}

export type TextareaProps = MergeHtmlProps<
  TextareaOwnProps,
  TextareaHTMLAttributes
> & {
  /**
   * Bound with `v-model` on the component.
   */
  modelValue?: string | null;
};
