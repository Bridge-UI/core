<script setup lang="ts">
// ** External Imports
import { computed, ref } from "vue";

// ** Core Imports
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import {
  FORM_FIELD_CHROME_SLOT_NAMES,
  FormField,
} from "@/Components/FormField";
import { Icon } from "@/Components/Icon";
import { useNumberField } from "@/Components/NumberField/composables/useNumberField";
import type {
  NumberFieldEmits,
  NumberFieldOwnProps,
  NumberFieldSlots,
} from "@/Components/NumberField/numberField.types";
import {
  mergePartBind,
  presentSlotNames,
  useHoldRepeat,
  useOptionalModel,
} from "@/Utils";

defineSlots<NumberFieldSlots>();

defineOptions({ inheritAttrs: false });

const resolveMessage = useResolveMessage();

const emit = defineEmits<NumberFieldEmits>();

const model = defineModel<null | number | undefined>();

const props = withDefaults(defineProps<NumberFieldOwnProps>(), {
  step: 1,
});

const uncontrolledValue = ref<null | number | undefined>(props.defaultValue);

const value = useOptionalModel(model, uncontrolledValue);

const {
  isSplit,
  decrement,
  formField,
  increment,
  inputBind,
  stringModel,
  decrementIcon,
  incrementIcon,
  mergedClasses,
  incrementFirst,
  stepperIconSize,
  controlVariantItem,
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

const chromeSlotNames = computed(() => {
  return FORM_FIELD_CHROME_SLOT_NAMES.filter((name) => {
    if (name === "end") {
      return false;
    }

    if (name === "start" && isSplit.value) {
      return false;
    }

    return true;
  });
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
      "aria-label": resolveMessage("Increment value"),
      onLostpointercapture: incrementHold.onPressLostPointerCapture,
    },
    cn({
      [controlVariantItem.value.button]: true,
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
      "aria-label": resolveMessage("Decrement value"),
      onLostpointercapture: decrementHold.onPressLostPointerCapture,
    },
    cn({
      [controlVariantItem.value.button]: true,
      [mergedClasses.value.decrement ?? ""]: true,
    }),
  );
});
</script>

<template>
  <FormField :field="formField">
    <template
      #[name]="slotData"
      v-for="name in presentSlotNames(chromeSlotNames, $slots)"
    >
      <slot :name="name" v-bind="slotData || {}" />
    </template>

    <input v-model="stringModel" v-bind="inputBind" />

    <template #start v-if="isSplit">
      <div :class="controlVariantItem.startGroup">
        <button v-bind="decrementBind">
          <Icon
            :icon="decrementIcon"
            :size="stepperIconSize"
            v-bind="props.customProps?.decrementIcon"
          />
        </button>
      </div>
    </template>

    <template #end>
      <div :class="controlVariantItem.endGroup">
        <button v-if="incrementFirst" v-bind="incrementBind">
          <Icon
            :icon="incrementIcon"
            :size="stepperIconSize"
            v-bind="props.customProps?.incrementIcon"
          />
        </button>

        <button v-if="!isSplit" v-bind="decrementBind">
          <Icon
            :icon="decrementIcon"
            :size="stepperIconSize"
            v-bind="props.customProps?.decrementIcon"
          />
        </button>

        <button v-if="!incrementFirst" v-bind="incrementBind">
          <Icon
            :icon="incrementIcon"
            :size="stepperIconSize"
            v-bind="props.customProps?.incrementIcon"
          />
        </button>
      </div>
    </template>
  </FormField>
</template>
