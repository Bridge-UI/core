// ** External Imports
import type { LucideIcon } from "lucide-react";
import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type {
  MergeHtmlProps,
  MergeProps,
  TextFieldColor,
  TextFieldRounded,
  TextFieldSize,
  TextFieldVariant,
} from "@bridge-ui/core";

// ** Local Imports
import type { IconProps } from "@/Components/Icon";

export interface TextFieldSizeOverrides {}
export interface TextFieldColorOverrides {}
export interface TextFieldRoundedOverrides {}
export interface TextFieldVariantOverrides {}

export interface TextFieldClasses {
  /**
   * The classes to apply to the inline-end adornment (icon or slot).
   */
  end?: string;

  /**
   * The classes to apply to the helper text below the field.
   */
  description?: string;

  /**
   * The classes to apply to the error message.
   */
  error?: string;

  /**
   * The classes to apply to the label + corner header row.
   */
  header?: string;

  /**
   * The classes to apply to the input element.
   */
  input?: string;

  /**
   * The classes to apply to the corner label (inline end of the header).
   */
  corner?: string;

  /**
   * The classes to apply to the primary label (inline start of the header).
   */
  label?: string;

  /**
   * The classes to apply to the root wrapper.
   */
  root?: string;

  /**
   * The classes to apply to the inline-start adornment (icon or slot).
   */
  start?: string;

  /**
   * The classes to apply to the input container (`<label>` wrapper).
   */
  container?: string;
}

export interface TextFieldPartsProps {
  /**
   * Props forwarded to the input container (`<label>`).
   */
  container?: HTMLAttributes<HTMLLabelElement>;

  /**
   * Props forwarded to the corner label element.
   */
  corner?: HTMLAttributes<HTMLSpanElement>;

  /**
   * Props forwarded to the description element below the field.
   */
  description?: HTMLAttributes<HTMLParagraphElement>;

  /**
   * Props forwarded to the inline-end adornment wrapper.
   */
  end?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the inline-end `Icon` (`icon` is set by the field).
   */
  endIcon?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the error message element.
   */
  error?: HTMLAttributes<HTMLParagraphElement>;

  /**
   * Props forwarded to the label + corner header row.
   */
  header?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the `<input>`.
   */
  input?: Partial<InputHTMLAttributes<HTMLInputElement>>;

  /**
   * Props forwarded to the primary label element.
   */
  label?: HTMLAttributes<HTMLLabelElement>;

  /**
   * Props forwarded to the root wrapper.
   */
  root?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the inline-start adornment wrapper.
   */
  start?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the inline-start `Icon` (`icon` is set by the field).
   */
  startIcon?: Partial<Omit<IconProps, "icon">>;
}

export interface TextFieldOwnProps {
  /**
   * Extra classes merged with the root wrapper (and `classes.root`).
   *
   * @default undefined
   */
  className?: string;

  /**
   * The classes to apply to the text field.
   *
   * @default undefined
   */
  classes?: TextFieldClasses;

  /**
   * The color to apply to the text field.
   *
   * @default "primary"
   */
  color?: MergeProps<TextFieldColor, TextFieldColorOverrides>;

  /**
   * Secondary label text at the inline end of the header row.
   *
   * @default undefined
   */
  corner?: string;

  /**
   * Helper text below the field (hidden when the field is invalid).
   *
   * @default undefined
   */
  description?: string;

  /**
   * Whether the text field is disabled.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Inline-end text inside the field (suffix), e.g. `@mail.com`.
   *
   * @default undefined
   */
  end?: string;

  /**
   * Icon at the **inline end** (physical right in `ltr`, physical left in `rtl`).
   *
   * @default undefined
   */
  endIcon?: LucideIcon;

  /**
   * When `true`, applies invalid styling (border, label, error icon).
   *
   * @default false
   */
  error?: boolean;

  /**
   * Error message below the field. Shown only when set (or via `slots.error`).
   *
   * @default undefined
   */
  errorMessage?: string;

  /**
   * The primary label text above the field.
   *
   * @default undefined
   */
  label?: string;

  /**
   * Extra props for internal parts (`start`, `end`, `input`, etc.).
   * Native `<input>` attributes stay on the component top level.
   *
   * @default undefined
   */
  partsProps?: TextFieldPartsProps;

  /**
   * Whether the text field is read-only.
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
   * The roundedness of the text field.
   *
   * @default "md"
   */
  rounded?: MergeProps<TextFieldRounded, TextFieldRoundedOverrides>;

  /**
   * The size of the text field.
   *
   * @default "md"
   */
  size?: MergeProps<TextFieldSize, TextFieldSizeOverrides>;

  /**
   * The slots to apply to the text field.
   *
   * @default undefined
   */
  slots?: TextFieldSlots;

  /**
   * Inline-start text inside the field (prefix), e.g. `https://`.
   *
   * @default undefined
   */
  start?: string;

  /**
   * Icon at the **inline start** (physical left in `ltr`, physical right in `rtl`).
   *
   * @default undefined
   */
  startIcon?: LucideIcon;

  /**
   * The variant of the text field.
   *
   * @default "outline"
   */
  variant?: MergeProps<TextFieldVariant, TextFieldVariantOverrides>;

  /**
   * When `true` and the field is invalid, shows an error icon at the inline end
   * when no `endIcon` or `end` slot is present.
   *
   * @default true
   */
  withErrorIcon?: boolean;
}

export interface TextFieldSlots {
  /**
   * Slot at the inline end of the header row (secondary label).
   */
  corner?: ReactNode;

  /**
   * Inline-end slot for custom content (e.g. a `Button`). Prefer the `end` prop
   * for plain suffix text.
   */
  end?: ReactNode;

  /**
   * Helper text below the field (hidden when the field is invalid).
   */
  description?: ReactNode;

  /**
   * Custom error message content.
   */
  error?: ReactNode;

  /**
   * Slot at the inline start of the header row (primary label).
   */
  label?: ReactNode;

  /**
   * Inline-start slot for custom content (e.g. a `Button`). Prefer the `start`
   * prop for plain prefix text.
   */
  start?: ReactNode;
}

export type TextFieldProps = MergeHtmlProps<
  TextFieldOwnProps,
  InputHTMLAttributes<HTMLInputElement>
>;
