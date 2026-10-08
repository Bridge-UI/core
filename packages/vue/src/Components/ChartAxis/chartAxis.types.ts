// ** Core Imports
import type { ChartAxisPosition } from "@bridge-ui/core/Domain";

/**
 * Axis options for the nearest `ChartLine`, `ChartBar`, or `ChartScatter`.
 * Renders nothing.
 */
export interface ChartAxisOwnProps {
  /**
   * Formats category tick labels (the category axis of `ChartLine` and
   * `ChartBar`).
   *
   * @default undefined
   */
  formatCategory?: (category: string) => string;

  /**
   * Formats numeric tick labels: the value on a value axis, or the timestamp
   * (ms) on a time axis.
   *
   * @default undefined
   */
  formatTick?: (value: number) => string;

  /**
   * Draws grid lines for this axis.
   *
   * @default true for the value axis, false for the category axis
   */
  grid?: boolean;

  /**
   * Hides the axis line and labels.
   *
   * @default false
   */
  hidden?: boolean;

  /**
   * Axis title.
   *
   * @default undefined
   */
  label?: string;

  /**
   * Upper bound (value or time axis). The plot picks one when omitted.
   *
   * @default undefined
   */
  max?: number;

  /**
   * Lower bound (value or time axis). The plot picks one when omitted.
   *
   * @default undefined
   */
  min?: number;

  /**
   * Which axis to configure: `x` is horizontal, `y` is vertical. On a
   * horizontal `ChartBar`, categories sit on `y` and values on `x`.
   */
  position: ChartAxisPosition;

  /**
   * Preferred number of ticks (hint for the plot).
   *
   * @default undefined
   */
  tickCount?: number;
}

/**
 * `ChartAxis` has no DOM element, so it takes no HTML attributes.
 */
export type ChartAxisProps = ChartAxisOwnProps;
