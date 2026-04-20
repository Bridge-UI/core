export interface IconSizeOverrides {}

export type IconProps = {
  /**
   * The classes to apply to the icon.
   */
  class?: string | undefined;

  /**
   * Lucide icon component.
   */
  icon: any;

  /**
   * The size of the icon.
   *
   * @default "md"
   */
  size?: "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
};
