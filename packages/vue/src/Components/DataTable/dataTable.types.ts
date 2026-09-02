// ** External Imports
import type { HTMLAttributes, Slot, VNodeChild } from "vue";

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
import type { DataTablePaginationOwnProps } from "@/Components/DataTable/dataTablePagination.types";
import type { ProgressOwnProps } from "@/Components/Progress/progress.types";
import type { RadioProps } from "@/Components/Radio/radio.types";
import type { SelectOwnProps } from "@/Components/Select/select.types";
import type {
  TableAlignOverrides,
  TableRoundedOverrides,
  TableSizeOverrides,
  TableVariantOverrides,
} from "@/Components/Table/table.types";
import type { TextFieldOwnProps } from "@/Components/TextField/textField.types";

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
 * Column definition with Vue renderers.
 */
export type DataTableColumn<T> = Omit<DataTableColumnBase<T>, "align"> & {
  /**
   * Text alignment for the header and cells.
   *
   * @default "start"
   */
  align?: MergeProps<TableAlign, TableAlignOverrides>;

  /**
   * Cell renderer for a data row. Used when no `#item.{id}` slot is set.
   * Defaults to the column accessor (or `row[id]`).
   *
   * @default undefined
   */
  cell?: (row: T) => VNodeChild;

  /**
   * Header content.
   */
  header: VNodeChild;

  /**
   * Footer cell for a summary row. Receives the current (filtered) rows.
   */
  summary?: (rows: T[]) => VNodeChild;
};

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
  body?: HTMLAttributes;

  /**
   * Props forwarded to body cells.
   *
   * @default undefined
   */
  cell?: HTMLAttributes;

  /**
   * Extra props for selection checkboxes.
   *
   * @default undefined
   */
  checkbox?: Partial<Omit<CheckboxProps, "modelValue" | "indeterminate">>;

  /**
   * Props forwarded to the empty-state region.
   *
   * @default undefined
   */
  empty?: HTMLAttributes;

  /**
   * Props forwarded to the footer region below the table.
   *
   * @default undefined
   */
  footer?: HTMLAttributes;

  /**
   * Props forwarded to header cells.
   *
   * @default undefined
   */
  head?: HTMLAttributes;

  /**
   * Props forwarded to the header rowgroup.
   *
   * @default undefined
   */
  header?: HTMLAttributes;

  /**
   * Props forwarded to the loading region.
   *
   * @default undefined
   */
  loading?: HTMLAttributes;

  /**
   * Extra props for the built-in chrome pager (first / previous / next / last).
   *
   * @default undefined
   */
  pagination?: Partial<
    Omit<DataTablePaginationOwnProps, "count" | "modelValue">
  >;

  /**
   * Extra props for the built-in per-page `Select`.
   *
   * @default undefined
   */
  perPage?: Partial<Omit<SelectOwnProps, "options">>;

  /**
   * Extra props for the built-in `Progress` (`loadingVariant="bar"`).
   *
   * @default undefined
   */
  progress?: Partial<ProgressOwnProps>;

  /**
   * Extra props for selection radios (`selectionMode="single"`).
   *
   * @default undefined
   */
  radio?: Partial<Omit<RadioProps, "modelValue">>;

  /**
   * Props forwarded to the DataTable root.
   *
   * @default undefined
   */
  root?: HTMLAttributes;

  /**
   * Props forwarded to rows.
   *
   * @default undefined
   */
  row?: HTMLAttributes;

  /**
   * Extra props for the toolbar search field.
   *
   * @default undefined
   */
  search?: Partial<Omit<TextFieldOwnProps, "modelValue">>;

  /**
   * Props forwarded to the selection summary in the chrome footer.
   *
   * @default undefined
   */
  selected?: HTMLAttributes;

  /**
   * Props forwarded to the `<table>` element.
   *
   * @default undefined
   */
  table?: HTMLAttributes;

  /**
   * Props forwarded to the toolbar region.
   *
   * @default undefined
   */
  toolbar?: HTMLAttributes;

  /**
   * Props forwarded to the table wrapper (`Table` root).
   *
   * @default undefined
   */
  wrapper?: HTMLAttributes;
}

export interface DataTableEmits {
  /**
   * Emitted when per-column text search should update (`v-model:column-search`).
   */
  "update:columnSearch": [search: DataTableColumnSearch];

  /**
   * Emitted when expanded row ids should update (`v-model:expanded`).
   */
  "update:expanded": [ids: string[]];

  /**
   * Emitted when column filters should update (`v-model:filters`).
   */
  "update:filters": [filters: DataTableFilters];

  /**
   * Emitted when hidden column ids should update (`v-model:hidden-columns`).
   */
  "update:hiddenColumns": [ids: string[]];

  /**
   * Emitted when the numbered page should update (`v-model:page`).
   */
  "update:page": [page: number];

  /**
   * Emitted when the page size should update (`v-model:per-page`).
   * DataTable also resets to page 1.
   */
  "update:perPage": [perPage: number];

  /**
   * Emitted when the toolbar search query should update (`v-model:search`).
   */
  "update:search": [query: string];

  /**
   * Emitted when selected row ids should update (`v-model:selection`).
   */
  "update:selection": [ids: string[]];

  /**
   * Emitted when sort should update (`v-model:sorting`).
   */
  "update:sorting": [sorting: DataTableSorting];
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
   * or emits `update:search` only when server-paged.
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

/**
 * Opinionated data table slots. Per-column cells use `#item.{columnId}`
 * (`row`, `value`) and override `columns[].cell`.
 */
export interface DataTableSlots<T = unknown> {
  /**
   * Shown when `rows` is empty.
   */
  empty?: Slot<undefined>;

  /**
   * Rendered in a spanning row when a row is expanded.
   */
  expanded?: Slot<{ row: T }>;

  /**
   * Region below the table, above the chrome footer.
   */
  footer?: Slot<undefined>;

  /**
   * Catch-all cell slot when `#item.{columnId}` is not set.
   */
  item?: Slot<DataTableItemSlotProps<T>>;

  /**
   * Indicator shown when `loading` is set. Overlay defaults to a spin; bar
   * defaults to `Progress` under the header.
   */
  loading?: Slot<undefined>;

  /**
   * Replaces the built-in chrome pager. Receives `page`, `count`, and
   * `onPageChange`.
   */
  pagination?: Slot<DataTablePaginationSlotProps>;

  /**
   * Replaces the built-in per-page Select. Receives `perPage`, `options`,
   * and `onPerPageChange`.
   */
  perPage?: Slot<DataTablePerPageSlotProps>;

  /**
   * Replaces the toolbar search field.
   */
  search?: Slot<undefined>;

  /**
   * Replaces the selection summary (`selected of total`). Receives
   * `selectedCount` / `totalCount`.
   */
  selected?: Slot<DataTableSelectedSlotProps>;

  /**
   * Leading toolbar region (left of Columns / Search).
   */
  toolbar?: Slot<undefined>;

  /**
   * Extra controls beside Columns and Search in the toolbar end cluster.
   */
  toolbarActions?: Slot<undefined>;
}

export type DataTableProps<T = unknown> = MergeHtmlProps<
  DataTableOwnProps<T>,
  HTMLAttributes
>;
