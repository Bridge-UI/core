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
import { computed, useAttrs, useSlots, type Ref, type VNodeChild } from "vue";

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
  type DataTableFilters,
  type DataTableSorting,
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
  "paginationAlign",
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
  | "paginationAlign"
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

  const {
    merged,
    components,
    entry: bridgeDataTable,
  } = useBridgeUIComponent<DataTableMerged<T>, "DataTable">({
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

  const variantClasses = computed(() => {
    return mergeBridgeUILayeredClasses(
      variantProps,
      get(components.value, ["Table", "tokens", "variant"]),
    );
  });

  const variantItem = computed(() => {
    return get(variantClasses.value, merged.value.variant);
  });

  const columns = computed(() => {
    return merged.value.columns ?? [];
  });

  const columnsById = computed(() => {
    return keyBy(columns.value, "id");
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

  const stickyHeaderEnabled = computed(() => {
    return isDataTableStickyHeader(merged.value.stickyHeader);
  });

  const stickyHeaderBoxed = computed(() => {
    return isDataTableStickyHeaderBoxed(merged.value.stickyHeader);
  });

  const sortingState = computed((): SortingState => {
    return models.sorting.value
      ? [{ id: models.sorting.value.id, desc: models.sorting.value.desc }]
      : [];
  });

  const columnFilters = computed((): ColumnFiltersState => {
    return map(models.filters.value ?? {}, (value, id) => {
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
          const values = isArray(filterValue) ? filterValue : [];

          if (isEmpty(values)) {
            return true;
          }

          return values.includes(String(row.getValue(columnId) ?? ""));
        },
      };
    });

    return compact([
      selectionEnabled.value
        ? { ...chromeColumn, id: DATATABLE_SELECTION_COLUMN_ID }
        : undefined,
      expandEnabled.value
        ? { ...chromeColumn, id: DATATABLE_EXPAND_COLUMN_ID }
        : undefined,
      ...defs,
    ]);
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
      const next = isFunction(updater) ? updater(rowSelection.value) : updater;

      models.selection.value = rowSelectionToIds(next);
    },
    onSortingChange: (updater) => {
      const next = isFunction(updater) ? updater(sortingState.value) : updater;
      const first = head(next);

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
    return map(table.getRowModel().rows, "id");
  });

  const selectAllState = computed(() => {
    return getDataTableSelectAllState(
      pageIds.value,
      models.selection.value ?? [],
    );
  });

  const headerViews = computed((): DataTableHeaderView[] => {
    const headerGroup = head(table.getHeaderGroups());
    const metas = (headerGroup?.headers ?? []).map((header) => {
      const column = get(columnsById.value, header.column.id) as
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
      stickyHeaderEnabled.value ? 20 : 10,
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
        expanded: (models.expanded.value ?? []).includes(row.id),
        selected: (models.selection.value ?? []).includes(row.id),
        cells: row.getVisibleCells().map((cell) => {
          const column = get(columnsById.value, cell.column.id) as
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

  const columnCount = computed(() => {
    return headerViews.value.length;
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

  const tableProps = computed(() => {
    return {
      size: merged.value.size,
      variant: merged.value.variant,
      full: merged.value.full !== false,
      striped: merged.value.striped === true,
      stickyHeader: stickyHeaderEnabled.value,
      hoverable: merged.value.hoverable === true,
      customProps: {
        root: customProps.value?.wrapper,
        table: {
          ...customProps.value?.table,
          "aria-busy": merged.value.loading || undefined,
        },
      },
      classes: {
        row: get(mergedClasses.value, "row"),
        body: get(mergedClasses.value, "body"),
        cell: get(mergedClasses.value, "cell"),
        head: get(mergedClasses.value, "head"),
        table: get(mergedClasses.value, "table"),
        footer: get(mergedClasses.value, "footer"),
        header: get(mergedClasses.value, "header"),
        root: cn({
          "overflow-auto": stickyHeaderBoxed.value,
          [get(mergedClasses.value, "wrapper") ?? ""]: true,
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
  ) {
    const width = getDataTableColumnCssWidth(
      view.width,
      view.isExpand || view.isSelection,
    );

    return {
      ...(width ? { width, minWidth: width } : {}),
      ...view.stickyStyle,
      ...(header && view.stickyStyle ? { zIndex: 20 } : {}),
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
    return mergePartBind(
      customProps.value?.head,
      {},
      {
        style: getColumnLayoutStyle(header, true),
        "aria-sort": header.sortable ? header.ariaSort : undefined,
        class: cn({
          "min-w-0": true,
          [get(variantItem.value, "cellSticky") ?? ""]: Boolean(
            header.stickyStyle,
          ),
          "shadow-[4px_0_8px_-4px_rgba(15,23,42,0.16)]":
            header.sticky === "start" && header.stickyEdge,
          "shadow-[-4px_0_8px_-4px_rgba(15,23,42,0.16)]":
            header.sticky === "end" && header.stickyEdge,
        }),
      },
    );
  }

  function getCellBind(cell: DataTableCellView) {
    return mergePartBind(
      customProps.value?.cell,
      {},
      {
        style: getColumnLayoutStyle(cell),
        class: cn({
          "min-w-0": true,
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
          "flex py-3": true,
          [getDataTablePaginationAlignClass(merged.value.paginationAlign)]:
            true,
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
      map(columns.value, "id"),
    );
  }

  const summaryCells = computed((): null | DataTableCellView[] => {
    const hasSummary = columns.value.some((column) => {
      return column.summary !== undefined;
    });

    if (!hasSummary) {
      return null;
    }

    const data = map(table.getRowModel().rows, "original");

    return headerViews.value.map((header) => {
      const column = get(columnsById.value, header.id) as
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

  const visibilityItems = computed((): DataTableVisibilityItem[] => {
    return columns.value.map((column) => {
      return {
        id: column.id,
        hideable: column.hideable !== false,
        label: isString(column.header) ? column.header : column.id,
        hidden: (models.hiddenColumns.value ?? []).includes(column.id),
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
    tableProps,
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
