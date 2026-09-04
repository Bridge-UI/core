<script setup lang="ts">
// ** External Imports
import { computed, useSlots } from "vue";

// ** Local Imports
import BaseFieldCorner from "@/Components/BaseField/BaseFieldCorner.vue";
import BaseFieldLabel from "@/Components/BaseField/BaseFieldLabel.vue";
import type { BaseFieldSlots } from "@/Components/BaseField/baseField.types";
import type { UseBaseFieldReturn } from "@/Components/BaseField/composables/useBaseField";
import { hasNamedSlot, hasSlotOrProp, isPropPresent } from "@/Utils";

defineSlots<BaseFieldSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<{
  field: UseBaseFieldReturn;
}>();

const slots = useSlots();

const api = computed((): UseBaseFieldReturn => {
  return {
    ...props.field,
    slots: {
      ...props.field.slots,
      ...slots,
    },
  };
});

const showHeader = computed(() => {
  return (
    hasSlotOrProp(slots, "label", api.value.merged.value.label) ||
    hasSlotOrProp(slots, "corner", api.value.merged.value.corner)
  );
});
</script>

<template>
  <div
    v-bind="api.rootBind.value"
    :data-invalid="api.invalidated.value || undefined"
    :aria-disabled="api.isDisabled.value || undefined"
    :aria-readonly="api.isReadonly.value || undefined"
  >
    <div v-if="showHeader" v-bind="api.headerBind.value">
      <BaseFieldLabel :api="api">
        <template #label v-if="hasNamedSlot(slots, 'label')">
          <slot name="label" />
        </template>
      </BaseFieldLabel>

      <BaseFieldCorner :api="api">
        <template #corner v-if="hasNamedSlot(slots, 'corner')">
          <slot name="corner" />
        </template>
      </BaseFieldCorner>
    </div>

    <div v-bind="api.groupBind.value">
      <div v-bind="api.startSlotBind.value" v-if="hasNamedSlot(slots, 'start')">
        <slot name="start" />
      </div>

      <slot />

      <div v-bind="api.endSlotBind.value" v-if="hasNamedSlot(slots, 'end')">
        <slot name="end" />
      </div>
    </div>

    <p
      v-bind="api.descriptionBind.value"
      v-if="api.showDescriptionContent.value"
      :id="`${api.controlId.value}-description`"
    >
      <slot name="description" v-if="hasNamedSlot(slots, 'description')" />

      <template v-else-if="isPropPresent(api.merged.value.description)">
        {{ api.merged.value.description }}
      </template>
    </p>

    <p
      v-bind="api.errorBind.value"
      :id="`${api.controlId.value}-error`"
      v-if="api.showErrorMessageRow.value"
      :aria-hidden="api.showErrorMessageContent.value ? undefined : true"
    >
      <template v-if="api.showErrorMessageContent.value">
        <slot name="errorMessage" v-if="hasNamedSlot(slots, 'errorMessage')" />

        <template v-else-if="isPropPresent(api.merged.value.errorMessage)">
          {{ api.merged.value.errorMessage }}
        </template>
      </template>
    </p>
  </div>
</template>
