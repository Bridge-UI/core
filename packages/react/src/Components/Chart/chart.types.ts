// ** External Imports
import type { HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type { ChartColor, ChartSize } from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

export interface ChartSizeOverrides {}
export interface ChartColorOverrides {}

/**
 * Series color: a Chart color token key (`"primary"`, `"info"`, …) or any
 * CSS color (`"#6366f1"`, `"rgb(0 0 0)"`, `"var(--brand)"`).
 */
export type ChartSeriesColor =
  (string & {}) | MergeProps<ChartColor, ChartColorOverrides>;

export interface ChartClasses {
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
  plot?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the root element.
   *
   * @default undefined
   */
  root?: HTMLAttributes<HTMLDivElement>;
}

/**
 * Chart root. Compose with `ChartSeries`, `ChartAxis`, `ChartLegend`,
 * and `ChartTooltip`. The plot is drawn by ECharts.
 */
export interface ChartOwnProps {
  /**
   * Enables engine transitions. Always off under `prefers-reduced-motion`.
   *
   * @default true
   */
  animation?: boolean;

  /**
   * Category labels for the x axis. Each series has one value per category.
   */
  categories: string[];

  /**
   * Chart parts (`ChartSeries`, `ChartAxis`, `ChartLegend`, `ChartTooltip`).
   *
   * @default undefined
   */
  children?: ReactNode;

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
   * Series colors used in order when a `ChartSeries` omits `color`.
   *
   * @default ["primary", "info", "success", "warning", "error", "secondary", "dark"]
   */
  palette?: ChartSeriesColor[];

  /**
   * Density of axis labels, legend, and tooltip.
   *
   * @default "md"
   */
  size?: MergeProps<ChartSize, ChartSizeOverrides>;

  /**
   * Custom empty and loading content.
   *
   * @default undefined
   */
  slots?: ChartSlots;

  /**
   * Accessible description of the plot. Defaults to a generated summary
   * (series names and category range).
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
   * Content shown when there is nothing to plot.
   */
  empty?: ReactNode;

  /**
   * Content shown while `loading` is true.
   */
  loading?: ReactNode;
}

export type ChartProps = MergeHtmlProps<
  ChartOwnProps,
  HTMLAttributes<HTMLDivElement>
>;
