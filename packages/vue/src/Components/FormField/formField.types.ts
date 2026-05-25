// ** External Imports
import type { HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core";
import type { FormFieldSize } from "@bridge-ui/core/Components/FormField";

export interface FormFieldSizeOverrides {}

export interface FormFieldClasses {
  /**
   * Classes merged onto the corner label in the header row.
   */
  corner?: string;

  /**
   * Classes merged onto the helper text below the control.
   */
  description?: string;

  /**
   * Classes merged onto the error message below the control.
   */
  error?: string;

  /**
   * Classes merged onto the label + corner header row.
   */
  header?: string;

  /**
   * Classes merged onto the primary label in the header row.
   */
  label?: string;

  /**
   * Classes merged onto the required asterisk.
   */
  required?: string;

  /**
   * Classes merged onto the root wrapper.
   */
  root?: string;
}

export interface FormFieldPartsProps {
  /**
   * Props forwarded to the corner label element.
   */
  corner?: HTMLAttributes;

  /**
   * Props forwarded to the description element below the control.
   */
  description?: HTMLAttributes;

  /**
   * Props forwarded to the error message element.
   */
  error?: HTMLAttributes;

  /**
   * Props forwarded to the label + corner header row.
   */
  header?: HTMLAttributes;

  /**
   * Props forwarded to the primary label element.
   */
  label?: HTMLAttributes;

  /**
   * Props forwarded to the root wrapper.
   */
  root?: HTMLAttributes;
}

export interface FormFieldOwnProps {
  /**
   * The classes to apply to the form field.
   *
   * @default undefined
   */
  classes?: FormFieldClasses;

  /**
   * Associates labels and helper text with a form control. When omitted, an id
   * is generated automatically.
   *
   * @default undefined
   */
  controlId?: string;

  /**
   * Secondary label text at the inline end of the header row.
   *
   * @default undefined
   */
  corner?: string;

  /**
   * Helper text below the control (hidden when the field is invalid).
   *
   * @default undefined
   */
  description?: string;

  /**
   * Whether the control is disabled.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * When `true`, applies invalid styling on the label and hides description.
   *
   * @default false
   */
  error?: boolean;

  /**
   * Error message below the control. Shown only when set (or via `#errorMessage`
   * slot).
   *
   * @default undefined
   */
  errorMessage?: string;

  /**
   * The primary label text above the control.
   *
   * @default undefined
   */
  label?: string;

  /**
   * Extra props for internal parts (`header`, `label`, `description`, etc.).
   *
   * @default undefined
   */
  partsProps?: FormFieldPartsProps;

  /**
   * Whether the control is read-only.
   *
   * @default false
   */
  readonly?: boolean;

  /**
   * Shows a red asterisk on the label.
   *
   * @default false
   */
  required?: boolean;

  /**
   * Typography scale for label, corner, description, and error message.
   *
   * @default "md"
   */
  size?: MergeProps<FormFieldSize, FormFieldSizeOverrides>;
}

export interface FormFieldSlots {
  /**
   * Slot at the inline end of the header row (secondary label).
   */
  corner?: Slot;

  /**
   * Helper text below the control (hidden when the field is invalid).
   */
  description?: Slot;

  /**
   * The form control (input, textarea, select trigger, etc.).
   */
  default?: Slot;

  /**
   * Custom error message content.
   */
  errorMessage?: Slot;

  /**
   * Slot at the inline start of the header row (primary label).
   */
  label?: Slot;
}

export type FormFieldProps = MergeHtmlProps<FormFieldOwnProps, HTMLAttributes>;
