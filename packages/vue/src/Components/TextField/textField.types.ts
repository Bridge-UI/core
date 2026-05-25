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
import type {
  FormFieldClasses,
  FormFieldOwnProps,
  FormFieldPartsProps,
  FormFieldSlots,
} from "@/Components/FormField/formField.types";
import type { IconProps } from "@/Components/Icon";

export interface TextFieldSizeOverrides {}
export interface TextFieldColorOverrides {}
export interface TextFieldRoundedOverrides {}
export interface TextFieldVariantOverrides {}

export interface TextFieldClasses extends FormFieldClasses {
  /**
   * The classes to apply to the inline-end adornment (icon or slot).
   */
  end?: string;

  /**
   * The classes to apply to the input element.
   */
  input?: string;

  /**
   * The classes to apply to the inline-start adornment (icon or slot).
   */
  start?: string;

  /**
   * The classes to apply to the input container (`<div>` wrapper).
   */
  container?: string;
}

export interface TextFieldPartsProps extends FormFieldPartsProps {
  /**
   * Props forwarded to the input container (`<div>`).
   */
  container?: HTMLAttributes;

  /**
   * Props forwarded to the inline-end adornment wrapper.
   */
  end?: HTMLAttributes;

  /**
   * Props forwarded to the inline-end `Icon` (`icon` is set by the field).
   */
  endIcon?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the `<input>`.
   */
  input?: Partial<InputHTMLAttributes>;

  /**
   * Props forwarded to the inline-start adornment wrapper.
   */
  start?: HTMLAttributes;

  /**
   * Props forwarded to the inline-start `Icon` (`icon` is set by the field).
   */
  startIcon?: Partial<Omit<IconProps, "icon">>;
}

export interface TextFieldOwnProps extends FormFieldOwnProps {
  /**
   * The color to apply to the text field.
   *
   * @default "primary"
   */
  color?: MergeProps<TextFieldColor, TextFieldColorOverrides>;

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
   * The roundedness of the text field.
   *
   * @default "md"
   */
  rounded?: MergeProps<TextFieldRounded, TextFieldRoundedOverrides>;

  /**
   * The size of the text field control (input, container, and icons). Form
   * labels and helper text use the same `size` key via {@link FormField}.
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
   * When `true` and the field is invalid, shows an error icon at the inline end
   * when no `endIcon` or `end` slot is present.
   *
   * @default true
   */
  withErrorIcon?: boolean;
}

export interface TextFieldSlots extends FormFieldSlots {
  /**
   * Inline-end slot for custom content (e.g. a `Button`). Prefer the `end` prop
   * for plain suffix text. Interactive children should fill the slot wrapper
   * (`h-full min-h-0 w-full` on the control; matching radius is up to you).
   */
  end?: Slot;

  /**
   * Inline-start slot for custom content (e.g. a `Button`). Prefer the `start`
   * prop for plain prefix text. Interactive children should fill the slot
   * wrapper (`h-full min-h-0 w-full` on the control; matching radius is up to you).
   */
  start?: Slot;
}

export type TextFieldProps = MergeHtmlProps<
  TextFieldOwnProps,
  InputHTMLAttributes
> & {
  /**
   * Bound with `v-model` on the component (`defineModel` internally).
   *
   * @default undefined
   */
  modelValue?: string | null;
};
