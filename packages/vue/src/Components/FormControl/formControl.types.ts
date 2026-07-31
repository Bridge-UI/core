// ** External Imports
import type { HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type {
  FormControlInvalidated,
  LabelSize,
  MergeHtmlProps,
  MergeProps,
} from "@bridge-ui/core";

// ** Local Imports
import type { UseFormControlReturn } from "@/Components/FormControl/composables/useFormControl";
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
  description?: HTMLAttributes;

  /**
   * Props forwarded to the inline-end `Label` (content stays owned by `FormControl`).
   *
   * @default undefined
   */
  endLabel?: Partial<LabelProps>;

  /**
   * Props forwarded to the error message element.
   */
  errorMessage?: HTMLAttributes;

  /**
   * Error-state message colors (`errorMessage`). Label colors come from `Label` when `error` is set.
   *
   * @default undefined
   */
  invalidated?: Partial<FormControlInvalidated>;

  /**
   * Props forwarded to the root wrapper.
   */
  root?: HTMLAttributes;

  /**
   * Props forwarded to the control row.
   */
  row?: HTMLAttributes;

  /**
   * Props forwarded to the inline-start `Label` (content stays owned by `FormControl`).
   *
   * @default undefined
   */
  startLabel?: Partial<LabelProps>;
}

export interface FormControlOwnProps {
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
   * `<FormControl :field="…" />`; not set on Checkbox, Radio, or Switch.
   *
   * @default undefined
   */
  field?: UseFormControlReturn;

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

  /**
   * When `true`, does not reserve space below the row for error messages.
   *
   * @default false
   */
  withoutErrorMessage?: boolean;
}

export interface FormControlSlots {
  /**
   * The form control (checkbox, radio, switch, …).
   */
  default?: Slot<undefined>;

  /**
   * Helper text below the control row (hidden when invalid).
   */
  description?: Slot<undefined>;

  /**
   * Inline-end label after the control (right in LTR, left in RTL).
   */
  endLabel?: Slot<undefined>;

  /**
   * Custom error message content.
   */
  errorMessage?: Slot<undefined>;

  /**
   * Inline-start label before the control (left in LTR, right in RTL).
   */
  startLabel?: Slot<undefined>;
}

export type FormControlProps = MergeHtmlProps<
  FormControlOwnProps,
  HTMLAttributes
>;
