// ** External Imports
import type { ReactNode } from "react";

// ** Core Imports
import type {
  BadgeColor,
  BadgeRounded,
  BadgeVariant,
  MergeProps,
  MiniBadgeSize,
} from "@bridge-ui/core";

export interface MiniBadgeSizeOverrides {}
export interface MiniBadgeColorOverrides {}
export interface MiniBadgeRoundedOverrides {}
export interface MiniBadgeVariantOverrides {}

export interface MiniBadgeClasses {
  /**
   * The classes to apply to the root.
   */
  root?: string;
}

export interface MiniBadgeProps {
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
  classes?: MiniBadgeClasses;

  /**
   * The color to apply to the badge.
   *
   * @default "primary"
   */
  color?: MergeProps<BadgeColor, MiniBadgeColorOverrides>;

  /**
   * The roundedness of the badge.
   *
   * @default "full"
   */
  rounded?: MergeProps<BadgeRounded, MiniBadgeRoundedOverrides>;

  /**
   * The size of the badge.
   *
   * @default "xs"
   */
  size?: MergeProps<MiniBadgeSize, MiniBadgeSizeOverrides>;

  /**
   * The variant of the badge.
   *
   * @default "flat"
   */
  variant?: MergeProps<BadgeVariant, MiniBadgeVariantOverrides>;
}
