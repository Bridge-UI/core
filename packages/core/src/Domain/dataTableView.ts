// ** External Imports
import { isNil, isString } from "es-toolkit/compat";

// ** Local Imports
import {
  DATATABLE_EXPAND_COLUMN_ID,
  DATATABLE_SELECTION_COLUMN_ID,
  getDataTableAriaSort,
  getDataTableColumnAccessor,
  getDataTableColumnCssWidth,
  getDataTableColumnFilterValues,
  getDataTableColumnSearch,
  getDataTableDefaultCellContent,
  getDataTableSortIcon,
  getDataTableStickyInsets,
  isDataTableColumnFilterable,
  isDataTableColumnFiltered,
  isDataTableColumnSearchable,
  isDataTableColumnSearched,
  type DataTableAriaSort,
  type DataTableColumnBase,
  type DataTableColumnClasses,
  type DataTableColumnSearch,
  type DataTableFilterOption,
  type DataTableFilters,
  type DataTableSortIcon,
  type DataTableSorting,
  type DataTableStickyEdge,
  type DataTableStickyInset,
} from "@/Domain/dataTable";

/**
 * Column fields read when building header, body, and summary views.
 * `TNode` is the framework's renderable type (`ReactNode`, `VNodeChild`, …);
 * `TAlign` is the column's (possibly extended) alignment token.
 */
export type DataTableViewColumn<
  T = unknown,
  TNode = unknown,
  TAlign extends string = string,
> = Omit<DataTableColumnBase<T>, "align"> & {
  /**
   * Text alignment for the header and cells.
   */
  align?: TAlign;

  /**
   * Cell renderer. Defaults to the accessor value as text.
   */
  cell?: (row: T) => TNode;

  /**
   * Header content.
   */
  header: TNode;

  /**
   * Footer summary renderer, called with every row matching search/filters.
   */
  summary?: (data: T[]) => TNode;
};

/**
 * Layout fields shared by header, body, and summary cell views.
 */
type DataTableColumnLayoutView<TAlign extends string = string> = {
  align?: TAlign;
  classes?: DataTableColumnClasses;
  ellipsis: boolean;
  id: string;
  isExpand: boolean;
  isSelection: boolean;
  sticky?: DataTableStickyEdge;
  stickyEdge: boolean;
  stickyStyle?: DataTableStickyInset["style"];
  width?: number | string;
};

/**
 * Render-ready header cell: sort, filter, search, and sticky state.
 */
export type DataTableHeaderView<
  TNode = unknown,
  TAlign extends string = string,
> = DataTableColumnLayoutView<TAlign> & {
  ariaSort: DataTableAriaSort;
  filterable: boolean;
  filterActive: boolean;
  filterMultiple: boolean;
  filterOptions: DataTableFilterOption[];
  filterValues: string[];
  header: TNode | undefined;
  hideable: boolean;
  searchable: boolean;
  searchQuery: string;
  sortable: boolean;
  sortIcon: DataTableSortIcon;
};

/**
 * Render-ready body or summary cell.
 */
export type DataTableCellView<
  TNode = unknown,
  TAlign extends string = string,
> = DataTableColumnLayoutView<TAlign> & {
  content: null | TNode | string;
  tooltip?: string;
  value?: unknown;
};

/**
 * Item in the column visibility menu.
 */
export type DataTableVisibilityItem = {
  hidden: boolean;
  hideable: boolean;
  id: string;
  label: string;
};

/**
 * Inline style for a header or body cell: width plus sticky offsets.
 */
export type DataTableColumnLayoutStyle = {
  left?: number;
  maxWidth?: string;
  position?: "sticky";
  right?: number;
  top?: number;
  width?: string;
  zIndex?: number;
};

/**
 * Builds header views for the visible `columnIds` (in render order).
 * Sticky z-index stacks above body cells, and above sticky headers when
 * `stickyHeader` is on.
 */
export function resolveDataTableHeaderViews<
  T,
  TNode,
  TAlign extends string = string,
>({
  filters,
  sorting,
  columnIds,
  columnsById,
  columnSearch,
  stickyHeader,
}: {
  columnIds: readonly string[];
  columnsById: Readonly<
    Record<string, undefined | DataTableViewColumn<T, TNode, TAlign>>
  >;
  columnSearch?: DataTableColumnSearch;
  filters?: DataTableFilters;
  sorting?: DataTableSorting;
  stickyHeader: boolean;
}): DataTableHeaderView<TNode, TAlign>[] {
  const metas = columnIds.map((id) => {
    const column = columnsById[id];

    return {
      id,
      column,
      width: column?.width,
      sticky: column?.sticky,
      isExpand: id === DATATABLE_EXPAND_COLUMN_ID,
      isSelection: id === DATATABLE_SELECTION_COLUMN_ID,
    };
  });
  const insets = getDataTableStickyInsets(metas, stickyHeader ? 20 : 10);

  return metas.map((meta) => {
    const inset = insets[meta.id] as undefined | DataTableStickyInset;
    const ariaSort = meta.column?.sortable
      ? getDataTableAriaSort(sorting ?? null, meta.id)
      : "none";

    return {
      ariaSort,
      id: meta.id,
      width: meta.width,
      sticky: inset?.sticky,
      isExpand: meta.isExpand,
      align: meta.column?.align,
      stickyStyle: inset?.style,
      header: meta.column?.header,
      classes: meta.column?.classes,
      isSelection: meta.isSelection,
      stickyEdge: inset?.edge === true,
      ellipsis: meta.column?.ellipsis === true,
      sortable: meta.column?.sortable === true,
      sortIcon: getDataTableSortIcon(ariaSort),
      hideable: meta.column?.hideable !== false,
      filterOptions: meta.column?.filters ?? [],
      filterable: isDataTableColumnFilterable(meta.column),
      searchable: isDataTableColumnSearchable(meta.column),
      filterMultiple: meta.column?.filterMultiple !== false,
      searchQuery: getDataTableColumnSearch(columnSearch, meta.id),
      filterValues: getDataTableColumnFilterValues(filters, meta.id),
      filterActive:
        isDataTableColumnFiltered(filters, meta.id) ||
        isDataTableColumnSearched(columnSearch, meta.id),
    };
  });
}

