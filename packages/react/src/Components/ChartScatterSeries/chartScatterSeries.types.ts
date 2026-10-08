// ** Core Imports
import type { ChartScatterPoint } from "@bridge-ui/core/Domain";

// ** Local Imports
import type { ChartColorValue } from "@/Utils/Chart";

/**
 * One group of points registered on the nearest `ChartScatter`.
 * Renders nothing.
 */
export interface ChartScatterSeriesOwnProps {
  /**
   * Series color (token key or CSS color). Falls back to the palette.
   *
   * @default undefined
   */
  color?: ChartColorValue;

  /**
   * Points: `[x, y]`, or `[x, y, size]` for bubbles.
   */
  data: ChartScatterPoint[];

  /**
   * Series name shown in the legend, tooltip, and data table.
   */
  name: string;

  /**
   * Label for the third value (bubble size) in the tooltip and data table.
   *
   * @default "Size"
   */
  sizeName?: string;

  /**
   * Point diameter (px) for `[x, y]` points. Ignored for bubbles.
   *
   * @default ChartScatter `symbolSize`
   */
  symbolSize?: number;
}

/**
 * `ChartScatterSeries` has no DOM element, so it takes no HTML attributes.
 */
export type ChartScatterSeriesProps = ChartScatterSeriesOwnProps;
