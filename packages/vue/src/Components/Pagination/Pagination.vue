<script setup lang="ts">
// ** Local Imports
import { Icon } from "@/Components/Icon";
import { usePagination } from "@/Components/Pagination/composables/usePagination";
import type {
  PaginationEmits,
  PaginationOwnProps,
  PaginationSlots,
} from "@/Components/Pagination/pagination.types";

defineSlots<PaginationSlots>();

const emit = defineEmits<PaginationEmits>();

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<PaginationOwnProps>(), {
  disabled: false,
  hideNextButton: false,
  hidePrevButton: false,
});

const model = defineModel<number>({ default: 1 });

const {
  entries,
  showPrev,
  showNext,
  rootBind,
  listBind,
  prevBind,
  nextBind,
  prevLabel,
  nextLabel,
  getItemBind,
  prevIconBind,
  nextIconBind,
  getEllipsisBind,
} = usePagination(
  props,
  {
    size: "md",
    rounded: "md",
    color: "dark",
    disabled: false,
    siblingCount: 1,
    variant: "ghost",
    mode: "numbered",
    boundaryCount: 1,
    hideNextButton: false,
    hidePrevButton: false,
  },
  model,
  emit,
);
</script>

<template>
  <nav v-bind="rootBind">
    <ul v-bind="listBind">
      <li v-if="showPrev" class="contents">
        <button v-bind="prevBind">
          <slot name="prev">
            <Icon icon="chevronLeft" v-bind="prevIconBind" />
            {{ prevLabel }}
          </slot>
        </button>
      </li>

      <template
        :key="`${entry.type}-${index}`"
        v-for="(entry, index) in entries"
      >
        <li v-bind="getEllipsisBind(index)" v-if="entry.type === 'ellipsis'">
          <slot name="ellipsis">…</slot>
        </li>

        <li v-else class="contents">
          <button v-bind="getItemBind(entry.page)">
            {{ entry.page }}
          </button>
        </li>
      </template>

      <li v-if="showNext" class="contents">
        <button v-bind="nextBind">
          <slot name="next">
            {{ nextLabel }}
            <Icon icon="chevronRight" v-bind="nextIconBind" />
          </slot>
        </button>
      </li>
    </ul>
  </nav>
</template>
