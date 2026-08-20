<script setup lang="ts" generic="T">
// ** External Imports
import { computed, useId, useSlots, type VNodeChild } from "vue";

// ** Core Imports
import type { DataTableFilters } from "@bridge-ui/core/Domain";
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useDataTable } from "@/Components/DataTable/composables/useDataTable";
import type {
  DataTableItemSlotProps,
  DataTableOwnProps,
  DataTableSlots,
  DataTableSorting,
} from "@/Components/DataTable/dataTable.types";
import DataTableColumnsMenu from "@/Components/DataTable/DataTableColumnsMenu.vue";
import DataTableFilterMenu from "@/Components/DataTable/DataTableFilterMenu.vue";
import DataTableSelection from "@/Components/DataTable/DataTableSelection.vue";
import DataTableSortButton from "@/Components/DataTable/DataTableSortButton.vue";
import { Icon } from "@/Components/Icon";
import { Pagination } from "@/Components/Pagination";
import { Spinner } from "@/Components/Spinner";
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
      | "filters"
      | "sorting"
      | "expanded"
      | "selection"
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
  },
);

const expanded = defineModel<string[]>("expanded");
const filters = defineModel<DataTableFilters>("filters");
const hiddenColumns = defineModel<string[]>("hiddenColumns");
const page = defineModel<number>("page");
const selection = defineModel<string[]>("selection");
const sorting = defineModel<DataTableSorting>("sorting");
const tableSlots = useSlots();

const {
  merged,
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
  summaryCells,
  expandEnabled,
  paginationBind,
  selectAllState,
  showPagination,
  onToggleExpand,
  visibilityItems,
  paginationVariant,
  selectionMultiple,
  visibilityEnabled,
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
  },
  {
    page,
    filters,
    sorting,
    expanded,
    selection,
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
      <DataTableColumnsMenu
        :items="visibilityItems"
        v-if="visibilityEnabled"
        v-on:toggle="onToggleColumnVisibility"
      />
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
                  :multiple="header.filterMultiple"
                  v-on:apply="
                    (values) => onCommitColumnFilter(header.id, values)
                  "
                />
              </div>
            </TableHead>
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
                  No data
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
      <div v-bind="loadingBind" v-if="merged.loading">
        <slot name="loading">
          <Spinner v-bind="merged.customProps?.spinner" />
        </slot>
      </div>
    </div>

    <div v-if="showFooter" v-bind="footerBind">
      <slot name="footer" />
    </div>

    <div v-if="showPagination" v-bind="paginationBind">
      <slot name="pagination">
        <Pagination
          v-if="serverPaged"
          v-bind="merged.customProps?.pagination"
          v-model="paginationPage"
          :count="merged.pageCount"
          :variant="paginationVariant"
        />
      </slot>
    </div>
  </div>
</template>
