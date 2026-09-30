// ** Core Imports
import type { ChartCurve, ChartDatum, ChartType } from "@bridge-ui/core/Domain";

// ** Local Imports
import type { ChartSeriesColor } from "@/Components/Chart/chart.types";

/**
 * One data series registered on the nearest `Chart`. Renders nothing.
 */
export interface ChartSeriesOwnProps {
  /**
   * Series color (token key or CSS color). Falls back to the `Chart` palette.
   *
   * @default undefined
   */
  color?: ChartSeriesColor;

  /**
   * Line interpolation for `line` / `area` series.
   *
   * @default "linear"
   */
  curve?: ChartCurve;

  /**
   * One value per `Chart` category. `null` renders a gap.
   */
  data: ChartDatum[];

  /**
   * Series name shown in the legend, tooltip, and data table.
   */
  name: string;

  /**
   * Series family.
   *
   * @default "line"
   */
  type?: ChartType;
}

/**
 * `ChartSeries` has no DOM element, so it takes no HTML attributes.
 */
export type ChartSeriesProps = ChartSeriesOwnProps;
