// ** External Imports
import type { HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type { ChartTooltipItem } from "@bridge-ui/core/Domain";
import type { MergeHtmlProps } from "@bridge-ui/core/Utils";

export interface ChartTooltipClasses {
  /**
   * Classes merged onto each row.
   */
  item?: string;

  /**
   * Classes merged onto each row label.
   */
  label?: string;

  /**
   * Classes merged onto each percent (pie, funnel).
   */
  percent?: string;

  /**
   * Classes merged onto the tooltip box.
   */
  root?: string;

  /**
   * Classes merged onto each color swatch.
   */
  swatch?: string;

  /**
   * Classes merged onto the title (category, series name).
   */
  title?: string;

  /**
   * Classes merged onto each formatted value.
   */
  value?: string;
}

export interface ChartTooltipContentContext {
  /**
   * Swatch color next to the title (scatter series).
   */
  color?: string;

  /**
   * Active item index (category, point, slice, or stage).
   */
  index: number;

  /**
   * Rows: series values, point dimensions, or the active slice.
   */
  items: ChartTooltipItem[];

  /**
   * Title: the category or series name. Empty for slices.
   */
  title: string;
}

export interface ChartTooltipCustomProps {
  /**
   * Props forwarded to the tooltip box.
   *
   * @default undefined
   */
  root?: HTMLAttributes;
}

/**
 * Tooltip for the active item of the nearest chart (pointer hover or arrow
 * keys on the focused plot).
 */
export interface ChartTooltipOwnProps {
  /**
   * Classes for tooltip parts.
   *
   * @default undefined
   */
  classes?: ChartTooltipClasses;

  /**
   * Extra props for the tooltip box.
   *
   * @default undefined
   */
  customProps?: ChartTooltipCustomProps;

  /**
   * Formats each percent (pie, funnel). Defaults to `Intl.NumberFormat`
   * with the Bridge locale.
   *
   * @default undefined
   */
  formatPercent?: (percent: number, item: ChartTooltipItem) => string;

  /**
   * Formats each value. Defaults to `Intl.NumberFormat` with the Bridge locale.
   *
   * @default undefined
   */
  formatValue?: (value: number, item: ChartTooltipItem) => string;
}

export interface ChartTooltipSlots {
  /**
   * Replaces the default title + rows.
   */
  content?: Slot<ChartTooltipContentContext>;
}

export type ChartTooltipProps = MergeHtmlProps<
  ChartTooltipOwnProps,
  HTMLAttributes
>;
