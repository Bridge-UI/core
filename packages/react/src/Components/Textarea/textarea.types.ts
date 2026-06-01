// ** External Imports
import type { TextareaHTMLAttributes } from "react";

// ** Core Imports
import type {
  MergeHtmlProps,
  MergeProps,
  TextareaResize,
} from "@bridge-ui/core";

// ** Local Imports
import type {
  FormFieldClasses,
  FormFieldOwnProps,
  FormFieldPartsProps,
  FormFieldSlots,
} from "@/Components/FormField/formField.types";

export interface TextareaResizeOverrides {}

export interface TextareaClasses extends FormFieldClasses {}

export interface TextareaPartsProps extends FormFieldPartsProps {}

export interface TextareaOwnProps extends Omit<FormFieldOwnProps, "field"> {
  /**
   * Whether the textarea automatically resizes with its content.
   *
   * Defaults to `true` when `likeInput` is set; otherwise `false`.
   */
  autosize?: boolean;

  /**
   * Use compact TextField-like sizing instead of the default multiline textarea profile.
   * Enables `autosize` and `rows={1}` by default; both can be overridden explicitly.
   *
   * @default false
   */
  likeInput?: boolean;

  /**
   * Native resize handle (`resize` CSS). Ignored when `autosize` is `true`.
   *
   * @default "none"
   */
  resize?: MergeProps<TextareaResize, TextareaResizeOverrides>;
}

export interface TextareaSlots extends FormFieldSlots {}

export type TextareaProps = MergeHtmlProps<
  TextareaOwnProps,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>;
