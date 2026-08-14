// ** External Imports
import type { HTMLAttributes } from "react";

// ** Core Imports
import type {
  ProgressColor,
  ProgressRounded,
  ProgressSize,
  ProgressVariant,
} from "@bridge-ui/core/Tokens/Progress";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

export interface ProgressSizeOverrides {}
export interface ProgressColorOverrides {}
export interface ProgressRoundedOverrides {}
export interface ProgressVariantOverrides {}

export interface ProgressClasses {
  /**
   * The classes to apply to the primary progress bar.
   */
  bar?: string;

  /**
   * The classes to apply to the buffer bar.
   */
  buffer?: string;

  /**
   * The classes to apply to the root.
   */
  root?: string;

  /**
   * The classes to apply to the track.
   */
  track?: string;
}

export interface ProgressCustomProps {
  /**
   * Props forwarded to the primary progress bar.
   */
  bar?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the buffer bar.
   */
  buffer?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the root element.
   */
  root?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the track element.
   */
  track?: HTMLAttributes<HTMLDivElement>;
}

export interface ProgressOwnProps {
  /**
   * The classes to apply to progress parts.
   *
   * @default undefined
   */
  classes?: ProgressClasses;

  /**
   * The color of the progress indicator.
   *
   * @default "primary"
   */
  color?: MergeProps<ProgressColor, ProgressColorOverrides>;

  /**
   * Extra props for internal parts (`root`, `track`, `bar`, `buffer`).
   * Root HTML attributes stay on the component top level.
   *
   * @default undefined
   */
  customProps?: ProgressCustomProps;

  /**
   * The roundedness of the progress bar.
   *
   * @default "full"
   */
  rounded?: MergeProps<ProgressRounded, ProgressRoundedOverrides>;

  /**
   * The height size of the progress bar.
   *
   * @default "md"
   */
  size?: MergeProps<ProgressSize, ProgressSizeOverrides>;

  /**
   * Progress value from 0 to 100. Used by `determinate` and `buffer` variants.
   *
   * @default undefined
   */
  value?: number;

  /**
   * Buffer value from 0 to 100. Used by the `buffer` variant; should be ≥ `value`.
   *
   * @default undefined
   */
  valueBuffer?: number;

  /**
   * Visual variant of the progress indicator.
   *
   * @default "indeterminate"
   */
  variant?: MergeProps<ProgressVariant, ProgressVariantOverrides>;
}

export type ProgressProps = MergeHtmlProps<
  ProgressOwnProps,
  HTMLAttributes<HTMLDivElement>
>;
