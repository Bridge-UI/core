// ** External Imports
import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type {
  MergeHtmlProps,
  MergeProps,
  OtpFieldColor,
  OtpFieldInvalidated,
  OtpFieldRounded,
  OtpFieldSize,
  OtpFieldVariant,
  OtpInputType,
} from "@bridge-ui/core";

// ** Local Imports
import type { LabelProps } from "@/Components/Label/label.types";

export interface OtpFieldColorOverrides {}
export interface OtpFieldRoundedOverrides {}
export interface OtpFieldSizeOverrides {}
export interface OtpFieldVariantOverrides {}

export interface OtpFieldClasses {
  /**
   * Classes merged onto the corner label in the header row.
   */
  corner?: string;

  /**
   * Classes merged onto the helper text below the pins.
   */
  description?: string;

  /**
   * Classes merged onto the error message below the pins.
   */
  errorMessage?: string;

  /**
   * Classes merged onto the pin group wrapper.
   */
  group?: string;

  /**
   * Classes merged onto the label + corner header row.
   */
  header?: string;

  /**
   * Classes merged onto each pin `<input>`.
   */
  input?: string;

  /**
   * Classes merged onto the primary label.
   */
  label?: string;

  /**
   * Classes merged onto each pin cell wrapper.
   */
  pin?: string;

  /**
   * Classes merged onto the required asterisk.
   */
  required?: string;

  /**
   * Classes merged onto the root wrapper.
   */
  root?: string;
}

export interface OtpFieldCustomProps {
  /**
   * Props forwarded to the corner label element.
   */
  corner?: HTMLAttributes<HTMLSpanElement>;

  /**
   * Props forwarded to the helper text below the pins.
   */
  description?: HTMLAttributes<HTMLParagraphElement>;

  /**
   * Props forwarded to the error message element.
   */
  errorMessage?: HTMLAttributes<HTMLParagraphElement>;

  /**
   * Props forwarded to the pin group wrapper.
   */
  group?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the label + corner header row.
   */
  header?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to each pin `<input>`.
   */
  input?: Partial<InputHTMLAttributes<HTMLInputElement>>;

  /**
   * Error-state pin chrome colors. Label colors come from `Label` when `error`
   * is set.
   *
   * @default undefined
   */
  invalidated?: Partial<OtpFieldInvalidated>;

  /**
   * Props forwarded to the primary `Label` (content stays owned by `OtpField`).
   *
   * @default undefined
   */
  label?: Partial<Omit<LabelProps, "children">>;

  /**
   * Props forwarded to each pin cell wrapper.
   */
  pin?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the root wrapper.
   */
  root?: HTMLAttributes<HTMLDivElement>;
}

export interface OtpFieldOwnProps {
  /**
   * Autofocus the first empty pin (or the first pin) on mount.
   *
   * @default false
   */
  autoFocus?: boolean;

  /**
   * Classes for the field chrome and pin cells.
   *
   * @default undefined
   */
  classes?: OtpFieldClasses;

  /**
   * Focus ring / underline color on each pin.
   *
   * @default "primary"
   */
  color?: MergeProps<OtpFieldColor, OtpFieldColorOverrides>;

  /**
   * Associates labels and helper text with the pin group. When omitted, an id
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
   * Extra props for internal parts (`root`, `pin`, `input`, …).
   *
   * @default undefined
   */
  customProps?: OtpFieldCustomProps;

  /**
   * Helper text below the pins (hidden when the field is invalid).
   *
   * @default undefined
   */
  description?: string;

  /**
   * Whether all pins are disabled.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * When `true`, applies invalid styling on the label and pins.
   *
   * @default false
   */
  error?: boolean;

  /**
   * Error message below the pins. Shown only when set (or via `errorMessage` slot).
   *
   * @default undefined
   */
  errorMessage?: string;

  /**
   * When `true`, does not reserve space below the pins for error messages.
   *
   * @default false
   */
  hideErrorMessage?: boolean;

  /**
   * The primary label text above the pins.
   *
   * @default undefined
   */
  label?: string;

  /**
   * Number of pin slots.
   *
   * @default 6
   */
  length?: number;

  /**
   * Mask pin values (password-style dots).
   *
   * @default false
   */
  mask?: boolean;

  /**
   * Called when the OTP string changes.
   */
  onChange?: (value: string) => void;

  /**
   * Called when every pin slot is filled.
   */
  onComplete?: (value: string) => void;

  /**
   * Placeholder character shown in empty pins.
   *
   * @default undefined
   */
  placeholder?: string;

  /**
   * Whether all pins are read-only.
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
   * Border radius of each pin cell.
   *
   * @default "md"
   */
  rounded?: MergeProps<OtpFieldRounded, OtpFieldRoundedOverrides>;

  /**
   * Pin size and label typography scale.
   *
   * @default "md"
   */
  size?: MergeProps<OtpFieldSize, OtpFieldSizeOverrides>;

  /**
   * Chrome slots (`label`, `description`, `errorMessage`, …).
   *
   * @default undefined
   */
  slots?: OtpFieldSlots;

  /**
   * Character set accepted by each pin.
   *
   * @default "numeric"
   */
  type?: OtpInputType;

  /**
   * Controlled OTP value (concatenated digits).
   *
   * @default undefined
   */
  value?: string;

  /**
   * Visual variant applied to each pin cell.
   *
   * @default "outline"
   */
  variant?: MergeProps<OtpFieldVariant, OtpFieldVariantOverrides>;
}

export interface OtpFieldSlots {
  /**
   * Secondary header text at the inline end.
   */
  corner?: ReactNode;

  /**
   * Helper text below the pins.
   */
  description?: ReactNode;

  /**
   * Error message below the pins.
   */
  errorMessage?: ReactNode;

  /**
   * Primary label content.
   */
  label?: ReactNode;
}

export type OtpFieldProps = MergeHtmlProps<
  OtpFieldOwnProps,
  Omit<HTMLAttributes<HTMLDivElement>, "color" | "onChange">
>;
