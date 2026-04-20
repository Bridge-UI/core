// ** External Imports
import { Component } from "vue";

export interface ButtonSizeOverrides {}
export interface ButtonColorOverrides {}
export interface ButtonRoundedOverrides {}
export interface ButtonVariantOverrides {}

export interface ButtonClasses {
  /**
   * The classes to apply to the left icon.
   */
  leftIcon?: string | undefined;

  /**
   * The classes to apply to the loading.
   */
  loading?: string | undefined;

  /**
   * The classes to apply to the right icon.
   */
  rightIcon?: string | undefined;

  /**
   * The classes to apply to the root.
   */
  root?: string | undefined;
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
  classes?: ButtonClasses | undefined;

  /**
   * The color to apply to the button.
   *
   * @default undefined
   */
  color?: any;

  /**
   * Whether the button is disabled.
   *
   * @default false
   */
  disabled?: boolean | undefined;

  /**
   * Whether the button is full width.
   *
   * @default false
   */
  full?: boolean | undefined;

  /**
   * The href to apply to the button.
   *
   * @default undefined
   */
  href?: string | undefined;

  /**
   * The left icon to apply to the button.
   *
   * @default undefined
   */
  leftIcon?: any;

  /**
   * Whether the button is loading.
   *
   * @default false
   */
  loading?: boolean | undefined;

  /**
   * The right icon to apply to the button.
   *
   * @default undefined
   */
  rightIcon?: any;

  /**
   * The roundedness of the button.
   *
   * @default "none"
   */
  rounded?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl" | "full";

  /**
   * The size of the button.
   *
   * @default "md"
   */
  size?: "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

  /**
   * The variant of the button.
   *
   * @default "flat"
   */
  variant?: "flat" | "light" | "solid" | "outline";
}

export interface ButtonSlots {
  /**
   * The slot to apply to the append.
   */
  append?: Component | undefined;

  /**
   * The slot to apply to the default.
   */
  default?: Component | undefined;

  /**
   * The slot to apply to the prepend.
   */
  prepend?: Component | undefined;
}
