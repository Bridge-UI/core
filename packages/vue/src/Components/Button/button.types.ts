// ** External Imports
import type { LucideIcon } from "lucide-vue-next";
import type { Component } from "vue";

// ** Core Imports
import type {
  ButtonColor,
  ButtonRounded,
  ButtonSize,
  ButtonVariant,
  MergeProps,
} from "@bridge-ui/core";

export interface ButtonSizeOverrides {}
export interface ButtonColorOverrides {}
export interface ButtonRoundedOverrides {}
export interface ButtonVariantOverrides {}

export interface ButtonClasses {
  leftIcon?: string;
  loading?: string;
  rightIcon?: string;
  root?: string;
}

export interface ButtonProps {
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
   * Whether the button is disabled.
   *
   * @default false
   */
  disabled?: boolean;

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
   * The left icon to apply to the button.
   *
   * @default undefined
   */
  leftIcon?: LucideIcon;

  /**
   * Whether the button is loading.
   *
   * @default false
   */
  loading?: boolean;

  /**
   * The right icon to apply to the button.
   *
   * @default undefined
   */
  rightIcon?: LucideIcon;

  /**
   * The roundedness of the button.
   *
   * @default "none"
   */
  rounded?: MergeProps<ButtonRounded, ButtonRoundedOverrides>;

  /**
   * The size of the button.
   *
   * @default "md"
   */
  size?: MergeProps<ButtonSize, ButtonSizeOverrides>;

  /**
   * The variant of the button.
   *
   * @default "flat"
   */
  variant?: MergeProps<ButtonVariant, ButtonVariantOverrides>;
}

export interface ButtonSlots {
  /**
   * The slot to apply to the append.
   */
  append?: Component;

  /**
   * The slot to apply to the default.
   */
  default?: Component;

  /**
   * The slot to apply to the prepend.
   */
  prepend?: Component;
}
