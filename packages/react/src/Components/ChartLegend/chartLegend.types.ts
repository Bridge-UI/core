// ** External Imports
import type { ButtonHTMLAttributes, HTMLAttributes } from "react";

// ** Core Imports
import type { MergeHtmlProps } from "@bridge-ui/core/Utils";

export interface ChartLegendClasses {
  /**
   * Classes merged onto each legend entry.
   */
  item?: string;

  /**
   * Classes merged onto each entry label.
   */
  label?: string;

  /**
   * Classes merged onto each percent column.
   */
  percent?: string;

  /**
   * Classes merged onto the legend list.
   */
  root?: string;

  /**
   * Classes merged onto each color swatch.
   */
  swatch?: string;

  /**
   * Classes merged onto each value column.
   */
  value?: string;
}

export interface ChartLegendCustomProps {
  /**
   * Props forwarded to each legend entry (`button` when interactive).
   *
   * @default undefined
   */
  item?: ButtonHTMLAttributes<HTMLButtonElement>;

  /**
   * Props forwarded to the legend list.
   *
   * @default undefined
   */
  root?: HTMLAttributes<HTMLUListElement>;
}

/**
 * Legend for the nearest chart: series (line, bar, scatter) or slices
 * (pie, funnel). Entries toggle visibility.
 */
export interface ChartLegendOwnProps {
  /**
   * Alignment of the entries along the legend.
   *
   * @default "center"
   */
  align?: "end" | "start" | "center";

  /**
   * Classes for legend parts.
   *
   * @default undefined
   */
  classes?: ChartLegendClasses;

  /**
   * Extra props for the list and entries.
   *
   * @default undefined
   */
  customProps?: ChartLegendCustomProps;

  /**
   * Formats the percent column. Defaults to `Intl.NumberFormat` with the
   * Bridge locale.
   *
   * @default undefined
   */
  formatPercent?: (percent: number) => string;

  /**
   * Formats the value column. Defaults to `Intl.NumberFormat` with the
   * Bridge locale.
   *
   * @default undefined
   */
  formatValue?: (value: number) => string;

  /**
   * When true, entries are buttons that show / hide their item and
   * emphasize it on hover or focus.
   *
   * @default true
   */
  interactive?: boolean;

  /**
   * Places the legend around the plot. `left` / `right` stack the entries
   * in a column beside the plot.
   *
   * @default "bottom"
   */
  position?: "top" | "left" | "right" | "bottom";

  /**
   * Shows each slice's share (pie, funnel).
   *
   * @default false
   */
  showPercent?: boolean;

  /**
   * Shows each slice's value (pie, funnel).
   *
   * @default false
   */
  showValue?: boolean;
}

export type ChartLegendProps = MergeHtmlProps<
  ChartLegendOwnProps,
  HTMLAttributes<HTMLUListElement>
>;
