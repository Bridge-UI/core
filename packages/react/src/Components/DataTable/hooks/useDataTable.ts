// ** External Imports
import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createSortedRowModel,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  useTable,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type OnChangeFn,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";
import {
  compact,
  fromPairs,
  get,
  head,
  isArray,
  isEmpty,
  isFunction,
  keyBy,
  map,
  omit,
} from "es-toolkit/compat";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
  type UIEvent,
} from "react";

// ** Core Imports
import {
  DATATABLE_AMBIGUOUS_PAGING_WARNING,
  DATATABLE_EXPAND_COLUMN_ID,
  DATATABLE_SELECTION_COLUMN_ID,
  getDataTableBodyInsets,
  getDataTableChromeTextClass,
  getDataTableColumnAccessor,
  getDataTableColumnLayoutStyle,
  getDataTableFooterLayout,
  getDataTableFooterTextClass,
  getDataTablePaginationSlotProps,
  getDataTablePerPageSelectOptions,
  getDataTableResolvedPageCount,
  getDataTableResolvedPerPage,
  getDataTableSelectAllState,
  getDataTableSelectionTotal,
  getDataTableStickyPing,
  getDataTableViewAlign,
  isDataTableClientPaged,
  isDataTableColumnFilterable,
  isDataTableColumnSearchable,
  isDataTableCursorPaged,
  isDataTableExpandEnabled,
  isDataTablePagingAmbiguous,
  isDataTablePerPageEnabled,
  isDataTableSearchEnabled,
  isDataTableSelectionEnabled,
  isDataTableSelectionMultiple,
  isDataTableServerPaged,
  isDataTableStickyHeader,
  isDataTableStickyHeaderBoxed,
  isDataTableVisibilityEnabled,
  resolveDataTableHeaderViews,
  resolveDataTableRowCells,
  resolveDataTableRowId,
  resolveDataTableSummaryCells,
  resolveDataTableVisibilityItems,
  rowMatchesDataTableColumnSearch,
  rowMatchesDataTableToolbarSearch,
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
  type DataTableCellView as CoreDataTableCellView,
  type DataTableHeaderView as CoreDataTableHeaderView,
  type DataTablePaginationSlotProps,
  type DataTablePerPageSlotProps,
  type DataTableSelectedSlotProps,
  type DataTableVisibilityItem,
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
  DataTableSorting,
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
  "cursor",
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
  "nextCursor",
  "prevCursor",
  "showSearch",
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
  "onCursorChange",
  "onSearchChange",
  "perPageOptions",
  "onFiltersChange",
  "onPerPageChange",
  "onSortingChange",
  "onExpandedChange",
  "columnsShowFooter",
  "onSelectionChange",
  "onColumnSearchChange",
  "showColumnVisibility",
  "onHiddenColumnsChange",
] as const satisfies readonly (
  | "onPageChange"
  | "onCursorChange"
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
    | "onCursorChange"
    | "onSearchChange"
    | "onFiltersChange"
    | "onPerPageChange"
    | "onSortingChange"
    | "onExpandedChange"
    | "onSelectionChange"
    | "onColumnSearchChange"
    | "onHiddenColumnsChange"
  >;

type DataTableAlign = NonNullable<DataTableColumn<unknown>["align"]>;

export type DataTableHeaderView = CoreDataTableHeaderView<
  ReactNode,
  DataTableAlign
>;

export type DataTableCellView = CoreDataTableCellView<
  ReactNode,
  DataTableAlign
>;

export type DataTableRowView<T = unknown> = {
  cells: DataTableCellView[];
  expanded: boolean;
  id: string;
  original: T;
  selected: boolean;
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
const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  rowSelectionFeature,
  columnFilteringFeature,
  columnVisibilityFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  sortFns: {
    text: sortFn_text,
    datetime: sortFn_datetime,
    alphanumeric: sortFn_alphanumeric,
  },
});

type DataTableFeatures = typeof dataTableFeatures;

