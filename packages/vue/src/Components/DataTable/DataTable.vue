<script setup lang="ts" generic="T">
// ** External Imports
import { computed, type VNodeChild } from "vue";

// ** Local Imports
import { Checkbox } from "@/Components/Checkbox";
import { useDataTable } from "@/Components/DataTable/composables/useDataTable";
import type {
  DataTableOwnProps,
  DataTableSlots,
  DataTableSorting,
} from "@/Components/DataTable/dataTable.types";
import { Icon } from "@/Components/Icon";
import { Pagination } from "@/Components/Pagination";
import { Spinner } from "@/Components/Spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/Table";

defineSlots<DataTableSlots>();

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<Omit<DataTableOwnProps<T>, "page" | "sorting" | "selection">>(),
  {
    full: true,
    loading: false,
    striped: false,
    hoverable: false,
    stickyHeader: false,
  },
);

const page = defineModel<number>("page");
const selection = defineModel<string[]>("selection");
const sorting = defineModel<DataTableSorting>("sorting");

const {
  merged,
  colSpan,
  rowViews,
  rootBind,
  emptyBind,
  showEmpty,
  tableProps,
  headerViews,
  loadingBind,
  onToggleRow,
  toolbarBind,
  onTogglePage,
  onToggleSort,
  paginationBind,
  selectAllState,
  showPagination,
  paginationVariant,
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
  },
  {
    page,
    sorting,
    selection,
  },
);

const checkboxSize = computed(() => {
  return merged.value.size === "lg" ? "md" : "sm";
});

const paginationPage = computed({
  get: () => {
    return page.value ?? 1;
  },
  set: (value: number) => {
    page.value = value;
  },
});

const DataTableChild = (childProps: { node?: VNodeChild }) => {
  return childProps.node ?? null;
};
</script>

<template>
  <div v-bind="rootBind">
    <div v-bind="toolbarBind" v-if="$slots.toolbar">
      <slot name="toolbar" />
    </div>

    <Table v-bind="tableProps" :aria-busy="merged.loading || undefined">
      <TableHeader>
        <TableRow>
          <TableHead
            :key="header.id"
            v-for="header in headerViews"
            :align="header.isSelection ? 'center' : header.align"
            :aria-sort="header.sortable ? header.ariaSort : undefined"
            :style="header.width ? { width: header.width } : undefined"
          >
            <Checkbox
              :size="checkboxSize"
              v-if="header.isSelection"
              aria-label="Select all rows"
              :model-value="selectAllState.checked"
              :indeterminate="selectAllState.indeterminate"
              v-bind="merged.customProps?.checkbox"
              v-on:update:model-value="
                (checked) => onTogglePage(Boolean(checked))
              "
            />

            <button
              type="button"
              v-else-if="header.sortable"
              v-on:click="onToggleSort(header.id)"
              class="inline-flex items-center gap-1"
            >
              <DataTableChild :node="header.header" />
              <Icon size="sm" :icon="header.sortIcon" />
            </button>

            <DataTableChild v-else :node="header.header" />
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow v-if="merged.loading && $slots.loading === undefined">
          <TableCell align="center" :colspan="colSpan">
            <div v-bind="loadingBind">
              <Spinner v-bind="merged.customProps?.spinner" />
            </div>
          </TableCell>
        </TableRow>

        <TableRow v-else-if="merged.loading && $slots.loading">
          <TableCell align="center" :colspan="colSpan">
            <div v-bind="loadingBind">
              <slot name="loading" />
            </div>
          </TableCell>
        </TableRow>

        <TableRow v-if="showEmpty">
          <TableCell align="center" :colspan="colSpan">
            <div v-bind="emptyBind">
              <slot name="empty" />
            </div>
          </TableCell>
        </TableRow>

        <template v-if="!merged.loading">
          <TableRow :key="row.id" v-for="row in rowViews">
            <TableCell
              :key="cell.id"
              v-for="cell in row.cells"
              :align="cell.isSelection ? 'center' : cell.align"
              :style="cell.width ? { width: cell.width } : undefined"
            >
              <Checkbox
                :size="checkboxSize"
                aria-label="Select row"
                v-if="cell.isSelection"
                :model-value="row.selected"
                v-bind="merged.customProps?.checkbox"
                v-on:update:model-value="
                  (checked) => onToggleRow(row.id, Boolean(checked))
                "
              />

              <DataTableChild v-else :node="cell.content" />
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>

    <div v-if="showPagination" v-bind="paginationBind">
      <slot name="pagination">
        <Pagination
          v-bind="merged.customProps?.pagination"
          v-model="paginationPage"
          :count="merged.pageCount"
          :variant="paginationVariant"
          v-if="merged.page != null && merged.pageCount != null"
        />
      </slot>
    </div>
  </div>
</template>
