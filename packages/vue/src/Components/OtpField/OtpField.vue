<script setup lang="ts">
// ** Local Imports
import BaseField from "@/Components/BaseField/BaseField.vue";
import { useOtpField } from "@/Components/OtpField/composables/useOtpField";
import type {
  OtpFieldEmits,
  OtpFieldOwnProps,
  OtpFieldSlots,
} from "@/Components/OtpField/otpField.types";

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
