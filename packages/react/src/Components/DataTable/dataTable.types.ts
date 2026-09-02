// ** External Imports
import type { HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type {
  DataTableColumnBase,
  DataTableColumnClasses,
  DataTableColumnSearch,
  DataTableFilterOption,
  DataTableFilters,
  DataTableItemSlotProps,
  DataTableLoadingVariant,
  DataTablePaginationSlotProps,
  DataTablePerPageSlotProps,
  DataTableSelectedSlotProps,
  DataTableSelectionMode,
  DataTableSorting,
  DataTableStickyEdge,
  DataTableStickyHeader,
  FieldOverlayMode,
} from "@bridge-ui/core/Domain";
import type {
  TableAlign,
  TableRounded,
  TableSize,
  TableVariant,
} from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { CheckboxProps } from "@/Components/Checkbox/checkbox.types";
import type { DataTablePaginationProps } from "@/Components/DataTable/dataTablePagination.types";
import type { ProgressProps } from "@/Components/Progress/progress.types";
import type { RadioProps } from "@/Components/Radio/radio.types";
import type { SelectProps } from "@/Components/Select/select.types";
import type {
  TableAlignOverrides,
  TableRoundedOverrides,
  TableSizeOverrides,
  TableVariantOverrides,
} from "@/Components/Table/table.types";
import type { TextFieldProps } from "@/Components/TextField/textField.types";

export type {
  DataTableColumnBase,
  DataTableColumnClasses,
  DataTableColumnSearch,
  DataTableFilterOption,
  DataTableFilters,
  DataTableItemSlotProps,
  DataTableLoadingVariant,
  DataTablePaginationSlotProps,
  DataTablePerPageSlotProps,
  DataTableSelectedSlotProps,
  DataTableSelectionMode,
  DataTableSorting,
  DataTableStickyEdge,
  DataTableStickyHeader,
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
  align?: MergeProps<TableAlign, TableAlignOverrides>;

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
   * Called when per-column text search queries change.
   *
   * @default undefined
   */
  onColumnSearchChange?: (search: DataTableColumnSearch) => void;

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
   * Called when the page size changes. DataTable also resets to page 1.
   *
   * @default undefined
   */
  onPerPageChange?: (perPage: number) => void;

  /**
   * Called when the toolbar search query changes.
   *
   * @default undefined
   */
  onSearchChange?: (query: string) => void;

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
   * Classes merged onto the footer region below the table.
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
   * Classes merged onto the chrome footer (selection, per-page, pager).
   */
  pagination?: string;

  /**
   * Classes merged onto the per-page Select.
   */
  perPage?: string;

  /**
   * Classes merged onto the DataTable root.
   */
  root?: string;

  /**
   * Classes merged onto rows.
   */
  row?: string;

  /**
   * Classes merged onto the toolbar search field.
   */
  search?: string;

  /**
   * Classes merged onto the selection summary in the chrome footer.
   */
  selected?: string;

  /**
   * Classes merged onto the `<table>` element.
   */
  table?: string;

  /**
   * Classes merged onto the toolbar region.
   */
  toolbar?: string;

  /**
   * Classes merged onto the table wrapper (`Table` root).
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
   * Props forwarded to the footer region below the table.
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
   * Extra props for the built-in chrome pager (first / previous / next / last).
   *
   * @default undefined
   */
  pagination?: Partial<
    Omit<DataTablePaginationProps, "page" | "count" | "onChange">
  >;

  /**
   * Extra props for the built-in per-page `Select`.
   *
   * @default undefined
   */
  perPage?: Partial<Omit<SelectProps, "value" | "options" | "onChange">>;

  /**
   * Extra props for the built-in `Progress` (`loadingVariant="bar"`).
   *
   * @default undefined
   */
  progress?: Partial<ProgressProps>;

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
   * Extra props for the toolbar search field.
   *
   * @default undefined
   */
  search?: Partial<Omit<TextFieldProps, "value" | "onChange">>;

  /**
   * Props forwarded to the selection summary in the chrome footer.
   *
   * @default undefined
   */
  selected?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the `<table>` element.
   *
   * @default undefined
   */
  table?: HTMLAttributes<HTMLTableElement>;

  /**
   * Props forwarded to the toolbar region.
   *
   * @default undefined
   */
  toolbar?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the table wrapper (`Table` root).
   *
   * @default undefined
   */
  wrapper?: HTMLAttributes<HTMLDivElement>;
}

/**
 * Opinionated data table. Compose with `columns` / `rows`.
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
   * Controlled per-column text search: column id → query. Set `searchable`
   * on a column to show the field in that header's filter menu.
   *
   * @default undefined
   */
  columnSearch?: DataTableColumnSearch;

  /**
   * Overlay shell for the column visibility panel. `auto` uses `menu` on
   * desktop and `drawer` on mobile.
   *
   * @default "auto"
   */
  columnsOverlay?: FieldOverlayMode;

  /**
   * Shows Reset / OK on the column visibility overlay. Unset defaults to
   * `true` for `modal` / `drawer` shells (`false` for `menu`). Selection
   * stays draft until OK.
   *
   * @default undefined
   */
  columnsShowFooter?: boolean;

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
   * Overlay shell for column filter panels. `auto` uses `menu` on desktop
   * and `drawer` on mobile.
   *
   * @default "auto"
   */
  filterOverlay?: FieldOverlayMode;

  /**
   * Controlled column filters: column id → selected option values.
   *
   * @default undefined
   */
  filters?: DataTableFilters;

  /**
   * Stretch the table to at least the wrapper width. When `false`, the
   * wrapper hugs column content, and pagination / per-page follow that width.
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
   * How `loading` is shown. `overlay` dims the table; `bar` dims the table
   * and draws a progress line under the header.
   *
   * @default "overlay"
   */
  loadingVariant?: DataTableLoadingVariant;

  /**
   * Controlled page for the built-in chrome pager (1-based).
   *
   * @default undefined
   */
  page?: number;

  /**
   * Total pages for the built-in chrome pager. Use this or `totalCount`.
   *
   * @default undefined
   */
  pageCount?: number;

  /**
   * Page size. With `page` and no `pageCount`/`totalCount`, slices `rows`
   * locally. With server paging, only drives the per-page Select.
   *
   * @default undefined
   */
  perPage?: number;

  /**
   * Options for the built-in per-page Select.
   *
   * @default [10, 25, 50, 100]
   */
  perPageOptions?: number[];

  /**
   * Corner radius of the table wrapper, header, and footer.
   *
   * @default "lg"
   */
  rounded?: MergeProps<TableRounded, TableRoundedOverrides>;

  /**
   * Current page of data (or the full set when not paging on the server).
   *
   * @default []
   */
  rows?: T[];

  /**
   * Controlled toolbar search query. Filters visible columns client-side,
   * or emits `onSearchChange` only when server-paged.
   *
   * @default undefined
   */
  search?: string;

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
  size?: MergeProps<TableSize, TableSizeOverrides>;

  /**
   * `empty`, `expanded`, `footer`, `item`, `loading`, `pagination`, `perPage`,
   * `search`, `selected`, `toolbar`, and `toolbarActions` regions.
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
   * Stick header cells to the page (`true`) or inside the wrapper (`"boxed"`).
   * For boxed, set a max height on `classes.wrapper` or `classes.root`.
   *
   * @default false
   */
  stickyHeader?: DataTableStickyHeader;

  /**
   * Alternating body row surfaces.
   *
   * @default false
   */
  striped?: boolean;

  /**
   * Total item count when the app owns paging. Derives page count with
   * `perPage`. Use this or `pageCount`, not both (`pageCount` wins).
   *
   * @default undefined
   */
  totalCount?: number;

  /**
   * Chrome treatment (`plain` / `ghost` / `bordered`).
   *
   * @default "plain"
   */
  variant?: MergeProps<TableVariant, TableVariantOverrides>;
}

