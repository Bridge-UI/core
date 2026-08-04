<script setup lang="ts">
// ** External Imports
import { computed } from "vue";

// ** Local Imports
import { useOtpField } from "@/Components/OtpField/composables/useOtpField";
import type {
  OtpFieldEmits,
  OtpFieldOwnProps,
  OtpFieldSlots,
} from "@/Components/OtpField/otpField.types";
import OtpFieldLabel from "@/Components/OtpField/OtpFieldLabel.vue";
import {
  hasNamedSlot,
  hasSlotOrProp,
  resolveNamedSlot,
  resolveSlotOrProp,
} from "@/Utils";

defineSlots<OtpFieldSlots>();

defineOptions({ inheritAttrs: false });

const emit = defineEmits<OtpFieldEmits>();

const model = defineModel<null | string | undefined>();

const props = withDefaults(defineProps<OtpFieldOwnProps>(), {
  length: 6,
  size: "md",
  rounded: "md",
  type: "numeric",
  color: "primary",
  variant: "outline",
});

const api = useOtpField(props, model, {
  onChange: (value) => emit("change", value),
  onComplete: (value) => emit("complete", value),
});

const {
  slots,
  merged,
  digits,
  pinBind,
  rootBind,
  errorBind,
  groupBind,
  inputBind,
  setPinRef,
  controlId,
  headerBind,
  cornerBind,
  endSlotBind,
  invalidated,
  startSlotBind,
  handlePinInput,
  handlePinFocus,
  handlePinPaste,
  descriptionBind,
  handlePinKeyDown,
  showErrorMessageContent,
} = api;

const showHeader = computed(() => {
  return (
    hasSlotOrProp(slots, "label", merged.value.label) ||
    hasSlotOrProp(slots, "corner", merged.value.corner)
  );
});
</script>

<template>
  <div
    v-bind="rootBind"
    :data-invalid="invalidated || undefined"
    :aria-disabled="merged.disabled || undefined"
    :aria-readonly="merged.readonly || undefined"
  >
    <div v-if="showHeader" v-bind="headerBind">
      <OtpFieldLabel :api="api" />

      <span
        v-bind="cornerBind"
        v-if="hasSlotOrProp(slots, 'corner', merged.corner)"
      >
        <component :is="resolveSlotOrProp(slots, 'corner', merged.corner)" />
      </span>
    </div>

    <div v-bind="groupBind">
      <div v-bind="startSlotBind" v-if="hasNamedSlot(slots, 'start')">
        <component :is="resolveNamedSlot(slots, 'start')" />
      </div>

      <div
        :key="index"
        v-bind="pinBind(index)"
        v-for="(digit, index) in digits"
      >
        <input
          v-bind="inputBind(index)"
          :value="digit"
          v-on:focus="handlePinFocus(index)"
          v-on:paste="handlePinPaste(index, $event)"
          v-on:input="handlePinInput(index, $event)"
          v-on:keydown="handlePinKeyDown(index, $event)"
          :ref="(el) => setPinRef(index, el as HTMLInputElement | null)"
        />
      </div>

      <div v-bind="endSlotBind" v-if="hasNamedSlot(slots, 'end')">
        <component :is="resolveNamedSlot(slots, 'end')" />
      </div>
    </div>

    <p
      v-bind="descriptionBind"
      :id="`${controlId}-description`"
      v-if="
        !invalidated && hasSlotOrProp(slots, 'description', merged.description)
      "
    >
      <component
        :is="resolveSlotOrProp(slots, 'description', merged.description)"
      />
    </p>

    <p
      v-bind="errorBind"
      :id="`${controlId}-error`"
      v-if="!merged.hideErrorMessage"
      :aria-hidden="showErrorMessageContent ? undefined : true"
    >
      <component
        v-if="showErrorMessageContent"
        :is="resolveSlotOrProp(slots, 'errorMessage', merged.errorMessage)"
      />
    </p>
  </div>
</template>
