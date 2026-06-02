// ** External Imports
import type { HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type { LabelSize, MergeHtmlProps, MergeProps } from "@bridge-ui/core";

import type { UseSwitcherReturn } from "@/Components/Switcher/hooks/useSwitcher";

export interface SwitcherSizeOverrides {}

export interface SwitcherClasses {
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
   * Classes merged onto the main inline label next to the control.
   */
  mainLabel?: string;

  /**
   * Classes merged onto the root wrapper.
   */
  root?: string;

  /**
   * Classes merged onto the control row (`label` + control).
   */
  row?: string;

  /**
   * Classes merged onto the inline-start label.
   */
  startLabel?: string;
}

export interface SwitcherPartsProps {
  /**
   * Props forwarded to the helper text element.
   */
  description?: HTMLAttributes<HTMLParagraphElement>;

  /**
   * Props forwarded to the inline-end label wrapper inside `mainLabel`.
   */
  endLabel?: HTMLAttributes<HTMLSpanElement>;

  /**
   * Props forwarded to the error message element.
   */
  errorMessage?: HTMLAttributes<HTMLParagraphElement>;

  /**
   * Props forwarded to the main inline label element.
   */
  mainLabel?: HTMLAttributes<HTMLLabelElement>;

  /**
   * Props forwarded to the root wrapper.
   */
  root?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the control row.
   */
  row?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the inline-start label element.
   */
  startLabel?: HTMLAttributes<HTMLLabelElement>;
}

export interface SwitcherOwnProps {
  /**
   * The form control rendered inside the switcher row.
   *
   * @default undefined
   */
  children?: ReactNode;

  /**
   * Classes for labels, description, error, and layout chrome.
   *
   * @default undefined
   */
  classes?: SwitcherClasses;

  /**
   * Associates labels and helper text with a form control. When omitted, an id
   * is generated automatically.
   *
   * @default undefined
   */
  controlId?: string;

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
   * Inline-end label text after the main label.
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
   * Pre-composed switcher API from a parent composable. Used by
   * `<Switcher field={…} />`; not set on Checkbox, Radio, or Toggle.
   *
   * @default undefined
   */
  field?: UseSwitcherReturn;

  /**
   * Main label text next to the control.
   *
   * @default undefined
   */
  mainLabel?: string;

  /**
   * Extra props for internal parts (`row`, `mainLabel`, `description`, …).
   *
   * @default undefined
   */
  partsProps?: SwitcherPartsProps;

  /**
   * Whether the control is read-only.
   *
   * @default false
   */
  readonly?: boolean;

  /**
   * Shows a red asterisk on labels.
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
  size?: MergeProps<LabelSize, SwitcherSizeOverrides>;

  /**
   * Chrome slots (`mainLabel`, `description`, `errorMessage`, …) and the control.
   *
   * @default undefined
   */
  slots?: SwitcherSlots;

  /**
   * Inline-start label text before the control.
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

  /**
   * When `true`, applies validation color tokens on labels when invalid.
   *
   * @default true
   */
  withValidationColors?: boolean;
}

export interface SwitcherSlots {
  /**
   * Helper text below the control row (hidden when invalid).
   */
  description?: ReactNode;

  /**
   * The form control (checkbox, radio, toggle, …).
   */
  default?: ReactNode;

  /**
   * Custom error message content.
   */
  errorMessage?: ReactNode;

  /**
   * Main label next to the control.
   */
  mainLabel?: ReactNode;

  /**
   * Inline-start label before the control.
   */
  startLabel?: ReactNode;

  /**
   * Inline-end label after the main label.
   */
  endLabel?: ReactNode;
}

export type SwitcherProps = MergeHtmlProps<
  SwitcherOwnProps,
  HTMLAttributes<HTMLDivElement>
>;