/**
 * Sticky insets for body cells, derived from the header views (z-index 1).
 */
export function getDataTableBodyInsets(
  headers: readonly DataTableHeaderView<unknown>[],
): Record<string, DataTableStickyInset> {
  return getDataTableStickyInsets(
    headers.map((header) => {
      return {
        id: header.id,
        width: header.width,
        sticky: header.sticky,
        isExpand: header.isExpand,
        isSelection: header.isSelection,
      };
    }),
    1,
  );
}

/**
 * Builds the body cells of `row` for the visible `columnIds`. Ellipsis
 * columns get the accessor text as `tooltip`.
 */
export function resolveDataTableRowCells<
  T,
  TNode,
  TAlign extends string = string,
>({
  row,
  insets,
  columnIds,
  columnsById,
}: {
  columnIds: readonly string[];
  columnsById: Readonly<
    Record<string, undefined | DataTableViewColumn<T, TNode, TAlign>>
  >;
  insets: Readonly<Record<string, DataTableStickyInset>>;
  row: T;
}): DataTableCellView<TNode, TAlign>[] {
  return columnIds.map((id) => {
    const column = columnsById[id];
    const inset = insets[id] as undefined | DataTableStickyInset;
    const accessor = column
      ? getDataTableColumnAccessor(row, column)
      : undefined;
    const tooltip =
      column?.ellipsis === true && !isNil(accessor) && accessor !== ""
        ? String(accessor)
        : undefined;

    return {
      id,
      tooltip,
      value: accessor,
      width: column?.width,
      align: column?.align,
      sticky: inset?.sticky,
      classes: column?.classes,
      stickyStyle: inset?.style,
      stickyEdge: inset?.edge === true,
      ellipsis: column?.ellipsis === true,
      isExpand: id === DATATABLE_EXPAND_COLUMN_ID,
      isSelection: id === DATATABLE_SELECTION_COLUMN_ID,
      content: column?.cell
        ? column.cell(row)
        : getDataTableDefaultCellContent(accessor),
    };
  });
}

/**
 * Builds the footer summary row, or `null` when no column has `summary`.
 * Chrome columns (selection / expand) stay empty.
 */
export function resolveDataTableSummaryCells<
  T,
  TNode,
  TAlign extends string = string,
>({
  data,
  headers,
  columns,
}: {
  columns: readonly DataTableViewColumn<T, TNode, TAlign>[];
  data: T[];
  headers: readonly DataTableHeaderView<TNode, TAlign>[];
}): null | DataTableCellView<TNode, TAlign>[] {
  const hasSummary = columns.some((column) => {
    return column.summary !== undefined;
  });

  if (!hasSummary) {
    return null;
  }

  return headers.map((header) => {
    const column = columns.find((item) => item.id === header.id);

    return {
      id: header.id,
      ellipsis: false,
      value: undefined,
      tooltip: undefined,
      width: header.width,
      align: header.align,
      sticky: header.sticky,
      classes: header.classes,
      isExpand: header.isExpand,
      stickyEdge: header.stickyEdge,
      stickyStyle: header.stickyStyle,
      isSelection: header.isSelection,
      content:
        header.isSelection || header.isExpand
          ? null
          : (column?.summary?.(data) ?? null),
    };
  });
}

/**
 * Items for the column visibility menu. String headers are used as labels;
 * other headers fall back to the column id.
 */
export function resolveDataTableVisibilityItems(
  columns: readonly Pick<DataTableViewColumn, "id" | "header" | "hideable">[],
  hiddenColumns: readonly string[],
): DataTableVisibilityItem[] {
  return columns.map((column) => {
    return {
      id: column.id,
      hideable: column.hideable !== false,
      hidden: hiddenColumns.includes(column.id),
      label: isString(column.header) ? column.header : column.id,
    };
  });
}

/**
 * Resolved text alignment: chrome columns (selection / expand) are centered.
 */
export function getDataTableViewAlign<TAlign extends string>(view: {
  align?: TAlign;
  isExpand: boolean;
  isSelection: boolean;
}): TAlign | "start" | "center" {
  return view.isSelection || view.isExpand ? "center" : (view.align ?? "start");
}

/**
 * Inline style for a header (`header: true`) or body cell: CSS width, sticky
 * column offsets, and sticky-header positioning.
 */
export function getDataTableColumnLayoutStyle(
  view: {
    isExpand: boolean;
    isSelection: boolean;
    stickyStyle?: DataTableStickyInset["style"];
    width?: number | string;
  },
  stickyHeader: boolean,
  header = false,
): DataTableColumnLayoutStyle {
  const width = getDataTableColumnCssWidth(
    view.width,
    view.isExpand || view.isSelection,
  );
  const headerSticky = header && stickyHeader;

  return {
    ...(width ? { width, maxWidth: width } : {}),
    ...view.stickyStyle,
    ...(header && view.stickyStyle && !headerSticky ? { zIndex: 20 } : {}),
    ...(headerSticky
      ? {
          top: 0,
          position: "sticky",
          zIndex: view.stickyStyle ? 20 : 11,
        }
      : {}),
  };
}
