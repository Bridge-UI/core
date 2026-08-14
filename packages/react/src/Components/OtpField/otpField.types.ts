// ** External Imports
import type { HTMLAttributes, InputHTMLAttributes } from "react";

// ** Core Imports
import type { OtpInputType } from "@bridge-ui/core/Domain";
import type { BaseFieldInvalidated } from "@bridge-ui/core/Tokens/BaseField";
import type {
  OtpFieldColor,
  OtpFieldInvalidated,
  OtpFieldRounded,
  OtpFieldVariant,
} from "@bridge-ui/core/Tokens/OtpField";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  BaseFieldClasses,
  BaseFieldCustomProps,
  BaseFieldOwnProps,
  BaseFieldSlots,
} from "@/Components/BaseField/baseField.types";

export interface OtpFieldColorOverrides {}
export interface OtpFieldRoundedOverrides {}
export interface OtpFieldSizeOverrides {}
export interface OtpFieldVariantOverrides {}

export interface OtpFieldClasses extends BaseFieldClasses {
  /**
   * Classes merged onto each pin `<input>`.
   */
  input?: string;

  /**
   * Classes merged onto each pin cell wrapper.
   */
  pin?: string;
}

export interface OtpFieldCustomProps extends Omit<
  BaseFieldCustomProps,
  "invalidated"
> {
  /**
   * Props forwarded to each pin `<input>`.
   */
  input?: Partial<InputHTMLAttributes<HTMLInputElement>>;

  /**
   * Pin error chrome (`pin` / `pinUnderlined`). Error message color comes from
   * {@link BaseField} (`Tokens/BaseField`); pass `errorMessage` here to override.
   *
   * @default undefined
   */
  invalidated?: Partial<OtpFieldInvalidated & BaseFieldInvalidated>;

  /**
   * Props forwarded to each pin cell wrapper.
   */
  pin?: HTMLAttributes<HTMLDivElement>;
}

export interface OtpFieldOwnProps extends Omit<
  BaseFieldOwnProps,
  "field" | "slots" | "classes" | "children" | "customProps"
> {
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
   * Extra props for internal parts (`root`, `pin`, `input`, …).
   *
   * @default undefined
   */
  customProps?: OtpFieldCustomProps;

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
   * Border radius of each pin cell.
   *
   * @default "md"
   */
  rounded?: MergeProps<OtpFieldRounded, OtpFieldRoundedOverrides>;

  /**
   * Chrome slots (`label`, `description`, `errorMessage`, `start`, `end`, …).
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

export interface OtpFieldSlots extends BaseFieldSlots {}

export type OtpFieldProps = MergeHtmlProps<
  OtpFieldOwnProps,
  Omit<HTMLAttributes<HTMLDivElement>, "color" | "onChange">
>;
