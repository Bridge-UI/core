<script setup lang="ts">
// ** External Imports
import { useSlots } from "vue";

// ** Local Imports
import { Icon } from "@/Components/Icon";
import { Label } from "@/Components/Label";
import { useTextField } from "@/Components/TextField/composables/useTextField";
import type {
  TextFieldOwnProps,
  TextFieldSlots,
} from "@/Components/TextField/textField.types";
import {
  hasNamedSlot,
  hasSlotOrProp,
  isPropPresent,
  resolveSlotOrProp,
} from "@/Utils";

defineSlots<TextFieldSlots>();

defineOptions({ inheritAttrs: false });

const model = defineModel<string | null | undefined>();

const props = withDefaults(defineProps<TextFieldOwnProps>(), {
  withErrorIcon: true,
});

const slots = useSlots();

const {
  merged,
  inputId,
  rootBind,
  errorBind,
  errorIcon,
  inputBind,
  labelBind,
  endBind,
  startBind,
  cornerBind,
  headerBind,
  isDisabled,
  isReadonly,
  endIconBind,
  endSlotBind,
  invalidated,
  containerBind,
  startIconBind,
  startSlotBind,
  descriptionBind,
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
    <div
      v-if="
        hasSlotOrProp(slots, 'label', merged.label) ||
        hasSlotOrProp(slots, 'corner', merged.corner)
      "
      v-bind="headerBind"
    >
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
      <div v-if="hasNamedSlot(slots, 'start')" v-bind="startSlotBind">
        <slot name="start" />
      </div>

      <div v-else-if="isPropPresent(merged.start)" v-bind="startBind">
        {{ merged.start }}
      </div>

      <div v-else-if="merged.startIcon" v-bind="startBind">
        <Icon
          :icon="merged.startIcon"
          :size="merged.size"
          v-bind="startIconBind"
        />
      </div>

      <input v-model="model" v-bind="inputBind" />

      <div v-if="hasNamedSlot(slots, 'end')" v-bind="endSlotBind">
        <slot name="end" />
      </div>

      <div v-else-if="isPropPresent(merged.end)" v-bind="endBind">
        {{ merged.end }}
      </div>

      <div
        v-else-if="invalidated && merged.withErrorIcon !== false"
        v-bind="endBind"
      >
        <Icon :icon="errorIcon" :size="merged.size" v-bind="endIconBind" />
      </div>

      <div v-else-if="merged.endIcon" v-bind="endBind">
        <Icon :icon="merged.endIcon" :size="merged.size" v-bind="endIconBind" />
      </div>
    </label>

    <p
      v-if="
        !invalidated && hasSlotOrProp(slots, 'description', merged.description)
      "
      v-bind="descriptionBind"
      :id="`${inputId}-description`"
    >
      <component
        :is="resolveSlotOrProp(slots, 'description', merged.description)"
      />
    </p>

    <p
      v-if="hasSlotOrProp(slots, 'errorMessage', merged.errorMessage)"
      v-bind="errorBind"
      :id="`${inputId}-error`"
    >
      <component
        :is="resolveSlotOrProp(slots, 'errorMessage', merged.errorMessage)"
      />
    </p>
  </div>
</template>
