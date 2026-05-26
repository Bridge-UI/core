<script setup lang="ts">
// ** External Imports
import { get } from "es-toolkit/compat";
import { Eye, EyeOff } from "lucide-vue-next";
import { computed, toRef } from "vue";

// ** Core Imports
import { cn } from "@bridge-ui/core";
import type { IconSize } from "@bridge-ui/core/Components/Icon";

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

// prettier-ignore
const toggleIconSize = computed(() => {
  const fieldSize = props.size ?? "md";

  return get({
    "2xs": "xs",
    "xs": "xs",
    "sm": "sm",
    "md": "md",
    "lg": "md",
    "xl": "lg",
    "2xl": "lg",
  }, fieldSize) as keyof IconSize;
});

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
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary-500/40': true,
            'inline-flex h-full min-h-0 shrink-0 items-center justify-center self-stretch px-2.5': true,
            'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50': true,
            'dark:hover:bg-gray-700/50 dark:hover:text-gray-300 dark:active:bg-gray-600': true,
            'cursor-pointer rounded-sm text-gray-500 transition-colors': true,
            'hover:bg-gray-100 hover:text-gray-700 active:bg-gray-200': true,
            [props.classes?.toggle ?? '']: true,
          })
        "
      >
        <Icon :icon="isVisible ? EyeOff : Eye" :size="toggleIconSize" />
      </button>
    </template>
  </TextField>
</template>
