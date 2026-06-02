<script setup lang="ts">
// ** External Imports
import { computed } from "vue";

// ** Local Imports
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
      <label
        v-bind="api.startLabelBind"
        v-if="
          hasSlotOrProp(api.slots, 'startLabel', api.merged.value.startLabel)
        "
      >
        <component
          :is="
            resolveSlotOrProp(
              api.slots,
              'startLabel',
              api.merged.value.startLabel,
            )
          "
        />
      </label>

      <slot />

      <label
        v-bind="api.mainLabelBind"
        v-if="
          hasSlotOrProp(api.slots, 'endLabel', api.merged.value.endLabel) ||
          hasSlotOrProp(api.slots, 'mainLabel', api.merged.value.mainLabel)
        "
      >
        <component
          :is="
            hasSlotOrProp(api.slots, 'mainLabel', api.merged.value.mainLabel)
              ? resolveSlotOrProp(
                  api.slots,
                  'mainLabel',
                  api.merged.value.mainLabel,
                )
              : resolveSlotOrProp(
                  api.slots,
                  'endLabel',
                  api.merged.value.endLabel,
                )
          "
        />
      </label>
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
      v-if="api.reservesErrorMessageSpace.value"
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
