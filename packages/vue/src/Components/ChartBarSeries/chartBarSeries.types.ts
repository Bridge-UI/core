// ** Core Imports
import type {
  ChartColorRangeAxis,
  ChartDatum,
  ChartReference,
  ChartTone,
} from "@bridge-ui/core/Domain";

// ** Local Imports
import type { ChartColorRangeOption, ChartColorValue } from "@/Utils/Charts";

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
   * What `colorRanges` match: each bar's value, or its category index.
   *
   * @default "value"
   */
  colorBy?: ChartColorRangeAxis;

  /**
   * Recolors single bars: values in `[min, max)` take the range color.
   * With `colorBy="category"`, `min` and `max` are category indices (both
   * included). Ranges win over `ChartBar` `categoryColors`. Range labels
   * show in the tooltip and data table.
   *
   * @default undefined
   */
  colorRanges?: ChartColorRangeOption[];

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

  /**
   * `muted` mixes every bar color toward the background (a comparison or
   * past period next to a `solid` series).
   *
   * @default "solid"
   */
  tone?: ChartTone;
}

/**
 * `ChartBarSeries` has no DOM element, so it takes no HTML attributes.
 */
export type ChartBarSeriesProps = ChartBarSeriesOwnProps;
