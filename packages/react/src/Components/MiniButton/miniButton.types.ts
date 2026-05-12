// ** External Imports
import { Component } from "vue";

export interface MiniButtonSizeOverrides {}
export interface MiniButtonColorOverrides {}
export interface MiniButtonRoundedOverrides {}
export interface MiniButtonVariantOverrides {}

export interface MiniButtonClasses {
  /**
   * The classes to apply to the icon.
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
}

export interface MiniButtonProps {
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
  classes?: MiniButtonClasses;

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
  disabled?: boolean;

  /**
   * The href to apply to the button.
   *
   * @default undefined
   */
  href?: string;

  /**
   * The icon to apply to the button.
   *
   * @default undefined
   */
  icon?: any;

  /**
   * Whether the button is loading.
   *
   * @default false
   */
  loading?: boolean;

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

export interface MiniButtonSlots {
  /**
   * The slot to apply to the default.
   */
  default?: Component;
}
