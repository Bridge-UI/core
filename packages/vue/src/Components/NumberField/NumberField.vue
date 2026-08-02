<script setup lang="ts">
// ** External Imports
import { isUndefined } from "es-toolkit/compat";
import { computed, ref } from "vue";

// ** Core Imports
import { cn, resolveMessage } from "@bridge-ui/core";

// ** Local Imports
import { FormField } from "@/Components/FormField";
import { Icon } from "@/Components/Icon";
import { useNumberField } from "@/Components/NumberField/composables/useNumberField";
import type {
  NumberFieldEmits,
  NumberFieldOwnProps,
  NumberFieldSlots,
} from "@/Components/NumberField/numberField.types";
import { useI18nAdapter } from "@/I18n";
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

const uncontrolledValue = ref<null | number | undefined>(props.defaultValue);

const value = computed({
  set: (next) => {
    model.value = next;
    uncontrolledValue.value = next;
  },
  get: () => {
    return isUndefined(model.value) ? uncontrolledValue.value : model.value;
  },
});

const i18n = useI18nAdapter();

const {
  decrement,
  formField,
  increment,
  inputBind,
  stringModel,
  mergedClasses,
} = useNumberField(props, value, {
  onChange: (next) => emit("change", next),
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
      type: "button" as const,
      disabled: props.disabled,
      onClick: incrementHold.onPressClick,
      onPointerup: incrementHold.onPressPointerUp,
      onPointerdown: incrementHold.onPressPointerDown,
      "aria-label": resolveMessage("Increment value", i18n.value),
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
      type: "button" as const,
      disabled: props.disabled,
      onClick: decrementHold.onPressClick,
      onPointerup: decrementHold.onPressPointerUp,
      onPointerdown: decrementHold.onPressPointerDown,
      "aria-label": resolveMessage("Decrement value", i18n.value),
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
            icon="chevronUp"
            :size="stepperIconSize"
            v-bind="props.customProps?.incrementIcon"
          />
        </button>

        <button v-bind="decrementBind">
          <Icon
            icon="chevronDown"
            :size="stepperIconSize"
            v-bind="props.customProps?.decrementIcon"
          />
        </button>
      </div>
    </template>
  </FormField>
</template>
