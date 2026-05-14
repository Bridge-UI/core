// ** External Imports
import type { ReactNode } from "react";

// ** Core Imports
import type {
  BadgeColor,
  BadgeRounded,
  BadgeSize,
  BadgeVariant,
  MergeProps,
} from "@bridge-ui/core";

export interface BadgeSizeOverrides {}
export interface BadgeColorOverrides {}
export interface BadgeRoundedOverrides {}
export interface BadgeVariantOverrides {}

export interface BadgeClasses {
  /**
   * The classes to apply to the root.
   */
  root?: string;
}

export interface BadgeProps {
  /**
   * The children to render.
   *
   * @default undefined
   */
  children?: ReactNode;

  /**
   * The classes to apply to the badge.
   *
   * @default undefined
   */
  classes?: BadgeClasses;

  /**
   * The color to apply to the badge.
   *
   * @default "primary"
   */
  color?: MergeProps<BadgeColor, BadgeColorOverrides>;

  /**
   * The roundedness of the badge.
   *
   * @default "full"
   */
  rounded?: MergeProps<BadgeRounded, BadgeRoundedOverrides>;

  /**
   * The size of the badge.
   *
   * @default "sm"
   */
  size?: MergeProps<BadgeSize, BadgeSizeOverrides>;

  /**
   * The variant of the badge.
   *
   * @default "flat"
   */
  variant?: MergeProps<BadgeVariant, BadgeVariantOverrides>;
}
