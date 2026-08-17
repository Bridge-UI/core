<script setup lang="ts">
// ** Local Imports
import { Icon } from "@/Components/Icon";
import { useStep } from "@/Components/Step/composables/useStep";
import type { StepOwnProps, StepSlots } from "@/Components/Step/step.types";
import { hasNamedSlot, hasSlotOrProp, isPropPresent } from "@/Utils";

defineSlots<StepSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<StepOwnProps>();

const {
  slots,
  merged,
  rootBind,
  textBind,
  iconBind,
  labelBind,
  stepNumber,
  showContent,
  contentBind,
  triggerBind,
  resolvedIcon,
  indicatorBind,
  connectorBind,
  descriptionBind,
} = useStep(props);
</script>

<template>
  <li v-bind="rootBind">
    <div v-bind="connectorBind" />

    <button v-bind="triggerBind">
      <span v-bind="indicatorBind">
        <slot name="icon" v-if="hasNamedSlot(slots, 'icon')" />

        <Icon :icon="resolvedIcon" v-bind="iconBind" v-else-if="resolvedIcon" />

        <template v-else>
          {{ stepNumber }}
        </template>
      </span>

      <span
        v-bind="textBind"
        v-if="
          hasSlotOrProp(slots, 'label', merged.label) ||
          hasSlotOrProp(slots, 'description', merged.description)
        "
      >
        <span
          v-bind="labelBind"
          v-if="hasSlotOrProp(slots, 'label', merged.label)"
        >
          <slot name="label" v-if="hasNamedSlot(slots, 'label')" />

          <template v-else-if="isPropPresent(merged.label)">
            {{ merged.label }}
          </template>
        </span>

        <span
          v-bind="descriptionBind"
          v-if="hasSlotOrProp(slots, 'description', merged.description)"
        >
          <slot name="description" v-if="hasNamedSlot(slots, 'description')" />

          <template v-else-if="isPropPresent(merged.description)">
            {{ merged.description }}
          </template>
        </span>
      </span>
    </button>

    <div v-if="showContent" v-bind="contentBind">
      <slot />
    </div>
  </li>
</template>
