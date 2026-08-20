<script setup lang="ts" generic="T">
// ** External Imports
import {
  computed,
  defineComponent,
  h,
  ref,
  useId,
  type PropType,
  type VNodeChild,
} from "vue";

// ** Core Imports
import {
  toggleDataTableFilterDraft,
  type DataTableFilterOption,
  type DataTableFilters,
} from "@bridge-ui/core/Domain";

// ** Local Imports
import { Button } from "@/Components/Button";
import { Checkbox } from "@/Components/Checkbox";
import { useDataTable } from "@/Components/DataTable/composables/useDataTable";
import type {
  DataTableItemSlotProps,
  DataTableOwnProps,
  DataTableSlots,
  DataTableSorting,
} from "@/Components/DataTable/dataTable.types";
import { Icon } from "@/Components/Icon";
import { Menu } from "@/Components/Menu";
import { Pagination } from "@/Components/Pagination";
import { Radio } from "@/Components/Radio";
import { Spinner } from "@/Components/Spinner";
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
  },
);

const expanded = defineModel<string[]>("expanded");
const filters = defineModel<DataTableFilters>("filters");
const hiddenColumns = defineModel<string[]>("hiddenColumns");
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

const paginationPage = computed({
  get: () => {
    return page.value ?? 1;
  },
  set: (value: number) => {
    page.value = value;
  },
});

const selectionName = useId();
const columnsMenuOpen = ref(false);
const filterDraft = ref<string[]>([]);
const filterMenuId = ref<null | string>(null);

const DataTableChild = (childProps: { node?: VNodeChild }) => {
  return childProps.node ?? null;
};

function renderFilterOptions(
  options: DataTableFilterOption[],
  draft: string[],
  multiple: boolean,
  onToggle: (value: string, selected: boolean) => void,
): VNodeChild[] {
  return options.map((option) => {
    if (option.children && option.children.length > 0) {
      return h("div", { class: "min-w-0", key: option.value }, [
        h("div", { class: "px-3 py-1 text-xs font-medium" }, option.label),
        h(
          "div",
          { class: "ps-2" },
          renderFilterOptions(option.children, draft, multiple, onToggle),
        ),
      ]);
    }

    if (multiple) {
      return h(Checkbox, {
        size: "sm",
        key: option.value,
        endLabel: option.label,
        modelValue: draft.includes(option.value),
        "onUpdate:modelValue": (checked: boolean | undefined) => {
          onToggle(option.value, Boolean(checked));
        },
      });
    }

    return h(Radio, {
      size: "sm",
      key: option.value,
      value: option.value,
      endLabel: option.label,
      modelValue: draft.includes(option.value) ? option.value : undefined,
      "onUpdate:modelValue": (value?: number | string) => {
        onToggle(option.value, value === option.value);
      },
    });
  });
}

const DataTableFilterOptions = defineComponent({
  name: "DataTableFilterOptions",
  emits: {
    toggle: (_value: string, _selected: boolean) => {
      return true;
    },
  },
  props: {
    multiple: { type: Boolean, required: true },
    draft: { required: true, type: Array as PropType<string[]> },
    options: {
      required: true,
      type: Array as PropType<DataTableFilterOption[]>,
    },
  },
  setup(props, { emit }) {
    return (): VNodeChild[] => {
      return renderFilterOptions(
        props.options,
        props.draft,
        props.multiple,
        (value, selected) => {
          emit("toggle", value, selected);
        },
      );
    };
  },
});

function onFilterMenuShow(columnId: string, values: string[], show: boolean) {
  if (show) {
    filterMenuId.value = columnId;
    filterDraft.value = [...values];

    return;
  }

  if (filterMenuId.value === columnId) {
    filterMenuId.value = null;
  }
}

function onToggleFilterDraft(
  value: string,
  selected: boolean,
  multiple: boolean,
) {
  filterDraft.value = toggleDataTableFilterDraft(
    filterDraft.value,
    value,
    selected,
    multiple,
  );
}

function onResetFilterDraft() {
  filterDraft.value = [];
}

function onApplyColumnFilter(columnId: string) {
  onCommitColumnFilter(columnId, filterDraft.value);
  filterMenuId.value = null;
}
</script>

