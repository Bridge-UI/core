// ** External Imports
import type { HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type { LabelSize } from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { UseFormControlReturn } from "@/Components/FormControl/hooks/useFormControl";
import type { LabelProps } from "@/Components/Label/label.types";

export interface FormControlSizeOverrides {}

export interface FormControlClasses {
  /**
   * Classes merged onto the helper text below the control row.
   */
  description?: string;

  /**
   * Classes merged onto the inline-end label.
   */
  endLabel?: string;

  /**
   * Classes merged onto the error message below the control row.
   */
  errorMessage?: string;

  /**
   * Classes merged onto the root wrapper.
   */
  root?: string;

  /**
   * Classes merged onto the control row.
   */
  row?: string;

  /**
   * Classes merged onto the inline-start label.
   */
  startLabel?: string;
}

export interface FormControlCustomProps {
  /**
   * Props forwarded to the helper text element.
   */
  description?: HTMLAttributes<HTMLParagraphElement>;

  /**
   * Props forwarded to the inline-end `Label` (content stays owned by `FormControl`).
   *
   * @default undefined
   */
  endLabel?: Partial<Omit<LabelProps, "children">>;

  /**
   * Props forwarded to the error message element.
   */
  errorMessage?: HTMLAttributes<HTMLParagraphElement>;

  /**
   * Props forwarded to the root wrapper.
   */
  root?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the control row.
   */
  row?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the inline-start `Label` (content stays owned by `FormControl`).
   *
   * @default undefined
   */
  startLabel?: Partial<Omit<LabelProps, "children">>;
}

export interface FormControlOwnProps {
  /**
   * The form control rendered inside the form control row.
   *
   * @default undefined
   */
  children?: ReactNode;

  /**
   * Classes for labels, description, error, and layout chrome.
   *
   * @default undefined
   */
  classes?: FormControlClasses;

  /**
   * Associates labels and helper text with a form control. When omitted, an id
   * is generated automatically.
   *
   * @default undefined
   */
  controlId?: string;

  /**
   * Extra props for internal parts (`row`, `startLabel`, `endLabel`, …).
   *
   * @default undefined
   */
  customProps?: FormControlCustomProps;

  /**
   * Helper text below the control row (hidden when invalid).
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
   * Inline-end label text after the control (right in LTR, left in RTL).
   *
   * @default undefined
   */
  endLabel?: string;

  /**
   * When `true`, applies invalid styling on labels and hides description.
   *
   * @default false
   */
  error?: boolean;

  /**
   * Error message below the control row.
   *
   * @default undefined
   */
  errorMessage?: string;

  /**
   * Pre-composed form control API from a parent composable. Used by
   * `<FormControl field={…} />`; not set on Checkbox, Radio, or Switch.
   *
   * @default undefined
   */
  field?: UseFormControlReturn;

  /**
   * When `true`, does not reserve space below the row for error messages.
   *
   * @default false
   */
  hideErrorMessage?: boolean;

  /**
   * Whether the control is read-only.
   *
   * @default false
   */
  readonly?: boolean;

  /**
   * Sets the native `required` attribute on the control and shows a required
   * asterisk on start/end labels.
   *
   * @default false
   */
  required?: boolean;

  /**
   * Typography scale for labels, description, and error text (aligned with
   * `FormField` / `Label`).
   *
   * @default "md"
   */
  size?: MergeProps<LabelSize, FormControlSizeOverrides>;

  /**
   * Chrome slots (`startLabel`, `endLabel`, `description`, `errorMessage`, …)
   * and the control.
   *
   * @default undefined
   */
  slots?: FormControlSlots;

  /**
   * Inline-start label text before the control (left in LTR, right in RTL).
   *
   * @default undefined
   */
  startLabel?: string;
}

export interface FormControlSlots {
  /**
   * The form control (checkbox, radio, switch, …).
   */
  default?: ReactNode;

  /**
   * Helper text below the control row (hidden when invalid).
   */
  description?: ReactNode;

  /**
   * Inline-end label after the control (right in LTR, left in RTL).
   */
  endLabel?: ReactNode;

  /**
   * Custom error message content.
   */
  errorMessage?: ReactNode;

  /**
   * Inline-start label before the control (left in LTR, right in RTL).
   */
  startLabel?: ReactNode;
}

export type FormControlProps = MergeHtmlProps<
  FormControlOwnProps,
  HTMLAttributes<HTMLDivElement>
>;
