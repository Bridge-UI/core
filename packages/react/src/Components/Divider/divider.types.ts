// ** External Imports
import type { HTMLAttributes } from "react";

// ** Core Imports
import type {
  DividerColor,
  DividerOrientation,
  MergeHtmlProps,
  MergeProps,
} from "@bridge-ui/core";

export interface DividerColorOverrides {}
export interface DividerOrientationOverrides {}

export interface DividerClasses {
  /**
   * The classes to apply to the root.
   */
  root?: string;
}

export interface DividerOwnProps {
  /**
   * The classes to apply to the divider.
   *
   * @default undefined
   */
  classes?: DividerClasses;

  /**
   * The color of the divider.
   *
   * @default "dark"
   */
  color?: MergeProps<DividerColor, DividerColorOverrides>;

  /**
   * The orientation of the divider.
   *
   * @default "horizontal"
   */
  orientation?: MergeProps<DividerOrientation, DividerOrientationOverrides>;
}

export type DividerProps = MergeHtmlProps<
  DividerOwnProps,
  HTMLAttributes<HTMLHRElement>
>;
