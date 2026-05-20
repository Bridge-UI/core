<script setup lang="ts">
// ** Local Imports
import { Icon } from "@/Components/Icon";
import { useTextField } from "@/Components/TextField/composables/useTextField";
import type {
  TextFieldOwnProps,
  TextFieldSlots,
} from "@/Components/TextField/textField.types";
import { hasSlotOrProp, resolveSlotOrProp } from "@/Utils";

defineSlots<TextFieldSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<TextFieldOwnProps>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const {
  slots,
  merged,
  errorIcon,
  inputBind,
  labelBind,
  rootBind,
  endBind,
  errorBind,
  descriptionBind,
  showDescription,
  showError,
  startBind,
  cornerBind,
  headerBind,
  endIconBind,
  containerBind,
  startIconBind,
  endSlotClass,
  startSlotClass,
  showHeader,
  showEndIcon,
  showErrorIcon,
  invalidated,
  showStartIcon,
  hasStartSlot,
  hasEndSlot,
  inputId,
  isDisabled,
  isReadonly,
} = useTextField(props, {
  size: "md",
  rounded: "md",
  color: "primary",
  variant: "outline",
  withErrorIcon: true,
});
</script>

<template>
  <div
    v-bind="rootBind"
    :aria-disabled="isDisabled || undefined"
    :aria-readonly="isReadonly || undefined"
    :data-invalid="invalidated || undefined"
  >
    <div v-if="showHeader" v-bind="headerBind">
      <label
        v-if="hasSlotOrProp(slots, 'label', merged.label)"
        v-bind="labelBind"
        :for="inputId"
      >
        <component :is="resolveSlotOrProp(slots, 'label', merged.label)" />
      </label>

      <span
        v-if="hasSlotOrProp(slots, 'corner', merged.corner)"
        v-bind="cornerBind"
      >
        <component :is="resolveSlotOrProp(slots, 'corner', merged.corner)" />
      </span>
    </div>

    <label v-bind="containerBind" :for="inputId">
      <div v-if="hasStartSlot" :class="startSlotClass">
        <slot name="start" />
      </div>

      <div v-else-if="showStartIcon && merged.startIcon" v-bind="startBind">
        <Icon
          :icon="merged.startIcon"
          :size="merged.size ?? 'md'"
          v-bind="startIconBind"
        />
      </div>

      <input
        v-bind="inputBind"
        @input="
          emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
      />

      <div v-if="hasEndSlot" :class="endSlotClass">
        <slot name="end" />
      </div>

      <div v-else-if="showEndIcon && merged.endIcon" v-bind="endBind">
        <Icon
          :icon="merged.endIcon"
          :size="merged.size ?? 'md'"
          v-bind="endIconBind"
        />
      </div>

      <div v-else-if="showErrorIcon" v-bind="endBind">
        <Icon
          :icon="errorIcon"
          :size="merged.size ?? 'md'"
          v-bind="endIconBind"
        />
      </div>
    </label>

    <p
      v-if="showDescription"
      v-bind="descriptionBind"
      :id="`${inputId}-description`"
    >
      <component
        :is="resolveSlotOrProp(slots, 'description', merged.description)"
      />
    </p>

    <p v-if="showError" v-bind="errorBind" :id="`${inputId}-error`">
      <component :is="resolveSlotOrProp(slots, 'error', merged.error)" />
    </p>
  </div>
</template>