export interface DataTableSlots<T = unknown> {
  /**
   * Shown when `rows` is empty.
   */
  empty?: ReactNode;

  /**
   * Rendered in a spanning row when a row is expanded.
   */
  expanded?: (row: T) => ReactNode;

  /**
   * Region below the table, above the chrome footer.
   */
  footer?: ReactNode;

  /**
   * Per-column cells. `item.role` overrides `columns[].cell` for `id: "role"`.
   */
  item?: {
    [columnId: string]: (props: DataTableItemSlotProps<T>) => ReactNode;
  };

  /**
   * Indicator shown when `loading` is set. Overlay defaults to a spin; bar
   * defaults to `Progress` under the header.
   */
  loading?: ReactNode;

  /**
   * Replaces the built-in chrome pager. A function receives page / count /
   * `onPageChange`.
   */
  pagination?: ReactNode | ((props: DataTablePaginationSlotProps) => ReactNode);

  /**
   * Replaces the built-in per-page Select. A function receives `perPage` /
   * options / `onPerPageChange`.
   */
  perPage?: ReactNode | ((props: DataTablePerPageSlotProps) => ReactNode);

  /**
   * Replaces the toolbar search field.
   */
  search?: ReactNode;

  /**
   * Replaces the selection summary (`selected of total`). A function receives
   * `selectedCount` / `totalCount`.
   */
  selected?: ReactNode | ((props: DataTableSelectedSlotProps) => ReactNode);

  /**
   * Leading toolbar region (left of Columns / Search).
   */
  toolbar?: ReactNode;

  /**
   * Extra controls beside Columns and Search in the toolbar end cluster.
   */
  toolbarActions?: ReactNode;
}

export type DataTableProps<T = unknown> = MergeHtmlProps<
  DataTableOwnProps<T> & DataTableCallbacks,
  HTMLAttributes<HTMLDivElement>
>;
