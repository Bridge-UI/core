// ** External Imports
import type { LucideIcon } from "lucide-vue-next";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  Slot,
} from "vue";

// ** Core Imports
import type {
  ButtonColor,
  ButtonDensity,
  ButtonRounded,
  ButtonSize,
  ButtonVariant,
  MergeHtmlProps,
  MergeProps,
} from "@bridge-ui/core";

// ** Local Imports
import type { IconProps } from "@/Components/Icon";

export interface ButtonSizeOverrides {}
export interface ButtonColorOverrides {}
export interface ButtonDensityOverrides {}
export interface ButtonRoundedOverrides {}
export interface ButtonVariantOverrides {}

export interface ButtonClasses {
  /**
   * The classes to apply to the end icon.
   */
  endIcon?: string;

  /**
   * The classes to apply to the icon (mini density).
   */
  icon?: string;

  /**
   * The classes to apply to the loading.
   */
  loading?: string;

  /**
   * The classes to apply to the root.
   */
  root?: string;

  /**
   * The classes to apply to the start icon.
   */
  startIcon?: string;
}

export interface ButtonCustomProps {
  /**
   * Props forwarded to the inline-end slot wrapper.
   */
  end?: HTMLAttributes;

  /**
   * Props forwarded to the end `Icon` (`icon` is set by the button).
   */
  endIcon?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the icon `Icon` (`icon` is set by the button).
   */
  icon?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the loading spinner `Icon`.
   */
  loading?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the root element.
   */
  root?: HTMLAttributes;

  /**
   * Props forwarded to the inline-start slot wrapper.
   */
  start?: HTMLAttributes;

  /**
   * Props forwarded to the inline-start `Icon` (`icon` is set by the button).
   */
  startIcon?: Partial<Omit<IconProps, "icon">>;
}

export interface ButtonOwnProps {
  /**
   * The element to render as.
   *
   * @default "button"
   */
  as?: "a" | "span" | "button";

  /**
   * The classes to apply to the button.
   *
   * @default undefined
   */
  classes?: ButtonClasses;

  /**
   * The color to apply to the button.
   *
   * @default "primary"
   */
  color?: MergeProps<ButtonColor, ButtonColorOverrides>;

  /**
   * Extra props for internal parts (`startIcon`, `endIcon`, slot wrappers, etc.).
   * Root HTML attributes stay on the component top level.
   *
   * @default undefined
   */
  customProps?: ButtonCustomProps;

  /**
   * The density of the button.
   *
   * @default "default"
   */
  density?: MergeProps<ButtonDensity, ButtonDensityOverrides>;

  /**
   * Whether the button is disabled.
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
   * Whether the button is full width.
   *
   * @default false
   */
  full?: boolean;

  /**
   * The href to apply to the button.
   *
   * @default undefined
   */
  href?: string;

  /**
   * Icon for mini density (replaces label and start/end icons).
   *
   * @default undefined
   */
  icon?: LucideIcon;

  /**
   * Whether the button is loading.
   *
   * @default false
   */
  loading?: boolean;

  /**
   * The roundedness of the button.
   *
   * @default "md"
   */
  rounded?: MergeProps<ButtonRounded, ButtonRoundedOverrides>;

  /**
   * The size of the button.
   *
   * @default "md"
   */
  size?: MergeProps<ButtonSize, ButtonSizeOverrides>;

  /**
   * Icon at the **inline start** (physical left in `ltr`, physical right in `rtl`).
   *
   * @default undefined
   */
  startIcon?: LucideIcon;

  /**
   * Label text when the default slot is not used.
   *
   * @default undefined
   */
  text?: string;

  /**
   * The variant of the button.
   *
   * @default "solid"
   */
  variant?: MergeProps<ButtonVariant, ButtonVariantOverrides>;
}

export interface ButtonSlots {
  /**
   * The default slot (label / main content).
   */
  default?: Slot<undefined>;

  /**
   * Slot at the inline end (follows `dir` on an ancestor, e.g. `<html dir="rtl">`).
   */
  end?: Slot<undefined>;

  /**
   * Slot at the inline start (follows `dir` on an ancestor, e.g. `<html dir="rtl">`).
   */
  start?: Slot<undefined>;
}

export type ButtonProps =
  | MergeHtmlProps<ButtonOwnProps & { as: "span" }, HTMLAttributes>
  | MergeHtmlProps<ButtonOwnProps & { as: "a" }, AnchorHTMLAttributes>
  | MergeHtmlProps<ButtonOwnProps & { as?: "button" }, ButtonHTMLAttributes>;
