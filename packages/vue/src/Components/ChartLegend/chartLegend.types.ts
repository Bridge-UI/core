// ** External Imports
import type { ButtonHTMLAttributes, HTMLAttributes } from "vue";

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
   * Classes merged onto the legend list.
   */
  root?: string;

  /**
   * Classes merged onto each color swatch.
   */
  swatch?: string;
}

export interface ChartLegendCustomProps {
  /**
   * Props forwarded to each legend entry (`button` when interactive).
   *
   * @default undefined
   */
  item?: ButtonHTMLAttributes;

  /**
   * Props forwarded to the legend list.
   *
   * @default undefined
   */
  root?: HTMLAttributes;
}

/**
 * Series legend for the nearest `Chart`. Entries toggle series visibility.
 */
export interface ChartLegendOwnProps {
  /**
   * Horizontal alignment of the entries.
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
   * When true, entries are buttons that show / hide their series and
   * emphasize it on hover or focus.
   *
   * @default true
   */
  interactive?: boolean;

  /**
   * Places the legend above or below the plot.
   *
   * @default "bottom"
   */
  position?: "top" | "bottom";
}

export type ChartLegendProps = MergeHtmlProps<
  ChartLegendOwnProps,
  HTMLAttributes
>;
