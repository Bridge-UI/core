<script setup lang="ts">
// ** Local Imports
import { Icon } from "@/Components/Icon";
import { Label } from "@/Components/Label";
import { useTextField } from "@/Components/TextField/composables/useTextField";
import type {
  TextFieldOwnProps,
  TextFieldSlots,
} from "@/Components/TextField/textField.types";
import { hasSlotOrProp, resolveSlotOrProp } from "@/Utils";

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
  rootBind,
  errorBind,
  errorIcon,
  inputBind,
  labelBind,
  showError,
  startBind,
  cornerBind,
  hasEndSlot,
  headerBind,
  isDisabled,
  isReadonly,
  showHeader,
  endIconBind,
  endSlotBind,
  invalidated,
  showEndIcon,
  showEndText,
  hasStartSlot,
  containerBind,
  showErrorIcon,
  showStartIcon,
  showStartText,
  startIconBind,
  startSlotBind,
  descriptionBind,
  showDescription,
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
    :data-invalid="invalidated || undefined"
    :aria-disabled="isDisabled || undefined"
    :aria-readonly="isReadonly || undefined"
  >
    <div v-if="showHeader" v-bind="headerBind">
      <Label
        v-if="hasSlotOrProp(slots, 'label', merged.label)"
        v-bind="labelBind"
        :for="inputId"
        :size="merged.size"
        :error="invalidated"
        :required="merged.required"
      >
        <component :is="resolveSlotOrProp(slots, 'label', merged.label)" />
      </Label>

      <span
        v-if="hasSlotOrProp(slots, 'corner', merged.corner)"
        v-bind="cornerBind"
      >
        <component :is="resolveSlotOrProp(slots, 'corner', merged.corner)" />
      </span>
    </div>

    <label v-bind="containerBind" :for="inputId">
      <div v-if="hasStartSlot" v-bind="startSlotBind">
        <slot name="start" />
      </div>

      <div v-else-if="showStartText" v-bind="startBind">
        {{ merged.start }}
      </div>

      <div v-else-if="showStartIcon && merged.startIcon" v-bind="startBind">
        <Icon
          :icon="merged.startIcon"
          :size="merged.size ?? 'md'"
          v-bind="startIconBind"
        />
      </div>

      <input v-model="model" v-bind="inputBind" />

      <div v-if="hasEndSlot" v-bind="endSlotBind">
        <slot name="end" />
      </div>

      <div v-if="!hasEndSlot && showEndText" v-bind="endBind">
        {{ merged.end }}
      </div>

      <div v-if="!hasEndSlot && showErrorIcon" v-bind="endBind">
        <Icon
          :icon="errorIcon"
          :size="merged.size ?? 'md'"
          v-bind="endIconBind"
        />
      </div>

      <div v-if="!hasEndSlot && showEndIcon && merged.endIcon" v-bind="endBind">
        <Icon
          :icon="merged.endIcon"
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
      <component
        :is="resolveSlotOrProp(slots, 'errorMessage', merged.errorMessage)"
      />
    </p>
  </div>
</template>
