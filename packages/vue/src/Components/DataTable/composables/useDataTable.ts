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
import {
  computed,
  getCurrentInstance,
  onBeforeUnmount,
  ref,
  useAttrs,
  useSlots,
  type Ref,
  type VNode,
  type VNodeChild,
} from "vue";

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
  type DataTableColumnSearch,
  type DataTableFilterOption,
  type DataTableFilters,
  type DataTablePaginationSlotProps,
  type DataTablePerPageSlotProps,
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
  "stickyHeader",
  "filterOverlay",
  "hiddenColumns",
  "selectionMode",
  "columnsOverlay",
  "loadingVariant",
  "perPageOptions",
  "columnsShowFooter",
] as const satisfies readonly (keyof DataTableOwnProps<unknown>)[];

/**
 * Whether a header click landed on filter or selection chrome.
 */
function isDataTableHeadChromeEvent(event: Event) {
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
  header: VNodeChild;
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
  columnSearch: Ref<undefined | DataTableColumnSearch>;
  expanded: Ref<string[] | undefined>;
  filters: Ref<undefined | DataTableFilters>;
  hiddenColumns: Ref<string[] | undefined>;
  page: Ref<number | undefined>;
  perPage: Ref<number | undefined>;
  search: Ref<string | undefined>;
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

const EMPTY_ROWS: never[] = [];
const EMPTY_COLUMNS: never[] = [];
const EMPTY_IDS: string[] = [];
const dataTableCoreRowModel = getCoreRowModel();
const dataTableSortedRowModel = getSortedRowModel();
const dataTableFilteredRowModel = getFilteredRowModel();

export function useDataTable<T>(
  props: DataTableOwnProps<T>,
  libDefaults: DataTableLibDefaults,
  models: DataTableModels,
) {
  const attrs = useAttrs();
  const vueSlots = useSlots();
  const instance = getCurrentInstance();

  const split = computed(() => {
    return splitComponentProps<DataTableProps<T>, typeof dataTableBridgeKeys>({
      bridgeKeys: dataTableBridgeKeys,
      props: {
        ...attrs,
        ...props,
        page: models.page.value,
        perPage: models.perPage.value,
        filters: models.filters.value,
        sorting: models.sorting.value,
        expanded: models.expanded.value,
        selection: models.selection.value,
        columnSearch: models.columnSearch.value,
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
    return merged.value.columns ?? EMPTY_COLUMNS;
  });

  const columnsById = computed(() => {
    return keyBy(columns.value, "id");
  });

  const rows = computed(() => {
    return merged.value.rows ?? EMPTY_ROWS;
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
    return isDataTableServerPaged(
      models.page.value,
      merged.value.pageCount,
      merged.value.totalCount,
    );
  });

  const clientPaged = computed(() => {
    return isDataTableClientPaged(
      models.page.value,
      models.perPage.value,
      merged.value.pageCount,
      merged.value.totalCount,
    );
  });

  const resolvedPerPage = computed(() => {
    return getDataTableResolvedPerPage(models.perPage.value);
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

  const hiddenColumns = computed(() => {
    return models.hiddenColumns.value ?? EMPTY_IDS;
  });

  const columnVisibility = computed((): VisibilityState => {
    return fromPairs(
      hiddenColumns.value.map((id) => {
        return [id, false];
      }),
    );
  });

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
    getCoreRowModel: dataTableCoreRowModel,
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
      return serverPaged.value ? undefined : dataTableSortedRowModel;
    },
    getRowId: (row, index) => {
      return resolveDataTableRowId(row, index, merged.value.getRowId);
    },
    get getFilteredRowModel() {
      return serverPaged.value ? undefined : dataTableFilteredRowModel;
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

  const searchedRows = computed(() => {
    const source = table.getRowModel().rows;

    if (serverPaged.value) {
      return source;
    }

    const query = models.search.value ?? "";
    const hidden = hiddenColumns.value;

    return source.filter((row) => {
      if (
        !rowMatchesDataTableColumnSearch(
          row.original,
          columns.value,
          models.columnSearch.value,
          hidden,
        )
      ) {
        return false;
      }

      if (query.trim().length === 0) {
        return true;
      }

      return columns.value.some((column) => {
        if (hidden.includes(column.id)) {
          return false;
        }

        return matchDataTableSearch(
          getDataTableColumnAccessor(row.original, column),
          query,
        );
      });
    });
  });

  const pagedRows = computed(() => {
    if (!clientPaged.value) {
      return searchedRows.value;
    }

    return sliceDataTablePage(
      searchedRows.value,
      models.page.value ?? 1,
      resolvedPerPage.value,
    );
  });

  const pageIds = computed(() => {
    return map(pagedRows.value, "id");
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
        searchQuery: getDataTableColumnSearch(
          models.columnSearch.value,
          meta.id,
        ),
        filterValues: getDataTableColumnFilterValues(
          models.filters.value,
          meta.id,
        ),
        filterActive:
          isDataTableColumnFiltered(models.filters.value, meta.id) ||
          isDataTableColumnSearched(models.columnSearch.value, meta.id),
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

    return pagedRows.value.map((row) => {
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
  });

  const columnCount = computed(() => {
    return headerViews.value.length;
  });

  const showPagination = computed(() => {
    return (
      Boolean(vueSlots.pagination) ||
      Boolean(vueSlots.perPage) ||
      serverPaged.value ||
      clientPaged.value
    );
  });

  const showPerPage = computed(() => {
    return isDataTablePerPageEnabled(
      models.perPage.value,
      instance?.vnode.props?.["onUpdate:perPage"] !== undefined,
      Boolean(vueSlots.perPage),
    );
  });

  const resolvedPageCount = computed(() => {
    return getDataTableResolvedPageCount({
      perPage: models.perPage.value,
      clientPaged: clientPaged.value,
      pageCount: merged.value.pageCount,
      totalCount: merged.value.totalCount,
      filteredCount: searchedRows.value.length,
    });
  });

  const showEmpty = computed(() => {
    return rowViews.value.length === 0;
  });

  const paginationVariant = computed(() => {
    return getDataTablePaginationVariant(merged.value.variant);
  });

  const rootBind = computed(() => {
    return mergePartBind(customProps.value?.root, rootInheritedAttrs.value, {
      class: cn({
        [!stickyHeaderBoxed.value
          ? (get(mergedClasses.value, "root") ?? "")
          : ""]: true,
      }),
    });
  });

  const hasStickyColumns = computed(() => {
    return headerViews.value.some((header) => {
      return Boolean(header.stickyStyle);
    });
  });

  const stickyPing = ref({ end: false, start: false });

  let tableScrollObserver: undefined | ResizeObserver;

  function applyStickyPing(el: null | HTMLElement) {
    const next = el
      ? getDataTableStickyPing(el.scrollLeft, el.scrollWidth, el.clientWidth)
      : { end: false, start: false };

    if (
      stickyPing.value.end !== next.end ||
      stickyPing.value.start !== next.start
    ) {
      stickyPing.value = next;
    }
  }

  function bindTableScrollEl(el: null | HTMLElement) {
    tableScrollObserver?.disconnect();
    tableScrollObserver = undefined;
    applyStickyPing(el);

    if (!el || typeof ResizeObserver === "undefined") {
      return;
    }

    tableScrollObserver = new ResizeObserver(() => {
      applyStickyPing(el);
    });
    tableScrollObserver.observe(el);
  }

  function onTableScroll(event: Event) {
    const userOnScroll = customProps.value?.wrapper?.onScroll;

    if (isFunction(userOnScroll)) {
      userOnScroll(event);
    }

    const target = event.currentTarget;

    if (target instanceof HTMLElement) {
      applyStickyPing(target);
    }
  }

  function callWrapperVnodeHook(
    key: "onVnodeMounted" | "onVnodeUnmounted",
    vnode: VNode,
  ) {
    const hook = (
      customProps.value?.wrapper as
        undefined | Record<string, (vnode: VNode) => void>
    )?.[key];

    if (isFunction(hook)) {
      hook(vnode);
    }
  }

  function onTableRootMounted(vnode: VNode) {
    callWrapperVnodeHook("onVnodeMounted", vnode);

    const el = vnode.el;
    bindTableScrollEl(el instanceof HTMLElement ? el : null);
  }

  function onTableRootUnmounted(vnode: VNode) {
    callWrapperVnodeHook("onVnodeUnmounted", vnode);
    bindTableScrollEl(null);
  }

  onBeforeUnmount(() => {
    bindTableScrollEl(null);
  });

  const tableProps = computed(() => {
    return {
      size: merged.value.size,
      variant: merged.value.variant,
      rounded: merged.value.rounded,
      full: merged.value.full !== false,
      striped: merged.value.striped === true,
      stickyHeader: stickyHeaderEnabled.value,
      hoverable: merged.value.hoverable === true,
      customProps: {
        table: {
          ...customProps.value?.table,
          "aria-busy": merged.value.loading || undefined,
        },
        root: {
          ...customProps.value?.wrapper,
          onScroll: onTableScroll,
          onVnodeMounted: onTableRootMounted,
          onVnodeUnmounted: onTableRootUnmounted,
        },
      },
      classes: {
        row: get(mergedClasses.value, "row"),
        body: get(mergedClasses.value, "body"),
        cell: get(mergedClasses.value, "cell"),
        head: get(mergedClasses.value, "head"),
        header: cn({
          "relative z-40":
            merged.value.loading && merged.value.loadingVariant === "bar",
          [get(mergedClasses.value, "header") ?? ""]: true,
        }),
        table: cn({
          "border-separate border-spacing-0":
            hasStickyColumns.value && !stickyHeaderEnabled.value,
          [get(mergedClasses.value, "table") ?? ""]: true,
        }),
        root: cn({
          "overflow-auto": stickyHeaderBoxed.value,
          [get(mergedClasses.value, "wrapper") ?? ""]: true,
          [stickyHeaderBoxed.value
            ? (get(mergedClasses.value, "root") ?? "")
            : ""]: true,
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
    const headerSticky = header && stickyHeaderEnabled.value;

    return {
      ...(width ? { width, maxWidth: width } : {}),
      ...view.stickyStyle,
      ...(header && view.stickyStyle && !headerSticky ? { zIndex: 20 } : {}),
      ...(headerSticky
        ? {
            top: 0,
            position: "sticky" as const,
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

    return mergePartBind(
      customProps.value?.head,
      {},
      {
        style: getColumnLayoutStyle(header, true),
        tabindex: header.sortable ? 0 : undefined,
        "aria-sort": header.sortable ? header.ariaSort : undefined,
        onClick: header.sortable
          ? (event: MouseEvent) => {
              if (isDataTableHeadChromeEvent(event)) {
                return;
              }

              onToggleSort(header.id);
            }
          : undefined,
        onKeydown: header.sortable
          ? (event: KeyboardEvent) => {
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
        class: cn({
          "min-w-0": true,
          relative: header.sortable,
          "border-e-0": isChrome,
          "sticky z-20": Boolean(header.stickyStyle),
          "after:hidden": isChrome,
          "cursor-pointer hover:bg-dark-500/10 dark:hover:bg-dark-500/15":
            header.sortable,
          [get(variantItem.value, "cellStickyEdgeStart") ?? ""]:
            header.sticky === "start" &&
            header.stickyEdge &&
            stickyPing.value.start,
          [get(variantItem.value, "cellStickyEdgeEnd") ?? ""]:
            header.sticky === "end" &&
            header.stickyEdge &&
            stickyPing.value.end,
          [header.classes?.header ?? ""]: true,
        }),
      },
    );
  }

  function getCellBind(cell: DataTableCellView) {
    const isChrome = cell.isSelection || cell.isExpand;

    return mergePartBind(
      customProps.value?.cell,
      {},
      {
        style: getColumnLayoutStyle(cell),
        class: cn({
          "min-w-0": true,
          "border-e-0": isChrome,
          "after:hidden": isChrome,
          [get(variantItem.value, "cellSticky") ?? ""]: Boolean(
            cell.stickyStyle,
          ),
          [get(variantItem.value, "cellStickyEdgeStart") ?? ""]:
            cell.sticky === "start" &&
            cell.stickyEdge &&
            stickyPing.value.start,
          [get(variantItem.value, "cellStickyEdgeEnd") ?? ""]:
            cell.sticky === "end" && cell.stickyEdge && stickyPing.value.end,
          [cell.classes?.cell ?? ""]: true,
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
          "flex items-center justify-between gap-3 pb-3": true,
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
          "flex flex-col items-center justify-center gap-2 py-12 text-sm text-dark-400 dark:text-dark-500": true,
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
          "absolute inset-0 z-30 bg-white/50 dark:bg-dark-900/50": true,
          "flex items-center justify-center":
            merged.value.loadingVariant !== "bar",
          [get(mergedClasses.value, "loading") ?? ""]: true,
        }),
      },
    );
  });

  const loadingBarBind = computed(() => {
    return mergePartBind(
      {},
      {},
      {
        class: cn({
          "pointer-events-none absolute inset-x-0 top-0 z-40": true,
        }),
      },
    );
  });

  const footerBind = computed(() => {
    return mergePartBind(
      customProps.value?.footer,
      {},
      {
        class: cn({
          "border-t border-dark-200 bg-dark-50 px-3 py-2.5 text-sm text-dark-600 dark:border-dark-700 dark:bg-dark-800 dark:text-dark-300": true,
          [get(mergedClasses.value, "footer") ?? ""]: true,
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
          "flex w-full flex-col items-center justify-center gap-3 py-3 sm:flex-row sm:gap-4": true,
          "sm:justify-end": !showPerPage.value,
          "sm:justify-between": showPerPage.value,
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

  function onChangePerPage(next: number) {
    models.perPage.value = next;

    if (models.page.value !== 1) {
      models.page.value = 1;
    }
  }

  function onChangeSearch(query: string) {
    models.search.value = query;

    if (models.page.value !== 1) {
      models.page.value = 1;
    }
  }

  const paginationSlotProps = computed((): DataTablePaginationSlotProps => {
    return {
      page: models.page.value ?? 1,
      variant: paginationVariant.value,
      count: resolvedPageCount.value ?? 1,
      onPageChange: (nextPage) => {
        models.page.value = nextPage;
      },
    };
  });

  const perPageSlotProps = computed((): DataTablePerPageSlotProps => {
    return {
      perPage: resolvedPerPage.value,
      onPerPageChange: onChangePerPage,
      options: getDataTablePerPageSelectOptions(
        resolvedPerPage.value,
        merged.value.perPageOptions,
      ),
    };
  });

  function onTogglePage(selectAll: boolean) {
    models.selection.value = toggleDataTablePageSelection(
      models.selection.value ?? [],
      pageIds.value,
      selectAll,
    );
  }

  function onCommitColumnFilter(
    columnId: string,
    values: string[],
    query: string,
  ) {
    const column = get(columnsById.value, columnId) as
      undefined | DataTableColumn<T>;

    if (column?.filters && column.filters.length > 0) {
      models.filters.value = setDataTableColumnFilter(
        models.filters.value,
        columnId,
        values,
      );
    }

    if (isDataTableColumnSearchable(column)) {
      models.columnSearch.value = setDataTableColumnSearch(
        models.columnSearch.value,
        columnId,
        query,
      );
    }

    if (models.page.value !== 1) {
      models.page.value = 1;
    }
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

  function onHiddenColumnsChange(ids: string[]) {
    models.hiddenColumns.value = ids;
  }

  const summaryCells = computed((): null | DataTableCellView[] => {
    const hasSummary = columns.value.some((column) => {
      return column.summary !== undefined;
    });

    if (!hasSummary) {
      return null;
    }

    const data = map(searchedRows.value, "original");

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
  });

  const visibilityItems = computed((): DataTableVisibilityItem[] => {
    return columns.value.map((column) => {
      return {
        id: column.id,
        hideable: column.hideable !== false,
        hidden: hiddenColumns.value.includes(column.id),
        label: isString(column.header) ? column.header : column.id,
      };
    });
  });

  const showSearch = computed(() => {
    return isDataTableSearchEnabled(
      models.search.value,
      instance?.vnode.props?.["onUpdate:search"] !== undefined,
      vueSlots.search !== undefined,
    );
  });

  const showToolbar = computed(() => {
    return (
      Boolean(vueSlots.toolbar) ||
      Boolean(vueSlots.toolbarActions) ||
      visibilityEnabled.value ||
      showSearch.value
    );
  });

  return {
    merged,
    pageIds,
    rowViews,
    rootBind,
    emptyBind,
    showEmpty,
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
    loadingBar: computed(() => {
      return merged.value.loadingVariant === "bar";
    }),
  };
}
