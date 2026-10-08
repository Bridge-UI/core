// ** External Imports
import type { HTMLAttributes } from "vue";

// ** Core Imports
import type {
  ChartFunnelAlign,
  ChartFunnelSort,
  ChartLabelContent,
  ChartLabelPosition,
  ChartSlice,
} from "@bridge-ui/core/Domain";
import type { MergeHtmlProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { ChartColorValue, ChartRootOwnProps } from "@/Utils/Charts";

/**
 * Funnel chart root. Takes its stages from `data`; compose with
 * `ChartLegend` and `ChartTooltip`.
 */
export interface ChartFunnelOwnProps extends ChartRootOwnProps {
  /**
   * Shape alignment.
   *
   * @default "center"
   */
  align?: ChartFunnelAlign;

  /**
   * Stages. Percents compare each stage to the largest one.
   */
  data: ChartFunnelStage[];

  /**
   * What plot labels show: `"label"`, `"value"`, `"percent"`, or custom text.
   *
   * @default "label"
   */
  labelContent?: ChartLabelContent;

  /**
   * Where plot labels sit when `labels` is on.
   *
   * @default "inside"
   */
  labelPosition?: ChartLabelPosition;

  /**
   * Shows stage labels on the plot. Legend labels come from `ChartLegend`.
   *
   * @default true
   */
  labels?: boolean;

  /**
   * Stage order, top to bottom. `"none"` keeps the `data` order.
   *
   * @default "descending"
   */
  sort?: ChartFunnelSort;
}

/**
 * One stage: label, value, and an optional color (token key or CSS color).
 */
export interface ChartFunnelStage extends Omit<ChartSlice, "color"> {
  /**
   * Stage color. Falls back to the palette.
   */
  color?: ChartColorValue;
}

export type ChartFunnelProps = MergeHtmlProps<
  ChartFunnelOwnProps,
  HTMLAttributes
>;
