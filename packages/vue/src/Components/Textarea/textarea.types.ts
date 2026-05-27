// ** External Imports
import type { TextareaHTMLAttributes } from "vue";

// ** Core Imports
import type { MergeHtmlProps } from "@bridge-ui/core";

// ** Local Imports
import type {
  FormFieldClasses,
  FormFieldColorOverrides,
  FormFieldOwnProps,
  FormFieldPartsProps,
  FormFieldRoundedOverrides,
  FormFieldSizeOverrides,
  FormFieldSlots,
  FormFieldVariantOverrides,
} from "@/Components/FormField/formField.types";

export type TextareaSizeOverrides = FormFieldSizeOverrides;
export type TextareaColorOverrides = FormFieldColorOverrides;
export type TextareaRoundedOverrides = FormFieldRoundedOverrides;
export type TextareaVariantOverrides = FormFieldVariantOverrides;

export interface TextareaClasses extends FormFieldClasses {}

export interface TextareaPartsProps extends FormFieldPartsProps {}

export interface TextareaOwnProps extends Omit<FormFieldOwnProps, "field"> {
  /**
   * Whether the textarea automatically resizes with its content.
   *
   * @default false
   */
  autosize?: boolean;
}

export interface TextareaSlots extends FormFieldSlots {}

export type TextareaProps = MergeHtmlProps<
  TextareaOwnProps,
  TextareaHTMLAttributes
>;
