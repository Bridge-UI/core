<script setup lang="ts">
// ** External Imports
import { ChevronDown, ChevronUp } from "@lucide/vue";
import { computed } from "vue";

// ** Core Imports
import { cn } from "@bridge-ui/core";

// ** Local Imports
import { FormField } from "@/Components/FormField";
import { Icon } from "@/Components/Icon";
import { useNumberField } from "@/Components/NumberField/composables/useNumberField";
import type {
  NumberFieldEmits,
  NumberFieldOwnProps,
  NumberFieldSlots,
} from "@/Components/NumberField/numberField.types";
import { resolveFieldAdornmentIconSize, useHoldRepeat } from "@/Utils";

defineSlots<NumberFieldSlots>();

defineOptions({ inheritAttrs: false });

const emit = defineEmits<NumberFieldEmits>();

const model = defineModel<null | number | undefined>();

const props = withDefaults(defineProps<NumberFieldOwnProps>(), {
  step: 1,
});

const {
  decrement,
  formField,
  increment,
  inputBind,
  stringModel,
  mergedClasses,
} = useNumberField(props, model, {
  onChange: (value) => emit("change", value),
});

const incrementHold = useHoldRepeat(
  () => increment(),
  () => ({
    disabled: props.disabled,
  }),
);

const decrementHold = useHoldRepeat(
  () => decrement(),
  () => ({
    disabled: props.disabled,
  }),
);

const stepperIconSize = computed(() => {
  return resolveFieldAdornmentIconSize(props.size);
});
</script>

<template>
  <FormField :field="formField">
    <input v-model="stringModel" v-bind="inputBind" />

    <template #end>
      <div
        class="bridge-end-adornment flex h-full min-w-9 flex-col gap-px overflow-hidden"
      >
        <button
          type="button"
          :disabled="props.disabled"
          aria-label="Increment value"
          v-on:click="incrementHold.onPressClick"
          v-on:pointerup="incrementHold.onPressPointerUp"
          v-on:pointerdown="incrementHold.onPressPointerDown"
          v-on:lostpointercapture="incrementHold.onPressLostPointerCapture"
          :class="
            cn({
              'bridge-field-adornment-button inline-flex min-h-0 min-w-8 flex-1 items-center justify-center': true,
              [mergedClasses.increment ?? '']: true,
            })
          "
        >
          <Icon :icon="ChevronUp" :size="stepperIconSize" />
        </button>

        <button
          type="button"
          :disabled="props.disabled"
          aria-label="Decrement value"
          v-on:click="decrementHold.onPressClick"
          v-on:pointerup="decrementHold.onPressPointerUp"
          v-on:pointerdown="decrementHold.onPressPointerDown"
          v-on:lostpointercapture="decrementHold.onPressLostPointerCapture"
          :class="
            cn({
              'bridge-field-adornment-button inline-flex min-h-0 min-w-8 flex-1 items-center justify-center': true,
              [mergedClasses.decrement ?? '']: true,
            })
          "
        >
          <Icon :icon="ChevronDown" :size="stepperIconSize" />
        </button>
      </div>
    </template>
  </FormField>
</template>
