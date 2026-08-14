// ** External Imports
import type { HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type {
  MergeHtmlProps,
  MergeProps,
  ToggleGroupColor,
  ToggleGroupOrientation,
  ToggleGroupRounded,
  ToggleGroupSize,
  ToggleGroupVariant,
} from "@bridge-ui/core";

export interface ToggleGroupSizeOverrides {}
export interface ToggleGroupColorOverrides {}
export interface ToggleGroupRoundedOverrides {}
export interface ToggleGroupVariantOverrides {}
export interface ToggleGroupOrientationOverrides {}

export interface ToggleGroupClasses {
  /**
   * Classes merged onto the root track.
   */
  root?: string;
}

export interface ToggleGroupCustomProps {
  /**
   * Props forwarded to the root element.
   *
   * @default undefined
   */
  root?: HTMLAttributes<HTMLDivElement>;
}

/**
 * Segmented control root. Compose with `Toggle` children.
 */
export interface ToggleGroupOwnProps {
  /**
   * The children to render (`Toggle` segments).
   *
   * @default undefined
   */
  children?: ReactNode;

  /**
   * Classes for toggle group parts.
   *
   * @default undefined
   */
  classes?: ToggleGroupClasses;

  /**
   * Accent color for the selected segment.
   *
   * @default "primary"
   */
  color?: MergeProps<ToggleGroupColor, ToggleGroupColorOverrides>;

  /**
   * Extra props for internal parts.
   *
   * @default undefined
   */
  customProps?: ToggleGroupCustomProps;

  /**
   * Initial selected value when uncontrolled.
   *
   * @default undefined
   */
  defaultValue?: string;

  /**
   * Disable the entire group.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Stretch the track to the container width.
   *
   * @default false
   */
  full?: boolean;

  /**
   * Called when the selected value changes.
   *
   * @default undefined
   */
  onChange?: (value: string) => void;

  /**
   * Layout orientation of the track.
   *
   * @default "horizontal"
   */
  orientation?: MergeProps<
    ToggleGroupOrientation,
    ToggleGroupOrientationOverrides
  >;

  /**
   * Track and segment roundness.
   *
   * @default "full"
   */
  rounded?: MergeProps<ToggleGroupRounded, ToggleGroupRoundedOverrides>;

  /**
   * Size of the track and segments.
   *
   * @default "md"
   */
  size?: MergeProps<ToggleGroupSize, ToggleGroupSizeOverrides>;

  /**
   * Controlled selected value.
   *
   * @default undefined
   */
  value?: string;

  /**
   * Visual style of the selected segment.
   *
   * @default "solid"
   */
  variant?: MergeProps<ToggleGroupVariant, ToggleGroupVariantOverrides>;
}

export type ToggleGroupProps = MergeHtmlProps<
  ToggleGroupOwnProps,
  HTMLAttributes<HTMLDivElement>
>;
