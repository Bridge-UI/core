// ** External Imports
import type { HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type {
  ToggleGroupColor,
  ToggleGroupOrientation,
  ToggleGroupRounded,
  ToggleGroupSize,
  ToggleGroupValue,
  ToggleGroupVariant,
} from "@bridge-ui/core/Tokens/ToggleGroup";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

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
 * Segmented control root. Compose with `ToggleItem` children.
 */
export interface ToggleGroupOwnProps {
  /**
   * The children to render (`ToggleItem` segments).
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
  defaultValue?: ToggleGroupValue;

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
   * Allow selecting more than one segment.
   *
   * @default false
   */
  multiple?: boolean;

  /**
   * Called when the selected value changes.
   *
   * @default undefined
   */
  onChange?: (value: ToggleGroupValue) => void;

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
   * @default "md"
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
  value?: ToggleGroupValue;

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
