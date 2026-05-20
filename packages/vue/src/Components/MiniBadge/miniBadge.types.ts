// ** External Imports
import type { HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type {
  BadgeColor,
  BadgeRounded,
  BadgeSize,
  BadgeVariant,
  MergeHtmlProps,
  MergeProps,
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
   * Extra classes merged with the root element (and `classes.root`).
   *
   * @default undefined
   */
  class?: string;

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
   * @default "md"
   */
  rounded?: MergeProps<BadgeRounded, MiniBadgeRoundedOverrides>;

  /**
   * The size of the badge.
   *
   * @default "sm"
   */
  size?: MergeProps<BadgeSize, MiniBadgeSizeOverrides>;

  /**
   * The variant of the badge.
   *
   * @default "flat"
   */
  variant?: MergeProps<BadgeVariant, MiniBadgeVariantOverrides>;
}

export interface MiniBadgeSlots {
  /**
   * The content of the badge.
   */
  default?: Slot;
}

export type MiniBadgeProps = MergeHtmlProps<MiniBadgeOwnProps, HTMLAttributes>;
