// ** External Imports
import type { LucideIcon } from "@lucide/vue";
import type { HTMLAttributes, InputHTMLAttributes, Slot } from "vue";

// ** Core Imports
import type {
  FormFieldColor,
  FormFieldInvalidated,
  FormFieldRounded,
  FormFieldSize,
  FormFieldVariant,
  MergeHtmlProps,
  MergeProps,
} from "@bridge-ui/core";
// ** Local Imports
import type { UseFormFieldReturn } from "@/Components/FormField/composables/useFormField";
import type { IconProps } from "@/Components/Icon";

export interface FormFieldSizeOverrides {}
export interface FormFieldColorOverrides {}
export interface FormFieldRoundedOverrides {}
export interface FormFieldVariantOverrides {}

export interface FormFieldClasses {
  /**
   * The classes to apply to the input container (`<div>` wrapper).
   */
  container?: string;

  /**
   * Classes merged onto the corner label in the header row.
   */
  corner?: string;

  /**
   * Classes merged onto the helper text below the control.
   */
  description?: string;

  /**
   * The classes to apply to the inline-end adornment (icon or slot).
   */
  end?: string;

  /**
   * Classes merged onto the error message below the control.
   */
  errorMessage?: string;

  /**
   * Classes merged onto the label + corner header row.
   */
  header?: string;

  /**
   * The classes to apply to the input element.
   */
  input?: string;

  /**
   * Classes merged onto the primary label in the header row.
   */
  label?: string;

  /**
   * Classes merged onto the required asterisk.
   */
  required?: string;

  /**
   * Classes merged onto the root wrapper.
   */
  root?: string;

  /**
   * The classes to apply to the inline-start adornment (icon or slot).
   */
  start?: string;
}

export interface FormFieldCustomProps {
  /**
   * Props forwarded to the input container (`<div>`).
   */
  container?: HTMLAttributes;

  /**
   * Props forwarded to the corner label element.
   */
  corner?: HTMLAttributes;

  /**
   * Props forwarded to the helper text below the control.
   */
  description?: HTMLAttributes;

  /**
   * Props forwarded to the inline-end adornment wrapper.
   */
  end?: HTMLAttributes;

  /**
   * Props forwarded to the inline-end `Icon` (`icon` is set by the field).
   */
  endIcon?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the error message element.
   */
  errorMessage?: HTMLAttributes;

  /**
   * Props forwarded to the label + corner header row.
   */
  header?: HTMLAttributes;

  /**
   * Props forwarded to the `<input>`.
   */
  input?: Partial<InputHTMLAttributes>;

  /**
   * Error-state field chrome colors (label, container, adornments, …).
   *
   * @default undefined
   */
  invalidated?: Partial<FormFieldInvalidated>;

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

export interface FormFieldOwnProps {
  /**
   * Classes for the field chrome and the control (includes label, container, adornments).
   *
   * @default undefined
   */
  classes?: FormFieldClasses;

  /**
   * The color to apply to the field control.
   *
   * @default "primary"
   */
  color?: MergeProps<FormFieldColor, FormFieldColorOverrides>;

  /**
   * Associates labels and helper text with a form control. When omitted, an id
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
   * Extra props for internal parts (`header`, `label`, `input`, `container`, …).
   *
   * @default undefined
   */
  customProps?: FormFieldCustomProps;

  /**
   * Helper text below the control (hidden when the field is invalid).
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
   * When `true`, applies invalid styling on the label and hides description.
   *
   * @default false
   */
  error?: boolean;

  /**
   * Icon used when `withErrorIcon` is enabled and the field is invalid.
   *
   * @default CircleAlert
   */
  errorIcon?: LucideIcon;

  /**
   * Error message below the control. Shown only when set (or via `#errorMessage`
   * slot).
   *
   * @default undefined
   */
  errorMessage?: string;

  /**
   * Pre-composed field API from a parent composable (e.g. `useTextField`). Used
   * by `<FormField :field="…" />`; not set on field wrappers such as TextField.
   *
   * @default undefined
   */
  field?: UseFormFieldReturn;

  /**
   * The primary label text above the control.
   *
   * @default undefined
   */
  label?: string;

  /**
   * Whether the control is read-only.
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
   * The roundedness of the field control.
   *
   * @default "md"
   */
  rounded?: MergeProps<FormFieldRounded, FormFieldRoundedOverrides>;

  /**
   * Typography scale for label, corner, description, and error message, and
   * control sizing (input, container, icons).
   *
   * @default "md"
   */
  size?: MergeProps<FormFieldSize, FormFieldSizeOverrides>;

  /**
   * Chrome slots (`label`, `description`, `errorMessage`, …) via `#slot` or prop;
   * inline adornments use `#start` / `#end`.
   */
  slots?: FormFieldSlots;

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
   * The visual variant of the field shell and control.
   *
   * @default "outline"
   */
  variant?: MergeProps<FormFieldVariant, FormFieldVariantOverrides>;

  /**
   * When `true` and the field is invalid, shows an error icon at the inline end
   * when no `endIcon` or `end` slot is present.
   *
   * @default true
   */
  withErrorIcon?: boolean;

  /**
   * When `true`, does not reserve space below the control for error messages.
   *
   * @default false
   */
  withoutErrorMessage?: boolean;
}

export interface FormFieldSlots {
  /**
   * Slot at the inline end of the header row (secondary label).
   */
  corner?: Slot;

  /**
   * The form control (input, textarea, select trigger, etc.).
   */
  default?: Slot;

  /**
   * Helper text below the control (hidden when the field is invalid).
   */
  description?: Slot;

  /**
   * Inline-end slot for custom content (e.g. a `Button`). Prefer the `end` prop
   * for plain suffix text.
   */
  end?: Slot;

  /**
   * Custom error message content.
   */
  errorMessage?: Slot;

  /**
   * Slot at the inline start of the header row (primary label).
   */
  label?: Slot;

  /**
   * Inline-start slot for custom content (e.g. a `Button`). Prefer the `start`
   * prop for plain prefix text.
   */
  start?: Slot;
}

export type FormFieldProps = MergeHtmlProps<FormFieldOwnProps, HTMLAttributes>;
