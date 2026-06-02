<script setup lang="ts">
// ** External Imports
import { computed, useAttrs } from "vue";

// ** Local Imports
import { useRadio } from "@/Components/Radio/composables/useRadio";
import type { RadioOwnProps, RadioSlots } from "@/Components/Radio/radio.types";
import { Switcher } from "@/Components/Switcher";

defineSlots<RadioSlots>();

defineOptions({ inheritAttrs: false });

const model = defineModel<string | number>();

const props = defineProps<RadioOwnProps>();

const attrs = useAttrs();

const modelRef = computed(() => model.value);

const {
  switcher,
  isChecked,
  inputBind,
  dotBind,
  controlBind,
  fieldBind,
  merged,
} = useRadio(
  () => ({ ...attrs, ...props }),
  {
    size: "sm",
    color: "primary",
  },
  modelRef,
);

function onChange() {
  if (merged.value.value !== undefined) {
    model.value = merged.value.value;
  }
}
</script>

<template>
  <Switcher :field="switcher">
    <span v-bind="fieldBind">
      <input v-bind="inputBind" :checked="isChecked" @change="onChange" />

      <span v-bind="controlBind">
        <span v-bind="dotBind" />
      </span>
    </span>
  </Switcher>
</template>
