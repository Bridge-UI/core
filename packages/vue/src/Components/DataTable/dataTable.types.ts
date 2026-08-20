// ** External Imports
import type { HTMLAttributes, Slot, VNodeChild } from "vue";

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
import type { PaginationOwnProps } from "@/Components/Pagination/pagination.types";
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
 * Column definition with Vue renderers.
 */
export type DataTableColumn<T> = Omit<DataTableColumnBase<T>, "align"> & {
  /**
   * Text alignment for the header and cells.
   *
   * @default "start"
   */
  align?: MergeProps<DataTableAlign, DataTableAlignOverrides>;

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
   * Props forwarded to the summary footer rowgroup.
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
   * Extra props for the built-in `Pagination`.
   *
   * @default undefined
   */
  pagination?: Partial<Omit<PaginationOwnProps, "count">>;

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
  table?: HTMLAttributes;

  /**
   * Props forwarded to the toolbar region.
   *
   * @default undefined
   */
  toolbar?: HTMLAttributes;

  /**
   * Props forwarded to the chrome wrapper.
   *
   * @default undefined
   */
  wrapper?: HTMLAttributes;
}

export interface DataTableEmits {
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
   * Emitted when selected row ids should update (`v-model:selection`).
   */
  "update:selection": [ids: string[]];

  /**
   * Emitted when sort should update (`v-model:sorting`).
   */
  "update:sorting": [sorting: DataTableSorting];
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

/**
 * Opinionated data grid slots. Per-column cells use `#item.{columnId}`
 * (`row`, `value`) and override `columns[].cell`.
 */
export interface DataTableSlots<T = unknown> {
  /**
   * Shown when `rows` is empty and the table is not loading.
   */
  empty?: Slot<undefined>;

  /**
   * Rendered in a spanning row when a row is expanded.
   */
  expanded?: Slot<{ row: T }>;

  /**
   * Replaces the default spinner when `loading` is set.
   */
  loading?: Slot<undefined>;

  /**
   * Replaces the built-in numbered Pagination (no auto variant).
   */
  pagination?: Slot<undefined>;

  /**
   * Optional toolbar above the table.
   */
  toolbar?: Slot<undefined>;
}

export type DataTableProps<T = unknown> = MergeHtmlProps<
  DataTableOwnProps<T>,
  HTMLAttributes
>;
