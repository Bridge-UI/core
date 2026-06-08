<script setup lang="ts">
// ** External Imports
import { isNil } from "es-toolkit/compat";
import { computed, useAttrs } from "vue";

// ** Local Imports
import { useRadio } from "@/Components/Radio/composables/useRadio";
import type { RadioOwnProps, RadioSlots } from "@/Components/Radio/radio.types";
import { Switcher } from "@/Components/Switcher";

const attrs = useAttrs();

defineSlots<RadioSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<RadioOwnProps>();

const model = defineModel<string | number>();

const modelRef = computed(() => {
  return model.value;
});

const {
  merged,
  dotBind,
  switcher,
  fieldBind,
  inputBind,
  isChecked,
  controlBind,
} = useRadio(
  () => ({ ...attrs, ...props }),
  {
    size: "md",
    rounded: "full",
    color: "primary",
  },
  modelRef,
);

function onChange() {
  if (!isNil(merged.value.value)) {
    model.value = merged.value.value;
  }
}
</script>

<template>
  <Switcher :field="switcher">
    <label v-bind="fieldBind" :for="switcher.controlId.value">
      <input v-bind="inputBind" :checked="isChecked" v-on:change="onChange" />

      <span v-bind="controlBind">
        <span v-bind="dotBind" />
      </span>
    </label>
  </Switcher>
</template>
