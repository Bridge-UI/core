// ** External Imports
import { compact, fromPairs, get, isNil } from "es-toolkit/compat";

/**
 * Internal column id for the row-expand control column.
 */
export const DATATABLE_EXPAND_COLUMN_ID = "__bridge-expand";

/**
 * Internal column id for the selection checkbox column.
 */
export const DATATABLE_SELECTION_COLUMN_ID = "__bridge-selection";

/**
 * Width in px used for expand/selection tracks when computing sticky offsets.
 */
export const DATATABLE_CHROME_COLUMN_WIDTH_PX = 48;

/**
 * Fallback width in px for sticky columns without a parseable `width`.
 */
export const DATATABLE_STICKY_WIDTH_PX = 160;

/**
 * Pagination variant that pairs with a DataTable chrome variant.
 */
/**
 * Pagination region alignment (`justify-*`) for `paginationAlign`.
 */
export const DATATABLE_PAGINATION_ALIGN = {
  end: "justify-end",
  start: "justify-start",
  center: "justify-center",
} as const;

/**
 * Pagination variant that pairs with a DataTable chrome variant.
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
 * One option in a column filter menu. `children` render as a nested group.
 */
export type DataTableFilterOption = {
  /**
   * Nested options shown in a submenu.
   */
  children?: DataTableFilterOption[];

  /**
   * Visible label in the filter menu.
   */
  label: string;

  /**
   * Value stored in `filters[columnId]` when selected.
   */
  value: string;
};

/**
 * Controlled column filters: column id → selected option values.
 */
export type DataTableFilters = Record<string, string[]>;

/**
 * Per-column cell slot props (`#item.{id}` / `slots.item[id]`).
 */
export type DataTableItemSlotProps<T> = {
  /**
   * Column id for the current cell.
   */
  id: string;

  /**
   * Current data row.
   */
  row: T;

  /**
   * Column accessor value (`accessor` or `row[id]`).
   */
  value: unknown;
};

/**
 * How `loading` is shown.
 *
 * `overlay` dims the table and centers a spin. `bar` dims the table and draws
 * a progress line under the header.
 */
export type DataTableLoadingVariant = "bar" | "overlay";

/**
 * Row selection chrome: radios (`single`) or checkboxes (`multiple`).
 */
export type DataTableSelectionMode = "single" | "multiple";

/**
 * Pin a column to the inline start or end while the table scrolls.
 */
export type DataTableStickyEdge = "end" | "start";

/**
 * Stick header cells. `true` pins to the page; `"boxed"` pins inside the
 * table wrapper (set a max height on `classes.wrapper`).
 */
export type DataTableStickyHeader = "boxed" | boolean;

/**
 * Whether sticky column edge shadows should show.
 *
 * Start pins sit in their natural place at `scrollLeft === 0`. End pins sit in
 * their natural place when the scrollport is at the end.
 */
export type DataTableStickyPing = {
  /**
   * Shadow on the first end-pinned column (not yet scrolled to the end).
   */
  end: boolean;

  /**
   * Shadow on the last start-pinned column (scrolled away from the start).
   */
  start: boolean;
};

/**
 * Sticky insets for one visible column.
 */
export type DataTableStickyInset = {
  /**
   * Whether this column is the last start pin or the first end pin.
   */
  edge: boolean;

  /**
   * Resolved sticky edge after chrome auto-pin.
   */
  sticky?: DataTableStickyEdge;

  /**
   * `position: sticky` plus `left` / `right` offsets.
   */
  style?: {
    left?: number;
    position: "sticky";
    right?: number;
    zIndex: number;
  };
};

/**
 * Shared column fields. Framework packages add `header` / `cell` renderers.
 */
export type DataTableColumnBase<T> = {
  /**
   * Value used for client-side sorting and filtering. Defaults to `row[id]`.
   */
  accessor?: (row: T) => unknown;

  /**
   * Text alignment for the header and cells.
   */
  align?: "end" | "start" | "center";

  /**
   * Truncate overflowing cell text and show the full value in a tooltip.
   *
   * @default false
   */
  ellipsis?: boolean;

  /**
   * When false, the filter menu allows only one value. Default is multiple.
   *
   * @default true
   */
  filterMultiple?: boolean;

  /**
   * Filter menu options. Presence enables the header filter trigger.
   */
  filters?: DataTableFilterOption[];

  /**
   * When false, the column cannot be toggled in the columns menu.
   *
   * @default true
   */
  hideable?: boolean;

  /**
   * Stable column id (also the default accessor key).
   */
  id: string;

  /**
   * Whether the column can be sorted.
   */
  sortable?: boolean;

  /**
   * Pin the column while the grid scrolls horizontally.
   */
  sticky?: DataTableStickyEdge;

  /**
   * Optional column width as a CSS grid track (`px` number or CSS length).
   */
  width?: number | string;
};

