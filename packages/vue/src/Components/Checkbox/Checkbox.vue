<script setup lang="ts">
// ** External Imports
import { Check } from "lucide-vue-next";
import { computed, useAttrs } from "vue";

// ** Core Imports
import { cn } from "@bridge-ui/core";

// ** Local Imports
import type {
  CheckboxOwnProps,
  CheckboxSlots,
} from "@/Components/Checkbox/checkbox.types";
import { useCheckbox } from "@/Components/Checkbox/composables/useCheckbox";
import { Switcher } from "@/Components/Switcher";

defineSlots<CheckboxSlots>();

defineOptions({ inheritAttrs: false });

const model = defineModel<boolean>({ default: false });

const props = defineProps<CheckboxOwnProps>();

const attrs = useAttrs();

const checked = computed(() => model.value);

const {
  switcher,
  inputRef,
  isChecked,
  inputBind,
  iconBind,
  controlBind,
  fieldBind,
  merged,
} = useCheckbox(
  () => ({ ...attrs, ...props }),
  {
    size: "sm",
    color: "primary",
    rounded: "sm",
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
    <span v-bind="fieldBind">
      <input
        ref="inputRef"
        v-bind="inputBind"
        :checked="model"
        @change="onChange"
      />

      <span v-bind="controlBind">
        <Check
          v-if="isChecked && !merged.indeterminate"
          :stroke-width="3"
          :class="cn('h-[65%] w-[65%]', iconBind.class)"
        />

        <span
          v-else-if="merged.indeterminate"
          class="block h-0.5 w-[55%] rounded-full bg-white"
        />
      </span>
    </span>
  </Switcher>
</template>
