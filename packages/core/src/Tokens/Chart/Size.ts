/**
 * Per-token sizing for chart chrome (axis labels, legend, tooltip).
 */
export interface ChartSizeItem {
  /**
   * Legend container gap and typography.
   */
  "legend": string;

  /**
   * Gap and padding for each legend entry.
   */
  "legendItem": string;

  /**
   * Root typography. Its computed font size drives axis labels.
   */
  "root": string;

  /**
   * Color swatch size (legend and tooltip).
   */
  "swatch": string;

  /**
   * Tooltip padding, gap, and typography.
   */
  "tooltip": string;
}

/**
 * Chart size scale (`xs` … `lg`).
 */
export interface ChartSize {
  /**
   * Large size token.
   */
  "lg": ChartSizeItem;

  /**
   * Medium size token (default).
   */
  "md": ChartSizeItem;

  /**
   * Small size token.
   */
  "sm": ChartSizeItem;

  /**
   * Extra small size token.
   */
  "xs": ChartSizeItem;
}

export const sizeProps: ChartSize = {
  "sm": {
    "swatch": "size-2",
    "root": "text-2xs",
    "legendItem": "gap-1 px-1 py-0.5",
    "legend": "gap-x-3 gap-y-1 text-xs",
    "tooltip": "gap-1 px-2.5 py-1.5 text-xs",
  },
  "md": {
    "root": "text-xs",
    "swatch": "size-2.5",
    "legend": "gap-x-4 gap-y-1 text-sm",
    "tooltip": "gap-1 px-3 py-2 text-sm",
    "legendItem": "gap-1.5 px-1.5 py-0.5",
  },
  "xs": {
    "root": "text-2xs",
    "swatch": "size-1.5",
    "legendItem": "gap-1 px-1 py-0.5",
    "legend": "gap-x-2 gap-y-0.5 text-2xs",
    "tooltip": "gap-0.5 px-2 py-1 text-2xs",
  },
  "lg": {
    "root": "text-sm",
    "swatch": "size-3",
    "legendItem": "gap-2 px-2 py-1",
    "legend": "gap-x-5 gap-y-1.5 text-base",
    "tooltip": "gap-1.5 px-3.5 py-2.5 text-base",
  },
};
