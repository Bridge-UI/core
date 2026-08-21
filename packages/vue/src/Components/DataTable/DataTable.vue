<script setup lang="ts" generic="T">
// ** External Imports
import { computed, useId, useSlots, type VNodeChild } from "vue";

// ** Core Imports
import type {
  DataTableColumnSearch,
  DataTableFilters,
} from "@bridge-ui/core/Domain";
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import { useDataTable } from "@/Components/DataTable/composables/useDataTable";
import type {
  DataTableItemSlotProps,
  DataTableOwnProps,
  DataTableSlots,
  DataTableSorting,
} from "@/Components/DataTable/dataTable.types";
import DataTableColumnsMenu from "@/Components/DataTable/DataTableColumnsMenu.vue";
import DataTableFilterMenu from "@/Components/DataTable/DataTableFilterMenu.vue";
import DataTableSearch from "@/Components/DataTable/DataTableSearch.vue";
import DataTableSelection from "@/Components/DataTable/DataTableSelection.vue";
import DataTableSortButton from "@/Components/DataTable/DataTableSortButton.vue";
import { Icon } from "@/Components/Icon";
import { Pagination } from "@/Components/Pagination";
import { Progress } from "@/Components/Progress";
import { Select } from "@/Components/Select";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/Table";
import { Tooltip } from "@/Components/Tooltip";
import { hasNamedSlot } from "@/Utils";

defineSlots<
  DataTableSlots<T> & {
    [K in `item.${string}`]?: (props: DataTableItemSlotProps<T>) => VNodeChild;
  }
>();

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<
    Omit<
      DataTableOwnProps<T>,
      | "page"
      | "search"
      | "filters"
      | "perPage"
      | "sorting"
      | "expanded"
      | "selection"
      | "columnSearch"
      | "hiddenColumns"
    >
  >(),
  {
    full: true,
    loading: false,
    striped: false,
    hoverable: false,
    stickyHeader: false,
    paginationAlign: "end",
    loadingVariant: "overlay",
  },
);

const tableSlots = useSlots();
const resolveMessage = useResolveMessage();

const page = defineModel<number>("page");
const perPage = defineModel<number>("perPage");
const expanded = defineModel<string[]>("expanded");
const selection = defineModel<string[]>("selection");
const filters = defineModel<DataTableFilters>("filters");
const sorting = defineModel<DataTableSorting>("sorting");
const hiddenColumns = defineModel<string[]>("hiddenColumns");
const columnSearch = defineModel<DataTableColumnSearch>("columnSearch");
const search = defineModel<string>("search");

const {
  merged,
  rowViews,
  rootBind,
  emptyBind,
  showEmpty,
  tableProps,
  footerBind,
  loadingBar,
  showSearch,
  getHeadBind,
  headerViews,
  loadingBind,
  onToggleRow,
  toolbarBind,
  getCellBind,
  columnCount,
  showPerPage,
  showToolbar,
  getHeadAlign,
  getCellAlign,
  onTogglePage,
  summaryCells,
  expandEnabled,
  loadingBarBind,
  paginationBind,
  selectAllState,
  showPagination,
  onChangeSearch,
  onToggleExpand,
  visibilityItems,
  perPageSlotProps,
  resolvedPageCount,
  selectionMultiple,
  visibilityEnabled,
  paginationSlotProps,
  onCommitColumnFilter,
  onToggleColumnVisibility,
} = useDataTable(
  props,
  {
    size: "md",
    full: true,
    rounded: "lg",
    loading: false,
    striped: false,
    variant: "plain",
    hoverable: false,
    stickyHeader: false,
    paginationAlign: "end",
    selectionMode: "multiple",
    loadingVariant: "overlay",
  },
  {
    page,
    search,
    perPage,
    filters,
    sorting,
    expanded,
    selection,
    columnSearch,
    hiddenColumns,
  },
);

const checkboxSize = computed(() => {
  return merged.value.size === "lg" ? "md" : "sm";
});

function renderItemCell(
  row: { original: T },
  cell: { content: VNodeChild; id: string; value?: unknown },
): VNodeChild {
  const slot = tableSlots[`item.${cell.id}`] ?? tableSlots.item;

  if (slot) {
    return slot({ id: cell.id, row: row.original, value: cell.value });
  }

  return cell.content;
}

const paginationPage = computed({
  get: () => {
    return page.value ?? 1;
  },
  set: (value: number) => {
    page.value = value;
  },
});

const perPageSelectOptions = computed(() => {
  return perPageSlotProps.value.options.map((value) => {
    return { value, label: String(value) };
  });
});

