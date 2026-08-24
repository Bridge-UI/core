<script setup lang="ts">
// ** Core Imports
import { type FieldOverlayMode } from "@bridge-ui/core/Domain";
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import { Button } from "@/Components/Button";
import { Checkbox } from "@/Components/Checkbox";
import type { DataTableVisibilityItem } from "@/Components/DataTable/composables/useDataTable";
import { useDataTableColumnsMenu } from "@/Components/DataTable/composables/useDataTableColumnsMenu";
import DataTableToolbarButton from "@/Components/DataTable/DataTableToolbarButton.vue";
import { FieldOverlay } from "@/Components/FieldOverlay";

defineOptions({ inheritAttrs: false, name: "DataTableColumnsMenu" });

const props = withDefaults(
  defineProps<{
    items: DataTableVisibilityItem[];
    overlay?: FieldOverlayMode;
    showFooter?: boolean;
  }>(),
  {
    overlay: "auto",
    showFooter: undefined,
  },
);

const emit = defineEmits<{
  change: [hiddenIds: string[]];
}>();

const resolveMessage = useResolveMessage();
const {
  show,
  onApply,
  onReset,
  isHidden,
  triggerRef,
  controlSize,
  onToggleItem,
  onToggleShow,
  overlayCustomProps,
  showFooter: showFooterResolved,
} = useDataTableColumnsMenu(props, (hiddenIds) => {
  emit("change", hiddenIds);
});
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
        :class="
          cn({
            'min-w-52 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black/5 dark:bg-dark-800 dark:ring-white/10': true,
            'p-1': !showFooterResolved,
            'px-1 pb-0.5 pt-1': showFooterResolved,
          })
        "
      >
        <div
          :key="item.id"
          v-for="item in items"
          role="menuitemcheckbox"
          :aria-checked="!isHidden(item)"
          v-on:click="onToggleItem(item)"
          class="flex w-full cursor-pointer items-center rounded-md px-2 py-1.5 text-start hover:bg-dark-500/5 dark:hover:bg-dark-500/10"
        >
          <Checkbox
            hide-error-message
            :size="controlSize"
            :end-label="item.label"
            :disabled="!item.hideable"
            :model-value="!isHidden(item)"
            :classes="{ root: 'pointer-events-none' }"
          />
        </div>

        <div
          v-if="showFooterResolved"
          class="flex justify-end gap-2 border-t border-dark-200 px-2 pb-1 pt-1.5 dark:border-dark-700"
        >
          <Button size="sm" variant="outline" v-on:click="onReset">
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
