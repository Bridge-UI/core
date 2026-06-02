<script setup lang="ts">
// ** External Imports
import { computed, useAttrs } from "vue";

// ** Local Imports
import { Switcher } from "@/Components/Switcher";
import { useToggle } from "@/Components/Toggle/composables/useToggle";
import type {
  ToggleOwnProps,
  ToggleSlots,
} from "@/Components/Toggle/toggle.types";

defineSlots<ToggleSlots>();

defineOptions({ inheritAttrs: false });

const model = defineModel<boolean>({ default: false });

const props = defineProps<ToggleOwnProps>();

const attrs = useAttrs();

const checked = computed(() => model.value);

const { switcher, inputBind, thumbBind, trackBind, fieldBind } = useToggle(
  () => ({ ...attrs, ...props }),
  {
    size: "sm",
    color: "primary",
  },
  checked,
);

function onChange(event: Event) {
  const target = event.target as HTMLInputElement;

  model.value = target.checked;
}
</script>

<template>
  <Switcher :field="switcher">
    <label v-bind="fieldBind">
      <input v-bind="inputBind" :checked="model" @change="onChange" />

      <span v-bind="trackBind" />

      <span v-bind="thumbBind" />
    </label>
  </Switcher>
</template>
