<script setup lang="ts">
// ** External Imports
import { computed } from "vue";

// ** Core Imports
import {
  getDataTableSortTooltip,
  type DataTableAriaSort,
} from "@bridge-ui/core/Domain";
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import { Icon } from "@/Components/Icon";
import { Tooltip } from "@/Components/Tooltip";

defineOptions({ inheritAttrs: false, name: "DataTableSortButton" });

const props = defineProps<{
  sort: DataTableAriaSort;
}>();

const resolveMessage = useResolveMessage();

const tooltip = computed(() => {
  return resolveMessage(getDataTableSortTooltip(props.sort));
});
</script>

<template>
  <Tooltip
    :content="tooltip"
    :custom-props="{
      root: { class: 'min-w-0 max-w-none flex-1' },
      trigger: { class: 'min-w-0 max-w-none flex-1' },
    }"
  >
    <template #trigger>
      <span
        class="inline-flex min-w-0 flex-1 items-center gap-1.5 leading-none"
      >
        <span class="min-w-0 truncate leading-none">
          <slot />
        </span>
        <span
          class="inline-flex h-4 w-3.5 shrink-0 flex-col items-center justify-center leading-none"
        >
          <Icon
            size="sm"
            icon="chevronUp"
            :class="
              cn({
                '-mb-1': true,
                'text-dark-800 dark:text-dark-100': sort === 'ascending',
                'text-dark-300 dark:text-dark-600': sort !== 'ascending',
              })
            "
          />
          <Icon
            size="sm"
            icon="chevronDown"
            :class="
              cn({
                'text-dark-800 dark:text-dark-100': sort === 'descending',
                'text-dark-300 dark:text-dark-600': sort !== 'descending',
              })
            "
          />
        </span>
      </span>
    </template>
  </Tooltip>
</template>
