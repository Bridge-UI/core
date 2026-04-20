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
  icon?: string | undefined;

  /**
   * The classes to apply to the loading.
   */
  loading?: string | undefined;

  /**
   * The classes to apply to the root.
   */
  root?: string | undefined;
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
  classes?: MiniButtonClasses | undefined;

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
   * The href to apply to the button.
   *
   * @default undefined
   */
  href?: string | undefined;

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
  loading?: boolean | undefined;

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
  default?: Component | undefined;
}
