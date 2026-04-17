export interface ButtonSizeOverrides {}
export interface ButtonColorOverrides {}
export interface ButtonRoundedOverrides {}
export interface ButtonVariantOverrides {}

export interface ButtonProps {
  /**
   * The element to render as.
   *
   * @default "button"
   */
  as?: "a" | "span" | "button";

  /**
   * The children to render.
   *
   * @default undefined
   */
  children?: any;

  /**
   * The classes to apply to the button.
   *
   * @default undefined
   */
  classes?: any;

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
   * The icon to apply to the button.
   *
   * @default undefined
   */
  icon?: any;

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
