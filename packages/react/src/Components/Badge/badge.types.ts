// ** External Imports
import type { HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type {
  BadgeColor,
  BadgeDensity,
  BadgeRounded,
  BadgeSize,
  BadgeVariant,
  MergeHtmlProps,
  MergeProps,
} from "@bridge-ui/core";

export interface BadgeSizeOverrides {}
export interface BadgeColorOverrides {}
export interface BadgeDensityOverrides {}
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
  classes?: BadgeClasses;

  /**
   * The color to apply to the badge.
   *
   * @default "primary"
   */
  color?: MergeProps<BadgeColor, BadgeColorOverrides>;

  /**
   * The density of the badge.
   *
   * @default "default"
   */
  density?: MergeProps<BadgeDensity, BadgeDensityOverrides>;

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

export type BadgeProps = MergeHtmlProps<
  BadgeOwnProps,
  HTMLAttributes<HTMLSpanElement>
>;
