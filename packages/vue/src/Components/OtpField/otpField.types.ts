// ** External Imports
import type { HTMLAttributes, InputHTMLAttributes } from "vue";

// ** Core Imports
import type { OtpInputType } from "@bridge-ui/core/Domain";
import type {
  OtpFieldColor,
  OtpFieldRounded,
  OtpFieldVariant,
} from "@bridge-ui/core/Tokens";
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

export interface OtpFieldCustomProps extends BaseFieldCustomProps {
  /**
   * Props forwarded to each pin `<input>`.
   */
  input?: Partial<InputHTMLAttributes>;

  /**
   * Props forwarded to each pin cell wrapper.
   */
  pin?: HTMLAttributes;
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
   * Initial value for uncontrolled usage (when `v-model` / `modelValue` is
   * not bound).
   *
   * @default undefined
   */
  defaultValue?: string;

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
   * Border radius of each pin cell.
   *
   * @default "md"
   */
  rounded?: MergeProps<OtpFieldRounded, OtpFieldRoundedOverrides>;

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
}

export interface OtpFieldSlots extends BaseFieldSlots {}

export type OtpFieldProps = MergeHtmlProps<
  OtpFieldOwnProps,
  Omit<HTMLAttributes, "color" | "onChange">
> & {
  /**
   * Bound with `v-model` on the component (`defineModel` internally).
   */
  modelValue?: null | string;
};
