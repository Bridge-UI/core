<script setup lang="ts">
// ** External Imports
import { computed, useAttrs } from "vue";

// ** Local Imports
import { FormControl } from "@/Components/FormControl";
import { useSwitch } from "@/Components/Switch/composables/useSwitch";
import type {
  SwitchOwnProps,
  SwitchSlots,
} from "@/Components/Switch/switch.types";

const attrs = useAttrs();

defineSlots<SwitchSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<SwitchOwnProps>();

const model = defineModel<boolean>({ default: false });

const checked = computed(() => {
  return model.value;
});

const { fieldBind, inputBind, thumbBind, trackBind, formControl } = useSwitch(
  () => ({ ...attrs, ...props }),
  {
    size: "md",
    rounded: "full",
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
  <FormControl :field="formControl">
    <label v-bind="fieldBind">
      <input v-bind="inputBind" :checked="model" v-on:change="onChange" />

      <span v-bind="trackBind" />

      <span v-bind="thumbBind" />
    </label>
  </FormControl>
</template>
