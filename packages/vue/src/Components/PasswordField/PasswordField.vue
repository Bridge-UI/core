<script setup lang="ts">
// ** External Imports
import { Eye, EyeOff } from "lucide-vue-next";
import { computed, toRef } from "vue";

// ** Core Imports
import { cn } from "@bridge-ui/core";

// ** Local Imports
import { Icon } from "@/Components/Icon";
import { usePasswordField } from "@/Components/PasswordField/composables/usePasswordField";
import type {
  PasswordFieldProps,
  PasswordFieldSlots,
} from "@/Components/PasswordField/passwordField.types";
import { TextField } from "@/Components/TextField";

defineSlots<PasswordFieldSlots>();

defineOptions({ inheritAttrs: false });

const model = defineModel<string | null | undefined>();

const props = withDefaults(defineProps<PasswordFieldProps>(), {
  visible: null,
});

const visible = toRef(props, "visible");

const { isVisible, toggleVisibility } = usePasswordField({
  visible,
  onVisibilityChange: (next) => props.onVisibilityChange?.(next),
});

const inputType = computed(() => (isVisible.value ? "text" : "password"));

const mergedPartsProps = computed(() => ({
  ...props.partsProps,
  input: {
    ...props.partsProps?.input,
    type: inputType.value,
  },
}));

const textFieldProps = computed(() => {
  const {
    visible: _visible,
    modelValue: _modelValue,
    onVisibilityChange: _onVisibilityChange,
    ...rest
  } = props;

  return rest;
});
</script>

<template>
  <TextField
    v-model="model"
    v-bind="{
      ...textFieldProps,
      ...$attrs,
    }"
    :classes="props.classes"
    :with-error-icon="false"
    :parts-props="mergedPartsProps"
  >
    <template #end>
      <button
        type="button"
        :disabled="props.disabled"
        v-on:click="toggleVisibility"
        :aria-label="isVisible ? 'Hide password' : 'Show password'"
        :class="
          cn({
            'inline-flex items-center justify-center text-gray-500 transition-colors': true,
            'hover:text-gray-700 dark:hover:text-gray-300': true,
            'disabled:pointer-events-none disabled:opacity-50': true,
            [props.classes?.toggle ?? '']: true,
          })
        "
      >
        <Icon :icon="isVisible ? EyeOff : Eye" :size="props.size ?? 'md'" />
      </button>
    </template>
  </TextField>
</template>
