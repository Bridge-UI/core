<script setup lang="ts">
// ** Local Imports
import { useDataTablePagination } from "@/Components/DataTable/composables/useDataTablePagination";
import type {
  DataTablePaginationEmits,
  DataTablePaginationOwnProps,
  DataTablePaginationSlots,
} from "@/Components/DataTable/dataTablePagination.types";
import { Icon } from "@/Components/Icon";

defineSlots<DataTablePaginationSlots>();

const emit = defineEmits<DataTablePaginationEmits>();

defineOptions({ inheritAttrs: false, name: "DataTablePagination" });

const props = withDefaults(defineProps<DataTablePaginationOwnProps>(), {
  disabled: false,
});

const model = defineModel<number>({ default: 1 });

const {
  rootBind,
  listBind,
  prevBind,
  nextBind,
  lastBind,
  firstBind,
  prevIconBind,
  nextIconBind,
  lastIconBind,
  firstIconBind,
} = useDataTablePagination(
  props,
  {
    size: "sm",
    rounded: "md",
    disabled: false,
  },
  model,
  emit,
);
</script>

<template>
  <nav v-bind="rootBind">
    <ul v-bind="listBind">
      <li class="contents">
        <button v-bind="firstBind">
          <slot name="first">
            <Icon icon="chevronsLeft" v-bind="firstIconBind" />
          </slot>
        </button>
      </li>

      <li class="contents">
        <button v-bind="prevBind">
          <slot name="prev">
            <Icon icon="chevronLeft" v-bind="prevIconBind" />
          </slot>
        </button>
      </li>

      <li class="contents">
        <button v-bind="nextBind">
          <slot name="next">
            <Icon icon="chevronRight" v-bind="nextIconBind" />
          </slot>
        </button>
      </li>

      <li class="contents">
        <button v-bind="lastBind">
          <slot name="last">
            <Icon icon="chevronsRight" v-bind="lastIconBind" />
          </slot>
        </button>
      </li>
    </ul>
  </nav>
</template>
