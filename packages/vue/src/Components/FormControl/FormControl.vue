<script setup lang="ts">
// ** External Imports
import { computed } from "vue";

// ** Local Imports
import FormControlLabel from "@/Components/FormControl/FormControlLabel.vue";
import type { UseFormControlReturn } from "@/Components/FormControl/composables/useFormControl";
import { hasSlotOrProp, resolveSlotOrProp } from "@/Utils";

defineOptions({ inheritAttrs: false });

const props = defineProps<{
  field: UseFormControlReturn;
}>();

const api = computed((): UseFormControlReturn => {
  return props.field;
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
      <FormControlLabel :api="api" name="startLabel" />

      <slot />

      <FormControlLabel :api="api" name="endLabel" />
    </div>

    <p
      v-bind="api.descriptionBind.value"
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
      v-bind="api.errorMessageBind.value"
      v-if="!api.merged.value.hideErrorMessage"
      :aria-hidden="api.showErrorMessageContent.value ? undefined : true"
    >
      <template v-if="api.showErrorMessageContent.value">
        <component
          :is="
            resolveSlotOrProp(
              api.slots,
              'errorMessage',
              api.merged.value.errorMessage,
            )
          "
        />
      </template>
    </p>
  </div>
</template>
