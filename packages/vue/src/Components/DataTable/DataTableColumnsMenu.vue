<script setup lang="ts">
// ** External Imports
import { computed, ref } from "vue";

// ** Core Imports
import {
  getFieldOverlayControlSize,
  resolveFieldOverlay,
  type FieldOverlayMode,
} from "@bridge-ui/core/Domain";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import { Checkbox } from "@/Components/Checkbox";
import type { DataTableVisibilityItem } from "@/Components/DataTable/composables/useDataTable";
import DataTableToolbarButton from "@/Components/DataTable/DataTableToolbarButton.vue";
import { FieldOverlay } from "@/Components/FieldOverlay";
import { useBreakpoint } from "@/Utils";

defineOptions({ inheritAttrs: false, name: "DataTableColumnsMenu" });

const props = withDefaults(
  defineProps<{
    items: DataTableVisibilityItem[];
    overlay?: FieldOverlayMode;
  }>(),
  {
    overlay: "auto",
  },
);

const emit = defineEmits<{
  toggle: [columnId: string, hide: boolean];
}>();

const show = ref(false);
const breakpoint = useBreakpoint();
const resolveMessage = useResolveMessage();
const triggerRef = ref<null | HTMLSpanElement>(null);

const controlSize = computed(() => {
  return getFieldOverlayControlSize(
    resolveFieldOverlay(props.overlay, breakpoint.mobile),
  );
});

const overlayCustomProps = computed(() => {
  return {
    menu: {
      anchorEl: triggerRef.value,
      placement: "bottom" as const,
    },
  };
});

function onToggleShow() {
  show.value = !show.value;
}
</script>

<template>
  <span class="relative inline-flex items-center">
    <span ref="triggerRef" class="inline-flex">
      <DataTableToolbarButton
        icon="columns"
        v-on:click="onToggleShow"
        :label="resolveMessage('Columns')"
      />
    </span>

    <FieldOverlay
      v-model="show"
      :overlay="overlay"
      :custom-props="overlayCustomProps"
    >
      <div
        class="min-w-52 overflow-hidden rounded-md bg-white p-1 shadow-lg ring-1 ring-black/5 dark:bg-dark-800 dark:ring-white/10"
      >
        <div
          :key="item.id"
          v-for="item in items"
          role="menuitemcheckbox"
          :aria-checked="!item.hidden"
          v-on:click="item.hideable && emit('toggle', item.id, !item.hidden)"
          class="flex w-full cursor-pointer items-center rounded-md px-2 py-1.5 text-start hover:bg-dark-500/5 dark:hover:bg-dark-500/10"
        >
          <Checkbox
            hide-error-message
            :size="controlSize"
            :end-label="item.label"
            :disabled="!item.hideable"
            :model-value="!item.hidden"
            :classes="{ root: 'pointer-events-none' }"
          />
        </div>
      </div>
    </FieldOverlay>
  </span>
</template>
