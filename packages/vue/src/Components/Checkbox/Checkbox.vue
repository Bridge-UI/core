<script setup lang="ts">
// ** External Imports
import { computed, ref, useAttrs } from "vue";

// ** Core Imports
import { cn, resolveIconSource } from "@bridge-ui/core";

// ** Local Imports
import type {
  CheckboxOwnProps,
  CheckboxSlots,
} from "@/Components/Checkbox/checkbox.types";
import { useCheckbox } from "@/Components/Checkbox/composables/useCheckbox";
import { FormControl } from "@/Components/FormControl";
import { useIconAdapter } from "@/Icons";

const attrs = useAttrs();

defineSlots<CheckboxSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<CheckboxOwnProps>();

const uncontrolledChecked = ref(Boolean(props.defaultChecked));

const model = defineModel<boolean | undefined>({ default: undefined });

const checked = computed(() => {
  return model.value ?? uncontrolledChecked.value;
});

const iconAdapter = useIconAdapter();

const CheckIcon = computed(() => {
  return resolveIconSource("check", iconAdapter.value);
});

const {
  merged,
  iconBind,
  inputRef,
  fieldBind,
  inputBind,
  isChecked,
  formControl,
  controlBind,
} = useCheckbox(
  () => ({ ...attrs, ...props }),
  {
    size: "md",
    rounded: "sm",
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
    <label v-bind="fieldBind" :for="formControl.controlId.value">
      <input
        ref="inputRef"
        v-bind="inputBind"
        :checked="isChecked"
        v-on:change="onChange"
      />

      <span v-bind="controlBind">
        <component
          :is="CheckIcon"
          :stroke-width="3"
          v-if="isChecked && !merged.indeterminate"
          :class="cn('h-[65%] w-[65%]', iconBind.class)"
        />

        <span
          v-else-if="merged.indeterminate"
          class="block h-0.5 w-[55%] rounded-full bg-white"
        />
      </span>
    </label>
  </FormControl>
</template>
