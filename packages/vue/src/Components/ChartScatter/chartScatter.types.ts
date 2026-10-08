// ** External Imports
import type { HTMLAttributes } from "vue";

// ** Core Imports
import type { MergeHtmlProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { ChartRootOwnProps } from "@/Utils/Chart";

/**
 * Scatter / bubble chart root. Compose with `ChartScatterSeries`,
 * `ChartAxis`, `ChartLegend`, and `ChartTooltip`. Both axes are numeric.
 */
export interface ChartScatterOwnProps extends ChartRootOwnProps {
  /**
   * Min / max bubble diameter (px) for `[x, y, size]` points. Sizes scale by
   * area across all series.
   *
   * @default [8, 40]
   */
  bubbleSize?: [number, number];

  /**
   * Point diameter (px) for `[x, y]` points.
   *
   * @default 8
   */
  symbolSize?: number;
}

export type ChartScatterProps = MergeHtmlProps<
  ChartScatterOwnProps,
  HTMLAttributes
>;
