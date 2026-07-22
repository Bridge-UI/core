// ** External Imports
import type { HTMLAttributes } from "vue";

// ** Core Imports
import type {
  MergeHtmlProps,
  MergeProps,
  SkeletonRounded,
} from "@bridge-ui/core";

export interface SkeletonRoundedOverrides {}

export interface SkeletonClasses {
  /**
   * The classes to apply to the root.
   */
  root?: string;
}

export interface SkeletonOwnProps {
  /**
   * The classes to apply to the skeleton.
   *
   * @default undefined
   */
  classes?: SkeletonClasses;

  /**
   * The roundedness of the skeleton.
   *
   * @default "md"
   */
  rounded?: MergeProps<SkeletonRounded, SkeletonRoundedOverrides>;
}

export type SkeletonProps = MergeHtmlProps<SkeletonOwnProps, HTMLAttributes>;