<template>
  <div v-bind="rootBind">
    <div v-if="showToolbar" v-bind="toolbarBind">
      <div class="min-w-0 flex-1">
        <slot name="toolbar" />
      </div>
      <Menu
        placement="bottom-end"
        v-if="visibilityEnabled"
        v-model="columnsMenuOpen"
      >
        <template #trigger>
          <Button size="sm" variant="flat">Columns</Button>
        </template>
        <div class="min-w-44 p-1">
          <Checkbox
            size="sm"
            :key="item.id"
            :end-label="item.label"
            :disabled="!item.hideable"
            :model-value="!item.hidden"
            v-for="item in visibilityItems"
            v-on:update:model-value="
              (checked) => onToggleColumnVisibility(item.id, !Boolean(checked))
            "
          />
        </div>
      </Menu>
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
                aria-label="Select all rows"
                :model-value="selectAllState.checked"
                :indeterminate="selectAllState.indeterminate"
                v-bind="merged.customProps?.checkbox"
                v-if="header.isSelection && selectionMultiple"
                v-on:update:model-value="
                  (checked) => onTogglePage(Boolean(checked))
                "
              />

              <div
                class="flex min-w-0 items-center gap-1"
                v-else-if="!header.isSelection && !header.isExpand"
              >
                <button
                  type="button"
                  v-if="header.sortable"
                  v-on:click="onToggleSort(header.id)"
                  class="inline-flex min-w-0 items-center gap-1"
                >
                  <DataTableChild :node="header.header" />
                  <Icon size="sm" :icon="header.sortIcon" />
                </button>

                <DataTableChild v-else :node="header.header" />

                <Menu
                  placement="bottom-end"
                  v-if="header.filterable"
                  :model-value="filterMenuId === header.id"
                  v-on:update:model-value="
                    (show) =>
                      onFilterMenuShow(
                        header.id,
                        header.filterValues,
                        Boolean(show),
                      )
                  "
                >
                  <template #trigger>
                    <button
                      type="button"
                      aria-label="Filter column"
                      :aria-pressed="header.filterActive"
                      :class="
                        header.filterActive
                          ? 'inline-flex shrink-0 text-primary-600'
                          : 'inline-flex shrink-0'
                      "
                    >
                      <Icon size="sm" icon="filter" />
                    </button>
                  </template>

                  <div class="min-w-44 p-1">
                    <div class="max-h-60 overflow-y-auto">
                      <DataTableFilterOptions
                        :draft="filterDraft"
                        :options="header.filterOptions"
                        :multiple="header.filterMultiple"
                        v-on:toggle="
                          (value, selected) =>
                            onToggleFilterDraft(
                              value,
                              selected,
                              header.filterMultiple,
                            )
                        "
                      />
                    </div>
                    <div class="flex justify-end gap-2 border-t px-2 py-2">
                      <Button
                        size="sm"
                        variant="flat"
                        v-on:click="onResetFilterDraft"
                      >
                        Reset
                      </Button>
                      <Button
                        size="sm"
                        v-on:click="onApplyColumnFilter(header.id)"
                      >
                        OK
                      </Button>
                    </div>
                  </div>
                </Menu>
              </div>
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
            <template :key="row.id" v-for="row in rowViews">
              <div v-bind="bodyRowBind">
                <div
                  :key="cell.id"
                  v-for="cell in row.cells"
                  v-bind="getCellBind(cell)"
                >
                  <Checkbox
                    :size="checkboxSize"
                    aria-label="Select row"
                    :model-value="row.selected"
                    v-bind="merged.customProps?.checkbox"
                    v-if="cell.isSelection && selectionMultiple"
                    v-on:update:model-value="
                      (checked) => onToggleRow(row.id, Boolean(checked))
                    "
                  />

                  <Radio
                    :value="row.id"
                    :size="checkboxSize"
                    :name="selectionName"
                    aria-label="Select row"
                    v-else-if="cell.isSelection"
                    :model-value="row.selected ? row.id : undefined"
                    v-bind="merged.customProps?.radio"
                    v-on:update:model-value="() => onToggleRow(row.id, true)"
                  />

                  <button
                    type="button"
                    class="inline-flex"
                    aria-label="Expand row"
                    v-else-if="cell.isExpand"
                    :aria-expanded="row.expanded"
                    v-on:click="onToggleExpand(row.id, !row.expanded)"
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
                      trigger: { class: 'block min-w-0 max-w-full' },
                    }"
                  >
                    <template #trigger>
                      <div
                        class="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
                      >
                        <slot
                          :row="row.original"
                          :value="cell.value"
                          :name="`item.${cell.id}`"
                        >
                          <DataTableChild :node="cell.content" />
                        </slot>
                      </div>
                    </template>
                  </Tooltip>

                  <div
                    v-else-if="cell.ellipsis"
                    class="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    <slot
                      :row="row.original"
                      :value="cell.value"
                      :name="`item.${cell.id}`"
                    >
                      <DataTableChild :node="cell.content" />
                    </slot>
                  </div>

                  <slot
                    v-else
                    :row="row.original"
                    :value="cell.value"
                    :name="`item.${cell.id}`"
                  >
                    <DataTableChild :node="cell.content" />
                  </slot>
                </div>
              </div>

              <div v-if="row.expanded" v-bind="spanRowBind">
                <div v-bind="spanCellBind">
                  <slot name="expanded" :row="row.original" />
                </div>
              </div>
            </template>
          </template>
        </div>

        <div v-if="summaryCells" v-bind="footerGroupBind">
          <div v-bind="headerRowBind">
            <div
              :key="cell.id"
              v-bind="getCellBind(cell)"
              v-for="cell in summaryCells"
            >
              <DataTableChild :node="cell.content" />
            </div>
          </div>
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