/**
 * Pagination region `justify-*` class paired with `paginationAlign`.
 */
export type DataTablePaginationAlignClass =
  (typeof DATATABLE_PAGINATION_ALIGN)[keyof typeof DATATABLE_PAGINATION_ALIGN];

/**
 * Pagination variant paired with a DataTable chrome variant.
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
 * Maps `paginationAlign` to a flex `justify-*` class.
 */
export function getDataTablePaginationAlignClass(
  align: string | undefined,
): DataTablePaginationAlignClass {
  return get(DATATABLE_PAGINATION_ALIGN, align ?? "end") ?? "justify-end";
}

/**
 * Maps a DataTable chrome variant to the matching Pagination variant.
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
 * Tooltip for a sortable header given its `aria-sort`.
 */
export function getDataTableSortTooltip(ariaSort: DataTableAriaSort): string {
  if (ariaSort === "ascending") {
    return "Click to sort descending";
  }

  if (ariaSort === "descending") {
    return "Click to cancel sorting";
  }

  return "Click to sort ascending";
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
  return !isNil(page) && !isNil(pageCount);
}

/**
 * Whether the header row should stick (`true` / `"boxed"`).
 *
 * Empty string covers Vue boolean attributes on a `boolean | "boxed"` prop.
 */
export function isDataTableStickyHeader(
  stickyHeader: "" | "true" | undefined | DataTableStickyHeader,
): boolean {
  return (
    stickyHeader === true ||
    stickyHeader === "" ||
    stickyHeader === "true" ||
    stickyHeader === "boxed"
  );
}

/**
 * Whether the header sticks inside the wrapper scrollport.
 */
