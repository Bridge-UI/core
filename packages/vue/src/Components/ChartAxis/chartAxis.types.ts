// ** Core Imports
import type { ChartAxisPosition } from "@bridge-ui/core/Domain";

/**
 * Axis options for the nearest `Chart`. Renders nothing.
 */
export interface ChartAxisOwnProps {
  /**
   * Formats tick labels. Receives the category (`x`) or value (`y`).
   *
   * @default undefined
   */
  formatTick?: (value: number | string) => string;

  /**
   * Draws grid lines for this axis.
   *
   * @default true for `y`, false for `x`
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
   * Upper bound for the value axis (`y`). The plot picks one when omitted.
   *
   * @default undefined
   */
  max?: number;

  /**
   * Lower bound for the value axis (`y`). The plot picks one when omitted.
   *
   * @default undefined
   */
  min?: number;

  /**
   * Which axis to configure (`x` = categories, `y` = values).
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