export function useDataTable<T extends Record<string, unknown>>(
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

  const [uncontrolledSorting, setUncontrolledSorting] =
    useState<DataTableSorting>(null);
  const uncontrolledSortingRef = useRef(uncontrolledSorting);
  uncontrolledSortingRef.current = uncontrolledSorting;

  const resolvedSorting = derived(() => {
    return merged.sorting !== undefined ? merged.sorting : uncontrolledSorting;
  });

  const applySorting = useCallback((next: DataTableSorting) => {
    mergedRef.current.onSortingChange?.(next);

    if (mergedRef.current.sorting === undefined) {
      uncontrolledSortingRef.current = next;
      setUncontrolledSorting(next);
    }
  }, []);

  const [uncontrolledSearch, setUncontrolledSearch] = useState("");
  const uncontrolledSearchRef = useRef(uncontrolledSearch);
  uncontrolledSearchRef.current = uncontrolledSearch;

  const resolvedSearch = derived(() => {
    return merged.search !== undefined ? merged.search : uncontrolledSearch;
  });

  const [uncontrolledHiddenColumns, setUncontrolledHiddenColumns] =
    useState<string[]>(EMPTY_IDS);
  const uncontrolledHiddenColumnsRef = useRef(uncontrolledHiddenColumns);
  uncontrolledHiddenColumnsRef.current = uncontrolledHiddenColumns;

  const applySearch = useCallback((query: string) => {
    mergedRef.current.onSearchChange?.(query);

    if (mergedRef.current.search === undefined) {
      uncontrolledSearchRef.current = query;
      setUncontrolledSearch(query);
    }
  }, []);

  const applyHiddenColumns = useCallback((ids: string[]) => {
    mergedRef.current.onHiddenColumnsChange?.(ids);

    if (mergedRef.current.hiddenColumns === undefined) {
      uncontrolledHiddenColumnsRef.current = ids;
      setUncontrolledHiddenColumns(ids);
    }
  }, []);

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
    return merged.hiddenColumns !== undefined
      ? merged.hiddenColumns
      : uncontrolledHiddenColumns;
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
      merged.showColumnVisibility,
    );
  });

  const selectionMultiple = derived(() => {
    return isDataTableSelectionMultiple(merged.selectionMode);
  });

  const cursorPaged = derived(() => {
    return isDataTableCursorPaged({
      cursor: merged.cursor,
      nextCursor: merged.nextCursor,
      prevCursor: merged.prevCursor,
      hasCursorHandler: merged.onCursorChange !== undefined,
    });
  });

  const pagingAmbiguous = derived(() => {
    return isDataTablePagingAmbiguous(
      merged.page,
      merged.pageCount,
      merged.totalCount,
      cursorPaged,
    );
  });

  useEffect(() => {
    if (pagingAmbiguous && process.env.NODE_ENV !== "production") {
      console.warn(DATATABLE_AMBIGUOUS_PAGING_WARNING);
    }
  }, [pagingAmbiguous]);

  const serverPaged = derived(() => {
    return isDataTableServerPaged(
      merged.page,
      merged.pageCount,
      merged.totalCount,
      cursorPaged,
    );
  });

  const clientPaged = derived(() => {
    return isDataTableClientPaged(
      merged.page,
      merged.perPage,
      merged.pageCount,
      merged.totalCount,
      cursorPaged,
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
    return resolvedSorting
      ? [{ id: resolvedSorting.id, desc: resolvedSorting.desc }]
      : [];
  }, [resolvedSorting]);

  const columnFilters = useMemo((): ColumnFiltersState => {
    return map(merged.filters ?? {}, (value, id) => {
      return { id, value };
    });
  }, [merged.filters]);

  const rowSelection = useMemo((): RowSelectionState => {
    return selectionToRowSelection(merged.selection);
  }, [merged.selection]);

  const columnVisibility = useMemo((): ColumnVisibilityState => {
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

  const columnDefs = useMemo((): ColumnDef<DataTableFeatures, T>[] => {
    const defs: ColumnDef<DataTableFeatures, T>[] = columns.map((column) => {
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

  const onSortingChange = useCallback<OnChangeFn<SortingState>>(
    (updater) => {
      const currentSorting =
        mergedRef.current.sorting !== undefined
          ? (mergedRef.current.sorting ?? null)
          : uncontrolledSortingRef.current;
      const current = currentSorting
        ? [{ id: currentSorting.id, desc: currentSorting.desc }]
        : [];
      const next = isFunction(updater) ? updater(current) : updater;
      const first = head(next);

      applySorting(first ? { id: first.id, desc: first.desc } : null);
    },
    [applySorting],
  );

  const table = useTable({
    getRowId,
    data: rows,
    onSortingChange,
    state: tableState,
    columns: columnDefs,
    onRowSelectionChange,
    manualSorting: serverPaged,
    enableSortingRemoval: true,
    features: dataTableFeatures,
    manualFiltering: serverPaged,
    enableHiding: visibilityEnabled,
    enableRowSelection: selectionEnabled,
    enableMultiRowSelection: selectionMultiple,
  });

  const tableRowModelRows = table.getRowModel().rows;

  const searchedRows = useMemo(() => {
    if (serverPaged) {
      return tableRowModelRows;
    }

    const query = resolvedSearch;

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

      return rowMatchesDataTableToolbarSearch(
        row.original,
        columns,
        query,
        hiddenColumns,
      );
    });
  }, [
    columns,
    serverPaged,
    hiddenColumns,
    resolvedSearch,
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

    return resolveDataTableHeaderViews({
      filters: merged.filters,
      sorting: resolvedSorting,
      columnsById: columnsById,
      columnSearch: merged.columnSearch,
      stickyHeader: stickyHeaderEnabled,
      columnIds: (headerGroup?.headers ?? []).map((header) => {
        return header.column.id;
      }),
    });
  }, [
    columnDefs,
    columnsById,
    sortingState,
    merged.filters,
    resolvedSorting,
    columnVisibility,
    tableRowModelRows,
    merged.columnSearch,
    stickyHeaderEnabled,
  ]);

  const rowViews = useMemo((): DataTableRowView<T>[] => {
    const insets = getDataTableBodyInsets(headerViews);

    return pagedRows.map((row) => {
      return {
        id: row.id,
        original: row.original,
        expanded: expandedIds.includes(row.id),
        selected: selectionIds.includes(row.id),
        cells: resolveDataTableRowCells({
          insets,
          row: row.original,
          columnsById: columnsById,
          columnIds: row.getVisibleCells().map((cell) => {
            return cell.column.id;
          }),
        }),
      };
    });
  }, [columnsById, expandedIds, headerViews, pagedRows, selectionIds]);

  const columnCount = derived(() => {
    return headerViews.length;
  });

  const showSelected = derived(() => {
    return selectionEnabled;
  });

  const showPerPage = derived(() => {
    return isDataTablePerPageEnabled(
      merged.perPage,
      merged.onPerPageChange !== undefined,
      slots?.perPage !== undefined,
    );
  });

  const resolvedPageCount = useMemo(() => {
    if (cursorPaged) {
      return undefined;
    }

    return getDataTableResolvedPageCount({
      clientPaged,
      perPage: merged.perPage,
      pageCount: merged.pageCount,
      totalCount: merged.totalCount,
      filteredCount: searchedRows.length,
    });
  }, [
    clientPaged,
    cursorPaged,
    merged.perPage,
    merged.pageCount,
    merged.totalCount,
    searchedRows.length,
  ]);

  const showPager = derived(() => {
    return (
      Boolean(slots?.pagination) ||
      cursorPaged ||
      resolvedPageCount !== undefined
    );
  });

  const showFooterBar = derived(() => {
    return showSelected || showPager || showPerPage;
  });

  const showEmpty = derived(() => {
    return rowViews.length === 0;
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

  const tableProps = useMemo(() => {
    const hasEllipsisColumn = headerViews.some((header) => header.ellipsis);

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
        root: cn({
          "overflow-auto": stickyHeaderBoxed,
          [get(mergedClasses, "wrapper") ?? ""]: true,
          [stickyHeaderBoxed ? (get(mergedClasses, "root") ?? "") : ""]: true,
        }),
        table: cn({
          "w-full table-fixed": hasEllipsisColumn,
          "border-separate border-spacing-0":
            hasStickyColumns && !stickyHeaderEnabled,
          [get(mergedClasses, "table") ?? ""]: true,
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

  const getHeadAlign = getDataTableViewAlign<DataTableAlign>;
  const getCellAlign = getDataTableViewAlign<DataTableAlign>;

  const getHeadBind = useCallback(
    (header: DataTableHeaderView) => {
      const isChrome = header.isSelection || header.isExpand;

      return mergePartBind(
        customProps?.head,
        {},
        {
          "aria-sort": header.sortable ? header.ariaSort : undefined,
          style: getDataTableColumnLayoutStyle(
            header,
            stickyHeaderEnabled,
            true,
          ),
          className: cn({
            "min-w-0": true,
            "border-e-0": isChrome,
            "sticky z-20": Boolean(header.stickyStyle),
            "after:hidden": isChrome,
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
      merged.hoverable,
      stickyPing.start,
      customProps?.head,
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
            "overflow-hidden": cell.ellipsis,
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
      merged.hoverable,
      stickyPing.start,
      customProps?.cell,
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
          "w-full": true,
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
          "absolute inset-0 z-30 bg-white/50 dark:bg-dark-800/50": true,
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

  const chromeTextClass = useMemo(() => {
    return getDataTableChromeTextClass(merged.size, components);
  }, [components, merged.size]);

  const footerBind = useMemo(() => {
    return mergePartBind(
      customProps?.footer,
      {},
      {
        className: cn({
          "w-0 min-w-full": merged.full === false,
          "border-t border-dark-200 bg-dark-50 px-3 py-2.5 text-dark-600 dark:border-dark-700 dark:bg-dark-700/50 dark:text-dark-300": true,
          [getDataTableFooterTextClass(merged.size, components)]: true,
          [get(mergedClasses, "footer") ?? ""]: true,
        }),
      },
    );
  }, [
    components,
    merged.full,
    merged.size,
    mergedClasses,
    customProps?.footer,
  ]);

  const footerLayout = useMemo(() => {
    return getDataTableFooterLayout({
      showPager,
      showPerPage,
      showSelected,
    });
  }, [showPager, showPerPage, showSelected]);

  const perPageLabelBind = useMemo(() => {
    return mergePartBind(
      {},
      {},
      cn({
        "whitespace-nowrap": true,
        [chromeTextClass]: true,
      }),
    );
  }, [chromeTextClass]);

  const pageStatusBind = useMemo(() => {
    return mergePartBind(
      {},
      {},
      cn({
        "font-medium whitespace-nowrap": true,
        [chromeTextClass]: true,
      }),
    );
  }, [chromeTextClass]);

  const selectedBind = useMemo(() => {
    return mergePartBind(
      customProps?.selected,
      {},
      {
        className: cn({
          grow: footerLayout.breakpoint === null,
          "@lg/footer:grow": footerLayout.breakpoint === "compact",
          "@2xl/footer:grow": footerLayout.breakpoint === "wide",
          "whitespace-nowrap text-dark-500 dark:text-dark-400": true,
          [chromeTextClass]: true,
          [get(mergedClasses, "selected") ?? ""]: true,
        }),
      },
    );
  }, [
    mergedClasses,
    chromeTextClass,
    customProps?.selected,
    footerLayout.breakpoint,
  ]);

  const footerBarBind = useMemo(() => {
    return mergePartBind(
      customProps?.footerBar,
      {},
      {
        className: cn({
          "@container/footer": true,
          "w-full": merged.full !== false,
          "w-0 min-w-full": merged.full === false,
          [get(mergedClasses, "footerBar") ?? ""]: true,
        }),
      },
    );
  }, [merged.full, mergedClasses, customProps?.footerBar]);

  const paginationBind = useMemo(() => {
    return mergePartBind(
      {},
      {},
      {
        className: cn({
          "flex w-full items-center gap-3 py-3 [&>*]:shrink-0": true,
          "flex-row": footerLayout.breakpoint === null,
          "flex-col justify-center": footerLayout.breakpoint !== null,
          "@lg/footer:flex-row @lg/footer:flex-wrap @lg/footer:justify-between @lg/footer:[&>:last-child]:ml-auto":
            footerLayout.breakpoint === "compact",
          "@2xl/footer:flex-row @2xl/footer:flex-wrap @2xl/footer:justify-between @2xl/footer:[&>:last-child]:ml-auto":
            footerLayout.breakpoint === "wide",
          "justify-end": footerLayout.justify === "end",
          "justify-start": footerLayout.justify === "start",
          [get(mergedClasses, "pagination") ?? ""]: true,
        }),
      },
    );
  }, [footerLayout, mergedClasses]);

  const summaryCells = useMemo((): null | DataTableCellView[] => {
    return resolveDataTableSummaryCells({
      columns: columns,
      headers: headerViews,
      data: map(searchedRows, "original"),
    });
  }, [columns, columnsById, headerViews, searchedRows]);

  const visibilityItems = useMemo((): DataTableVisibilityItem[] => {
    return resolveDataTableVisibilityItems(columns, hiddenColumns);
  }, [columns, hiddenColumns]);

  const showSearch = derived(() => {
    return isDataTableSearchEnabled(
      merged.search,
      merged.onSearchChange !== undefined,
      slots?.search !== undefined,
      merged.showSearch,
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

  const onToggleSort = useCallback(
    (columnId: string) => {
      const current =
        mergedRef.current.sorting !== undefined
          ? (mergedRef.current.sorting ?? null)
          : uncontrolledSortingRef.current;

      applySorting(toggleDataTableSorting(current, columnId));
    },
    [applySorting],
  );

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

  const onChangeSearch = useCallback(
    (query: string) => {
      applySearch(query);

      if (mergedRef.current.page !== 1) {
        mergedRef.current.onPageChange?.(1);
      }
    },
    [applySearch],
  );

  const paginationSlotProps = useMemo((): DataTablePaginationSlotProps => {
    return getDataTablePaginationSlotProps({
      cursorPaged,
      page: merged.page,
      cursor: merged.cursor,
      count: resolvedPageCount,
      nextCursor: merged.nextCursor,
      prevCursor: merged.prevCursor,
      onPageChange: (page) => {
        mergedRef.current.onPageChange?.(page);
      },
      onCursorChange: (cursor) => {
        mergedRef.current.onCursorChange?.(cursor);
      },
    });
  }, [
    cursorPaged,
    merged.page,
    merged.cursor,
    merged.nextCursor,
    merged.prevCursor,
    resolvedPageCount,
  ]);

  const selectedSlotProps = useMemo((): DataTableSelectedSlotProps => {
    return {
      selectedCount: selectionIds.length,
      totalCount: getDataTableSelectionTotal({
        totalCount: merged.totalCount,
        filteredCount: searchedRows.length,
      }),
    };
  }, [merged.totalCount, searchedRows.length, selectionIds]);

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
      applyHiddenColumns(
        toggleDataTableColumnVisibility(
          mergedRef.current.hiddenColumns !== undefined
            ? (mergedRef.current.hiddenColumns ?? [])
            : uncontrolledHiddenColumnsRef.current,
          columnId,
          hide,
          map(columns, "id"),
        ),
      );
    },
    [applyHiddenColumns, columns],
  );

  const onHiddenColumnsChange = useCallback(
    (ids: string[]) => {
      applyHiddenColumns(ids);
    },
    [applyHiddenColumns],
  );

  return {
    slots,
    merged,
    pageIds,
    rowViews,
    rootBind,
    emptyBind,
    showEmpty,
    frameBind,
    showPager,
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
    cursorPaged,
    serverPaged,
    showPerPage,
    showToolbar,
    selectedBind,
    showSelected,
    getHeadAlign,
    getCellAlign,
    onTogglePage,
    onToggleSort,
    summaryCells,
    showFooterBar,
    expandEnabled,
    footerBarBind,
    onChangeSearch,
    loadingBarBind,
    paginationBind,
    pageStatusBind,
    selectAllState,
    onToggleExpand,
    visibilityItems,
    onChangePerPage,
    resolvedPerPage,
    selectionEnabled,
    perPageLabelBind,
    perPageSlotProps,
    selectedSlotProps,
    resolvedPageCount,
    selectionMultiple,
    visibilityEnabled,
    paginationSlotProps,
    onCommitColumnFilter,
    onHiddenColumnsChange,
    onToggleColumnVisibility,
    searchValue: resolvedSearch,
    loadingBar: merged.loadingVariant === "bar",
  };
}
