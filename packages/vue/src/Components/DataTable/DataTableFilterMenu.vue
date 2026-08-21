<script setup lang="ts">
// ** External Imports
import { computed, ref, watch } from "vue";

// ** Core Imports
import {
  flattenDataTableFilterOptionValues,
  setDataTableFilterDraftAll,
  toggleDataTableFilterDraft,
  type DataTableFilterOption,
} from "@bridge-ui/core/Domain";
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
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
  searchable: boolean;
  searchValue: string;
  values: string[];
}>();

const emit = defineEmits<{
  apply: [values: string[], query: string];
}>();

const show = ref(false);
const filterDraft = ref<string[]>([]);
const searchDraft = ref("");
const resolveMessage = useResolveMessage();
const searchLabel = computed(() => {
  return resolveMessage("Search");
});

const optionValues = computed(() => {
  return flattenDataTableFilterOptionValues(props.options);
});

const allSelected = computed(() => {
  return (
    optionValues.value.length > 0 &&
    optionValues.value.every((value) => {
      return filterDraft.value.includes(value);
    })
  );
});

const allIndeterminate = computed(() => {
  const selectedCount = optionValues.value.filter((value) => {
    return filterDraft.value.includes(value);
  }).length;

  return selectedCount > 0 && selectedCount < optionValues.value.length;
});

watch(show, (open) => {
  if (!open) {
    return;
  }

  searchDraft.value = props.searchValue;
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
    optionValues.value,
    !allSelected.value,
  );
}

function onResetDraft() {
  filterDraft.value = [];
  searchDraft.value = "";
}

function onApply() {
  emit("apply", filterDraft.value, searchDraft.value);
  show.value = false;
}
</script>

<template>
  <Menu
    v-model="show"
    placement="bottom"
    :custom-props="{
      root: { class: 'relative z-[2] inline-flex items-center leading-none' },
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
      <div v-if="searchable" class="px-1 pb-1.5">
        <TextField
          size="sm"
          hide-error-message
          start-icon="search"
          v-model="searchDraft"
          :aria-label="searchLabel"
          :placeholder="searchLabel"
        />
      </div>
      <div
        v-if="options.length > 0"
        class="flex max-h-60 flex-col gap-0.5 overflow-y-auto pb-2"
      >
        <div
          role="menuitemcheckbox"
          :aria-checked="allSelected"
          v-on:click="onToggleDraftAll"
          v-if="multiple && optionValues.length > 0"
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
          :options="options"
          :draft="filterDraft"
          :multiple="multiple"
          v-on:toggle="onToggleDraft"
          :name="`filter-${columnId}`"
        />
      </div>
      <div
        class="flex justify-end gap-2 border-t border-dark-200 px-2 pb-1 pt-1.5 dark:border-dark-700"
      >
        <Button size="sm" variant="outline" v-on:click="onResetDraft">
          Reset
        </Button>
        <Button size="sm" v-on:click="onApply">OK</Button>
      </div>
    </div>
  </Menu>
</template>
