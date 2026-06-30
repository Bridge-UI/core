<script setup lang="ts">
// ** Local Imports
import { type UseFormFieldReturn } from "@/Components/FormField/composables/useFormField";
import { Icon } from "@/Components/Icon";
import {
  hasNamedSlot,
  hasSlotOrProp,
  isPropPresent,
  resolveNamedSlot,
  resolveSlotOrProp,
} from "@/Utils";

defineProps<{
  api: UseFormFieldReturn;
}>();
</script>

<template>
  <div
    v-bind="api.rootBind.value"
    :data-invalid="api.invalidated.value || undefined"
    :aria-disabled="api.isDisabled.value || undefined"
    :aria-readonly="api.isReadonly.value || undefined"
  >
    <div v-bind="api.containerBind.value">
      <div
        v-if="api.hasInsetLabelRow.value"
        v-bind="api.insetLabelRowBind.value"
      >
        <label
          :for="api.controlId.value"
          v-bind="api.labelBind.value"
          v-if="hasSlotOrProp(api.slots, 'label', api.merged.value.label)"
        >
          <component
            :is="resolveSlotOrProp(api.slots, 'label', api.merged.value.label)"
          />

          <span
            v-bind="api.requiredBind.value"
            v-if="api.merged.value.required"
          >
            *
          </span>
        </label>

        <span
          v-bind="api.cornerBind.value"
          v-if="hasSlotOrProp(api.slots, 'corner', api.merged.value.corner)"
        >
          <component
            :is="
              resolveSlotOrProp(api.slots, 'corner', api.merged.value.corner)
            "
          />
        </span>
      </div>

      <div class="flex min-h-0 w-full flex-1 items-stretch gap-x-2">
        <div
          v-bind="api.startSlotBind.value"
          v-if="hasNamedSlot(api.slots, 'start')"
        >
          <component :is="resolveNamedSlot(api.slots, 'start')" />
        </div>

        <div
          v-bind="api.startBind.value"
          v-else-if="isPropPresent(api.merged.value.start)"
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
          v-bind="api.endSlotBind.value"
          v-if="hasNamedSlot(api.slots, 'end')"
        >
          <component :is="resolveNamedSlot(api.slots, 'end')" />
        </div>

        <div
          v-bind="api.endBind.value"
          v-else-if="isPropPresent(api.merged.value.end)"
        >
          {{ api.merged.value.end }}
        </div>

        <div
          v-bind="api.endBind.value"
          v-else-if="
            api.invalidated.value && api.merged.value.withErrorIcon !== false
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
      v-if="!api.merged.value.withoutErrorMessage"
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
