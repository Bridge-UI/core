// ** External Imports
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
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
  getDataTableDefaultCellContent,
  getDataTablePaginationAlignClass,
  getDataTablePaginationVariant,
  getDataTableSelectAllState,
  getDataTableSortIcon,
  getDataTableStickyInsets,
  getDataTableStickyPing,
  isDataTableColumnFilterable,
  isDataTableColumnFiltered,
  isDataTableExpandEnabled,
  isDataTableSelectionEnabled,
  isDataTableSelectionMultiple,
  isDataTableServerPaged,
  isDataTableStickyHeader,
  isDataTableStickyHeaderBoxed,
  isDataTableVisibilityEnabled,
  resolveDataTableRowId,
  rowSelectionToIds,
  selectionToRowSelection,
  setDataTableColumnFilter,
  setDataTableRowSelection,
  toggleDataTableColumnVisibility,
  toggleDataTablePageSelection,
  toggleDataTableRowExpansion,
  toggleDataTableSorting,
  type DataTableFilterOption,
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
  "classes",
  "columns",
  "filters",
  "loading",
  "rounded",
  "sorting",
  "striped",
  "variant",
  "expanded",
  "getRowId",
  "hoverable",
  "pageCount",
  "selection",
  "customProps",
  "onPageChange",
  "stickyHeader",
  "hiddenColumns",
  "selectionMode",
  "onFiltersChange",
  "onSortingChange",
  "paginationAlign",
  "onExpandedChange",
  "onSelectionChange",
  "onHiddenColumnsChange",
] as const satisfies readonly (
  | "onPageChange"
  | "onFiltersChange"
  | "onSortingChange"
  | "onExpandedChange"
  | "onSelectionChange"
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
  | "selectionMode"
  | "paginationAlign"
>;

type DataTableMerged<T> = MergeLibDefaults<
  DataTableOwnProps<T>,
  DataTableLibDefaults
> &
  Pick<
    DataTableProps<T>,
    | "onPageChange"
    | "onFiltersChange"
    | "onSortingChange"
    | "onExpandedChange"
    | "onSelectionChange"
    | "onHiddenColumnsChange"
  >;

export type DataTableHeaderView = {
  align?: DataTableColumn<unknown>["align"];
  ariaSort: ReturnType<typeof getDataTableAriaSort>;
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
  sortable: boolean;
  sortIcon: ReturnType<typeof getDataTableSortIcon>;
  sticky?: DataTableStickyEdge;
  stickyEdge: boolean;
  stickyStyle?: DataTableStickyInset["style"];
  width?: number | string;
};

export type DataTableCellView = {
  align?: DataTableColumn<unknown>["align"];
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

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["children"]);
  });

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
    return merged.columns ?? [];
  });

  const columnsById = derived(() => {
    return keyBy(columns, "id");
  });

  const rows = derived(() => {
    return merged.rows ?? [];
  });

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
    return isDataTableServerPaged(merged.page, merged.pageCount);
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
      (merged.hiddenColumns ?? []).map((id) => {
        return [id, false];
      }),
    );
  }, [merged.hiddenColumns]);

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

  const table = useReactTable({
    data: rows,
    columns: columnDefs,
    manualSorting: serverPaged,
    enableSortingRemoval: true,
    manualFiltering: serverPaged,
    enableHiding: visibilityEnabled,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: selectionEnabled,
    enableMultiRowSelection: selectionMultiple,
    getSortedRowModel: serverPaged ? undefined : getSortedRowModel(),
    getFilteredRowModel: serverPaged ? undefined : getFilteredRowModel(),
    getRowId: (row, index) => {
      return resolveDataTableRowId(row, index, merged.getRowId);
    },
    state: {
      rowSelection,
      columnFilters,
      columnVisibility,
      sorting: sortingState,
    },
    onRowSelectionChange: (updater) => {
      const next = isFunction(updater) ? updater(rowSelection) : updater;

      merged.onSelectionChange?.(rowSelectionToIds(next));
    },
    onSortingChange: (updater) => {
      const next = isFunction(updater) ? updater(sortingState) : updater;
      const first = head(next);

      merged.onSortingChange?.(
        first ? { id: first.id, desc: first.desc } : null,
      );
    },
  });

  const pageIds = derived(() => {
    return map(table.getRowModel().rows, "id");
  });

  const selectAllState = derived(() => {
    return getDataTableSelectAllState(pageIds, merged.selection ?? []);
  });

  const headerViews = derived((): DataTableHeaderView[] => {
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
        isSelection: meta.isSelection,
        stickyEdge: inset?.edge === true,
        ellipsis: meta.column?.ellipsis === true,
        sortable: meta.column?.sortable === true,
        sortIcon: getDataTableSortIcon(ariaSort),
        hideable: meta.column?.hideable !== false,
        filterOptions: meta.column?.filters ?? [],
        filterable: isDataTableColumnFilterable(meta.column),
        filterMultiple: meta.column?.filterMultiple !== false,
        filterActive: isDataTableColumnFiltered(merged.filters, meta.id),
        filterValues: getDataTableColumnFilterValues(merged.filters, meta.id),
      };
    });
  });

  const rowViews = derived((): DataTableRowView<T>[] => {
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

    return table.getRowModel().rows.map((row) => {
      return {
        id: row.id,
        original: row.original,
        expanded: (merged.expanded ?? []).includes(row.id),
        selected: (merged.selection ?? []).includes(row.id),
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
  });

  const columnCount = derived(() => {
    return headerViews.length;
  });

  const showPagination = derived(() => {
    return Boolean(slots?.pagination) || serverPaged;
  });

  const showEmpty = derived(() => {
    return rowViews.length === 0;
  });

  const showFooter = derived(() => {
    return slots?.footer !== undefined;
  });

  const paginationVariant = derived(() => {
    return getDataTablePaginationVariant(merged.variant);
  });

  const rootBind = derived(() => {
    return mergePartBind(customProps?.root, rootInheritedAttrs, {
      className: cn({
        [!stickyHeaderBoxed ? (get(mergedClasses, "root") ?? "") : ""]: true,
      }),
    });
  });

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
  }, [applyStickyPing, tableScrollEl]);

  const tableProps = derived(() => {
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
        header: get(mergedClasses, "header"),
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
  });

  function getColumnLayoutStyle(
    view: {
      isExpand: boolean;
      isSelection: boolean;
      stickyStyle?: DataTableStickyInset["style"];
      width?: number | string;
    },
    header = false,
  ): CSSProperties {
    const width = getDataTableColumnCssWidth(
      view.width,
      view.isExpand || view.isSelection,
    );
    const headerSticky = header && stickyHeaderEnabled;

    return {
      ...(width ? { width, minWidth: width } : {}),
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

  function getHeadAlign(header: DataTableHeaderView) {
    return header.isSelection || header.isExpand
      ? "center"
      : (header.align ?? "start");
  }

  function getCellAlign(cell: DataTableCellView) {
    return cell.isSelection || cell.isExpand
      ? "center"
      : (cell.align ?? "start");
  }

  function getHeadBind(header: DataTableHeaderView) {
    const isChrome = header.isSelection || header.isExpand;
    const isStartPing =
      header.sticky === "start" && header.stickyEdge && stickyPing.start;

    return mergePartBind(
      customProps?.head,
      {},
      {
        style: getColumnLayoutStyle(header, true),
        tabIndex: header.sortable ? 0 : undefined,
        "aria-sort": header.sortable ? header.ariaSort : undefined,
        onClick: header.sortable
          ? (event: ReactMouseEvent<HTMLTableCellElement>) => {
              if (isDataTableHeadChromeEvent(event)) {
                return;
              }

              onToggleSort(header.id);
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
              onToggleSort(header.id);
            }
          : undefined,
        className: cn({
          "min-w-0": true,
          "border-e-0": isChrome,
          "sticky z-20": Boolean(header.stickyStyle),
          "after:hidden": isChrome && !isStartPing,
          "cursor-pointer hover:bg-dark-500/10 dark:hover:bg-dark-500/15":
            header.sortable,
          [get(variantItem, "cellStickyEdgeStart") ?? ""]:
            header.sticky === "start" && header.stickyEdge && stickyPing.start,
          [get(variantItem, "cellStickyEdgeEnd") ?? ""]:
            header.sticky === "end" && header.stickyEdge && stickyPing.end,
        }),
      },
    );
  }

  function getCellBind(cell: DataTableCellView) {
    const isChrome = cell.isSelection || cell.isExpand;
    const isStartPing =
      cell.sticky === "start" && cell.stickyEdge && stickyPing.start;

    return mergePartBind(
      customProps?.cell,
      {},
      {
        style: getColumnLayoutStyle(cell),
        className: cn({
          "min-w-0": true,
          "border-e-0": isChrome,
          "after:hidden": isChrome && !isStartPing,
          [get(variantItem, "cellSticky") ?? ""]: Boolean(cell.stickyStyle),
          [get(variantItem, "cellStickyEdgeStart") ?? ""]:
            cell.sticky === "start" && cell.stickyEdge && stickyPing.start,
          [get(variantItem, "cellStickyEdgeEnd") ?? ""]:
            cell.sticky === "end" && cell.stickyEdge && stickyPing.end,
        }),
      },
    );
  }

  const toolbarBind = derived(() => {
    return mergePartBind(
      customProps?.toolbar,
      {},
      {
        className: cn({
          "flex items-center justify-between gap-2": true,
          [get(mergedClasses, "toolbar") ?? ""]: true,
        }),
      },
    );
  });

  const emptyBind = derived(() => {
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
  });

  const loadingBind = derived(() => {
    return mergePartBind(
      customProps?.loading,
      {},
      {
        className: cn({
          "absolute inset-0 z-30 flex items-center justify-center bg-white/60 dark:bg-dark-900/60": true,
          [get(mergedClasses, "loading") ?? ""]: true,
        }),
      },
    );
  });

  const footerBind = derived(() => {
    return mergePartBind(
      customProps?.footer,
      {},
      {
        className: cn({
          "border-t border-dark-200 bg-dark-50 px-3 py-2.5 text-sm text-dark-600 dark:border-dark-700 dark:bg-dark-800 dark:text-dark-300": true,
          [get(mergedClasses, "footer") ?? ""]: true,
        }),
      },
    );
  });

  const paginationBind = derived(() => {
    return mergePartBind(
      {},
      {},
      {
        className: cn({
          "flex py-3": true,
          [getDataTablePaginationAlignClass(merged.paginationAlign)]: true,
          [get(mergedClasses, "pagination") ?? ""]: true,
        }),
      },
    );
  });

  const summaryCells = derived((): null | DataTableCellView[] => {
    const hasSummary = columns.some((column) => {
      return column.summary !== undefined;
    });

    if (!hasSummary) {
      return null;
    }

    const data = map(table.getRowModel().rows, "original");

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
  });

  const visibilityItems = derived((): DataTableVisibilityItem[] => {
    return columns.map((column) => {
      return {
        id: column.id,
        hideable: column.hideable !== false,
        hidden: (merged.hiddenColumns ?? []).includes(column.id),
        label: isString(column.header) ? column.header : column.id,
      };
    });
  });

  const showToolbar = derived(() => {
    return Boolean(slots?.toolbar) || visibilityEnabled;
  });

  function onToggleSort(columnId: string) {
    merged.onSortingChange?.(
      toggleDataTableSorting(merged.sorting ?? null, columnId),
    );
  }

  function onToggleRow(rowId: string, selected: boolean) {
    merged.onSelectionChange?.(
      setDataTableRowSelection(
        merged.selection ?? [],
        rowId,
        selected,
        merged.selectionMode,
      ),
    );
  }

  function onTogglePage(selectAll: boolean) {
    merged.onSelectionChange?.(
      toggleDataTablePageSelection(merged.selection ?? [], pageIds, selectAll),
    );
  }

  function onCommitColumnFilter(columnId: string, values: string[]) {
    merged.onFiltersChange?.(
      setDataTableColumnFilter(merged.filters, columnId, values),
    );
  }

  function onToggleExpand(rowId: string, expanded: boolean) {
    merged.onExpandedChange?.(
      toggleDataTableRowExpansion(merged.expanded ?? [], rowId, expanded),
    );
  }

  function onToggleColumnVisibility(columnId: string, hide: boolean) {
    merged.onHiddenColumnsChange?.(
      toggleDataTableColumnVisibility(
        merged.hiddenColumns ?? [],
        columnId,
        hide,
        map(columns, "id"),
      ),
    );
  }

  return {
    slots,
    merged,
    pageIds,
    rowViews,
    rootBind,
    emptyBind,
    showEmpty,
    showFooter,
    tableProps,
    footerBind,
    getHeadBind,
    headerViews,
    loadingBind,
    onToggleRow,
    toolbarBind,
    getCellBind,
    columnCount,
    serverPaged,
    showToolbar,
    getHeadAlign,
    getCellAlign,
    onTogglePage,
    onToggleSort,
    summaryCells,
    expandEnabled,
    paginationBind,
    selectAllState,
    showPagination,
    onToggleExpand,
    visibilityItems,
    selectionEnabled,
    paginationVariant,
    selectionMultiple,
    visibilityEnabled,
    onCommitColumnFilter,
    onToggleColumnVisibility,
  };
}
