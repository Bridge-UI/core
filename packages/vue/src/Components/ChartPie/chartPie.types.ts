// ** External Imports
import type { HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type {
  ChartLabelContent,
  ChartLabels,
  ChartPieVariant,
  ChartSlice,
} from "@bridge-ui/core/Domain";
import type { MergeHtmlProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  ChartColorValue,
  ChartRootOwnProps,
  ChartSlots,
} from "@/Utils/Chart";

/**
 * Pie / donut chart root. Takes its slices from `data`; compose with
 * `ChartLegend` and `ChartTooltip`.
 */
export interface ChartPieOwnProps extends ChartRootOwnProps {
  /**
   * Slices in order. Non-positive values are skipped.
   */
  data: ChartPieSlice[];

  /**
   * What plot labels show: `"label"`, `"value"`, `"percent"`, or custom text.
   *
   * @default "label"
   */
  labelContent?: ChartLabelContent;

  /**
   * Slice labels on the plot. Legend labels come from `ChartLegend`.
   *
   * @default false
   */
  labels?: ChartLabels;

  /**
   * Keeps the largest `maxSlices - 1` slices and groups the rest into an
   * "Other" slice.
   *
   * @default undefined
   */
  maxSlices?: number;

  /**
   * Minimum slice angle (deg) so tiny slices stay visible.
   *
   * @default 2
   */
  minAngle?: number;

  /**
   * Donut ring thickness as a fraction of the radius (`0`–`1`).
   *
   * @default 0.3
   */
  thickness?: number;

  /**
   * `donut` leaves a hole for the `center` slot.
   *
   * @default "pie"
   */
  variant?: ChartPieVariant;
}

/**
 * One slice: label, value, and an optional color (token key or CSS color).
 */
export interface ChartPieSlice extends Omit<ChartSlice, "color"> {
  /**
   * Slice color. Falls back to the palette.
   */
  color?: ChartColorValue;
}

export interface ChartPieSlots extends ChartSlots {
  /**
   * Content centered in the donut hole (totals, captions).
   */
  center?: Slot<undefined>;
}

export type ChartPieProps = MergeHtmlProps<ChartPieOwnProps, HTMLAttributes>;
