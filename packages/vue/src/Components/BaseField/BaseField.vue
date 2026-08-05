<script setup lang="ts">
// ** External Imports
import { computed, useSlots } from "vue";

// ** Local Imports
import BaseFieldLabel from "@/Components/BaseField/BaseFieldLabel.vue";
import type { BaseFieldSlots } from "@/Components/BaseField/baseField.types";
import type { UseBaseFieldReturn } from "@/Components/BaseField/composables/useBaseField";
import {
  hasNamedSlot,
  hasSlotOrProp,
  resolveNamedSlot,
  resolveSlotOrProp,
} from "@/Utils";

defineSlots<BaseFieldSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<{
  field: UseBaseFieldReturn;
}>();

const localSlots = useSlots();

const api = computed((): UseBaseFieldReturn => {
  return {
    ...props.field,
    slots: {
      ...props.field.slots,
      ...localSlots,
    },
  };
});

const showHeader = computed(() => {
  return (
    hasSlotOrProp(api.value.slots, "label", api.value.merged.value.label) ||
    hasSlotOrProp(api.value.slots, "corner", api.value.merged.value.corner)
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
      <BaseFieldLabel :api="api" />

      <span
        v-bind="api.cornerBind.value"
        v-if="hasSlotOrProp(api.slots, 'corner', api.merged.value.corner)"
      >
        <component
          :is="resolveSlotOrProp(api.slots, 'corner', api.merged.value.corner)"
        />
      </span>
    </div>

    <div v-bind="api.groupBind.value">
      <div
        v-bind="api.startSlotBind.value"
        v-if="hasNamedSlot(api.slots, 'start')"
      >
        <component :is="resolveNamedSlot(api.slots, 'start')" />
      </div>

      <slot />

      <div v-bind="api.endSlotBind.value" v-if="hasNamedSlot(api.slots, 'end')">
        <component :is="resolveNamedSlot(api.slots, 'end')" />
      </div>
    </div>

    <p
      v-bind="api.descriptionBind.value"
      :id="`${api.controlId.value}-description`"
      v-if="
        !api.invalidated.value &&
        hasSlotOrProp(api.slots, 'description', api.merged.value.description)
      "
    >
      <component
        :is="
          resolveSlotOrProp(
            api.slots,
            'description',
            api.merged.value.description,
          )
        "
      />
    </p>

    <p
      v-bind="api.errorBind.value"
      :id="`${api.controlId.value}-error`"
      v-if="!api.merged.value.hideErrorMessage"
      :aria-hidden="api.showErrorMessageContent.value ? undefined : true"
    >
      <component
        v-if="api.showErrorMessageContent.value"
        :is="
          resolveSlotOrProp(
            api.slots,
            'errorMessage',
            api.merged.value.errorMessage,
          )
        "
      />
    </p>
  </div>
</template>
