<script setup lang="ts">
// ** External Imports
import { computed, ref, watch } from "vue";

// ** Core Imports
import {
  filterDataTableFilterOptions,
  flattenDataTableFilterOptionValues,
  setDataTableFilterDraftAll,
  toggleDataTableFilterDraft,
  type DataTableFilterOption,
} from "@bridge-ui/core/Domain";
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import { Button } from "@/Components/Button";
import { Checkbox } from "@/Components/Checkbox";
import DataTableFilterOptions from "@/Components/DataTable/DataTableFilterOptions.vue";
import { Icon } from "@/Components/Icon";
import { Menu } from "@/Components/Menu";
import { TextField } from "@/Components/TextField";

defineOptions({ inheritAttrs: false, name: "DataTableFilterMenu" });

const props = defineProps<{
  active: boolean;
  columnId: string;
  multiple: boolean;
  options: DataTableFilterOption[];
  values: string[];
}>();

const emit = defineEmits<{
  apply: [values: string[]];
}>();

const show = ref(false);
const filterDraft = ref<string[]>([]);
const filterQuery = ref("");

const visibleOptions = computed(() => {
  return filterDataTableFilterOptions(props.options, filterQuery.value);
});

const visibleValues = computed(() => {
  return flattenDataTableFilterOptionValues(visibleOptions.value);
});

const allSelected = computed(() => {
  return (
    visibleValues.value.length > 0 &&
    visibleValues.value.every((value) => {
      return filterDraft.value.includes(value);
    })
  );
});

const allIndeterminate = computed(() => {
  const selectedCount = visibleValues.value.filter((value) => {
    return filterDraft.value.includes(value);
  }).length;

  return selectedCount > 0 && selectedCount < visibleValues.value.length;
});

watch(show, (open) => {
  if (!open) {
    return;
  }

  filterQuery.value = "";
  filterDraft.value = [...props.values];
});

function onToggleDraft(value: string, selected: boolean) {
  filterDraft.value = toggleDataTableFilterDraft(
    filterDraft.value,
    value,
    selected,
    props.multiple,
  );
}

function onToggleDraftAll() {
  filterDraft.value = setDataTableFilterDraftAll(
    filterDraft.value,
    visibleValues.value,
    !allSelected.value,
  );
}

function onResetDraft() {
  filterDraft.value = [];
}

function onApply() {
  emit("apply", filterDraft.value);
  show.value = false;
}
</script>

<template>
  <Menu
    v-model="show"
    placement="bottom-end"
    :custom-props="{
      root: { class: 'inline-flex items-center leading-none' },
      trigger: { class: 'inline-flex items-center leading-none' },
    }"
  >
    <template #trigger>
      <button
        type="button"
        :aria-pressed="active"
        aria-label="Filter column"
        :class="
          cn({
            'inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-sm leading-none hover:bg-dark-500/10 dark:hover:bg-dark-500/15': true,
            'text-primary-600': active,
          })
        "
      >
        <Icon size="sm" icon="filter" />
      </button>
    </template>

    <div class="min-w-52 px-1 pb-0.5 pt-2.5">
      <div class="px-1 pb-1.5">
        <TextField
          size="sm"
          hide-error-message
          v-model="filterQuery"
          aria-label="Search in filters"
          placeholder="Search in filters"
        />
      </div>
      <div class="flex max-h-60 flex-col gap-0.5 overflow-y-auto">
        <div
          role="menuitemcheckbox"
          :aria-checked="allSelected"
          v-on:click="onToggleDraftAll"
          v-if="multiple && visibleValues.length > 0"
          class="flex w-full cursor-pointer items-center rounded-md px-2 py-1.5 text-start hover:bg-dark-500/5 dark:hover:bg-dark-500/10"
        >
          <Checkbox
            size="sm"
            hide-error-message
            :model-value="allSelected"
            end-label="Select all items"
            :indeterminate="allIndeterminate"
            :classes="{ root: 'pointer-events-none' }"
          />
        </div>
        <DataTableFilterOptions
          :draft="filterDraft"
          :multiple="multiple"
          :options="visibleOptions"
          v-on:toggle="onToggleDraft"
          :name="`filter-${columnId}`"
        />
        <div
          v-if="visibleOptions.length === 0"
          class="px-2 py-1.5 text-sm text-dark-500 dark:text-dark-400"
        >
          No matching filters
        </div>
      </div>
      <div
        class="flex justify-end gap-2 border-t border-dark-200 px-2 pb-1 pt-1.5 dark:border-dark-700"
      >
        <Button size="sm" variant="flat" v-on:click="onResetDraft">
          Reset
        </Button>
        <Button size="sm" v-on:click="onApply">OK</Button>
      </div>
    </div>
  </Menu>
</template>
