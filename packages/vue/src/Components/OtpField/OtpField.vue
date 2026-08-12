<script setup lang="ts">
// ** Local Imports
import { BASE_FIELD_CHROME_SLOT_NAMES } from "@/Components/BaseField";
import BaseField from "@/Components/BaseField/BaseField.vue";
import { useOtpField } from "@/Components/OtpField/composables/useOtpField";
import type {
  OtpFieldEmits,
  OtpFieldOwnProps,
  OtpFieldSlots,
} from "@/Components/OtpField/otpField.types";
import { presentSlotNames } from "@/Utils";

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
  digits,
  pinBind,
  pinsBind,
  baseField,
  inputBind,
  setPinRef,
  handlePinInput,
  handlePinFocus,
  handlePinPaste,
  handlePinKeyDown,
} = api;
</script>

<template>
  <BaseField :field="baseField">
    <template
      #[name]="slotData"
      v-for="name in presentSlotNames(BASE_FIELD_CHROME_SLOT_NAMES, $slots)"
    >
      <slot :name="name" v-bind="slotData || {}" />
    </template>

    <div v-bind="pinsBind">
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
    </div>
  </BaseField>
</template>