const perPageSelectCustom = computed(() => {
  const fromProps = merged.value.customProps?.perPage?.customProps;

  return {
    ...fromProps,
    listbox: {
      showCheckmark: false,
      ...fromProps?.listbox,
      customProps: {
        ...fromProps?.listbox?.customProps,
        menu: {
          matchWidth: true,
          ...fromProps?.listbox?.customProps?.menu,
        },
      },
    },
  };
});

const selectionName = useId();

const DataTableChild = (childProps: { node?: VNodeChild }) => {
  return childProps.node ?? null;
};
</script>

<template>
  <div v-bind="rootBind">
    <div v-if="showToolbar" v-bind="toolbarBind">
      <div class="min-w-0 flex-1">
        <slot name="toolbar" />
      </div>

      <div class="flex shrink-0 items-center gap-2">
        <div
          v-if="visibilityEnabled"
          class="inline-flex items-center rounded-lg border border-dark-200 bg-white p-0.5 dark:border-dark-700 dark:bg-dark-900"
        >
          <DataTableColumnsMenu
            :items="visibilityItems"
            v-on:toggle="onToggleColumnVisibility"
          />
        </div>

        <slot name="toolbarActions" />

        <slot name="search" v-if="showSearch">
          <DataTableSearch
            :model-value="search ?? ''"
            v-on:update:model-value="onChangeSearch"
            :field-props="merged.customProps?.search"
          />
        </slot>
      </div>
    </div>

    <div class="relative">
      <Table v-bind="tableProps">
        <TableHeader v-bind="merged.customProps?.header">
          <TableRow v-bind="merged.customProps?.row">
            <TableHead
              :key="header.id"
              :align="getHeadAlign(header)"
              v-bind="getHeadBind(header)"
              v-for="header in headerViews"
            >
              <DataTableSelection
                kind="page"
                :size="checkboxSize"
                v-on:change="onTogglePage"
                :checked="selectAllState.checked"
                :indeterminate="selectAllState.indeterminate"
                :checkbox-props="merged.customProps?.checkbox"
                v-if="header.isSelection && selectionMultiple"
              />

              <div
                v-else-if="!header.isSelection && !header.isExpand"
                class="flex w-full min-w-0 items-center gap-1.5 overflow-hidden leading-none"
              >
                <DataTableSortButton
                  v-if="header.sortable"
                  :sort="header.ariaSort"
                >
                  <DataTableChild :node="header.header" />
                </DataTableSortButton>

                <DataTableChild v-else :node="header.header" />

                <DataTableFilterMenu
                  :column-id="header.id"
                  v-if="header.filterable"
                  :active="header.filterActive"
                  :values="header.filterValues"
                  :options="header.filterOptions"
                  :searchable="header.searchable"
                  :multiple="header.filterMultiple"
                  :search-value="header.searchQuery"
                  v-on:apply="
                    (values, query) =>
                      onCommitColumnFilter(header.id, values, query)
                  "
                />
              </div>
            </TableHead>
          </TableRow>
          <TableRow
            :classes="{ root: 'h-0' }"
            v-if="merged.loading && loadingBar"
          >
            <TableCell
              :colspan="columnCount"
              :classes="{
                root: 'relative h-0 border-0 p-0 after:hidden',
              }"
            >
              <div v-bind="loadingBarBind">
                <slot name="loading">
                  <Progress
                    size="xs"
                    rounded="none"
                    v-bind="merged.customProps?.progress"
                  />
                </slot>
              </div>
            </TableCell>
          </TableRow>
        </TableHeader>

        <TableBody v-bind="merged.customProps?.body">
          <TableRow v-if="showEmpty">
            <TableCell align="center" :colspan="columnCount">
              <div v-bind="emptyBind">
                <slot name="empty">
                  <span
                    class="relative mb-1 block h-10 w-12 rounded-md border-2 border-dark-300 dark:border-dark-600"
                  >
                    <span
                      class="absolute -top-1.5 left-2 right-2 h-2 rounded-sm border-2 border-dark-300 bg-white dark:border-dark-600 dark:bg-dark-900"
                    />
                  </span>
                  {{ resolveMessage("No data") }}
                </slot>
              </div>
            </TableCell>
          </TableRow>

          <template v-if="!showEmpty">
            <template :key="row.id" v-for="row in rowViews">
              <TableRow v-bind="merged.customProps?.row">
                <TableCell
                  :key="cell.id"
                  v-for="cell in row.cells"
                  :align="getCellAlign(cell)"
                  v-bind="getCellBind(cell)"
                >
                  <DataTableSelection
                    kind="row"
                    :value="row.id"
                    :size="checkboxSize"
                    :name="selectionName"
                    :checked="row.selected"
                    v-if="cell.isSelection"
                    :multiple="selectionMultiple"
                    :radio-props="merged.customProps?.radio"
                    :checkbox-props="merged.customProps?.checkbox"
                    v-on:change="(checked) => onToggleRow(row.id, checked)"
                  />

                  <button
                    type="button"
                    aria-label="Expand row"
                    v-else-if="cell.isExpand"
                    :aria-expanded="row.expanded"
                    v-on:click="onToggleExpand(row.id, !row.expanded)"
                    class="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-sm leading-none hover:bg-dark-500/10 dark:hover:bg-dark-500/15"
                  >
                    <span
                      :class="{ 'rotate-90': row.expanded }"
                      class="inline-flex transition-transform duration-200 motion-reduce:transition-none"
                    >
                      <Icon size="sm" icon="chevronRight" />
                    </span>
                  </button>

                  <Tooltip
                    :content="cell.tooltip"
                    v-else-if="cell.ellipsis && cell.tooltip"
                    :custom-props="{
                      trigger: { class: 'block min-w-0 w-full max-w-full' },
                    }"
                  >
                    <template #trigger>
                      <div
                        class="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
                      >
                        <DataTableChild :node="renderItemCell(row, cell)" />
                      </div>
                    </template>
                  </Tooltip>

                  <div
                    v-else-if="cell.ellipsis"
                    class="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    <DataTableChild :node="renderItemCell(row, cell)" />
                  </div>

                  <DataTableChild v-else :node="renderItemCell(row, cell)" />
                </TableCell>
              </TableRow>

              <TableRow v-if="expandEnabled">
                <TableCell
                  :colspan="columnCount"
                  :classes="{
                    root: cn({
                      'p-0': true,
                      'border-0': !row.expanded,
                    }),
                  }"
                >
                  <div
                    :aria-hidden="!row.expanded"
                    :class="
                      cn({
                        'grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none': true,
                        'grid-rows-[1fr]': row.expanded,
                        'grid-rows-[0fr]': !row.expanded,
                      })
                    "
                  >
                    <div class="min-h-0 overflow-hidden">
                      <div class="p-3">
                        <slot name="expanded" :row="row.original" />
                      </div>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </template>
          </template>
        </TableBody>

        <TableFooter v-if="summaryCells">
          <TableRow v-bind="merged.customProps?.row">
            <TableCell
              :key="cell.id"
              :align="getCellAlign(cell)"
              v-bind="getCellBind(cell)"
              v-for="cell in summaryCells"
            >
              <DataTableChild :node="cell.content" />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <div
        v-bind="loadingBind"
        v-if="merged.loading"
        :aria-hidden="loadingBar || undefined"
      >
        <slot name="loading" v-if="!loadingBar">
          <span
            role="status"
            aria-label="Loading"
            class="relative inline-block size-5 animate-spin motion-reduce:animate-none"
          >
            <span
              class="absolute inset-s-0 top-0 size-2 rounded-full bg-primary-500 opacity-30 dark:bg-primary-400"
            />
            <span
              class="absolute inset-e-0 top-0 size-2 rounded-full bg-primary-500 opacity-50 dark:bg-primary-400"
            />
            <span
              class="absolute inset-e-0 bottom-0 size-2 rounded-full bg-primary-500 dark:bg-primary-400"
            />
            <span
              class="absolute inset-s-0 bottom-0 size-2 rounded-full bg-primary-500 opacity-70 dark:bg-primary-400"
            />
          </span>
        </slot>
      </div>
    </div>

    <div v-bind="footerBind" v-if="hasNamedSlot(tableSlots, 'footer')">
      <slot name="footer" />
    </div>

    <div v-if="showPagination" v-bind="paginationBind">
      <slot name="perPage" v-bind="perPageSlotProps" v-if="showPerPage">
        <div class="flex shrink-0 items-center gap-2">
          <span
            class="text-sm whitespace-nowrap text-dark-500 dark:text-dark-400"
          >
            {{ resolveMessage("Per page:") }}
          </span>
          <Select
            size="sm"
            v-bind="merged.customProps?.perPage"
            overlay="menu"
            :clearable="false"
            hide-error-message
            aria-label="Per page"
            :options="perPageSelectOptions"
            :custom-props="perPageSelectCustom"
            :model-value="perPageSlotProps.perPage"
            v-on:update:model-value="
              (value) => perPageSlotProps.onPerPageChange(Number(value))
            "
            :classes="{
              ...merged.customProps?.perPage?.classes,
              root: cn('w-20', merged.customProps?.perPage?.classes?.root),
            }"
          />
        </div>
      </slot>

      <slot name="pagination" v-bind="paginationSlotProps">
        <Pagination
          v-model="paginationPage"
          :count="resolvedPageCount"
          v-if="resolvedPageCount !== undefined"
          :variant="paginationSlotProps.variant"
          v-bind="merged.customProps?.pagination"
        />
      </slot>
    </div>
  </div>
</template>
