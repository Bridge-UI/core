// ** External Imports
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useVueTable,
  type ColumnDef,
  type ColumnFiltersState,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/vue-table";
import { fromPairs, get, omit } from "es-toolkit/compat";
import { computed, useAttrs, useSlots, type Ref, type VNodeChild } from "vue";

// ** Core Imports
import {
  DATATABLE_EXPAND_COLUMN_ID,
  DATATABLE_SELECTION_COLUMN_ID,
  getDataTableAriaSort,
  getDataTableColumnAccessor,
  getDataTableColumnFilterValues,
  getDataTableDefaultCellContent,
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
  type DataTableFilters,
  type DataTableSorting,
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
  "stickyHeader",
  "hiddenColumns",
  "selectionMode",
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
  | "selectionMode"
>;

type DataTableMerged<T> = MergeLibDefaults<
  DataTableOwnProps<T>,
  DataTableLibDefaults
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
  header: VNodeChild;
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
  content: VNodeChild;
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

export type DataTableModels = {
  expanded: Ref<string[] | undefined>;
  filters: Ref<undefined | DataTableFilters>;
  hiddenColumns: Ref<string[] | undefined>;
  page: Ref<number | undefined>;
  selection: Ref<string[] | undefined>;
  sorting: Ref<undefined | DataTableSorting>;
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
        filters: models.filters.value,
        sorting: models.sorting.value,
        expanded: models.expanded.value,
        selection: models.selection.value,
        hiddenColumns: models.hiddenColumns.value,
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

  const expandEnabled = computed(() => {
    return isDataTableExpandEnabled(
      models.expanded.value,
      attrs["onUpdate:expanded"] !== undefined,
      vueSlots.expanded !== undefined,
    );
  });

  const visibilityEnabled = computed(() => {
    return isDataTableVisibilityEnabled(
      models.hiddenColumns.value,
      attrs["onUpdate:hiddenColumns"] !== undefined,
    );
  });

  const selectionMultiple = computed(() => {
    return isDataTableSelectionMultiple(merged.value.selectionMode);
  });

  const serverPaged = computed(() => {
    return isDataTableServerPaged(merged.value.page, merged.value.pageCount);
  });

  const sortingState = computed((): SortingState => {
    return models.sorting.value
      ? [{ id: models.sorting.value.id, desc: models.sorting.value.desc }]
      : [];
  });

  const columnFilters = computed((): ColumnFiltersState => {
    return Object.entries(models.filters.value ?? {}).map(([id, value]) => {
      return { id, value };
    });
  });

  const rowSelection = computed((): RowSelectionState => {
    return selectionToRowSelection(models.selection.value);
  });

  const columnVisibility = computed((): VisibilityState => {
    return fromPairs(
      (models.hiddenColumns.value ?? []).map((id) => {
        return [id, false];
      }),
    );
  });

  const sortedRowModel = getSortedRowModel();
  const filteredRowModel = getFilteredRowModel();

  const columnDefs = computed((): ColumnDef<T>[] => {
    const defs: ColumnDef<T>[] = columns.value.map((column) => {
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
          const values = Array.isArray(filterValue) ? filterValue : [];

          if (values.length === 0) {
            return true;
          }

          return values.includes(String(row.getValue(columnId) ?? ""));
        },
      };
    });
    const leading: ColumnDef<T>[] = [];

    if (selectionEnabled.value) {
      leading.push({
        ...chromeColumn,
        id: DATATABLE_SELECTION_COLUMN_ID,
      });
    }

    if (expandEnabled.value) {
      leading.push({
        ...chromeColumn,
        id: DATATABLE_EXPAND_COLUMN_ID,
      });
    }

    return [...leading, ...defs];
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
    get manualFiltering() {
      return serverPaged.value;
    },
    get enableHiding() {
      return visibilityEnabled.value;
    },
    get enableRowSelection() {
      return selectionEnabled.value;
    },
    get enableMultiRowSelection() {
      return selectionMultiple.value;
    },
    get getSortedRowModel() {
      return serverPaged.value ? undefined : sortedRowModel;
    },
    get getFilteredRowModel() {
      return serverPaged.value ? undefined : filteredRowModel;
    },
    getRowId: (row, index) => {
      return resolveDataTableRowId(row, index, merged.value.getRowId);
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
    state: {
      get sorting() {
        return sortingState.value;
      },
      get rowSelection() {
        return rowSelection.value;
      },
      get columnFilters() {
        return columnFilters.value;
      },
      get columnVisibility() {
        return columnVisibility.value;
      },
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
    const metas = (headerGroup?.headers ?? []).map((header) => {
      const column = columns.value.find((item) => {
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
      merged.value.stickyHeader === true ? 20 : 3,
    );

    return metas.map((meta) => {
      const inset = get(insets, meta.id) as undefined | DataTableStickyInset;
      const ariaSort = meta.column?.sortable
        ? getDataTableAriaSort(models.sorting.value ?? null, meta.id)
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
        filterActive: isDataTableColumnFiltered(models.filters.value, meta.id),
        filterValues: getDataTableColumnFilterValues(
          models.filters.value,
          meta.id,
        ),
      };
    });
  });

  const rowViews = computed((): DataTableRowView<T>[] => {
    const insets = getDataTableStickyInsets(
      headerViews.value.map((header) => {
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
        expanded: (models.expanded.value ?? []).includes(row.id),
        cells: row.getVisibleCells().map((cell) => {
          const column = columns.value.find((item) => {
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
    return !merged.value.loading && rowViews.value.length === 0;
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
    const alignKey =
      header.isSelection || header.isExpand
        ? "center"
        : (header.align ?? "start");
    const alignItem = get(alignClasses.value, alignKey);

    return mergePartBind(
      customProps.value?.head,
      {},
      {
        role: "columnheader",
        style: header.stickyStyle,
        "aria-sort": header.sortable ? header.ariaSort : undefined,
        class: cn({
          "min-w-0": true,
          [get(sizeItem.value, "head") ?? ""]: true,
          [get(alignItem, "head") ?? ""]: true,
          [get(variantItem.value, "head") ?? ""]: true,
          [get(mergedClasses.value, "head") ?? ""]: true,
          [get(variantItem.value, "cellSticky") ?? ""]: Boolean(
            header.stickyStyle,
          ),
          [get(variantItem.value, "headSticky") ?? ""]:
            merged.value.stickyHeader === true,
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
    const alignItem = get(alignClasses.value, alignKey);

    return mergePartBind(
      customProps.value?.cell,
      {},
      {
        role: "cell",
        style: cell.stickyStyle,
        class: cn({
          "min-w-0": true,
          [get(sizeItem.value, "cell") ?? ""]: true,
          [get(alignItem, "cell") ?? ""]: true,
          [get(variantItem.value, "cell") ?? ""]: true,
          [get(mergedClasses.value, "cell") ?? ""]: true,
          [get(variantItem.value, "cellSticky") ?? ""]: Boolean(
            cell.stickyStyle,
          ),
          "shadow-[4px_0_8px_-4px_rgba(15,23,42,0.16)]":
            cell.sticky === "start" && cell.stickyEdge,
          "shadow-[-4px_0_8px_-4px_rgba(15,23,42,0.16)]":
            cell.sticky === "end" && cell.stickyEdge,
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
          "flex items-center justify-between gap-2": true,
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
    models.selection.value = setDataTableRowSelection(
      models.selection.value ?? [],
      rowId,
      selected,
      merged.value.selectionMode,
    );
  }

  function onTogglePage(selectAll: boolean) {
    models.selection.value = toggleDataTablePageSelection(
      models.selection.value ?? [],
      pageIds.value,
      selectAll,
    );
  }

  function onCommitColumnFilter(columnId: string, values: string[]) {
    models.filters.value = setDataTableColumnFilter(
      models.filters.value,
      columnId,
      values,
    );
  }

  function onToggleExpand(rowId: string, expanded: boolean) {
    models.expanded.value = toggleDataTableRowExpansion(
      models.expanded.value ?? [],
      rowId,
      expanded,
    );
  }

  function onToggleColumnVisibility(columnId: string, hide: boolean) {
    models.hiddenColumns.value = toggleDataTableColumnVisibility(
      models.hiddenColumns.value ?? [],
      columnId,
      hide,
      columns.value.map((column) => {
        return column.id;
      }),
    );
  }

  const footerGroupBind = computed(() => {
    return mergePartBind(
      customProps.value?.footer,
      {},
      {
        role: "rowgroup",
        class: cn({
          [get(mergedClasses.value, "footer") ?? ""]: true,
        }),
      },
    );
  });

  const summaryCells = computed((): null | DataTableCellView[] => {
    const hasSummary = columns.value.some((column) => {
      return column.summary !== undefined;
    });

    if (!hasSummary) {
      return null;
    }

    const data = table.getRowModel().rows.map((row) => {
      return row.original;
    });

    return headerViews.value.map((header) => {
      const column = columns.value.find((item) => {
        return item.id === header.id;
      });

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

  const visibilityItems = computed((): DataTableVisibilityItem[] => {
    return columns.value.map((column) => {
      return {
        id: column.id,
        hideable: column.hideable !== false,
        hidden: (models.hiddenColumns.value ?? []).includes(column.id),
        label: typeof column.header === "string" ? column.header : column.id,
      };
    });
  });

  const showToolbar = computed(() => {
    return Boolean(vueSlots.toolbar) || visibilityEnabled.value;
  });

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
