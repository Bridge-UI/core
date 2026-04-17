export interface AlertColorOverrides {}
export interface AlertShadowOverrides {}
export interface AlertPaddingOverrides {}
export interface AlertRoundedOverrides {}
export interface AlertVariantOverrides {}

export interface AlertProps {
  /**
   * The children to render.
   *
   * @default undefined
   */
  children?: any;

  /**
   * The classes to apply to the alert.
   *
   * @default undefined
   */
  classes?: any;

  /**
   * The color to apply to the alert.
   *
   * @default undefined
   */
  color?: any;

  /**
   * The icon to apply to the alert.
   *
   * @default undefined
   */
  icon?: any;

  /**
   * The padding to apply to the alert.
   *
   * @default "none"
   */
  padding?: "none" | "small" | "medium" | "large";

  /**
   * The roundedness of the alert.
   *
   * @default "none"
   */
  rounded?: "none" | "xs" | "sm" | "base" | "md" | "lg" | "xl" | "xxl" | "xxxl" | "full";

  /**
   * The shadow to apply to the alert.
   *
   * @default "none"
   */
  shadow?: "none" | "xs" | "sm" | "base" | "md" | "lg" | "xl" | "xxl" | "inner";

  /**
   * The title to apply to the alert.
   *
   * @default undefined
   */
  title?: string | undefined;

  /**
   * The variant of the alert.
   *
   * @default "flat"
   */
  variant?: "flat" | "solid" | "outline";
}
