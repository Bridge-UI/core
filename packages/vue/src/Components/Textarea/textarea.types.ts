// ** External Imports
import type { HTMLAttributes, TextareaHTMLAttributes } from "vue";

// ** Core Imports
import type {
  MergeHtmlProps,
  MergeProps,
  TextareaColor,
  TextareaRounded,
  TextareaSize,
  TextareaVariant,
} from "@bridge-ui/core";

// ** Local Imports
import type {
  FormFieldClasses,
  FormFieldOwnProps,
  FormFieldPartsProps,
  FormFieldSlots,
} from "@/Components/FormField/formField.types";

export interface TextareaSizeOverrides {}
export interface TextareaColorOverrides {}
export interface TextareaRoundedOverrides {}
export interface TextareaVariantOverrides {}

export interface TextareaClasses extends FormFieldClasses {
  /**
   * The classes to apply to the textarea container.
   */
  container?: string;

  /**
   * The classes to apply to the textarea element.
   */
  input?: string;
}

export interface TextareaPartsProps extends FormFieldPartsProps {
  /**
   * Props forwarded to the textarea container (`<div>`).
   */
  container?: HTMLAttributes;

  /**
   * Props forwarded to the `<textarea>`.
   */
  input?: Partial<TextareaHTMLAttributes>;
}

export interface TextareaOwnProps extends Omit<FormFieldOwnProps, "field"> {
  /**
   * Whether the textarea automatically resizes with its content.
   *
   * @default false
   */
  autosize?: boolean;

  /**
   * Classes for the field chrome and the control (includes all FormField keys).
   *
   * @default undefined
   */
  classes?: TextareaClasses;

  /**
   * The color to apply to the textarea.
   *
   * @default "primary"
   */
  color?: MergeProps<TextareaColor, TextareaColorOverrides>;

  /**
   * Props for FormField parts and control parts (`label`, `input`, `container`, …).
   *
   * @default undefined
   */
  partsProps?: TextareaPartsProps;

  /**
   * The roundedness of the textarea.
   *
   * @default "md"
   */
  rounded?: MergeProps<TextareaRounded, TextareaRoundedOverrides>;

  /**
   * The size of the textarea control and form labels or helper text.
   *
   * @default "md"
   */
  size?: MergeProps<TextareaSize, TextareaSizeOverrides>;

  /**
   * The variant of the textarea.
   *
   * @default "outline"
   */
  variant?: MergeProps<TextareaVariant, TextareaVariantOverrides>;
}

export interface TextareaSlots extends FormFieldSlots {}

export type TextareaProps = MergeHtmlProps<
  TextareaOwnProps,
  TextareaHTMLAttributes
>;
