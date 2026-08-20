// ** External Imports
import {
  getCoreRowModel,
  getSortedRowModel,
  useVueTable,
  type ColumnDef,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/vue-table";
import { get, omit } from "es-toolkit/compat";
import { computed, useAttrs, useSlots, type Ref, type VNodeChild } from "vue";

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
  type DataTableSorting,
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
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const dataTableBridgeKeys = [
  "full",
  "page",
  "rows",
  "size",
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
  "stickyHeader",
] as const satisfies readonly (keyof DataTableOwnProps<unknown>)[];

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
>;

export type DataTableHeaderView = {
  align?: DataTableColumn<unknown>["align"];
  ariaSort: ReturnType<typeof getDataTableAriaSort>;
  header: VNodeChild;
  id: string;
  isSelection: boolean;
  sortable: boolean;
  sortIcon: ReturnType<typeof getDataTableSortIcon>;
  width?: number | string;
};

export type DataTableCellView = {
  align?: DataTableColumn<unknown>["align"];
  content: VNodeChild;
  id: string;
  isSelection: boolean;
  width?: number | string;
};

export type DataTableRowView = {
  cells: DataTableCellView[];
  id: string;
  selected: boolean;
};

export type DataTableModels = {
  page: Ref<number | undefined>;
  selection: Ref<string[] | undefined>;
  sorting: Ref<undefined | DataTableSorting>;
};

export function useDataTable<T>(
  props: DataTableOwnProps<T>,
  libDefaults: DataTableLibDefaults,
  models: DataTableModels,
) {
  const attrs = useAttrs();
  const vueSlots = useSlots();

  const split = computed(() => {
    return splitComponentProps<DataTableProps<T>, typeof dataTableBridgeKeys>({
      bridgeKeys: dataTableBridgeKeys,
      props: {
        ...attrs,
        ...props,
        page: models.page.value,
        sorting: models.sorting.value,
        selection: models.selection.value,
      },
    });
  });

  const { merged, entry: bridgeDataTable } = useBridgeUIComponent<
    DataTableMerged<T>,
    "DataTable"
  >({
    libDefaults,
    componentName: "DataTable",
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const rootInheritedAttrs = computed(() => {
    return omit(split.value.inheritedAttrs, ["children"]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeDataTable,
    props: () => split.value.componentProps,
  });

  const sizeClasses = computed(() => {
    return mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeDataTable.value?.tokens?.size,
    );
  });

  const variantClasses = computed(() => {
    return mergeBridgeUILayeredClasses(
      variantProps,
      bridgeDataTable.value?.tokens?.variant,
    );
  });

  const alignClasses = computed(() => {
    return mergeBridgeUILayeredClasses(
      alignProps,
      bridgeDataTable.value?.tokens?.align,
    ) as DataTableAlign;
  });

  const sizeItem = computed(() => {
    return get(sizeClasses.value, merged.value.size);
  });

  const variantItem = computed(() => {
    return get(variantClasses.value, merged.value.variant);
  });

  const columns = computed(() => {
    return merged.value.columns ?? [];
  });

  const rows = computed(() => {
    return merged.value.rows ?? [];
  });

  const selectionEnabled = computed(() => {
    return isDataTableSelectionEnabled(
      models.selection.value,
      attrs["onUpdate:selection"] !== undefined,
    );
  });

  const serverPaged = computed(() => {
    return isDataTableServerPaged(merged.value.page, merged.value.pageCount);
  });

  const sortingState = computed((): SortingState => {
    return models.sorting.value
      ? [{ id: models.sorting.value.id, desc: models.sorting.value.desc }]
      : [];
  });

  const rowSelection = computed((): RowSelectionState => {
    return selectionToRowSelection(models.selection.value);
  });

  const sortedRowModel = getSortedRowModel();

  const columnDefs = computed((): ColumnDef<T>[] => {
    const defs: ColumnDef<T>[] = columns.value.map((column) => {
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

    if (!selectionEnabled.value) {
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
  });

  const table = useVueTable({
    data: rows,
    enableSortingRemoval: true,
    getCoreRowModel: getCoreRowModel(),
    get columns() {
      return columnDefs.value;
    },
    get manualSorting() {
      return serverPaged.value;
    },
    get enableRowSelection() {
      return selectionEnabled.value;
    },
    get getSortedRowModel() {
      return serverPaged.value ? undefined : sortedRowModel;
    },
    getRowId: (row, index) => {
      return resolveDataTableRowId(row, index, merged.value.getRowId);
    },
    state: {
      get sorting() {
        return sortingState.value;
      },
      get rowSelection() {
        return rowSelection.value;
      },
    },
    onRowSelectionChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(rowSelection.value) : updater;

      models.selection.value = rowSelectionToIds(next);
    },
    onSortingChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(sortingState.value) : updater;
      const first = next[0];

      models.sorting.value = first ? { id: first.id, desc: first.desc } : null;
    },
  });

  const pageIds = computed(() => {
    return table.getRowModel().rows.map((row) => {
      return row.id;
    });
  });

  const selectAllState = computed(() => {
    return getDataTableSelectAllState(
      pageIds.value,
      models.selection.value ?? [],
    );
  });

  const headerViews = computed((): DataTableHeaderView[] => {
    const headerGroup = table.getHeaderGroups()[0];

    return (headerGroup?.headers ?? []).map((header) => {
      const column = columns.value.find((item) => {
        return item.id === header.column.id;
      });
      const isSelection = header.column.id === DATATABLE_SELECTION_COLUMN_ID;
      const ariaSort = column?.sortable
        ? getDataTableAriaSort(models.sorting.value ?? null, header.column.id)
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

  const rowViews = computed((): DataTableRowView[] => {
    return table.getRowModel().rows.map((row) => {
      return {
        id: row.id,
        selected: row.getIsSelected(),
        cells: row.getVisibleCells().map((cell) => {
          const column = columns.value.find((item) => {
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

  const gridStyle = computed(() => {
    return {
      display: "grid",
      gridTemplateColumns: getDataTableGridTemplate(headerViews.value),
    };
  });

  const showPagination = computed(() => {
    return Boolean(vueSlots.pagination) || serverPaged.value;
  });

  const showEmpty = computed(() => {
    return !merged.value.loading && rows.value.length === 0;
  });

  const paginationVariant = computed(() => {
    return getDataTablePaginationVariant(merged.value.variant);
  });

  const rootBind = computed(() => {
    return mergePartBind(customProps.value?.root, rootInheritedAttrs.value, {
      class: cn({
        [get(mergedClasses.value, "root") ?? ""]: true,
      }),
    });
  });

  const wrapperBind = computed(() => {
    return mergePartBind(
      customProps.value?.wrapper,
      {},
      {
        class: cn({
          "overflow-x-auto": merged.value.stickyHeader !== true,
          [get(sizeItem.value, "root") ?? ""]: true,
          [get(variantItem.value, "root") ?? ""]: true,
          [get(mergedClasses.value, "wrapper") ?? ""]: true,
        }),
      },
    );
  });

  const tableBind = computed(() => {
    return mergePartBind(
      customProps.value?.table,
      {},
      {
        role: "table",
        "aria-busy": merged.value.loading || undefined,
        class: cn({
          "min-w-full": merged.value.full === true,
          [get(sizeItem.value, "table") ?? ""]: true,
          [get(mergedClasses.value, "table") ?? ""]: true,
        }),
      },
    );
  });

  const headerGroupBind = computed(() => {
    return mergePartBind(
      customProps.value?.header,
      {},
      {
        role: "rowgroup",
        class: cn({
          [get(variantItem.value, "header") ?? ""]: true,
          [get(mergedClasses.value, "header") ?? ""]: true,
        }),
      },
    );
  });

  const bodyGroupBind = computed(() => {
    return mergePartBind(
      customProps.value?.body,
      {},
      {
        role: "rowgroup",
        class: cn({
          [get(variantItem.value, "body") ?? ""]: true,
          [get(mergedClasses.value, "body") ?? ""]: true,
        }),
      },
    );
  });

  const headerRowBind = computed(() => {
    return mergePartBind(
      customProps.value?.row,
      {},
      {
        role: "row",
        style: gridStyle.value,
        class: cn({
          [get(variantItem.value, "row") ?? ""]: true,
          [get(mergedClasses.value, "row") ?? ""]: true,
        }),
      },
    );
  });

  const bodyRowBind = computed(() => {
    return mergePartBind(
      customProps.value?.row,
      {},
      {
        role: "row",
        style: gridStyle.value,
        class: cn({
          [get(variantItem.value, "row") ?? ""]: true,
          [get(mergedClasses.value, "row") ?? ""]: true,
          [get(variantItem.value, "rowHover") ?? ""]:
            merged.value.hoverable === true,
          [get(variantItem.value, "rowStriped") ?? ""]:
            merged.value.striped === true,
        }),
      },
    );
  });

  const spanRowBind = computed(() => {
    return mergePartBind(
      customProps.value?.row,
      {},
      {
        role: "row",
        style: gridStyle.value,
        class: cn({
          [get(variantItem.value, "row") ?? ""]: true,
          [get(mergedClasses.value, "row") ?? ""]: true,
        }),
      },
    );
  });

  const spanCellBind = computed(() => {
    return mergePartBind(
      customProps.value?.cell,
      {},
      {
        role: "cell",
        style: { gridColumn: "1 / -1" },
        class: cn({
          "min-w-0": true,
          "text-center": true,
          [get(sizeItem.value, "cell") ?? ""]: true,
          [get(variantItem.value, "cell") ?? ""]: true,
          [get(mergedClasses.value, "cell") ?? ""]: true,
        }),
      },
    );
  });

  function getHeadBind(header: DataTableHeaderView) {
    const alignKey = header.isSelection ? "center" : (header.align ?? "start");
    const alignItem = get(alignClasses.value, alignKey);

    return mergePartBind(
      customProps.value?.head,
      {},
      {
        role: "columnheader",
        "aria-sort": header.sortable ? header.ariaSort : undefined,
        class: cn({
          "min-w-0": true,
          [get(sizeItem.value, "head") ?? ""]: true,
          [get(alignItem, "head") ?? ""]: true,
          [get(variantItem.value, "head") ?? ""]: true,
          [get(mergedClasses.value, "head") ?? ""]: true,
          [get(variantItem.value, "headSticky") ?? ""]:
            merged.value.stickyHeader === true,
        }),
      },
    );
  }

  function getCellBind(cell: DataTableCellView) {
    const alignKey = cell.isSelection ? "center" : (cell.align ?? "start");
    const alignItem = get(alignClasses.value, alignKey);

    return mergePartBind(
      customProps.value?.cell,
      {},
      {
        role: "cell",
        class: cn({
          "min-w-0": true,
          [get(sizeItem.value, "cell") ?? ""]: true,
          [get(alignItem, "cell") ?? ""]: true,
          [get(variantItem.value, "cell") ?? ""]: true,
          [get(mergedClasses.value, "cell") ?? ""]: true,
        }),
      },
    );
  }

  const toolbarBind = computed(() => {
    return mergePartBind(
      customProps.value?.toolbar,
      {},
      {
        class: cn({
          [get(mergedClasses.value, "toolbar") ?? ""]: true,
        }),
      },
    );
  });

  const emptyBind = computed(() => {
    return mergePartBind(
      customProps.value?.empty,
      {},
      {
        class: cn({
          [get(mergedClasses.value, "empty") ?? ""]: true,
        }),
      },
    );
  });

  const loadingBind = computed(() => {
    return mergePartBind(
      customProps.value?.loading,
      {},
      {
        class: cn({
          "flex justify-center py-6": true,
          [get(mergedClasses.value, "loading") ?? ""]: true,
        }),
      },
    );
  });

  const paginationBind = computed(() => {
    return mergePartBind(
      {},
      {},
      {
        class: cn({
          "flex justify-end py-3": true,
          [get(mergedClasses.value, "pagination") ?? ""]: true,
        }),
      },
    );
  });

  function onToggleSort(columnId: string) {
    models.sorting.value = toggleDataTableSorting(
      models.sorting.value ?? null,
      columnId,
    );
  }

  function onToggleRow(rowId: string, selected: boolean) {
    models.selection.value = toggleDataTableRowSelection(
      models.selection.value ?? [],
      rowId,
      selected,
    );
  }

  function onTogglePage(selectAll: boolean) {
    models.selection.value = toggleDataTablePageSelection(
      models.selection.value ?? [],
      pageIds.value,
      selectAll,
    );
  }

  return {
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
