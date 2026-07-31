<script setup lang="ts">
// ** External Imports
import { isNil } from "es-toolkit/compat";
import { computed, ref, useAttrs } from "vue";

// ** Local Imports
import { FormControl } from "@/Components/FormControl";
import { useRadio } from "@/Components/Radio/composables/useRadio";
import type { RadioOwnProps, RadioSlots } from "@/Components/Radio/radio.types";

const attrs = useAttrs();

defineSlots<RadioSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<RadioOwnProps>();

const model = defineModel<number | string>();

const uncontrolledChecked = ref(Boolean(props.defaultChecked));

const modelRef = computed(() => {
  if (isNil(model.value) && uncontrolledChecked.value) {
    return props.value;
  }

  return model.value;
});

const {
  merged,
  dotBind,
  fieldBind,
  inputBind,
  isChecked,
  formControl,
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
  uncontrolledChecked.value = true;

  if (!isNil(merged.value.value)) {
    model.value = merged.value.value;
  }
}
</script>

<template>
  <FormControl :field="formControl">
    <label v-bind="fieldBind" :for="formControl.controlId.value">
      <input v-bind="inputBind" :checked="isChecked" v-on:change="onChange" />

      <span v-bind="controlBind">
        <span v-bind="dotBind" />
      </span>
    </label>
  </FormControl>
</template>
