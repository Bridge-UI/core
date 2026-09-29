// ** External Imports
import type { HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type { ChartTooltipItem } from "@bridge-ui/core/Domain";
import type { MergeHtmlProps } from "@bridge-ui/core/Utils";

export interface ChartTooltipClasses {
  /**
   * Classes merged onto each series row.
   */
  item?: string;

  /**
   * Classes merged onto each series name.
   */
  label?: string;

  /**
   * Classes merged onto the tooltip box.
   */
  root?: string;

  /**
   * Classes merged onto each color swatch.
   */
  swatch?: string;

  /**
   * Classes merged onto the category title.
   */
  title?: string;

  /**
   * Classes merged onto each formatted value.
   */
  value?: string;
}

export interface ChartTooltipContentContext {
  /**
   * Active category label.
   */
  category: string;

  /**
   * Active category index.
   */
  index: number;

  /**
   * Visible series values at the active category.
   */
  items: ChartTooltipItem[];
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
 * Tooltip for the active category of the nearest `Chart`
 * (pointer hover or arrow keys on the focused plot).
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
