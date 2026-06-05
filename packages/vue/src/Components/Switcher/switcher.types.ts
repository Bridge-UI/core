// ** External Imports
import type { HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type { LabelSize, MergeHtmlProps, MergeProps } from "@bridge-ui/core";

import type { UseSwitcherReturn } from "@/Components/Switcher/composables/useSwitcher";

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
   * Classes merged onto the control row.
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
  description?: HTMLAttributes;

  /**
   * Props forwarded to the inline-end label element.
   */
  endLabel?: HTMLAttributes;

  /**
   * Props forwarded to the error message element.
   */
  errorMessage?: HTMLAttributes;

  /**
   * Props forwarded to the main inline label element.
   */
  mainLabel?: HTMLAttributes;

  /**
   * Props forwarded to the root wrapper.
   */
  root?: HTMLAttributes;

  /**
   * Props forwarded to the control row.
   */
  row?: HTMLAttributes;

  /**
   * Props forwarded to the inline-start label element.
   */
  startLabel?: HTMLAttributes;
}

export interface SwitcherOwnProps {
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
   * `<Switcher :field="…" />`; not set on Checkbox, Radio, or Toggle.
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
   * Sets the native `required` attribute on the control.
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
}

export interface SwitcherSlots {
  /**
   * The form control (checkbox, radio, toggle, …).
   */
  default?: Slot;

  /**
   * Helper text below the control row (hidden when invalid).
   */
  description?: Slot;

  /**
   * Inline-end label after the main label.
   */
  endLabel?: Slot;

  /**
   * Custom error message content.
   */
  errorMessage?: Slot;

  /**
   * Main label next to the control.
   */
  mainLabel?: Slot;

  /**
   * Inline-start label before the control.
   */
  startLabel?: Slot;
}

export type SwitcherProps = MergeHtmlProps<SwitcherOwnProps, HTMLAttributes>;
