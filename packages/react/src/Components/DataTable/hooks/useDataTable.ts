// ** External Imports
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";
import { get, omit } from "es-toolkit/compat";
import { useMemo, type CSSProperties, type ReactNode } from "react";

// ** Core Imports
import {
  DATATABLE_SELECTION_COLUMN_ID,
  getDataTableAriaSort,
  getDataTableColumnAccessor,
  getDataTableGridTemplate,
  getDataTablePaginationVariant,
  getDataTableSelectAllState,
  getDataTableSortIcon,
  isDataTableSelectionEnabled,
  isDataTableServerPaged,
  resolveDataTableRowId,
  rowSelectionToIds,
  selectionToRowSelection,
  toggleDataTablePageSelection,
  toggleDataTableRowSelection,
  toggleDataTableSorting,
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
  "loading",
  "sorting",
  "striped",
  "variant",
  "getRowId",
  "hoverable",
  "pageCount",
  "selection",
  "customProps",
  "onPageChange",
  "stickyHeader",
  "onSortingChange",
  "onSelectionChange",
] as const satisfies readonly (
  | "onPageChange"
  | "onSortingChange"
  | "onSelectionChange"
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
>;

type DataTableMerged<T> = MergeLibDefaults<
  DataTableOwnProps<T>,
  DataTableLibDefaults
> &
  Pick<
    DataTableProps<T>,
    "onPageChange" | "onSortingChange" | "onSelectionChange"
  >;

export type DataTableHeaderView = {
  align?: DataTableColumn<unknown>["align"];
  ariaSort: ReturnType<typeof getDataTableAriaSort>;
  header: ReactNode;
  id: string;
  isSelection: boolean;
  sortable: boolean;
  sortIcon: ReturnType<typeof getDataTableSortIcon>;
  width?: number | string;
};

export type DataTableCellView = {
  align?: DataTableColumn<unknown>["align"];
  content: ReactNode;
  id: string;
  isSelection: boolean;
  width?: number | string;
};

export type DataTableRowView = {
  cells: DataTableCellView[];
  id: string;
  selected: boolean;
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

  const serverPaged = derived(() => {
    return isDataTableServerPaged(merged.page, merged.pageCount);
  });

  const sortingState = useMemo((): SortingState => {
    return merged.sorting
      ? [{ id: merged.sorting.id, desc: merged.sorting.desc }]
      : [];
  }, [merged.sorting]);

  const rowSelection = useMemo((): RowSelectionState => {
    return selectionToRowSelection(merged.selection);
  }, [merged.selection]);

  const columnDefs = useMemo((): ColumnDef<T>[] => {
    const defs: ColumnDef<T>[] = columns.map((column) => {
      return {
        id: column.id,
        enableSorting: column.sortable === true,
        header: () => {
          return column.header;
        },
        cell: (info) => {
          return column.cell(info.row.original);
        },
        accessorFn: (row) => {
          return getDataTableColumnAccessor(row, column);
        },
      };
    });

    if (!selectionEnabled) {
      return defs;
    }

    return [
      {
        enableSorting: false,
        id: DATATABLE_SELECTION_COLUMN_ID,
        cell: () => {
          return null;
        },
        header: () => {
          return null;
        },
      },
      ...defs,
    ];
  }, [columns, selectionEnabled]);

  const table = useReactTable({
    data: rows,
    columns: columnDefs,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection,
      sorting: sortingState,
    },
    ...(serverPaged ? {} : { getSortedRowModel: getSortedRowModel() }),
    manualSorting: serverPaged,
    enableSortingRemoval: true,
    enableRowSelection: selectionEnabled,
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

    return (headerGroup?.headers ?? []).map((header) => {
      const column = columns.find((item) => {
        return item.id === header.column.id;
      });
      const isSelection = header.column.id === DATATABLE_SELECTION_COLUMN_ID;
      const ariaSort = column?.sortable
        ? getDataTableAriaSort(merged.sorting ?? null, header.column.id)
        : "none";

      return {
        ariaSort,
        isSelection,
        id: header.column.id,
        width: column?.width,
        align: column?.align,
        header: column?.header,
        sortable: column?.sortable === true,
        sortIcon: getDataTableSortIcon(ariaSort),
      };
    });
  });

  const rowViews = derived((): DataTableRowView[] => {
    return table.getRowModel().rows.map((row) => {
      return {
        id: row.id,
        selected: row.getIsSelected(),
        cells: row.getVisibleCells().map((cell) => {
          const column = columns.find((item) => {
            return item.id === cell.column.id;
          });

          return {
            id: cell.column.id,
            width: column?.width,
            align: column?.align,
            content: column ? column.cell(row.original) : null,
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
    return !merged.loading && rows.length === 0;
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
    const alignKey = header.isSelection ? "center" : (header.align ?? "start");
    const alignItem = get(alignClasses, alignKey);

    return mergePartBind(
      customProps?.head,
      {},
      {
        role: "columnheader",
        "aria-sort": header.sortable ? header.ariaSort : undefined,
        className: cn({
          "min-w-0": true,
          [get(sizeItem, "head") ?? ""]: true,
          [get(alignItem, "head") ?? ""]: true,
          [get(variantItem, "head") ?? ""]: true,
          [get(mergedClasses, "head") ?? ""]: true,
          [get(variantItem, "headSticky") ?? ""]: merged.stickyHeader === true,
        }),
      },
    );
  }

  function getCellBind(cell: DataTableCellView) {
    const alignKey = cell.isSelection ? "center" : (cell.align ?? "start");
    const alignItem = get(alignClasses, alignKey);

    return mergePartBind(
      customProps?.cell,
      {},
      {
        role: "cell",
        className: cn({
          "min-w-0": true,
          [get(sizeItem, "cell") ?? ""]: true,
          [get(alignItem, "cell") ?? ""]: true,
          [get(variantItem, "cell") ?? ""]: true,
          [get(mergedClasses, "cell") ?? ""]: true,
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

  function onToggleSort(columnId: string) {
    merged.onSortingChange?.(
      toggleDataTableSorting(merged.sorting ?? null, columnId),
    );
  }

  function onToggleRow(rowId: string, selected: boolean) {
    merged.onSelectionChange?.(
      toggleDataTableRowSelection(merged.selection ?? [], rowId, selected),
    );
  }

  function onTogglePage(selectAll: boolean) {
    merged.onSelectionChange?.(
      toggleDataTablePageSelection(merged.selection ?? [], pageIds, selectAll),
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
    onTogglePage,
    onToggleSort,
    spanCellBind,
    bodyGroupBind,
    headerRowBind,
    paginationBind,
    selectAllState,
    showPagination,
    headerGroupBind,
    selectionEnabled,
    paginationVariant,
  };
}
