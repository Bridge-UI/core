// ** External Imports
import type { HTMLAttributes, TextareaHTMLAttributes } from "react";

// ** Core Imports
import type {
  MergeHtmlProps,
  MergeProps,
  TextareaSize,
  TextFieldColor,
  TextFieldRounded,
  TextFieldVariant,
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
  container?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the `<textarea>`.
   */
  input?: Partial<TextareaHTMLAttributes<HTMLTextAreaElement>>;
}

export interface TextareaOwnProps extends Omit<
  FormFieldOwnProps,
  "field" | "children"
> {
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
  color?: MergeProps<TextFieldColor, TextareaColorOverrides>;

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
  rounded?: MergeProps<TextFieldRounded, TextareaRoundedOverrides>;

  /**
   * The size of the textarea control. Form labels and helper text use the same
   * `size` key via {@link FormField}.
   *
   * @default "md"
   */
  size?: MergeProps<TextareaSize, TextareaSizeOverrides>;

  /**
   * The variant of the textarea.
   *
   * @default "outline"
   */
  variant?: MergeProps<TextFieldVariant, TextareaVariantOverrides>;
}

export interface TextareaSlots extends FormFieldSlots {}

export type TextareaProps = MergeHtmlProps<
  TextareaOwnProps,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>;
