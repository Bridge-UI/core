<script setup lang="ts">
// ** Local Imports
import { FormField } from "@/Components/FormField";
import { Icon } from "@/Components/Icon";
import { useTextField } from "@/Components/TextField/composables/useTextField";
import type {
  TextFieldOwnProps,
  TextFieldSlots,
} from "@/Components/TextField/textField.types";
import { hasNamedSlot, isPropPresent } from "@/Utils";

defineSlots<TextFieldSlots>();

defineOptions({ inheritAttrs: false });

const model = defineModel<string | null | undefined>();

const props = withDefaults(defineProps<TextFieldOwnProps>(), {
  withErrorIcon: true,
});

const {
  slots,
  merged,
  endBind,
  inputId,
  errorIcon,
  formField,
  inputBind,
  startBind,
  endIconBind,
  endSlotBind,
  invalidated,
  containerBind,
  startIconBind,
  startSlotBind,
} = useTextField(props, {
  size: "md",
  rounded: "md",
  color: "primary",
  variant: "outline",
  withErrorIcon: true,
});
</script>

<template>
  <FormField :field="formField">
    <div v-bind="containerBind">
      <div v-bind="startSlotBind" v-if="hasNamedSlot(slots, 'start')">
        <slot name="start" />
      </div>

      <div v-bind="startBind" v-else-if="isPropPresent(merged.start)">
        {{ merged.start }}
      </div>

      <div v-bind="startBind" v-else-if="merged.startIcon">
        <Icon
          :size="merged.size"
          v-bind="startIconBind"
          :icon="merged.startIcon"
        />
      </div>

      <input v-model="model" v-bind="inputBind" />

      <div v-bind="endSlotBind" v-if="hasNamedSlot(slots, 'end')">
        <slot name="end" />
      </div>

      <div v-bind="endBind" v-else-if="isPropPresent(merged.end)">
        {{ merged.end }}
      </div>

      <div
        v-bind="endBind"
        v-else-if="invalidated && merged.withErrorIcon !== false"
      >
        <Icon :icon="errorIcon" :size="merged.size" v-bind="endIconBind" />
      </div>

      <div v-bind="endBind" v-else-if="merged.endIcon">
        <Icon :size="merged.size" v-bind="endIconBind" :icon="merged.endIcon" />
      </div>
    </div>
  </FormField>
</template>
