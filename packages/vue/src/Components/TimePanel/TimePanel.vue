<script setup lang="ts">
// ** External Imports
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

// ** Core Imports
import { observeTimePanelSelectedScroll } from "@bridge-ui/core/Domain";

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
  secondItems,
  showSeconds,
  showMeridiem,
  getMinuteBind,
  getSecondBind,
  meridiemItems,
  getMeridiemBind,
} = useTimePanel(
  props,
  {
    ampm: false,
    interval: 1,
    rounded: "md",
    color: "primary",
    showSeconds: false,
  },
  emit,
);

let disconnectScrollSync: null | (() => void) = null;

function bindScrollSync() {
  disconnectScrollSync?.();
  disconnectScrollSync = null;

  const root = rootRef.value;

  if (!root) {
    return;
  }

  disconnectScrollSync = observeTimePanelSelectedScroll(root);
}

onMounted(() => {
  void nextTick(bindScrollSync);
});

onBeforeUnmount(() => {
  disconnectScrollSync?.();
  disconnectScrollSync = null;
});

watch(
  () =>
    [
      hourItems.value,
      minuteItems.value,
      secondItems.value,
      meridiemItems.value,
    ] as const,
  () => {
    void nextTick(bindScrollSync);
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

    <div v-if="showSeconds" v-bind="columnBind">
      <button
        v-for="item in secondItems"
        :key="`second-${item.value}`"
        v-bind="getSecondBind(item)"
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
