// ** External Imports
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type OnChangeFn,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  compact,
  fromPairs,
  get,
  head,
  isArray,
  isEmpty,
  isFunction,
  isNil,
  isString,
  keyBy,
  map,
  omit,
} from "es-toolkit/compat";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type Ref,
  type UIEvent,
} from "react";

// ** Core Imports
import {
  DATATABLE_EXPAND_COLUMN_ID,
  DATATABLE_SELECTION_COLUMN_ID,
  getDataTableAriaSort,
  getDataTableColumnAccessor,
  getDataTableColumnCssWidth,
  getDataTableColumnFilterValues,
  getDataTableColumnSearch,
  getDataTableDefaultCellContent,
  getDataTablePaginationVariant,
  getDataTablePerPageSelectOptions,
  getDataTableResolvedPageCount,
  getDataTableResolvedPerPage,
  getDataTableSelectAllState,
  getDataTableSortIcon,
  getDataTableStickyInsets,
  getDataTableStickyPing,
  isDataTableClientPaged,
  isDataTableColumnFilterable,
  isDataTableColumnFiltered,
  isDataTableColumnSearchable,
  isDataTableColumnSearched,
  isDataTableExpandEnabled,
  isDataTablePerPageEnabled,
  isDataTableSearchEnabled,
  isDataTableSelectionEnabled,
  isDataTableSelectionMultiple,
  isDataTableServerPaged,
  isDataTableStickyHeader,
  isDataTableStickyHeaderBoxed,
  isDataTableVisibilityEnabled,
  matchDataTableSearch,
  observeDataTablePaginationInline,
  resolveDataTableRowId,
  rowMatchesDataTableColumnSearch,
  rowSelectionToIds,
  selectionToRowSelection,
  setDataTableColumnFilter,
  setDataTableColumnSearch,
  setDataTableRowSelection,
  sliceDataTablePage,
  toggleDataTableColumnVisibility,
  toggleDataTablePageSelection,
  toggleDataTableRowExpansion,
  toggleDataTableSorting,
  type DataTableFilterOption,
  type DataTablePaginationSlotProps,
  type DataTablePerPageSlotProps,
  type DataTableStickyEdge,
  type DataTableStickyInset,
} from "@bridge-ui/core/Domain";
import { tableVariantProps as variantProps } from "@bridge-ui/core/Tokens";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  DataTableColumn,
  DataTableOwnProps,
  DataTableProps,
} from "@/Components/DataTable/dataTable.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const dataTableBridgeKeys = [
  "full",
  "page",
  "rows",
  "size",
  "slots",
  "search",
  "classes",
  "columns",
  "filters",
  "loading",
  "perPage",
  "rounded",
  "sorting",
  "striped",
  "variant",
  "expanded",
  "getRowId",
  "hoverable",
  "pageCount",
  "selection",
  "totalCount",
  "customProps",
  "columnSearch",
  "onPageChange",
  "stickyHeader",
  "filterOverlay",
  "hiddenColumns",
  "selectionMode",
  "columnsOverlay",
  "loadingVariant",
  "onSearchChange",
  "perPageOptions",
  "onFiltersChange",
  "onPerPageChange",
  "onSortingChange",
  "onExpandedChange",
  "columnsShowFooter",
  "onSelectionChange",
  "onColumnSearchChange",
  "onHiddenColumnsChange",
] as const satisfies readonly (
  | "onPageChange"
  | "onSearchChange"
  | "onFiltersChange"
  | "onPerPageChange"
  | "onSortingChange"
  | "onExpandedChange"
  | "onSelectionChange"
  | "onColumnSearchChange"
  | "onHiddenColumnsChange"
  | keyof DataTableOwnProps<unknown>
)[];

/**
 * Whether a header click landed on filter or selection chrome.
 */
function isDataTableHeadChromeEvent(event: { target: null | EventTarget }) {
  const target = event.target;

  return (
    target instanceof Element && Boolean(target.closest("button, input, a"))
  );
}

type DataTableLibDefaults = LibDefaultsShape<
  DataTableOwnProps<unknown>,
  | "full"
  | "size"
  | "loading"
  | "rounded"
  | "striped"
  | "variant"
  | "hoverable"
  | "stickyHeader"
  | "filterOverlay"
  | "selectionMode"
  | "columnsOverlay"
  | "loadingVariant"
>;

type DataTableMerged<T> = MergeLibDefaults<
  DataTableOwnProps<T>,
  DataTableLibDefaults
> &
  Pick<
    DataTableProps<T>,
    | "onPageChange"
    | "onSearchChange"
    | "onFiltersChange"
    | "onPerPageChange"
    | "onSortingChange"
    | "onExpandedChange"
    | "onSelectionChange"
    | "onColumnSearchChange"
    | "onHiddenColumnsChange"
  >;

