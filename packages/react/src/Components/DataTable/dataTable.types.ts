// ** External Imports
import type { HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type {
  DataTableColumnBase,
  DataTableFilterOption,
  DataTableFilters,
  DataTableItemSlotProps,
  DataTableSelectionMode,
  DataTableSorting,
  DataTableStickyEdge,
} from "@bridge-ui/core/Domain";
import type {
  DataTableAlign,
  DataTableSize,
  DataTableVariant,
} from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { CheckboxProps } from "@/Components/Checkbox/checkbox.types";
import type { PaginationProps } from "@/Components/Pagination/pagination.types";
import type { RadioProps } from "@/Components/Radio/radio.types";
import type { SpinnerProps } from "@/Components/Spinner/spinner.types";

export interface DataTableSizeOverrides {}
export interface DataTableAlignOverrides {}
export interface DataTableVariantOverrides {}

export type {
  DataTableColumnBase,
  DataTableFilterOption,
  DataTableFilters,
  DataTableItemSlotProps,
  DataTableSelectionMode,
  DataTableSorting,
  DataTableStickyEdge,
};

/**
 * Column definition with React renderers.
 */
export type DataTableColumn<T> = Omit<DataTableColumnBase<T>, "align"> & {
  /**
   * Text alignment for the header and cells.
   *
   * @default "start"
   */
  align?: MergeProps<DataTableAlign, DataTableAlignOverrides>;

  /**
   * Cell renderer for a data row. Used when no `item.{id}` slot is set.
   * Defaults to the column accessor (or `row[id]`).
   *
   * @default undefined
   */
  cell?: (row: T) => ReactNode;

  /**
   * Header content.
   */
  header: ReactNode;

  /**
   * Footer cell for a summary row. Receives the current (filtered) rows.
   */
  summary?: (rows: T[]) => ReactNode;
};

export interface DataTableCallbacks {
  /**
   * Called when expanded row ids change.
   *
   * @default undefined
   */
  onExpandedChange?: (ids: string[]) => void;

  /**
   * Called when column filters change.
   *
   * @default undefined
   */
  onFiltersChange?: (filters: DataTableFilters) => void;

  /**
   * Called when hidden column ids change.
   *
   * @default undefined
   */
  onHiddenColumnsChange?: (ids: string[]) => void;

  /**
   * Called when the numbered page changes.
   *
   * @default undefined
   */
  onPageChange?: (page: number) => void;

  /**
   * Called when selected row ids change.
   *
   * @default undefined
   */
  onSelectionChange?: (ids: string[]) => void;

  /**
   * Called when sort changes.
   *
   * @default undefined
   */
  onSortingChange?: (sorting: DataTableSorting) => void;
}

export interface DataTableClasses {
  /**
   * Classes merged onto the body rowgroup.
   */
  body?: string;

  /**
   * Classes merged onto body cells.
   */
  cell?: string;

  /**
   * Classes merged onto the empty-state region.
   */
  empty?: string;

  /**
   * Classes merged onto the summary footer rowgroup.
   */
  footer?: string;

  /**
   * Classes merged onto header cells.
   */
  head?: string;

  /**
   * Classes merged onto the header rowgroup.
   */
  header?: string;

  /**
   * Classes merged onto the loading region.
   */
  loading?: string;

  /**
   * Classes merged onto the pagination region.
   */
  pagination?: string;

  /**
   * Classes merged onto the DataTable root.
   */
  root?: string;

  /**
   * Classes merged onto rows.
   */
  row?: string;

  /**
   * Classes merged onto the grid (`role="table"`).
   */
  table?: string;

  /**
   * Classes merged onto the toolbar region.
   */
  toolbar?: string;

  /**
   * Classes merged onto the chrome wrapper.
   */
  wrapper?: string;
}

export interface DataTableCustomProps {
  /**
   * Props forwarded to the body rowgroup.
   *
   * @default undefined
   */
  body?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to body cells.
   *
   * @default undefined
   */
  cell?: HTMLAttributes<HTMLDivElement>;

  /**
   * Extra props for selection checkboxes.
   *
   * @default undefined
   */
  checkbox?: Partial<
    Omit<CheckboxProps, "checked" | "onChange" | "indeterminate">
  >;

  /**
   * Props forwarded to the empty-state region.
   *
   * @default undefined
   */
  empty?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the summary footer rowgroup.
   *
   * @default undefined
   */
  footer?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to header cells.
   *
   * @default undefined
   */
  head?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the header rowgroup.
   *
   * @default undefined
   */
  header?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the loading region.
   *
   * @default undefined
   */
  loading?: HTMLAttributes<HTMLDivElement>;

  /**
   * Extra props for the built-in `Pagination`.
   *
   * @default undefined
   */
  pagination?: Partial<Omit<PaginationProps, "page" | "count" | "onChange">>;

  /**
   * Extra props for selection radios (`selectionMode="single"`).
   *
   * @default undefined
   */
  radio?: Partial<Omit<RadioProps, "checked" | "onChange">>;

  /**
   * Props forwarded to the DataTable root.
   *
   * @default undefined
   */
  root?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to rows.
   *
   * @default undefined
   */
  row?: HTMLAttributes<HTMLDivElement>;

  /**
   * Extra props for the built-in `Spinner`.
   *
   * @default undefined
   */
  spinner?: Partial<SpinnerProps>;

  /**
   * Props forwarded to the grid (`role="table"`).
   *
   * @default undefined
   */
  table?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the toolbar region.
   *
   * @default undefined
   */
  toolbar?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the chrome wrapper.
   *
   * @default undefined
   */
  wrapper?: HTMLAttributes<HTMLDivElement>;
}

/**
 * Opinionated data grid. Compose with `columns` / `rows`.
 */
export interface DataTableOwnProps<T> {
  /**
   * Classes for DataTable regions.
   *
   * @default undefined
   */
  classes?: DataTableClasses;

  /**
   * Column definitions (Bridge shape).
   *
   * @default []
   */
  columns?: DataTableColumn<T>[];

  /**
   * Extra props for internal parts (`table`, `wrapper`, checkboxes, …).
   *
   * @default undefined
   */
  customProps?: DataTableCustomProps;

  /**
   * Controlled expanded row ids.
   *
   * @default undefined
   */
  expanded?: string[];

  /**
   * Controlled column filters: column id → selected option values.
   *
   * @default undefined
   */
  filters?: DataTableFilters;

  /**
   * Stretch the grid to at least the wrapper width.
   *
   * @default true
   */
  full?: boolean;

  /**
   * Stable row id. Required for reliable selection.
   *
   * @default undefined
   */
  getRowId?: (row: T) => string;

  /**
   * Controlled hidden column ids.
   *
   * @default undefined
   */
  hiddenColumns?: string[];

  /**
   * Row hover styles on the body.
   *
   * @default false
   */
  hoverable?: boolean;

  /**
   * Show the loading region (`aria-busy` on the table).
   *
   * @default false
   */
  loading?: boolean;

  /**
   * Controlled page for built-in numbered Pagination (1-based).
   *
   * @default undefined
   */
  page?: number;

  /**
   * Total pages for built-in numbered Pagination.
   *
   * @default undefined
   */
  pageCount?: number;

  /**
   * Current page of data (or the full set when not paging on the server).
   *
   * @default []
   */
  rows?: T[];

  /**
   * Controlled selected row ids.
   *
   * @default undefined
   */
  selection?: string[];

  /**
   * Row selection chrome: radios (`single`) or checkboxes (`multiple`).
   *
   * @default "multiple"
   */
  selectionMode?: DataTableSelectionMode;

  /**
   * Cell padding / type scale.
   *
   * @default "md"
   */
  size?: MergeProps<DataTableSize, DataTableSizeOverrides>;

  /**
   * `empty`, `expanded`, `item`, `loading`, `pagination`, and `toolbar` regions.
   *
   * @default undefined
   */
  slots?: DataTableSlots<T>;

  /**
   * Controlled sort: one column, or `null` when unsorted.
   *
   * @default undefined
   */
  sorting?: DataTableSorting;

  /**
   * Stick header cells to the nearest scrollport (usually the page).
   *
   * @default false
   */
  stickyHeader?: boolean;

  /**
   * Alternating body row surfaces.
   *
   * @default false
   */
  striped?: boolean;

  /**
   * Chrome treatment. Built-in Pagination follows the matching variant.
   *
   * @default "plain"
   */
  variant?: MergeProps<DataTableVariant, DataTableVariantOverrides>;
}

export interface DataTableSlots<T = unknown> {
  /**
   * Shown when `rows` is empty and the table is not loading.
   */
  empty?: ReactNode;

  /**
   * Rendered in a spanning row when a row is expanded.
   */
  expanded?: (row: T) => ReactNode;

  /**
   * Per-column cells. `item.role` overrides `columns[].cell` for `id: "role"`.
   */
  item?: {
    [columnId: string]: (props: DataTableItemSlotProps<T>) => ReactNode;
  };

  /**
   * Replaces the default spinner when `loading` is set.
   */
  loading?: ReactNode;

  /**
   * Replaces the built-in numbered Pagination (no auto variant).
   */
  pagination?: ReactNode;

  /**
   * Optional toolbar above the table.
   */
  toolbar?: ReactNode;
}

export type DataTableProps<T = unknown> = MergeHtmlProps<
  DataTableOwnProps<T> & DataTableCallbacks,
  HTMLAttributes<HTMLDivElement>
>;
