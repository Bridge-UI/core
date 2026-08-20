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
  spanRowBind,
  wrapperBind,
  serverPaged,
  onTogglePage,
  onToggleSort,
  spanCellBind,
  bodyGroupBind,
  headerRowBind,
  paginationBind,
  selectAllState,
  showPagination,
  headerGroupBind,
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

    <div v-bind="wrapperBind">
      <div v-bind="tableBind">
        <div v-bind="headerGroupBind">
          <div v-bind="headerRowBind">
            <div
              :key="header.id"
              v-bind="getHeadBind(header)"
              v-for="header in headerViews"
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
            </div>
          </div>
        </div>

        <div v-bind="bodyGroupBind">
          <div
            v-bind="spanRowBind"
            v-if="merged.loading && $slots.loading === undefined"
          >
            <div v-bind="spanCellBind">
              <div v-bind="loadingBind">
                <Spinner v-bind="merged.customProps?.spinner" />
              </div>
            </div>
          </div>

          <div
            v-bind="spanRowBind"
            v-else-if="merged.loading && $slots.loading"
          >
            <div v-bind="spanCellBind">
              <div v-bind="loadingBind">
                <slot name="loading" />
              </div>
            </div>
          </div>

          <div v-if="showEmpty" v-bind="spanRowBind">
            <div v-bind="spanCellBind">
              <div v-bind="emptyBind">
                <slot name="empty" />
              </div>
            </div>
          </div>

          <template v-if="!merged.loading">
            <div :key="row.id" v-bind="bodyRowBind" v-for="row in rowViews">
              <div
                :key="cell.id"
                v-for="cell in row.cells"
                v-bind="getCellBind(cell)"
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
              </div>
            </div>
          </template>
        </div>
      </div>
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