export function isDataTableStickyHeaderBoxed(
  stickyHeader: undefined | DataTableStickyHeader,
): boolean {
  return stickyHeader === "boxed";
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
 * Default cell text when no `cell` renderer is set.
 */
export function getDataTableDefaultCellContent(
  accessor: unknown,
): null | string {
  if (accessor == null || accessor === "") {
    return null;
  }

  return String(accessor);
}

/**
 * CSS width for a native table column (`th` / `td` / `col`).
 */
export function getDataTableColumnCssWidth(
  width: number | string | undefined,
  isChrome = false,
): string | undefined {
  if (isChrome) {
    return "3rem";
  }

  if (typeof width === "number") {
    return `${width}px`;
  }

  return width;
}

/**
 * CSS grid track for a DataTable column.
 */
export function getDataTableColumnTrack(
  width: number | string | undefined,
  isChrome = false,
  full = true,
): string {
  if (isChrome) {
    return "3rem";
  }

  if (typeof width === "number") {
    return `${width}px`;
  }

  if (width) {
    return width;
  }

  return full ? "minmax(0, 1fr)" : "max-content";
}

/**
 * `grid-template-columns` value for a DataTable row.
 */
export function getDataTableGridTemplate(
  columns: ReadonlyArray<{
    isExpand?: boolean;
    isSelection?: boolean;
    width?: number | string;
  }>,
  full = true,
): string {
  if (columns.length === 0) {
    return full ? "minmax(0, 1fr)" : "max-content";
  }

  return columns
    .map((column) => {
      return getDataTableColumnTrack(
        column.width,
        column.isSelection === true || column.isExpand === true,
        full,
      );
    })
    .join(" ");
}

/**
 * Width in px for sticky offset math.
 */
export function getDataTableColumnWidthPx(
  width: number | string | undefined,
  isChrome = false,
): number {
  if (isChrome) {
    return DATATABLE_CHROME_COLUMN_WIDTH_PX;
  }

  if (typeof width === "number") {
    return width;
  }

  if (typeof width === "string") {
    const px = /^(\d+(?:\.\d+)?)px$/.exec(width);

    if (px) {
      return Number(px[1]);
    }

    const rem = /^(\d+(?:\.\d+)?)rem$/.exec(width);

    if (rem) {
      return Number(rem[1]) * 16;
    }
  }

  return DATATABLE_STICKY_WIDTH_PX;
}

/**
 * Sticky `left` / `right` insets for visible columns. Chrome columns pin to
 * start when any data column uses `sticky: "start"`.
 */
export function getDataTableStickyInsets(
  columns: ReadonlyArray<{
    id: string;
    isExpand?: boolean;
    isSelection?: boolean;
    sticky?: DataTableStickyEdge;
    width?: number | string;
  }>,
  zIndex: number,
): Record<string, DataTableStickyInset> {
  const pinChrome = columns.some((column) => {
    return (
      column.sticky === "start" &&
      column.isExpand !== true &&
      column.isSelection !== true
    );
  });

  const resolved = columns.map((column) => {
    const isChrome = column.isExpand === true || column.isSelection === true;
    const sticky =
      column.sticky ?? (isChrome && pinChrome ? "start" : undefined);

    return {
      ...column,
      sticky,
      isChrome,
      widthPx: getDataTableColumnWidthPx(column.width, isChrome),
    };
  });

  let startOffset = 0;
  const leftById: Record<string, number> = {};

  for (const column of resolved) {
    if (column.sticky === "start") {
      leftById[column.id] = startOffset;
      startOffset += column.widthPx;
    }
  }

  let endOffset = 0;
  const rightById: Record<string, number> = {};

  for (let index = resolved.length - 1; index >= 0; index -= 1) {
    const column = resolved[index];

    if (column?.sticky === "end") {
      rightById[column.id] = endOffset;
      endOffset += column.widthPx;
    }
  }

  const lastStart = [...resolved].reverse().find((column) => {
    return column.sticky === "start";
  })?.id;
  const firstEnd = resolved.find((column) => {
    return column.sticky === "end";
  })?.id;

  return fromPairs(
    resolved.map((column) => {
      if (!column.sticky) {
        return [column.id, { edge: false }];
      }

      const inset: DataTableStickyInset = {
        sticky: column.sticky,
        edge: column.id === lastStart || column.id === firstEnd,
        style: {
          zIndex,
          position: "sticky",
          ...(column.sticky === "start"
            ? { left: leftById[column.id] }
            : { right: rightById[column.id] }),
        },
      };

      return [column.id, inset];
    }),
  );
}

/** Pixel slack so subpixel scroll does not flicker the edge shadow. */
const DATATABLE_STICKY_PING_EPSILON_PX = 1;

/**
 * Sticky column edge-shadow ping from a scrollport's overflow metrics.
 */
export function getDataTableStickyPing(
  scrollLeft: number,
  scrollWidth: number,
  clientWidth: number,
): DataTableStickyPing {
  const maxScroll = Math.max(0, scrollWidth - clientWidth);

  if (maxScroll <= DATATABLE_STICKY_PING_EPSILON_PX) {
    return { end: false, start: false };
  }

  return {
    start: scrollLeft > DATATABLE_STICKY_PING_EPSILON_PX,
    end: scrollLeft < maxScroll - DATATABLE_STICKY_PING_EPSILON_PX,
  };
}

/**
 * Whether expand chrome should render.
 */
export function isDataTableExpandEnabled(
  expanded: string[] | undefined,
  hasExpandedHandler: boolean,
  hasExpandedSlot: boolean,
): boolean {
  return expanded !== undefined || hasExpandedHandler || hasExpandedSlot;
}

/**
 * Whether the columns menu should render.
 */
export function isDataTableVisibilityEnabled(
  hiddenColumns: string[] | undefined,
  hasVisibilityHandler: boolean,
): boolean {
  return hiddenColumns !== undefined || hasVisibilityHandler;
}

/**
 * Adds or removes a hideable column id. Keeps at least one column visible.
 */
export function toggleDataTableColumnVisibility(
  hiddenIds: string[],
  columnId: string,
  hide: boolean,
  columnIds: string[],
): string[] {
  const next = hide
    ? hiddenIds.includes(columnId)
      ? hiddenIds
      : [...hiddenIds, columnId]
    : hiddenIds.filter((id) => {
        return id !== columnId;
      });
  const visible = columnIds.filter((id) => {
    return !next.includes(id);
  });

  return visible.length === 0 ? hiddenIds : next;
}

/**
 * Adds or removes an expanded row id.
 */
export function toggleDataTableRowExpansion(
  expandedIds: string[],
  rowId: string,
  expanded: boolean,
): string[] {
  return toggleDataTableRowSelection(expandedIds, rowId, expanded);
}

/**
 * Maps selected ids to a row selection record.
 */
export function selectionToRowSelection(
  ids: string[] | undefined,
): Record<string, boolean> {
  return fromPairs((ids ?? []).map((id) => [id, true]));
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
 * Updates row selection for `single` (radio) or `multiple` (checkbox) mode.
 */
export function setDataTableRowSelection(
  selectedIds: string[],
  rowId: string,
  selected: boolean,
  mode: DataTableSelectionMode = "multiple",
): string[] {
  if (mode === "single") {
    return selected ? [rowId] : [];
  }

  return toggleDataTableRowSelection(selectedIds, rowId, selected);
}

/**
 * Whether selection chrome uses checkboxes and select-all.
 */
export function isDataTableSelectionMultiple(
  mode: undefined | DataTableSelectionMode,
): boolean {
  return mode !== "single";
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

/**
 * Whether a column shows a filter trigger.
 */
export function isDataTableColumnFilterable(
  column: undefined | Pick<DataTableColumnBase<unknown>, "filters">,
): boolean {
  return Boolean(column?.filters && column.filters.length > 0);
}

/**
 * Selected filter values for `columnId`.
 */
export function getDataTableColumnFilterValues(
  filters: undefined | DataTableFilters,
  columnId: string,
): string[] {
  return get(filters, columnId) ?? [];
}

/**
 * Whether `columnId` has at least one selected filter value.
 */
export function isDataTableColumnFiltered(
  filters: undefined | DataTableFilters,
  columnId: string,
): boolean {
  return getDataTableColumnFilterValues(filters, columnId).length > 0;
}

/**
 * Leaf values from a filter option tree, in display order.
 */
export function flattenDataTableFilterOptionValues(
  options: DataTableFilterOption[],
): string[] {
  return options.flatMap((option) => {
    if (option.children && option.children.length > 0) {
      return flattenDataTableFilterOptionValues(option.children);
    }

    return [option.value];
  });
}

/**
 * Filters a filter-option tree by label. Matching groups keep all children.
 */
export function filterDataTableFilterOptions(
  options: DataTableFilterOption[],
  query: string,
): DataTableFilterOption[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return options;
  }

  return compact(
    options.map((option) => {
      const labelMatches = option.label.toLowerCase().includes(normalized);

      if (option.children && option.children.length > 0) {
        if (labelMatches) {
          return option;
        }

        const children = filterDataTableFilterOptions(option.children, query);

        if (children.length === 0) {
          return undefined;
        }

        return { ...option, children };
      }

      return labelMatches ? option : undefined;
    }),
  );
}

/**
 * Selects or clears every value in `values` on the filter draft.
 */
export function setDataTableFilterDraftAll(
  draft: string[],
  values: string[],
  selected: boolean,
): string[] {
  if (selected) {
    const seen = new Set(draft);

    return [
      ...draft,
      ...values.filter((value) => {
        return !seen.has(value);
      }),
    ];
  }

  const drop = new Set(values);

  return draft.filter((item) => {
    return !drop.has(item);
  });
}

/**
 * Toggles a draft filter value. Single-select replaces the draft.
 */
export function toggleDataTableFilterDraft(
  draft: string[],
  value: string,
  selected: boolean,
  multiple = true,
): string[] {
  if (!multiple) {
    return selected ? [value] : [];
  }

  if (selected) {
    return draft.includes(value) ? draft : [...draft, value];
  }

  return draft.filter((item) => {
    return item !== value;
  });
}

/**
 * Sets or clears the selected values for one column in `filters`.
 */
export function setDataTableColumnFilter(
  filters: undefined | DataTableFilters,
  columnId: string,
  values: string[],
): DataTableFilters {
  const next = { ...(filters ?? {}) };

  if (values.length === 0) {
    delete next[columnId];
  } else {
    next[columnId] = values;
  }

  return next;
}
