// ** External Imports
import type { LucideIcon } from "lucide-vue-next";
import type { Slot } from "vue";

// ** Core Imports
import type { LinkColor, LinkSize, MergeProps } from "@bridge-ui/core";

export interface LinkSizeOverrides {}
export interface LinkColorOverrides {}

export interface LinkClasses {
  /**
   * The classes to apply to the icon.
   */
  icon?: string;

  /**
   * The classes to apply to the root.
   */
  root?: string;
}

export interface LinkProps {
  /**
   * The classes to apply to the link.
   *
   * @default undefined
   */
  classes?: LinkClasses;

  /**
   * The color to apply to the link.
   *
   * @default "primary"
   */
  color?: MergeProps<LinkColor, LinkColorOverrides>;

  /**
   * Whether the link is disabled.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the link opens in a new tab.
   *
   * @default false
   */
  external?: boolean;

  /**
   * The URL the link points to.
   *
   * @default undefined
   */
  href?: string;

  /**
   * The icon to display before the link text.
   *
   * @default undefined
   */
  leftIcon?: LucideIcon;

  /**
   * The icon to display after the link text.
   *
   * @default undefined
   */
  rightIcon?: LucideIcon;

  /**
   * The size of the link.
   *
   * @default "md"
   */
  size?: MergeProps<LinkSize, LinkSizeOverrides>;

  /**
   * The underline behavior of the link.
   *
   * @default "hover"
   */
  underline?: "hover" | "always" | "none";
}

export interface LinkSlots {
  /**
   * Content to append after the link text.
   */
  append?: Slot<undefined>;

  /**
   * The content of the link.
   */
  default?: Slot<undefined>;

  /**
   * Content to prepend before the link text.
   */
  prepend?: Slot<undefined>;
}
