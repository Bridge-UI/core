// ** External Imports
import type { HTMLAttributes, InputHTMLAttributes, Slot } from "vue";

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
  corner?: HTMLAttributes;

  /**
   * Props forwarded to the helper text below the pins.
   */
  description?: HTMLAttributes;

  /**
   * Props forwarded to the error message element.
   */
  errorMessage?: HTMLAttributes;

  /**
   * Props forwarded to the pin group wrapper.
   */
  group?: HTMLAttributes;

  /**
   * Props forwarded to the label + corner header row.
   */
  header?: HTMLAttributes;

  /**
   * Props forwarded to each pin `<input>`.
   */
  input?: Partial<InputHTMLAttributes>;

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
  pin?: HTMLAttributes;

  /**
   * Props forwarded to the root wrapper.
   */
  root?: HTMLAttributes;
}

export interface OtpFieldEmits {
  /**
   * Emitted when the OTP string changes.
   */
  change: [value: string];

  /**
   * Emitted when every pin slot is filled.
   */
  complete: [value: string];
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
   * Initial value for uncontrolled usage (when `v-model` / `modelValue` is
   * not bound).
   *
   * @default undefined
   */
  defaultValue?: string;

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
   * Character set accepted by each pin.
   *
   * @default "numeric"
   */
  type?: OtpInputType;

  /**
   * Visual variant applied to each pin cell.
   *
   * @default "outline"
   */
  variant?: MergeProps<OtpFieldVariant, OtpFieldVariantOverrides>;

  /**
   * When `false`, the error message row is not reserved / rendered.
   *
   * @default false
   */
  withoutErrorMessage?: boolean;
}

export interface OtpFieldSlots {
  /**
   * Secondary header text at the inline end.
   */
  corner?: Slot;

  /**
   * Helper text below the pins.
   */
  description?: Slot;

  /**
   * Error message below the pins.
   */
  errorMessage?: Slot;

  /**
   * Primary label content.
   */
  label?: Slot;
}

export type OtpFieldProps = MergeHtmlProps<
  OtpFieldOwnProps,
  Omit<HTMLAttributes, "color" | "onChange">
> & {
  /**
   * Bound with `v-model` on the component (`defineModel` internally).
   */
  modelValue?: null | string;
};
