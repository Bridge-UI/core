<script setup lang="ts">
// ** External Imports
import { computed } from "vue";

// ** Core Imports
import {
  getDataTableSortLabel,
  type DataTableAriaSort,
} from "@bridge-ui/core/Domain";
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import { Icon } from "@/Components/Icon";

defineOptions({ inheritAttrs: false, name: "DataTableSortButton" });

const props = defineProps<{
  sort: DataTableAriaSort;
}>();

const emit = defineEmits<{
  click: [];
}>();

const resolveMessage = useResolveMessage();

const label = computed(() => {
  return resolveMessage(getDataTableSortLabel(props.sort));
});
</script>

<template>
  <button
    type="button"
    :aria-label="label"
    v-on:click="emit('click')"
    class="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-sm leading-none hover:bg-dark-500/10 dark:hover:bg-dark-500/15"
  >
    <span
      class="inline-flex h-6 w-5 shrink-0 flex-col items-center justify-center leading-none"
    >
      <Icon
        size="lg"
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
        size="lg"
        icon="chevronDown"
        :class="
          cn({
            'text-dark-800 dark:text-dark-100': sort === 'descending',
            'text-dark-300 dark:text-dark-600': sort !== 'descending',
          })
        "
      />
    </span>
  </button>
</template>
