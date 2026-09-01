<script setup lang="ts">
// ** External Imports
import { computed, ref, watch } from "vue";

// ** Core Imports
import {
  flattenDataTableFilterOptionValues,
  getFieldOverlayControlSize,
  resolveFieldOverlay,
  setDataTableFilterDraftAll,
  toggleDataTableFilterDraft,
  type DataTableFilterOption,
  type FieldOverlayMode,
} from "@bridge-ui/core/Domain";
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import { Button } from "@/Components/Button";
import { Checkbox } from "@/Components/Checkbox";
import DataTableFilterOptions from "@/Components/DataTable/DataTableFilterOptions.vue";
import { FieldOverlay } from "@/Components/FieldOverlay";
import { Icon } from "@/Components/Icon";
import { TextField } from "@/Components/TextField";
import { useBreakpoint } from "@/Utils";

defineOptions({ inheritAttrs: false, name: "DataTableFilterMenu" });

const props = withDefaults(
  defineProps<{
    active: boolean;
    columnId: string;
    multiple: boolean;
    options: DataTableFilterOption[];
    overlay?: FieldOverlayMode;
    searchable: boolean;
    searchValue: string;
    values: string[];
  }>(),
  {
    overlay: "auto",
  },
);

const emit = defineEmits<{
  apply: [values: string[], query: string];
}>();

const show = ref(false);
const searchDraft = ref("");
const breakpoint = useBreakpoint();
const filterDraft = ref<string[]>([]);
const resolveMessage = useResolveMessage();
const triggerRef = ref<null | HTMLButtonElement>(null);

const optionValues = computed(() => {
  return flattenDataTableFilterOptionValues(props.options);
});

const controlSize = computed(() => {
  return getFieldOverlayControlSize(
    resolveFieldOverlay(props.overlay, breakpoint.mobile),
  );
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

const overlayCustomProps = computed(() => {
  return {
    menu: {
      anchorEl: triggerRef.value,
      placement: "bottom" as const,
    },
  };
});

watch(show, (open) => {
  if (!open) {
    return;
  }

  searchDraft.value = props.searchValue;
  filterDraft.value = [...props.values];
});

function onToggleShow() {
  show.value = !show.value;
}

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
  <span class="relative z-2 inline-flex items-center leading-none">
    <button
      type="button"
      ref="triggerRef"
      :aria-pressed="active"
      v-on:click="onToggleShow"
      :aria-label="resolveMessage('Filter column')"
      :class="
        cn({
          'inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-sm leading-none hover:bg-dark-500/10 dark:hover:bg-dark-500/15': true,
          'text-primary-600': active,
        })
      "
    >
      <Icon size="sm" icon="filter" />
    </button>

    <FieldOverlay
      v-model="show"
      :overlay="overlay"
      :custom-props="overlayCustomProps"
    >
      <div
        class="min-w-52 overflow-hidden rounded-md bg-white px-1 pb-0.5 pt-2.5 shadow-lg ring-1 ring-black/5 dark:bg-dark-800 dark:ring-white/10"
      >
        <div v-if="searchable" class="px-1 pb-1.5">
          <TextField
            hide-error-message
            start-icon="search"
            :size="controlSize"
            v-model="searchDraft"
            :aria-label="resolveMessage('Search')"
            :placeholder="resolveMessage('Search')"
          />
        </div>

        <div
          v-if="options.length > 0"
          class="flex max-h-60 flex-col gap-0.5 overflow-y-auto overscroll-contain pb-2 bridge-soft-scrollbar"
        >
          <div
            role="menuitemcheckbox"
            :aria-checked="allSelected"
            v-on:click="onToggleDraftAll"
            v-if="multiple && optionValues.length > 0"
            class="flex w-full cursor-pointer items-center rounded-md px-2 py-1.5 text-start hover:bg-black/5 dark:hover:bg-white/10"
          >
            <Checkbox
              hide-error-message
              :size="controlSize"
              :model-value="allSelected"
              :indeterminate="allIndeterminate"
              :classes="{ root: 'pointer-events-none' }"
              :end-label="resolveMessage('Select all items')"
            />
          </div>

          <DataTableFilterOptions
            :options="options"
            :size="controlSize"
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
            {{ resolveMessage("Reset") }}
          </Button>

          <Button size="sm" v-on:click="onApply">
            {{ resolveMessage("OK") }}
          </Button>
        </div>
      </div>
    </FieldOverlay>
  </span>
</template>
