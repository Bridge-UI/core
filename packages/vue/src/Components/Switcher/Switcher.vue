<script setup lang="ts">
// ** External Imports
import { computed } from "vue";

// ** Local Imports
import { Label } from "@/Components/Label";
import type { UseSwitcherReturn } from "@/Components/Switcher/composables/useSwitcher";
import { hasSlotOrProp, resolveSlotOrProp } from "@/Utils";

defineOptions({ inheritAttrs: false });

const props = defineProps<{
  field: UseSwitcherReturn;
}>();

const api = computed((): UseSwitcherReturn => {
  return props.field;
});
</script>

<template>
  <div
    v-bind="api.rootBind"
    :data-invalid="api.invalidated.value || undefined"
    :aria-disabled="api.isDisabled.value || undefined"
    :aria-readonly="api.isReadonly.value || undefined"
  >
    <div v-bind="api.rowBind">
      <Label
        v-bind="api.leftLabelProps"
        v-if="hasSlotOrProp(api.slots, 'leftLabel', api.merged.value.leftLabel)"
      >
        <component
          :is="
            resolveSlotOrProp(
              api.slots,
              'leftLabel',
              api.merged.value.leftLabel,
            )
          "
        />
      </Label>

      <slot />

      <Label
        v-bind="api.labelProps"
        v-if="hasSlotOrProp(api.slots, 'label', api.merged.value.label)"
      >
        <component
          :is="resolveSlotOrProp(api.slots, 'label', api.merged.value.label)"
        />
      </Label>
    </div>

    <p
      v-bind="api.descriptionBind"
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
      v-bind="api.errorMessageBind"
      :aria-hidden="api.showErrorMessageContent.value ? undefined : true"
      v-if="!api.merged.value.errorless && api.reservesErrorMessageSpace.value"
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
