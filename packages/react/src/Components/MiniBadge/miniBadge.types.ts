// ** External Imports
import type { HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type {
  BadgeColor,
  BadgeRounded,
  BadgeVariant,
  MergeHtmlProps,
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

export interface MiniBadgeOwnProps {
  /**
   * The children to render.
   *
   * @default undefined
   */
  children?: ReactNode;

  /**
   * Extra classes merged with the root element (and `classes.root`).
   *
   * @default undefined
   */
  className?: string;

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

export type MiniBadgeProps = MergeHtmlProps<
  MiniBadgeOwnProps,
  HTMLAttributes<HTMLSpanElement>
>;
