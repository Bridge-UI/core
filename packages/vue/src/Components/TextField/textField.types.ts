// ** External Imports
import type { LucideIcon } from "lucide-vue-next";
import type { HTMLAttributes, InputHTMLAttributes, Slot } from "vue";

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
  container?: HTMLAttributes;

  /**
   * Props forwarded to the corner label element.
   */
  corner?: HTMLAttributes;

  /**
   * Props forwarded to the inline-end adornment wrapper.
   */
  end?: HTMLAttributes;

  /**
   * Props forwarded to the description element below the field.
   */
  description?: HTMLAttributes;

  /**
   * Props forwarded to the inline-end `Icon` (`icon` is set by the field).
   */
  endIcon?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the error message element.
   */
  error?: HTMLAttributes;

  /**
   * Props forwarded to the label + corner header row.
   */
  header?: HTMLAttributes;

  /**
   * Props forwarded to the `<input>`.
   */
  input?: Partial<InputHTMLAttributes>;

  /**
   * Props forwarded to the primary label element.
   */
  label?: HTMLAttributes;

  /**
   * Props forwarded to the root wrapper.
   */
  root?: HTMLAttributes;

  /**
   * Props forwarded to the inline-start adornment wrapper.
   */
  start?: HTMLAttributes;

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
  class?: string;

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
   * Icon at the **inline end** (physical right in `ltr`, physical left in `rtl`).
   *
   * @default undefined
   */
  endIcon?: LucideIcon;

  /**
   * The error message to display below the field.
   *
   * @default undefined
   */
  error?: string;

  /**
   * When `true`, error text and the error icon are not shown.
   *
   * @default false
   */
  errorless?: boolean;

  /**
   * The primary label text above the field.
   *
   * @default undefined
   */
  label?: string;

  /**
   * The value of the text field.
   *
   * @default undefined
   */
  modelValue?: string;

  /**
   * Extra props for internal parts (`start`, `end`, `input`, etc.).
   * Native `<input>` attributes use fallthrough attrs on the component.
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
   * The variant of the text field.
   *
   * @default "outline"
   */
  variant?: MergeProps<TextFieldVariant, TextFieldVariantOverrides>;

  /**
   * Icon at the **inline start** (physical left in `ltr`, physical right in `rtl`).
   *
   * @default undefined
   */
  startIcon?: LucideIcon;

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
  corner?: Slot;

  /**
   * Slot at the inline end of the input container.
   */
  end?: Slot;

  /**
   * Helper text below the field (hidden when the field is invalid).
   */
  description?: Slot;

  /**
   * Custom error message content.
   */
  error?: Slot;

  /**
   * Slot at the inline start of the header row (primary label).
   */
  label?: Slot;

  /**
   * Slot at the inline start of the input container.
   */
  start?: Slot;
}

export type TextFieldProps = MergeHtmlProps<
  TextFieldOwnProps,
  InputHTMLAttributes
>;
