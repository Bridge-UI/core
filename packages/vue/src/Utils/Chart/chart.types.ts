// ** External Imports
import type { HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type { ChartColor, ChartSize } from "@bridge-ui/core/Tokens";
import type { MergeProps } from "@bridge-ui/core/Utils";

export interface ChartSizeOverrides {}
export interface ChartColorOverrides {}

/**
 * Chart color: a Chart color token key (`"primary"`, `"info"`, …) or any CSS
 * color (`"#6366f1"`, `"rgb(0 0 0)"`, `"var(--brand)"`).
 */
export type ChartColorValue =
  (string & {}) | MergeProps<ChartColor, ChartColorOverrides>;

export interface ChartClasses {
  /**
   * Classes merged onto the center content (`ChartPie` donut hole).
   */
  center?: string;

  /**
   * Classes merged onto the empty-state overlay.
   */
  empty?: string;

  /**
   * Classes merged onto the loading overlay.
   */
  loading?: string;

  /**
   * Classes merged onto the plot area.
   */
  plot?: string;

  /**
   * Classes merged onto the root.
   */
  root?: string;

  /**
   * Classes merged onto the data table (screen-reader only).
   */
  table?: string;
}

export interface ChartCustomProps {
  /**
   * Props forwarded to the plot area (`role="img"`, keyboard target).
   *
   * @default undefined
   */
  plot?: HTMLAttributes;

  /**
   * Props forwarded to the root element.
   *
   * @default undefined
   */
  root?: HTMLAttributes;
}

/**
 * Props shared by every chart root (`ChartLine`, `ChartBar`, `ChartScatter`,
 * `ChartPie`, `ChartFunnel`).
 */
export interface ChartRootOwnProps {
  /**
   * Enables engine transitions. Always off under `prefers-reduced-motion`.
   *
   * @default true
   */
  animation?: boolean;

  /**
   * Classes for chart parts.
   *
   * @default undefined
   */
  classes?: ChartClasses;

  /**
   * Extra props for the root and plot parts.
   *
   * @default undefined
   */
  customProps?: ChartCustomProps;

  /**
   * Plot height (`280` → `280px`, or any CSS length).
   *
   * @default 280
   */
  height?: number | string;

  /**
   * Shows the loading overlay over the plot.
   *
   * @default false
   */
  loading?: boolean;

  /**
   * Colors used in order when a series or slice omits `color`.
   *
   * @default ["primary", "info", "success", "warning", "error", "secondary", "dark"]
   */
  palette?: ChartColorValue[];

  /**
   * Density of labels, legend, and tooltip.
   *
   * @default "md"
   */
  size?: MergeProps<ChartSize, ChartSizeOverrides>;

  /**
   * Accessible description of the plot. Defaults to a generated summary.
   *
   * @default undefined
   */
  summary?: string;

  /**
   * Root width (`480` → `480px`, or any CSS length).
   *
   * @default "100%"
   */
  width?: number | string;
}

export interface ChartSlots {
  /**
   * Chart parts (series, `ChartAxis`, `ChartLegend`, `ChartTooltip`).
   */
  default?: Slot<undefined>;

  /**
   * Content shown when there is nothing to plot.
   */
  empty?: Slot<undefined>;

  /**
   * Content shown while `loading` is true.
   */
  loading?: Slot<undefined>;
}
