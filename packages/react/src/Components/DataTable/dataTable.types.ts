// ** External Imports
import type { HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type {
  DataTableColumnBase,
  DataTableSorting,
} from "@bridge-ui/core/Domain";
import type { TableSize, TableVariant } from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { CheckboxProps } from "@/Components/Checkbox/checkbox.types";
import type { PaginationProps } from "@/Components/Pagination/pagination.types";
import type { SpinnerProps } from "@/Components/Spinner/spinner.types";
import type {
  TableClasses,
  TableCustomProps,
  TableSizeOverrides,
  TableVariantOverrides,
} from "@/Components/Table/table.types";

export type { DataTableColumnBase, DataTableSorting };

/**
 * Column definition with React renderers.
 */
export type DataTableColumn<T> = DataTableColumnBase<T> & {
  /**
   * Cell renderer for a data row.
   */
  cell: (row: T) => ReactNode;

  /**
   * Header content.
   */
  header: ReactNode;
};

export interface DataTableCallbacks {
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
   * Classes merged onto the empty-state region.
   */
  empty?: string;

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
   * Classes forwarded to the composed `Table`.
   */
  table?: TableClasses;

  /**
   * Classes merged onto the toolbar region.
   */
  toolbar?: string;
}

export interface DataTableCustomProps {
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
   * Props forwarded to the DataTable root.
   *
   * @default undefined
   */
  root?: HTMLAttributes<HTMLDivElement>;

  /**
   * Extra props for the built-in `Spinner`.
   *
   * @default undefined
   */
  spinner?: Partial<SpinnerProps>;

  /**
   * Extra props forwarded to the composed `Table`.
   *
   * @default undefined
   */
  table?: TableCustomProps;

  /**
   * Props forwarded to the toolbar region.
   *
   * @default undefined
   */
  toolbar?: HTMLAttributes<HTMLDivElement>;
}

/**
 * Opinionated data grid. Compose with `columns` / `rows`; chrome comes from `Table`.
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
   * Extra props for internal parts (`table`, `pagination`, checkboxes, …).
   *
   * @default undefined
   */
  customProps?: DataTableCustomProps;

  /**
   * Stretch the composed table to at least the wrapper width.
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
   * Cell padding / type scale. Passed through to `Table`.
   *
   * @default "md"
   */
  size?: MergeProps<TableSize, TableSizeOverrides>;

  /**
   * `empty`, `loading`, `pagination`, and `toolbar` regions.
   *
   * @default undefined
   */
  slots?: DataTableSlots;

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
  variant?: MergeProps<TableVariant, TableVariantOverrides>;
}

export interface DataTableSlots {
  /**
   * Shown when `rows` is empty and the table is not loading.
   */
  empty?: ReactNode;

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
