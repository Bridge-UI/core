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
import {
  mergePartBind,
  resolveFieldAdornmentIconSize,
  useHoldRepeat,
} from "@/Utils";

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

const incrementBind = computed(() => {
  return mergePartBind(
    props.customProps?.increment,
    {
      type: "button",
      disabled: props.disabled,
      "aria-label": "Increment value",
      onClick: incrementHold.onPressClick,
      onPointerup: incrementHold.onPressPointerUp,
      onPointerdown: incrementHold.onPressPointerDown,
      onLostpointercapture: incrementHold.onPressLostPointerCapture,
    },
    cn({
      "bridge-field-adornment-button inline-flex min-h-0 min-w-8 flex-1 items-center justify-center": true,
      [mergedClasses.value.increment ?? ""]: true,
    }),
  );
});

const decrementBind = computed(() => {
  return mergePartBind(
    props.customProps?.decrement,
    {
      type: "button",
      disabled: props.disabled,
      "aria-label": "Decrement value",
      onClick: decrementHold.onPressClick,
      onPointerup: decrementHold.onPressPointerUp,
      onPointerdown: decrementHold.onPressPointerDown,
      onLostpointercapture: decrementHold.onPressLostPointerCapture,
    },
    cn({
      "bridge-field-adornment-button inline-flex min-h-0 min-w-8 flex-1 items-center justify-center": true,
      [mergedClasses.value.decrement ?? ""]: true,
    }),
  );
});
</script>

<template>
  <FormField :field="formField">
    <input v-model="stringModel" v-bind="inputBind" />

    <template #end>
      <div
        class="bridge-end-adornment flex h-full min-w-9 flex-col gap-px overflow-hidden"
      >
        <button v-bind="incrementBind">
          <Icon
            :icon="ChevronUp"
            :size="stepperIconSize"
            v-bind="props.customProps?.incrementIcon"
          />
        </button>

        <button v-bind="decrementBind">
          <Icon
            :icon="ChevronDown"
            :size="stepperIconSize"
            v-bind="props.customProps?.decrementIcon"
          />
        </button>
      </div>
    </template>
  </FormField>
</template>
