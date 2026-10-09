// ** Core Imports
import type {
  ChartColorRangeAxis,
  ChartCurve,
  ChartDatum,
  ChartReference,
  ChartStep,
} from "@bridge-ui/core/Domain";

// ** Local Imports
import type { ChartColorRangeOption, ChartColorValue } from "@/Utils/Charts";

/**
 * One line registered on the nearest `ChartLine`, or drawn over the bars of
 * a `ChartBar`. Renders nothing. Unset options fall back to the root props.
 */
export interface ChartLineSeriesOwnProps {
  /**
   * Fills the area under the line.
   *
   * @default ChartLine `area`
   */
  area?: boolean;

  /**
   * Opacity (`0`–`1`) of the area fill.
   *
   * @default ChartLine `areaOpacity` (0.15)
   */
  areaOpacity?: number;

  /**
   * Series color (token key or CSS color). Falls back to the palette.
   *
   * @default undefined
   */
  color?: ChartColorValue;

  /**
   * What `colorRanges` match: each point's value, or its category index.
   *
   * @default "value"
   */
  colorBy?: ChartColorRangeAxis;

  /**
   * Recolors the line (and its area) piece by piece: values in
   * `[min, max)` take the range color. With `colorBy="category"`, `min`
   * and `max` are category indices (both included). Points outside every
   * range keep `color`. Range labels show in the tooltip and data table.
   *
   * @default undefined
   */
  colorRanges?: ChartColorRangeOption[];

  /**
   * Line interpolation.
   *
   * @default ChartLine `curve`
   */
  curve?: ChartCurve;

  /**
   * Dashed stroke (targets, forecasts).
   *
   * @default false
   */
  dashed?: boolean;

  /**
   * One value per `ChartLine` category. `null` renders a gap.
   */
  data: ChartDatum[];

  /**
   * Shows value labels on the points.
   *
   * @default ChartLine `labels`
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
   * Always draws point symbols.
   *
   * @default ChartLine `showPoints`
   */
  showPoints?: boolean;

  /**
   * Stack key. Series with the same key stack.
   *
   * @default ChartLine `stack`
   */
  stack?: string;

  /**
   * Step line mode.
   *
   * @default ChartLine `step`
   */
  step?: ChartStep;
}

/**
 * `ChartLineSeries` has no DOM element, so it takes no HTML attributes.
 */
export type ChartLineSeriesProps = ChartLineSeriesOwnProps;
