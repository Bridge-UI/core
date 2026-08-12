<script setup lang="ts">
// ** External Imports
import { computed, useSlots } from "vue";

// ** Local Imports
import FormControlLabel from "@/Components/FormControl/FormControlLabel.vue";
import type { UseFormControlReturn } from "@/Components/FormControl/composables/useFormControl";
import type { FormControlSlots } from "@/Components/FormControl/formControl.types";
import { hasNamedSlot, hasSlotOrProp, isPropPresent } from "@/Utils";

defineSlots<FormControlSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<{
  field: UseFormControlReturn;
}>();

const slots = useSlots();

const api = computed((): UseFormControlReturn => {
  return {
    ...props.field,
    slots: {
      ...props.field.slots,
      ...slots,
    },
  };
});
</script>

<template>
  <div
    v-bind="api.rootBind.value"
    :data-invalid="api.invalidated.value || undefined"
    :aria-disabled="api.isDisabled.value || undefined"
    :aria-readonly="api.isReadonly.value || undefined"
  >
    <div v-bind="api.rowBind.value">
      <FormControlLabel :api="api" name="startLabel">
        <slot name="startLabel" />
      </FormControlLabel>

      <slot />

      <FormControlLabel :api="api" name="endLabel">
        <slot name="endLabel" />
      </FormControlLabel>
    </div>

    <p
      v-bind="api.descriptionBind.value"
      v-if="
        !api.invalidated.value &&
        hasSlotOrProp(slots, 'description', api.merged.value.description)
      "
    >
      <slot name="description" v-if="hasNamedSlot(slots, 'description')" />

      <template v-else-if="isPropPresent(api.merged.value.description)">
        {{ api.merged.value.description }}
      </template>
    </p>

    <p
      v-bind="api.errorMessageBind.value"
      v-if="!api.merged.value.hideErrorMessage"
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
