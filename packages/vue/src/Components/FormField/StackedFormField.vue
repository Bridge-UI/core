<script setup lang="ts">
// ** External Imports
import { useSlots } from "vue";

// ** Local Imports
import FormFieldLabel from "@/Components/FormField/FormFieldLabel.vue";
import { type UseFormFieldReturn } from "@/Components/FormField/composables/useFormField";
import { Icon } from "@/Components/Icon";
import { hasNamedSlot, hasSlotOrProp, isPropPresent } from "@/Utils";

defineProps<{
  api: UseFormFieldReturn;
}>();

const slots = useSlots();
</script>

<template>
  <div
    v-bind="api.rootBind.value"
    :data-invalid="api.invalidated.value || undefined"
    :aria-disabled="api.isDisabled.value || undefined"
    :aria-readonly="api.isReadonly.value || undefined"
  >
    <div v-bind="api.containerBind.value">
      <div v-bind="api.startSlotBind.value" v-if="hasNamedSlot(slots, 'start')">
        <slot name="start" />
      </div>

      <div v-bind="api.stackedBodyBind.value">
        <div
          v-if="api.hasInsetLabelRow.value"
          v-bind="api.insetLabelRowBind.value"
        >
          <FormFieldLabel :api="api">
            <template #label v-if="hasNamedSlot(slots, 'label')">
              <slot name="label" />
            </template>
          </FormFieldLabel>

          <span
            v-bind="api.cornerBind.value"
            v-if="hasSlotOrProp(slots, 'corner', api.merged.value.corner)"
          >
            <slot name="corner" v-if="hasNamedSlot(slots, 'corner')" />

            <template v-else-if="isPropPresent(api.merged.value.corner)">
              {{ api.merged.value.corner }}
            </template>
          </span>
        </div>

        <div v-bind="api.stackedInputRowBind.value">
          <div
            v-bind="api.startBind.value"
            v-if="isPropPresent(api.merged.value.start)"
          >
            {{ api.merged.value.start }}
          </div>

          <div
            v-bind="api.startBind.value"
            v-else-if="api.merged.value.startIcon"
          >
            <Icon
              :size="api.merged.value.size"
              v-bind="api.startIconBind.value"
              :icon="api.merged.value.startIcon"
            />
          </div>

          <slot />

          <div
            v-bind="api.endBind.value"
            v-if="isPropPresent(api.merged.value.end)"
          >
            {{ api.merged.value.end }}
          </div>

          <div
            v-bind="api.endBind.value"
            v-else-if="
              api.invalidated.value && api.merged.value.showErrorIcon !== false
            "
          >
            <Icon
              :icon="api.errorIcon.value"
              :size="api.merged.value.size"
              v-bind="api.endIconBind.value"
            />
          </div>

          <div v-bind="api.endBind.value" v-else-if="api.merged.value.endIcon">
            <Icon
              :size="api.merged.value.size"
              v-bind="api.endIconBind.value"
              :icon="api.merged.value.endIcon"
            />
          </div>
        </div>
      </div>

      <div v-bind="api.endSlotBind.value" v-if="hasNamedSlot(slots, 'end')">
        <slot name="end" />
      </div>
    </div>

    <p
      v-bind="api.descriptionBind.value"
      :id="`${api.controlId.value}-description`"
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
      v-bind="api.errorBind.value"
      :id="`${api.controlId.value}-error`"
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
