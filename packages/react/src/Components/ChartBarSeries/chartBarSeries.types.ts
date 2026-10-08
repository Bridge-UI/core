// ** Core Imports
import type { ChartDatum, ChartReference } from "@bridge-ui/core/Domain";

// ** Local Imports
import type { ChartColorValue } from "@/Utils/Chart";

/**
 * One bar series registered on the nearest `ChartBar`. Renders nothing.
 * Unset options fall back to the `ChartBar` props.
 */
export interface ChartBarSeriesOwnProps {
  /**
   * Series color (token key or CSS color). Falls back to the palette.
   *
   * @default undefined
   */
  color?: ChartColorValue;

  /**
   * One value per `ChartBar` category. `null` leaves the slot empty.
   */
  data: ChartDatum[];

  /**
   * Shows value labels on the bars.
   *
   * @default ChartBar `labels`
   */
  labels?: boolean;

  /**
   * Series name shown in the legend, tooltip, and data table.
   */
  name: string;

  /**
   * Reference lines: `{ type: "average" | "min" | "max" }` or
   * `{ value }`, each with an optional `label`.
   *
   * @default undefined
   */
  reference?: ChartReference | ChartReference[];

  /**
   * Stack key. Series with the same key stack.
   *
   * @default ChartBar `stack`
   */
  stack?: string;
}

/**
 * `ChartBarSeries` has no DOM element, so it takes no HTML attributes.
 */
export type ChartBarSeriesProps = ChartBarSeriesOwnProps;