export type DataTableHeaderView = {
  align?: DataTableColumn<unknown>["align"];
  ariaSort: ReturnType<typeof getDataTableAriaSort>;
  classes?: DataTableColumn<unknown>["classes"];
  ellipsis: boolean;
  filterable: boolean;
  filterActive: boolean;
  filterMultiple: boolean;
  filterOptions: DataTableFilterOption[];
  filterValues: string[];
  header: ReactNode;
  hideable: boolean;
  id: string;
  isExpand: boolean;
  isSelection: boolean;
  searchable: boolean;
  searchQuery: string;
  sortable: boolean;
  sortIcon: ReturnType<typeof getDataTableSortIcon>;
  sticky?: DataTableStickyEdge;
  stickyEdge: boolean;
  stickyStyle?: DataTableStickyInset["style"];
  width?: number | string;
};

export type DataTableCellView = {
  align?: DataTableColumn<unknown>["align"];
  classes?: DataTableColumn<unknown>["classes"];
  content: ReactNode;
  ellipsis: boolean;
  id: string;
  isExpand: boolean;
  isSelection: boolean;
  sticky?: DataTableStickyEdge;
  stickyEdge: boolean;
  stickyStyle?: DataTableStickyInset["style"];
  tooltip?: string;
  value?: unknown;
  width?: number | string;
};

export type DataTableRowView<T = unknown> = {
  cells: DataTableCellView[];
  expanded: boolean;
  id: string;
  original: T;
  selected: boolean;
};

export type DataTableVisibilityItem = {
  hidden: boolean;
  hideable: boolean;
  id: string;
  label: string;
};

const chromeColumn = {
  enableHiding: false,
  enableSorting: false,
  cell: () => {
    return null;
  },
  header: () => {
    return null;
  },
};

const EMPTY_ROWS: never[] = [];
const EMPTY_COLUMNS: never[] = [];
const EMPTY_IDS: string[] = [];
const dataTableCoreRowModel = getCoreRowModel();
const dataTableSortedRowModel = getSortedRowModel();
const dataTableFilteredRowModel = getFilteredRowModel();

function getDataTableHeadAlign(header: {
  align?: DataTableColumn<unknown>["align"];
  isExpand: boolean;
  isSelection: boolean;
}) {
  return header.isSelection || header.isExpand
    ? "center"
    : (header.align ?? "start");
}

function getDataTableCellAlign(cell: {
  align?: DataTableColumn<unknown>["align"];
  isExpand: boolean;
  isSelection: boolean;
}) {
  return cell.isSelection || cell.isExpand ? "center" : (cell.align ?? "start");
}

