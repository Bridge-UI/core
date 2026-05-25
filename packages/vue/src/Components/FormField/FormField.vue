<script setup lang="ts">
// ** External Imports
import { computed, toValue } from "vue";

// ** Local Imports
import type { FormFieldApi } from "@/Components/FormField/composables/useFormField";
import { useFormField } from "@/Components/FormField/composables/useFormField";
import type {
  FormFieldOwnProps,
  FormFieldSlots,
} from "@/Components/FormField/formField.types";
import { hasSlotOrProp, resolveSlotOrProp } from "@/Utils";

defineSlots<FormFieldSlots>();

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FormFieldOwnProps>(), {});

const local = useFormField(props, {
  size: "md",
});

const activeApi = (): FormFieldApi => {
  return props.field ?? local;
};

const slots = computed(() => {
  return activeApi().slots;
});

const merged = computed(() => {
  return activeApi().merged.value;
});

const rootBind = computed(() => {
  return toValue(activeApi().rootBind);
});

const controlId = computed(() => {
  return toValue(activeApi().controlId);
});

const errorBind = computed(() => {
  return toValue(activeApi().errorBind);
});

const labelBind = computed(() => {
  return toValue(activeApi().labelBind);
});

const cornerBind = computed(() => {
  return toValue(activeApi().cornerBind);
});

const headerBind = computed(() => {
  return toValue(activeApi().headerBind);
});

const isDisabled = computed(() => {
  return toValue(activeApi().isDisabled);
});

const isReadonly = computed(() => {
  return toValue(activeApi().isReadonly);
});

const invalidated = computed(() => {
  return toValue(activeApi().invalidated);
});

const requiredBind = computed(() => {
  return toValue(activeApi().requiredBind);
});

const descriptionBind = computed(() => {
  return toValue(activeApi().descriptionBind);
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
