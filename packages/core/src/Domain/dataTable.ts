// ** External Imports
import { get } from "es-toolkit/compat";

/**
 * Internal column id for the selection checkbox column.
 */
export const DATATABLE_SELECTION_COLUMN_ID = "__bridge-selection";

/**
 * Pagination variant that pairs with a DataTable / Table chrome variant.
 */
export const DATATABLE_PAGINATION_VARIANT = {
  plain: "text",
  ghost: "ghost",
  bordered: "outlined",
} as const;

/**
 * Controlled sort: one column, or `null` when unsorted.
 */
export type DataTableSorting = null | {
  /**
   * Whether the sort is descending.
   */
  desc: boolean;

  /**
   * Sorted column id.
   */
  id: string;
};

/**
 * Shared column fields. Framework packages add `header` / `cell` renderers.
 */
export type DataTableColumnBase<T> = {
  /**
   * Value used for client-side sorting. Defaults to `row[id]`.
   */
  accessor?: (row: T) => unknown;

  /**
   * Text alignment for the header and cells.
   */
  align?: "end" | "start" | "center";

  /**
   * Stable column id (also the default accessor key).
   */
  id: string;

  /**
   * Whether the column can be sorted.
   */
  sortable?: boolean;

  /**
   * Optional column width (`th` / `td` style width).
   */
  width?: number | string;
};

/**
 * Pagination variant paired with a table chrome variant.
 */
export type DataTablePaginationVariant =
  (typeof DATATABLE_PAGINATION_VARIANT)[keyof typeof DATATABLE_PAGINATION_VARIANT];

/**
 * `aria-sort` value for a header cell.
 */
export type DataTableAriaSort = "none" | "ascending" | "descending";

/**
 * Semantic icon for a sortable header given its `aria-sort`.
 */
export type DataTableSortIcon = "chevronUp" | "chevronDown" | "chevronUpDown";

/**
 * Maps a table chrome variant to the matching Pagination variant.
 */
export function getDataTablePaginationVariant(
  tableVariant: string | undefined,
): DataTablePaginationVariant {
  return get(DATATABLE_PAGINATION_VARIANT, tableVariant ?? "plain") ?? "text";
}

/**
 * `aria-sort` for `columnId` given the current sort.
 */
export function getDataTableAriaSort(
  sorting: DataTableSorting,
  columnId: string,
): DataTableAriaSort {
  if (!sorting || sorting.id !== columnId) {
    return "none";
  }

  return sorting.desc ? "descending" : "ascending";
}

/**
 * Semantic sort icon for a header cell.
 */
export function getDataTableSortIcon(
  ariaSort: DataTableAriaSort,
): DataTableSortIcon {
  if (ariaSort === "ascending") {
    return "chevronUp";
  }

  if (ariaSort === "descending") {
    return "chevronDown";
  }

  return "chevronUpDown";
}

/**
 * Cycles sort for `columnId`: unsorted → asc → desc → unsorted.
 */
export function toggleDataTableSorting(
  current: DataTableSorting,
  columnId: string,
): DataTableSorting {
  if (!current || current.id !== columnId) {
    return { desc: false, id: columnId };
  }

  if (!current.desc) {
    return { desc: true, id: columnId };
  }

  return null;
}

/**
 * Whether built-in numbered Pagination should render (`page` and `pageCount` set).
 */
export function isDataTableServerPaged(
  page: number | undefined,
  pageCount: number | undefined,
): boolean {
  return page != null && pageCount != null;
}

/**
 * Whether selection chrome should render (controlled ids and/or a change handler).
 */
export function isDataTableSelectionEnabled(
  selection: string[] | undefined,
  hasSelectionHandler: boolean,
): boolean {
  return selection !== undefined || hasSelectionHandler;
}

/**
 * Stable row id from `getRowId`, `row.id`, or the row index.
 */
export function resolveDataTableRowId<T>(
  row: T,
  index: number,
  getRowId?: (row: T) => string,
): string {
  if (getRowId) {
    return getRowId(row);
  }

  const id = get(row, "id");

  if (typeof id === "string" || typeof id === "number") {
    return String(id);
  }

  return String(index);
}

/**
 * Sort value for a column. Uses `accessor` when set, otherwise `row[id]`.
 */
export function getDataTableColumnAccessor<T>(
  row: T,
  column: DataTableColumnBase<T>,
): unknown {
  if (column.accessor) {
    return column.accessor(row);
  }

  return get(row, column.id);
}

/**
 * Maps selected ids to a row selection record.
 */
export function selectionToRowSelection(
  ids: string[] | undefined,
): Record<string, boolean> {
  const record: Record<string, boolean> = {};

  for (const id of ids ?? []) {
    record[id] = true;
  }

  return record;
}

/**
 * Maps a row selection record to selected ids.
 */
export function rowSelectionToIds(
  selection: Record<string, boolean>,
): string[] {
  return Object.keys(selection).filter((id) => {
    return selection[id] === true;
  });
}

/**
 * Checked / indeterminate state for the header “select all” checkbox.
 */
export function getDataTableSelectAllState(
  pageIds: string[],
  selectedIds: string[],
): { checked: boolean; indeterminate: boolean } {
  if (pageIds.length === 0) {
    return { checked: false, indeterminate: false };
  }

  const selectedOnPage = pageIds.filter((id) => {
    return selectedIds.includes(id);
  });

  return {
    checked: selectedOnPage.length === pageIds.length,
    indeterminate:
      selectedOnPage.length > 0 && selectedOnPage.length < pageIds.length,
  };
}

/**
 * Adds or removes `rowId` from the selected ids.
 */
export function toggleDataTableRowSelection(
  selectedIds: string[],
  rowId: string,
  selected: boolean,
): string[] {
  if (selected) {
    return selectedIds.includes(rowId) ? selectedIds : [...selectedIds, rowId];
  }

  return selectedIds.filter((id) => {
    return id !== rowId;
  });
}

/**
 * Selects or clears every id on the current page, preserving off-page ids.
 */
export function toggleDataTablePageSelection(
  selectedIds: string[],
  pageIds: string[],
  selectAll: boolean,
): string[] {
  const pageSet = new Set(pageIds);
  const rest = selectedIds.filter((id) => {
    return !pageSet.has(id);
  });

  return selectAll ? [...rest, ...pageIds] : rest;
}