function getDataTableColumnLayoutStyle(
  view: {
    isExpand: boolean;
    isSelection: boolean;
    stickyStyle?: DataTableStickyInset["style"];
    width?: number | string;
  },
  stickyHeaderEnabled: boolean,
  header = false,
): CSSProperties {
  const width = getDataTableColumnCssWidth(
    view.width,
    view.isExpand || view.isSelection,
  );
  const headerSticky = header && stickyHeaderEnabled;

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

export function useDataTable<T>(
  props: DataTableProps<T>,
  libDefaults: DataTableLibDefaults,
) {
  const { componentProps, inheritedAttrs } = splitComponentProps<
    DataTableProps<T>,
    typeof dataTableBridgeKeys
  >({
    props,
    bridgeKeys: dataTableBridgeKeys,
  });

  const {
    merged,
    components,
    entry: bridgeDataTable,
  } = useBridgeUIComponent<DataTableMerged<T>, "DataTable">({
    libDefaults,
    props: componentProps,
    componentName: "DataTable",
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const slots = derived(() => {
    return merged.slots;
  });

  const mergedRef = useRef(merged);
  mergedRef.current = merged;

  const rootInheritedAttrs = useMemo(() => {
    return omit(inheritedAttrs, ["children"]);
  }, [inheritedAttrs]);

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    props: componentProps,
    entry: bridgeDataTable,
  });

  const variantClasses = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      variantProps,
      get(components, ["Table", "tokens", "variant"]),
    );
  }, [components]);

  const variantItem = derived(() => {
    return get(variantClasses, merged.variant);
  });

  const columns = derived(() => {
    return merged.columns ?? EMPTY_COLUMNS;
  });

  const rows = derived(() => {
    return merged.rows ?? EMPTY_ROWS;
  });

  const hiddenColumns = derived(() => {
    return merged.hiddenColumns ?? EMPTY_IDS;
  });

  const expandedIds = derived(() => {
    return merged.expanded ?? EMPTY_IDS;
  });

  const selectionIds = derived(() => {
    return merged.selection ?? EMPTY_IDS;
  });

  const columnsById = useMemo(() => {
    return keyBy(columns, "id");
  }, [columns]);

  const selectionEnabled = derived(() => {
    return isDataTableSelectionEnabled(
      merged.selection,
      merged.onSelectionChange !== undefined,
    );
  });

  const expandEnabled = derived(() => {
    return isDataTableExpandEnabled(
      merged.expanded,
      merged.onExpandedChange !== undefined,
      merged.slots?.expanded !== undefined,
    );
  });

  const visibilityEnabled = derived(() => {
    return isDataTableVisibilityEnabled(
      merged.hiddenColumns,
      merged.onHiddenColumnsChange !== undefined,
    );
  });

  const selectionMultiple = derived(() => {
    return isDataTableSelectionMultiple(merged.selectionMode);
  });

  const serverPaged = derived(() => {
    return isDataTableServerPaged(
      merged.page,
      merged.pageCount,
      merged.totalCount,
    );
  });

  const clientPaged = derived(() => {
    return isDataTableClientPaged(
      merged.page,
      merged.perPage,
      merged.pageCount,
      merged.totalCount,
    );
  });

  const resolvedPerPage = derived(() => {
    return getDataTableResolvedPerPage(merged.perPage);
  });

  const stickyHeaderEnabled = derived(() => {
    return isDataTableStickyHeader(merged.stickyHeader);
  });

  const stickyHeaderBoxed = derived(() => {
    return isDataTableStickyHeaderBoxed(merged.stickyHeader);
  });

  const sortingState = useMemo((): SortingState => {
    return merged.sorting
      ? [{ id: merged.sorting.id, desc: merged.sorting.desc }]
      : [];
  }, [merged.sorting]);

  const columnFilters = useMemo((): ColumnFiltersState => {
    return map(merged.filters ?? {}, (value, id) => {
      return { id, value };
    });
  }, [merged.filters]);

  const rowSelection = useMemo((): RowSelectionState => {
    return selectionToRowSelection(merged.selection);
  }, [merged.selection]);

  const columnVisibility = useMemo((): VisibilityState => {
    return fromPairs(
      hiddenColumns.map((id) => {
        return [id, false];
      }),
    );
  }, [hiddenColumns]);

  const tableState = useMemo(() => {
    return {
      rowSelection,
      columnFilters,
      columnVisibility,
      sorting: sortingState,
    };
  }, [columnFilters, columnVisibility, rowSelection, sortingState]);

  const columnDefs = useMemo((): ColumnDef<T>[] => {
    const defs: ColumnDef<T>[] = columns.map((column) => {
      return {
        id: column.id,
        enableSorting: column.sortable === true,
        enableHiding: column.hideable !== false,
        enableColumnFilter: isDataTableColumnFilterable(column),
        header: () => {
          return column.header;
        },
        cell: (info) => {
          return column.cell?.(info.row.original) ?? null;
        },
        accessorFn: (row) => {
          return getDataTableColumnAccessor(row, column);
        },
        filterFn: (row, columnId, filterValue) => {
          const values = isArray(filterValue) ? filterValue : [];

          if (isEmpty(values)) {
            return true;
          }

          return values.includes(String(row.getValue(columnId) ?? ""));
        },
      };
    });

    return compact([
      selectionEnabled
        ? { ...chromeColumn, id: DATATABLE_SELECTION_COLUMN_ID }
        : undefined,
      expandEnabled
        ? { ...chromeColumn, id: DATATABLE_EXPAND_COLUMN_ID }
        : undefined,
      ...defs,
    ]);
  }, [columns, expandEnabled, selectionEnabled]);

  const getRowId = useCallback((row: T, index: number) => {
    return resolveDataTableRowId(row, index, mergedRef.current.getRowId);
  }, []);

  const onRowSelectionChange = useCallback<OnChangeFn<RowSelectionState>>(
    (updater) => {
      const current = selectionToRowSelection(mergedRef.current.selection);
      const next = isFunction(updater) ? updater(current) : updater;

      mergedRef.current.onSelectionChange?.(rowSelectionToIds(next));
    },
    [],
  );

  const onSortingChange = useCallback<OnChangeFn<SortingState>>((updater) => {
    const current = mergedRef.current.sorting
      ? [
          {
            id: mergedRef.current.sorting.id,
            desc: mergedRef.current.sorting.desc,
          },
        ]
      : [];
    const next = isFunction(updater) ? updater(current) : updater;
    const first = head(next);

    mergedRef.current.onSortingChange?.(
      first ? { id: first.id, desc: first.desc } : null,
    );
  }, []);

  const table = useReactTable({
    getRowId,
    data: rows,
    onSortingChange,
    state: tableState,
    columns: columnDefs,
    onRowSelectionChange,
    manualSorting: serverPaged,
    enableSortingRemoval: true,
    manualFiltering: serverPaged,
    enableHiding: visibilityEnabled,
    enableRowSelection: selectionEnabled,
    getCoreRowModel: dataTableCoreRowModel,
    enableMultiRowSelection: selectionMultiple,
    getSortedRowModel: serverPaged ? undefined : dataTableSortedRowModel,
    getFilteredRowModel: serverPaged ? undefined : dataTableFilteredRowModel,
  });

  const tableRowModelRows = table.getRowModel().rows;

  const searchedRows = useMemo(() => {
    if (serverPaged) {
      return tableRowModelRows;
    }

    const query = merged.search ?? "";

    return tableRowModelRows.filter((row) => {
      if (
        !rowMatchesDataTableColumnSearch(
          row.original,
          columns,
          merged.columnSearch,
          hiddenColumns,
        )
      ) {
        return false;
      }

      if (query.trim().length === 0) {
        return true;
      }

      return columns.some((column) => {
        if (hiddenColumns.includes(column.id)) {
          return false;
        }

        return matchDataTableSearch(
          getDataTableColumnAccessor(row.original, column),
          query,
        );
      });
    });
  }, [
    columns,
    serverPaged,
    hiddenColumns,
    merged.search,
    tableRowModelRows,
    merged.columnSearch,
  ]);

  const pagedRows = useMemo(() => {
    if (!clientPaged) {
      return searchedRows;
    }

    return sliceDataTablePage(searchedRows, merged.page ?? 1, resolvedPerPage);
  }, [clientPaged, merged.page, resolvedPerPage, searchedRows]);

  const pageIds = useMemo(() => {
    return map(pagedRows, "id");
  }, [pagedRows]);

  const selectAllState = useMemo(() => {
    return getDataTableSelectAllState(pageIds, selectionIds);
  }, [pageIds, selectionIds]);

  const headerViews = useMemo((): DataTableHeaderView[] => {
    const headerGroup = head(table.getHeaderGroups());
    const metas = (headerGroup?.headers ?? []).map((header) => {
      const column = get(columnsById, header.column.id) as
        undefined | DataTableColumn<T>;

      return {
        column,
        id: header.column.id,
        width: column?.width,
        sticky: column?.sticky,
        isExpand: header.column.id === DATATABLE_EXPAND_COLUMN_ID,
        isSelection: header.column.id === DATATABLE_SELECTION_COLUMN_ID,
      };
    });
    const insets = getDataTableStickyInsets(
      metas,
      stickyHeaderEnabled ? 20 : 10,
    );

    return metas.map((meta) => {
      const inset = get(insets, meta.id) as undefined | DataTableStickyInset;
      const ariaSort = meta.column?.sortable
        ? getDataTableAriaSort(merged.sorting ?? null, meta.id)
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
        searchQuery: getDataTableColumnSearch(merged.columnSearch, meta.id),
        filterValues: getDataTableColumnFilterValues(merged.filters, meta.id),
        filterActive:
          isDataTableColumnFiltered(merged.filters, meta.id) ||
          isDataTableColumnSearched(merged.columnSearch, meta.id),
      };
    });
  }, [
    columnDefs,
    columnsById,
    sortingState,
    merged.filters,
    merged.sorting,
    columnVisibility,
    tableRowModelRows,
    merged.columnSearch,
    stickyHeaderEnabled,
  ]);

  const rowViews = useMemo((): DataTableRowView<T>[] => {
    const insets = getDataTableStickyInsets(
      headerViews.map((header) => {
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

    return pagedRows.map((row) => {
      return {
        id: row.id,
        original: row.original,
        expanded: expandedIds.includes(row.id),
        selected: selectionIds.includes(row.id),
        cells: row.getVisibleCells().map((cell) => {
          const column = get(columnsById, cell.column.id) as
            undefined | DataTableColumn<T>;
          const inset = get(insets, cell.column.id) as
            undefined | DataTableStickyInset;
          const accessor = column
            ? getDataTableColumnAccessor(row.original, column)
            : undefined;
          const tooltip =
            column?.ellipsis === true && !isNil(accessor) && accessor !== ""
              ? String(accessor)
              : undefined;

          return {
            tooltip,
            value: accessor,
            id: cell.column.id,
            width: column?.width,
            align: column?.align,
            sticky: inset?.sticky,
            classes: column?.classes,
            stickyStyle: inset?.style,
            stickyEdge: inset?.edge === true,
            ellipsis: column?.ellipsis === true,
            isExpand: cell.column.id === DATATABLE_EXPAND_COLUMN_ID,
            isSelection: cell.column.id === DATATABLE_SELECTION_COLUMN_ID,
            content: column?.cell
              ? column.cell(row.original)
              : getDataTableDefaultCellContent(accessor),
          };
        }),
      };
    });
  }, [columnsById, expandedIds, headerViews, pagedRows, selectionIds]);

  const columnCount = derived(() => {
    return headerViews.length;
  });

  const showPagination = derived(() => {
    return (
      Boolean(slots?.pagination) ||
      Boolean(slots?.perPage) ||
      serverPaged ||
      clientPaged
    );
  });

  const showPerPage = derived(() => {
    return isDataTablePerPageEnabled(
      merged.perPage,
      merged.onPerPageChange !== undefined,
      slots?.perPage !== undefined,
    );
  });

  const resolvedPageCount = useMemo(() => {
    return getDataTableResolvedPageCount({
      clientPaged,
      perPage: merged.perPage,
      pageCount: merged.pageCount,
      totalCount: merged.totalCount,
      filteredCount: searchedRows.length,
    });
  }, [
    clientPaged,
    merged.perPage,
    merged.pageCount,
    merged.totalCount,
    searchedRows.length,
  ]);

  const showEmpty = derived(() => {
    return rowViews.length === 0;
  });

  const paginationVariant = derived(() => {
    return getDataTablePaginationVariant(merged.variant);
  });

  const rootBind = useMemo(() => {
    return mergePartBind(customProps?.root, rootInheritedAttrs, {
      className: cn({
        [!stickyHeaderBoxed ? (get(mergedClasses, "root") ?? "") : ""]: true,
      }),
    });
  }, [customProps?.root, mergedClasses, rootInheritedAttrs, stickyHeaderBoxed]);

  const [stickyPing, setStickyPing] = useState({ end: false, start: false });
  const [tableScrollEl, setTableScrollElState] = useState<null | HTMLElement>(
    null,
  );
  const wrapperPropsRef = useRef(customProps?.wrapper);
  wrapperPropsRef.current = customProps?.wrapper;

  const applyStickyPing = useCallback((el: null | HTMLElement) => {
    setStickyPing((prev) => {
      const next = el
        ? getDataTableStickyPing(el.scrollLeft, el.scrollWidth, el.clientWidth)
        : { end: false, start: false };

      if (prev.end === next.end && prev.start === next.start) {
        return prev;
      }

      return next;
    });
  }, []);

  const setTableScrollEl = useCallback(
    (el: null | HTMLElement) => {
      setTableScrollElState((prev) => {
        return prev === el ? prev : el;
      });
      applyStickyPing(el);

      const wrapper = wrapperPropsRef.current as
        | undefined
        | (HTMLAttributes<HTMLDivElement> & {
            ref?: Ref<null | HTMLDivElement>;
          });
      const userRef = wrapper?.ref;

      if (isFunction(userRef)) {
        userRef(el as null | HTMLDivElement);
      } else if (userRef) {
        userRef.current = el as null | HTMLDivElement;
      }
    },
    [applyStickyPing],
  );

  const onTableScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      wrapperPropsRef.current?.onScroll?.(event);
      applyStickyPing(event.currentTarget);
    },
    [applyStickyPing],
  );

  useEffect(() => {
    if (!tableScrollEl || typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(() => {
      applyStickyPing(tableScrollEl);
    });
    observer.observe(tableScrollEl);

    return () => {
      observer.disconnect();
    };
  }, [tableScrollEl, applyStickyPing]);

  const [paginationInline, setPaginationInline] = useState(false);
  const [paginationEl, setPaginationEl] = useState<null | HTMLElement>(null);

  useLayoutEffect(() => {
    if (!paginationEl) {
      return;
    }

    return observeDataTablePaginationInline(paginationEl, (inline) => {
      setPaginationInline((prev) => {
        return prev === inline ? prev : inline;
      });
    });
  }, [paginationEl]);

  const tableProps = useMemo(() => {
    const hasStickyColumns = headerViews.some((header) => {
      return Boolean(header.stickyStyle);
    });

    return {
      size: merged.size,
      variant: merged.variant,
      rounded: merged.rounded,
      full: merged.full !== false,
      striped: merged.striped === true,
      stickyHeader: stickyHeaderEnabled,
      hoverable: merged.hoverable === true,
      customProps: {
        table: {
          ...customProps?.table,
          "aria-busy": merged.loading || undefined,
        },
        root: {
          ...customProps?.wrapper,
          ref: setTableScrollEl,
          onScroll: onTableScroll,
        },
      },
      classes: {
        row: get(mergedClasses, "row"),
        body: get(mergedClasses, "body"),
        cell: get(mergedClasses, "cell"),
        head: get(mergedClasses, "head"),
        header: cn({
          "relative z-40": merged.loading && merged.loadingVariant === "bar",
          [get(mergedClasses, "header") ?? ""]: true,
        }),
        table: cn({
          "border-separate border-spacing-0":
            hasStickyColumns && !stickyHeaderEnabled,
          [get(mergedClasses, "table") ?? ""]: true,
        }),
        root: cn({
          "overflow-auto": stickyHeaderBoxed,
          [get(mergedClasses, "wrapper") ?? ""]: true,
          [stickyHeaderBoxed ? (get(mergedClasses, "root") ?? "") : ""]: true,
        }),
      },
    };
  }, [
    headerViews,
    merged.full,
    merged.size,
    mergedClasses,
    onTableScroll,
    merged.loading,
    merged.rounded,
    merged.striped,
    merged.variant,
    merged.hoverable,
    setTableScrollEl,
    stickyHeaderBoxed,
    customProps?.table,
    stickyHeaderEnabled,
    customProps?.wrapper,
    merged.loadingVariant,
  ]);

  const getHeadAlign = getDataTableHeadAlign;
  const getCellAlign = getDataTableCellAlign;

  const getHeadBind = useCallback(
    (header: DataTableHeaderView) => {
      const isChrome = header.isSelection || header.isExpand;

      return mergePartBind(
        customProps?.head,
        {},
        {
          tabIndex: header.sortable ? 0 : undefined,
          "aria-sort": header.sortable ? header.ariaSort : undefined,
          style: getDataTableColumnLayoutStyle(
            header,
            stickyHeaderEnabled,
            true,
          ),
          onClick: header.sortable
            ? (event: ReactMouseEvent<HTMLTableCellElement>) => {
                if (isDataTableHeadChromeEvent(event)) {
                  return;
                }

                mergedRef.current.onSortingChange?.(
                  toggleDataTableSorting(
                    mergedRef.current.sorting ?? null,
                    header.id,
                  ),
                );
              }
            : undefined,
          onKeyDown: header.sortable
            ? (event: ReactKeyboardEvent<HTMLTableCellElement>) => {
                if (isDataTableHeadChromeEvent(event)) {
                  return;
                }

                if (event.key !== "Enter" && event.key !== " ") {
                  return;
                }

                event.preventDefault();
                mergedRef.current.onSortingChange?.(
                  toggleDataTableSorting(
                    mergedRef.current.sorting ?? null,
                    header.id,
                  ),
                );
              }
            : undefined,
          className: cn({
            "min-w-0": true,
            relative: header.sortable,
            "border-e-0": isChrome,
            "sticky z-20": Boolean(header.stickyStyle),
            "after:hidden": isChrome,
            "cursor-pointer hover:bg-dark-500/10 dark:hover:bg-dark-500/15":
              header.sortable,
            [get(variantItem, "cellStickyEdgeStart") ?? ""]:
              header.sticky === "start" &&
              header.stickyEdge &&
              stickyPing.start,
            [get(variantItem, "cellStickyEdgeEnd") ?? ""]:
              header.sticky === "end" && header.stickyEdge && stickyPing.end,
            [header.classes?.header ?? ""]: true,
          }),
        },
      );
    },
    [
      merged.size,
      variantItem,
      merged.loading,
      merged.rounded,
      merged.striped,
      merged.variant,
      stickyPing.end,
      customProps?.head,
      merged.hoverable,
      stickyPing.start,
      merged.stickyHeader,
      stickyHeaderEnabled,
      merged.loadingVariant,
    ],
  );

  const getCellBind = useCallback(
    (cell: DataTableCellView) => {
      const isChrome = cell.isSelection || cell.isExpand;

      return mergePartBind(
        customProps?.cell,
        {},
        {
          style: getDataTableColumnLayoutStyle(cell, stickyHeaderEnabled),
          className: cn({
            "min-w-0": true,
            "border-e-0": isChrome,
            "after:hidden": isChrome,
            [get(variantItem, "cellSticky") ?? ""]: Boolean(cell.stickyStyle),
            [get(variantItem, "cellStickyEdgeStart") ?? ""]:
              cell.sticky === "start" && cell.stickyEdge && stickyPing.start,
            [get(variantItem, "cellStickyEdgeEnd") ?? ""]:
              cell.sticky === "end" && cell.stickyEdge && stickyPing.end,
            [cell.classes?.cell ?? ""]: true,
          }),
        },
      );
    },
    [
      merged.size,
      variantItem,
      merged.loading,
      merged.rounded,
      merged.striped,
      merged.variant,
      stickyPing.end,
      customProps?.cell,
      merged.hoverable,
      stickyPing.start,
      merged.stickyHeader,
      stickyHeaderEnabled,
      merged.loadingVariant,
    ],
  );

  const toolbarBind = useMemo(() => {
    return mergePartBind(
      customProps?.toolbar,
      {},
      {
        className: cn({
          "flex items-center justify-between gap-3 pb-3": true,
          [get(mergedClasses, "toolbar") ?? ""]: true,
        }),
      },
    );
  }, [customProps?.toolbar, mergedClasses]);

  const emptyBind = useMemo(() => {
    return mergePartBind(
      customProps?.empty,
      {},
      {
        className: cn({
          "flex flex-col items-center justify-center gap-2 py-12 text-sm text-dark-400 dark:text-dark-500": true,
          [get(mergedClasses, "empty") ?? ""]: true,
        }),
      },
    );
  }, [customProps?.empty, mergedClasses]);

  const loadingBind = useMemo(() => {
    return mergePartBind(
      customProps?.loading,
      {},
      {
        className: cn({
          "absolute inset-0 z-30 bg-white/50 dark:bg-dark-900/50": true,
          "flex items-center justify-center": merged.loadingVariant !== "bar",
          [get(mergedClasses, "loading") ?? ""]: true,
        }),
      },
    );
  }, [customProps?.loading, merged.loadingVariant, mergedClasses]);

  const loadingBarBind = useMemo(() => {
    return mergePartBind(
      {},
      {},
      {
        className: cn({
          "pointer-events-none absolute inset-x-0 top-0 z-40": true,
        }),
      },
    );
  }, []);

  const frameBind = useMemo(() => {
    return mergePartBind(
      {},
      {},
      {
        className: cn({
          "w-fit min-w-0 max-w-full": merged.full === false,
        }),
      },
    );
  }, [merged.full]);

  const footerBind = useMemo(() => {
    return mergePartBind(
      customProps?.footer,
      {},
      {
        className: cn({
          "w-0 min-w-full": merged.full === false,
          "border-t border-dark-200 bg-dark-50 px-3 py-2.5 text-sm text-dark-600 dark:border-dark-700 dark:bg-dark-800 dark:text-dark-300": true,
          [get(mergedClasses, "footer") ?? ""]: true,
        }),
      },
    );
  }, [customProps?.footer, merged.full, mergedClasses]);

  const paginationBind = useMemo(() => {
    return mergePartBind(
      {},
      {},
      {
        ref: setPaginationEl,
        className: cn({
          "flex items-center gap-3 py-3 [&>*]:shrink-0": true,
          "flex-col justify-center": showPerPage && !paginationInline,
          "flex-row": !showPerPage || paginationInline,
          "justify-end": !showPerPage,
          "justify-between": showPerPage && paginationInline,
          "w-full": merged.full !== false,
          "w-0 min-w-full": merged.full === false,
          [get(mergedClasses, "pagination") ?? ""]: true,
        }),
      },
    );
  }, [
    merged.full,
    showPerPage,
    mergedClasses,
    setPaginationEl,
    paginationInline,
  ]);

  const summaryCells = useMemo((): null | DataTableCellView[] => {
    const hasSummary = columns.some((column) => {
      return column.summary !== undefined;
    });

    if (!hasSummary) {
      return null;
    }

    const data = map(searchedRows, "original");

    return headerViews.map((header) => {
      const column = get(columnsById, header.id) as
        undefined | DataTableColumn<T>;

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
  }, [columns, columnsById, headerViews, searchedRows]);

  const visibilityItems = useMemo((): DataTableVisibilityItem[] => {
    return columns.map((column) => {
      return {
        id: column.id,
        hideable: column.hideable !== false,
        hidden: hiddenColumns.includes(column.id),
        label: isString(column.header) ? column.header : column.id,
      };
    });
  }, [columns, hiddenColumns]);

  const showSearch = derived(() => {
    return isDataTableSearchEnabled(
      merged.search,
      merged.onSearchChange !== undefined,
      slots?.search !== undefined,
    );
  });

  const showToolbar = derived(() => {
    return (
      Boolean(slots?.toolbar) ||
      Boolean(slots?.toolbarActions) ||
      visibilityEnabled ||
      showSearch
    );
  });

  const onToggleSort = useCallback((columnId: string) => {
    mergedRef.current.onSortingChange?.(
      toggleDataTableSorting(mergedRef.current.sorting ?? null, columnId),
    );
  }, []);

  const onToggleRow = useCallback((rowId: string, selected: boolean) => {
    mergedRef.current.onSelectionChange?.(
      setDataTableRowSelection(
        mergedRef.current.selection ?? [],
        rowId,
        selected,
        mergedRef.current.selectionMode,
      ),
    );
  }, []);

  const onTogglePage = useCallback(
    (selectAll: boolean) => {
      mergedRef.current.onSelectionChange?.(
        toggleDataTablePageSelection(
          mergedRef.current.selection ?? [],
          pageIds,
          selectAll,
        ),
      );
    },
    [pageIds],
  );

  const onChangePerPage = useCallback((next: number) => {
    mergedRef.current.onPerPageChange?.(next);

    if (mergedRef.current.page !== 1) {
      mergedRef.current.onPageChange?.(1);
    }
  }, []);

  const onChangeSearch = useCallback((query: string) => {
    mergedRef.current.onSearchChange?.(query);

    if (mergedRef.current.page !== 1) {
      mergedRef.current.onPageChange?.(1);
    }
  }, []);

  const paginationSlotProps = useMemo((): DataTablePaginationSlotProps => {
    return {
      page: merged.page ?? 1,
      variant: paginationVariant,
      count: resolvedPageCount ?? 1,
      onPageChange: (page) => {
        mergedRef.current.onPageChange?.(page);
      },
    };
  }, [merged.page, paginationVariant, resolvedPageCount]);

  const perPageSlotProps = useMemo((): DataTablePerPageSlotProps => {
    return {
      perPage: resolvedPerPage,
      onPerPageChange: onChangePerPage,
      options: getDataTablePerPageSelectOptions(
        resolvedPerPage,
        merged.perPageOptions,
      ),
    };
  }, [merged.perPageOptions, onChangePerPage, resolvedPerPage]);

  const onCommitColumnFilter = useCallback(
    (columnId: string, values: string[], query: string) => {
      const column = get(columnsById, columnId) as
        undefined | DataTableColumn<T>;

      if (column?.filters && column.filters.length > 0) {
        mergedRef.current.onFiltersChange?.(
          setDataTableColumnFilter(mergedRef.current.filters, columnId, values),
        );
      }

      if (isDataTableColumnSearchable(column)) {
        mergedRef.current.onColumnSearchChange?.(
          setDataTableColumnSearch(
            mergedRef.current.columnSearch,
            columnId,
            query,
          ),
        );
      }

      if (mergedRef.current.page !== 1) {
        mergedRef.current.onPageChange?.(1);
      }
    },
    [columnsById],
  );

  const onToggleExpand = useCallback((rowId: string, expanded: boolean) => {
    mergedRef.current.onExpandedChange?.(
      toggleDataTableRowExpansion(
        mergedRef.current.expanded ?? [],
        rowId,
        expanded,
      ),
    );
  }, []);

  const onToggleColumnVisibility = useCallback(
    (columnId: string, hide: boolean) => {
      mergedRef.current.onHiddenColumnsChange?.(
        toggleDataTableColumnVisibility(
          mergedRef.current.hiddenColumns ?? [],
          columnId,
          hide,
          map(columns, "id"),
        ),
      );
    },
    [columns],
  );

  const onHiddenColumnsChange = useCallback((ids: string[]) => {
    mergedRef.current.onHiddenColumnsChange?.(ids);
  }, []);

  return {
    slots,
    merged,
    pageIds,
    rowViews,
    rootBind,
    emptyBind,
    showEmpty,
    frameBind,
    tableProps,
    footerBind,
    showSearch,
    getHeadBind,
    headerViews,
    loadingBind,
    onToggleRow,
    toolbarBind,
    getCellBind,
    columnCount,
    clientPaged,
    serverPaged,
    showPerPage,
    showToolbar,
    getHeadAlign,
    getCellAlign,
    onTogglePage,
    onToggleSort,
    summaryCells,
    expandEnabled,
    onChangeSearch,
    loadingBarBind,
    paginationBind,
    selectAllState,
    showPagination,
    onToggleExpand,
    visibilityItems,
    onChangePerPage,
    resolvedPerPage,
    selectionEnabled,
    perPageSlotProps,
    paginationVariant,
    resolvedPageCount,
    selectionMultiple,
    visibilityEnabled,
    paginationSlotProps,
    onCommitColumnFilter,
    onHiddenColumnsChange,
    onToggleColumnVisibility,
    loadingBar: merged.loadingVariant === "bar",
  };
}
