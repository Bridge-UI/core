<script setup lang="ts">
// ** External Imports
import { nextTick, onMounted, ref, watch } from "vue";

// ** Local Imports
import { useTimePanel } from "@/Components/TimePanel/composables/useTimePanel";
import type {
  TimePanelEmits,
  TimePanelOwnProps,
} from "@/Components/TimePanel/timePanel.types";

defineOptions({ inheritAttrs: false });

const emit = defineEmits<TimePanelEmits>();

const rootRef = ref<null | HTMLElement>(null);

const props = defineProps<TimePanelOwnProps>();

const {
  rootBind,
  hourItems,
  columnBind,
  getHourBind,
  minuteItems,
  showMeridiem,
  getMinuteBind,
  meridiemItems,
  getMeridiemBind,
} = useTimePanel(
  props,
  {
    ampm: false,
    interval: 1,
    rounded: "md",
    color: "primary",
  },
  emit,
);

/**
 * Centers a selected tile in its overflow column without scrolling the page.
 */
function scrollSelectedTimeItemsIntoView() {
  const root = rootRef.value;

  if (!root) {
    return;
  }

  root.querySelectorAll<HTMLElement>('[aria-pressed="true"]').forEach((el) => {
    const column = el.parentElement;

    if (!column) {
      return;
    }

    column.scrollTop = Math.max(
      0,
      el.offsetTop - column.clientHeight / 2 + el.offsetHeight / 2,
    );
  });
}

onMounted(() => {
  void nextTick(scrollSelectedTimeItemsIntoView);
});

watch(
  () => [hourItems.value, minuteItems.value, meridiemItems.value] as const,
  () => {
    void nextTick(scrollSelectedTimeItemsIntoView);
  },
);
</script>

<template>
  <div ref="rootRef" v-bind="rootBind">
    <div v-bind="columnBind">
      <button
        v-for="item in hourItems"
        :key="`hour-${item.value}`"
        v-bind="getHourBind(item)"
      >
        {{ item.label }}
      </button>
    </div>

    <div v-bind="columnBind">
      <button
        v-for="item in minuteItems"
        :key="`minute-${item.value}`"
        v-bind="getMinuteBind(item)"
      >
        {{ item.label }}
      </button>
    </div>

    <div v-if="showMeridiem" v-bind="columnBind">
      <button
        v-for="item in meridiemItems"
        :key="`meridiem-${item.value}`"
        v-bind="getMeridiemBind(item)"
      >
        {{ item.label }}
      </button>
    </div>
  </div>
</template>
