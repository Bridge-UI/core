// ** External Imports
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

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
   * The children to render.
   *
   * @default undefined
   */
  children?: ReactNode;

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
   * The slots to apply to the link.
   *
   * @default undefined
   */
  slots?: LinkSlots;

  /**
   * The underline behavior of the link.
   *
   * @default "hover"
   */
  underline?: "hover" | "always" | "none";
}

export interface LinkSlots {
  /**
   * The slot for the append content.
   */
  append?: ReactNode;

  /**
   * The slot for the prepend content.
   */
  prepend?: ReactNode;
}
