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

export interface BadgeOwnProps {
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
   * @default "md"
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

export interface BadgeSlots {
  /**
   * The content of the badge.
   */
  default?: Slot;
}

export type BadgeProps = MergeHtmlProps<BadgeOwnProps, HTMLAttributes>;
