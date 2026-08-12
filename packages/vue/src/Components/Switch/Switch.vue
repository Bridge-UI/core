<script setup lang="ts">
// ** External Imports
import { computed, ref, useAttrs } from "vue";

// ** Local Imports
import {
  FORM_CONTROL_CHROME_SLOT_NAMES,
  FormControl,
} from "@/Components/FormControl";
import { useSwitch } from "@/Components/Switch/composables/useSwitch";
import type {
  SwitchOwnProps,
  SwitchSlots,
} from "@/Components/Switch/switch.types";
import { presentSlotNames } from "@/Utils";

const attrs = useAttrs();

defineSlots<SwitchSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<SwitchOwnProps>();

const uncontrolledChecked = ref(Boolean(props.defaultChecked));

const model = defineModel<boolean | undefined>({ default: undefined });

const checked = computed(() => {
  return model.value ?? uncontrolledChecked.value;
});

const { fieldBind, inputBind, isChecked, thumbBind, trackBind, formControl } =
  useSwitch(
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
  uncontrolledChecked.value = target.checked;
}
</script>

<template>
  <FormControl :field="formControl">
    <template
      #[name]="slotData"
      v-for="name in presentSlotNames(FORM_CONTROL_CHROME_SLOT_NAMES, $slots)"
    >
      <slot :name="name" v-bind="slotData || {}" />
    </template>

    <label v-bind="fieldBind">
      <input v-bind="inputBind" :checked="isChecked" v-on:change="onChange" />

      <span v-bind="trackBind" />

      <span v-bind="thumbBind" />
    </label>
  </FormControl>
</template>
