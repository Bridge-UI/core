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
import { fromPairs, get, omit } from "es-toolkit/compat";
import { useMemo, type CSSProperties, type ReactNode } from "react";

// ** Core Imports
import {
  DATATABLE_EXPAND_COLUMN_ID,
  DATATABLE_SELECTION_COLUMN_ID,
  getDataTableAriaSort,
  getDataTableColumnAccessor,
  getDataTableColumnFilterValues,
  getDataTableGridTemplate,
  getDataTablePaginationVariant,
  getDataTableSelectAllState,
  getDataTableSortIcon,
  getDataTableStickyInsets,
  isDataTableColumnFilterable,
  isDataTableColumnFiltered,
  isDataTableExpandEnabled,
  isDataTableSelectionEnabled,
  isDataTableSelectionMultiple,
  isDataTableServerPaged,
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
import {
  dataTableAlignProps as alignProps,
  dataTableSizeProps as sizeProps,
  dataTableVariantProps as variantProps,
  type DataTableAlign,
} from "@bridge-ui/core/Tokens";
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

type DataTableLibDefaults = LibDefaultsShape<
  DataTableOwnProps<unknown>,
  | "full"
  | "size"
  | "loading"
  | "striped"
  | "variant"
  | "hoverable"
  | "stickyHeader"
  | "selectionMode"
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

  const { merged, entry: bridgeDataTable } = useBridgeUIComponent<
    DataTableMerged<T>,
    "DataTable"
  >({
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

  const sizeClasses = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeDataTable?.tokens?.size,
    );
  }, [bridgeDataTable?.tokens?.size]);

  const variantClasses = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      variantProps,
      bridgeDataTable?.tokens?.variant,
    );
  }, [bridgeDataTable?.tokens?.variant]);

  const alignClasses = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      alignProps,
      bridgeDataTable?.tokens?.align,
    ) as DataTableAlign;
  }, [bridgeDataTable?.tokens?.align]);

  const sizeItem = derived(() => {
    return get(sizeClasses, merged.size);
  });

  const variantItem = derived(() => {
    return get(variantClasses, merged.variant);
  });

  const columns = derived(() => {
    return merged.columns ?? [];
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

  const sortingState = useMemo((): SortingState => {
    return merged.sorting
      ? [{ id: merged.sorting.id, desc: merged.sorting.desc }]
      : [];
  }, [merged.sorting]);

  const columnFilters = useMemo((): ColumnFiltersState => {
    return Object.entries(merged.filters ?? {}).map(([id, value]) => {
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
          return column.cell(info.row.original);
        },
        accessorFn: (row) => {
          return getDataTableColumnAccessor(row, column);
        },
        filterFn: (row, columnId, filterValue) => {
          const values = Array.isArray(filterValue) ? filterValue : [];

          if (values.length === 0) {
            return true;
          }

          return values.includes(String(row.getValue(columnId) ?? ""));
        },
      };
    });
    const leading: ColumnDef<T>[] = [];

    if (selectionEnabled) {
      leading.push({
        ...chromeColumn,
        id: DATATABLE_SELECTION_COLUMN_ID,
      });
    }

    if (expandEnabled) {
      leading.push({
        ...chromeColumn,
        id: DATATABLE_EXPAND_COLUMN_ID,
      });
    }

    return [...leading, ...defs];
  }, [columns, expandEnabled, selectionEnabled]);

  const table = useReactTable({
    data: rows,
    columns: columnDefs,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection,
      columnFilters,
      columnVisibility,
      sorting: sortingState,
    },
    ...(serverPaged
      ? {}
      : {
          getSortedRowModel: getSortedRowModel(),
          getFilteredRowModel: getFilteredRowModel(),
        }),
    manualSorting: serverPaged,
    enableSortingRemoval: true,
    manualFiltering: serverPaged,
    enableHiding: visibilityEnabled,
    enableRowSelection: selectionEnabled,
    enableMultiRowSelection: selectionMultiple,
    getRowId: (row, index) => {
      return resolveDataTableRowId(row, index, merged.getRowId);
    },
    onRowSelectionChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(rowSelection) : updater;

      merged.onSelectionChange?.(rowSelectionToIds(next));
    },
    onSortingChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(sortingState) : updater;
      const first = next[0];

      merged.onSortingChange?.(
        first ? { id: first.id, desc: first.desc } : null,
      );
    },
  });

  const pageIds = derived(() => {
    return table.getRowModel().rows.map((row) => {
      return row.id;
    });
  });

  const selectAllState = derived(() => {
    return getDataTableSelectAllState(pageIds, merged.selection ?? []);
  });

  const headerViews = derived((): DataTableHeaderView[] => {
    const headerGroup = table.getHeaderGroups()[0];
    const metas = (headerGroup?.headers ?? []).map((header) => {
      const column = columns.find((item) => {
        return item.id === header.column.id;
      });

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
      merged.stickyHeader === true ? 20 : 3,
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
        selected: row.getIsSelected(),
        expanded: (merged.expanded ?? []).includes(row.id),
        cells: row.getVisibleCells().map((cell) => {
          const column = columns.find((item) => {
            return item.id === cell.column.id;
          });
          const inset = get(insets, cell.column.id) as
            undefined | DataTableStickyInset;
          const accessor = column
            ? getDataTableColumnAccessor(row.original, column)
            : undefined;
          const tooltip =
            column?.ellipsis === true && accessor != null && accessor !== ""
              ? String(accessor)
              : undefined;

          return {
            tooltip,
            id: cell.column.id,
            width: column?.width,
            align: column?.align,
            sticky: inset?.sticky,
            stickyStyle: inset?.style,
            stickyEdge: inset?.edge === true,
            ellipsis: column?.ellipsis === true,
            content: column ? column.cell(row.original) : null,
            isExpand: cell.column.id === DATATABLE_EXPAND_COLUMN_ID,
            isSelection: cell.column.id === DATATABLE_SELECTION_COLUMN_ID,
          };
        }),
      };
    });
  });

  const gridStyle = derived((): CSSProperties => {
    return {
      display: "grid",
      gridTemplateColumns: getDataTableGridTemplate(headerViews),
    };
  });

  const showPagination = derived(() => {
    return Boolean(slots?.pagination) || serverPaged;
  });

  const showEmpty = derived(() => {
    return !merged.loading && rowViews.length === 0;
  });

  const paginationVariant = derived(() => {
    return getDataTablePaginationVariant(merged.variant);
  });

  const rootBind = derived(() => {
    return mergePartBind(customProps?.root, rootInheritedAttrs, {
      className: cn({
        [get(mergedClasses, "root") ?? ""]: true,
      }),
    });
  });

  const wrapperBind = derived(() => {
    return mergePartBind(
      customProps?.wrapper,
      {},
      {
        className: cn({
          "overflow-x-auto": merged.stickyHeader !== true,
          [get(sizeItem, "root") ?? ""]: true,
          [get(variantItem, "root") ?? ""]: true,
          [get(mergedClasses, "wrapper") ?? ""]: true,
        }),
      },
    );
  });

  const tableBind = derived(() => {
    return mergePartBind(
      customProps?.table,
      {},
      {
        role: "table",
        "aria-busy": merged.loading || undefined,
        className: cn({
          "min-w-full": merged.full === true,
          [get(sizeItem, "table") ?? ""]: true,
          [get(mergedClasses, "table") ?? ""]: true,
        }),
      },
    );
  });

  const headerGroupBind = derived(() => {
    return mergePartBind(
      customProps?.header,
      {},
      {
        role: "rowgroup",
        className: cn({
          [get(variantItem, "header") ?? ""]: true,
          [get(mergedClasses, "header") ?? ""]: true,
        }),
      },
    );
  });

  const bodyGroupBind = derived(() => {
    return mergePartBind(
      customProps?.body,
      {},
      {
        role: "rowgroup",
        className: cn({
          [get(variantItem, "body") ?? ""]: true,
          [get(mergedClasses, "body") ?? ""]: true,
        }),
      },
    );
  });

  const headerRowBind = derived(() => {
    return mergePartBind(
      customProps?.row,
      {},
      {
        role: "row",
        style: gridStyle,
        className: cn({
          [get(variantItem, "row") ?? ""]: true,
          [get(mergedClasses, "row") ?? ""]: true,
        }),
      },
    );
  });

  const bodyRowBind = derived(() => {
    return mergePartBind(
      customProps?.row,
      {},
      {
        role: "row",
        style: gridStyle,
        className: cn({
          [get(variantItem, "row") ?? ""]: true,
          [get(mergedClasses, "row") ?? ""]: true,
          [get(variantItem, "rowHover") ?? ""]: merged.hoverable === true,
          [get(variantItem, "rowStriped") ?? ""]: merged.striped === true,
        }),
      },
    );
  });

  const spanRowBind = derived(() => {
    return mergePartBind(
      customProps?.row,
      {},
      {
        role: "row",
        style: gridStyle,
        className: cn({
          [get(variantItem, "row") ?? ""]: true,
          [get(mergedClasses, "row") ?? ""]: true,
        }),
      },
    );
  });

  const spanCellBind = derived(() => {
    return mergePartBind(
      customProps?.cell,
      {},
      {
        role: "cell",
        style: { gridColumn: "1 / -1" },
        className: cn({
          "min-w-0": true,
          "text-center": true,
          [get(sizeItem, "cell") ?? ""]: true,
          [get(variantItem, "cell") ?? ""]: true,
          [get(mergedClasses, "cell") ?? ""]: true,
        }),
      },
    );
  });

  function getHeadBind(header: DataTableHeaderView) {
    const alignKey =
      header.isSelection || header.isExpand
        ? "center"
        : (header.align ?? "start");
    const alignItem = get(alignClasses, alignKey);

    return mergePartBind(
      customProps?.head,
      {},
      {
        role: "columnheader",
        style: header.stickyStyle,
        "aria-sort": header.sortable ? header.ariaSort : undefined,
        className: cn({
          "min-w-0": true,
          [get(sizeItem, "head") ?? ""]: true,
          [get(alignItem, "head") ?? ""]: true,
          [get(variantItem, "head") ?? ""]: true,
          [get(mergedClasses, "head") ?? ""]: true,
          [get(variantItem, "cellSticky") ?? ""]: Boolean(header.stickyStyle),
          [get(variantItem, "headSticky") ?? ""]: merged.stickyHeader === true,
          "shadow-[4px_0_8px_-4px_rgba(15,23,42,0.16)]":
            header.sticky === "start" && header.stickyEdge,
          "shadow-[-4px_0_8px_-4px_rgba(15,23,42,0.16)]":
            header.sticky === "end" && header.stickyEdge,
        }),
      },
    );
  }

  function getCellBind(cell: DataTableCellView) {
    const alignKey =
      cell.isSelection || cell.isExpand ? "center" : (cell.align ?? "start");
    const alignItem = get(alignClasses, alignKey);

    return mergePartBind(
      customProps?.cell,
      {},
      {
        role: "cell",
        style: cell.stickyStyle,
        className: cn({
          "min-w-0": true,
          [get(sizeItem, "cell") ?? ""]: true,
          [get(alignItem, "cell") ?? ""]: true,
          [get(variantItem, "cell") ?? ""]: true,
          [get(mergedClasses, "cell") ?? ""]: true,
          [get(variantItem, "cellSticky") ?? ""]: Boolean(cell.stickyStyle),
          "shadow-[4px_0_8px_-4px_rgba(15,23,42,0.16)]":
            cell.sticky === "start" && cell.stickyEdge,
          "shadow-[-4px_0_8px_-4px_rgba(15,23,42,0.16)]":
            cell.sticky === "end" && cell.stickyEdge,
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
          "flex justify-center py-6": true,
          [get(mergedClasses, "loading") ?? ""]: true,
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
          "flex justify-end py-3": true,
          [get(mergedClasses, "pagination") ?? ""]: true,
        }),
      },
    );
  });

  const footerGroupBind = derived(() => {
    return mergePartBind(
      customProps?.footer,
      {},
      {
        role: "rowgroup",
        className: cn({
          [get(mergedClasses, "footer") ?? ""]: true,
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

    const data = table.getRowModel().rows.map((row) => {
      return row.original;
    });

    return headerViews.map((header) => {
      const column = columns.find((item) => {
        return item.id === header.id;
      });

      return {
        id: header.id,
        ellipsis: false,
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
        label: typeof column.header === "string" ? column.header : column.id,
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
        columns.map((column) => {
          return column.id;
        }),
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
    tableBind,
    getHeadBind,
    headerViews,
    loadingBind,
    onToggleRow,
    toolbarBind,
    bodyRowBind,
    getCellBind,
    serverPaged,
    spanRowBind,
    wrapperBind,
    showToolbar,
    onTogglePage,
    onToggleSort,
    spanCellBind,
    summaryCells,
    bodyGroupBind,
    headerRowBind,
    paginationBind,
    selectAllState,
    showPagination,
    onToggleExpand,
    headerGroupBind,
    visibilityItems,
    footerGroupBind,
    selectionEnabled,
    paginationVariant,
    selectionMultiple,
    visibilityEnabled,
    onCommitColumnFilter,
    onToggleColumnVisibility,
  };
}
