<script setup lang="ts" generic="T">
// ** External Imports
import { computed, useId, useSlots, type VNodeChild } from "vue";

// ** Core Imports
import type { DataTableFilters } from "@bridge-ui/core/Domain";

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
              class="flex min-w-0 items-center gap-1.5 overflow-hidden leading-none"
            >
              <DataTableSortButton
                v-if="header.sortable"
                :icon="header.sortIcon"
                v-on:click="onToggleSort(header.id)"
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
                v-on:apply="(values) => onCommitColumnFilter(header.id, values)"
              />
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody v-bind="merged.customProps?.body">
        <TableRow v-if="merged.loading && $slots.loading === undefined">
          <TableCell align="center" :colspan="columnCount">
            <div v-bind="loadingBind">
              <Spinner v-bind="merged.customProps?.spinner" />
            </div>
          </TableCell>
        </TableRow>

        <TableRow v-else-if="merged.loading && $slots.loading">
          <TableCell align="center" :colspan="columnCount">
            <div v-bind="loadingBind">
              <slot name="loading" />
            </div>
          </TableCell>
        </TableRow>

        <TableRow v-if="showEmpty">
          <TableCell align="center" :colspan="columnCount">
            <div v-bind="emptyBind">
              <slot name="empty" />
            </div>
          </TableCell>
        </TableRow>

        <template v-if="!merged.loading">
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
                  <Icon
                    size="sm"
                    :icon="row.expanded ? 'chevronDown' : 'chevronRight'"
                  />
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

            <TableRow v-if="row.expanded">
              <TableCell :colspan="columnCount">
                <slot name="expanded" :row="row.original" />
              </TableCell>
            </TableRow>
          </template>
        </template>
      </TableBody>

      <TableFooter v-if="summaryCells" v-bind="merged.customProps?.footer">
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
