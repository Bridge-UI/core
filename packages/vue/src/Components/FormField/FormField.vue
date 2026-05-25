<script setup lang="ts">
// ** External Imports
import { inject } from "vue";

// ** Local Imports
import { useFormField } from "@/Components/FormField/composables/useFormField";
import type {
  FormFieldOwnProps,
  FormFieldSlots,
} from "@/Components/FormField/formField.types";
import type { FormFieldApi } from "@/Components/FormField/formFieldContext";
import { formFieldContextKey } from "@/Components/FormField/formFieldContext";
import { hasSlotOrProp, resolveSlotOrProp } from "@/Utils";

defineSlots<FormFieldSlots>();

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FormFieldOwnProps>(), {});

const injected = inject<FormFieldApi | null>(formFieldContextKey, null);

const {
  slots,
  merged,
  rootBind,
  controlId,
  errorBind,
  labelBind,
  cornerBind,
  headerBind,
  isDisabled,
  isReadonly,
  invalidated,
  requiredBind,
  descriptionBind,
} =
  injected ??
  useFormField(props, {
    size: "md",
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
      v-bind="headerBind"
      v-if="
        hasSlotOrProp(slots, 'label', merged.label) ||
        hasSlotOrProp(slots, 'corner', merged.corner)
      "
    >
      <label
        :for="controlId"
        v-bind="labelBind"
        v-if="hasSlotOrProp(slots, 'label', merged.label)"
      >
        <component :is="resolveSlotOrProp(slots, 'label', merged.label)" />

        <span v-if="merged.required" v-bind="requiredBind">*</span>
      </label>

      <span
        v-bind="cornerBind"
        v-if="hasSlotOrProp(slots, 'corner', merged.corner)"
      >
        <component :is="resolveSlotOrProp(slots, 'corner', merged.corner)" />
      </span>
    </div>

    <slot />

    <p
      v-bind="descriptionBind"
      :id="`${controlId}-description`"
      v-if="
        !invalidated && hasSlotOrProp(slots, 'description', merged.description)
      "
    >
      <component
        :is="resolveSlotOrProp(slots, 'description', merged.description)"
      />
    </p>

    <p
      v-bind="errorBind"
      :id="`${controlId}-error`"
      v-if="hasSlotOrProp(slots, 'errorMessage', merged.errorMessage)"
    >
      <component
        :is="resolveSlotOrProp(slots, 'errorMessage', merged.errorMessage)"
      />
    </p>
  </div>
</template>
