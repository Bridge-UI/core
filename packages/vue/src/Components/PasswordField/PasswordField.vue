<script setup lang="ts">
// ** External Imports
import { Eye, EyeOff } from "lucide-vue-next";
import { computed, toRef } from "vue";

// ** Core Imports
import { cn } from "@bridge-ui/core";

// ** Local Imports
import { Icon } from "@/Components/Icon";
import { usePasswordField } from "@/Components/PasswordField/composables/usePasswordField";
import { usePasswordFieldClasses } from "@/Components/PasswordField/composables/usePasswordFieldClasses";
import type {
  PasswordFieldOwnProps,
  PasswordFieldSlots,
} from "@/Components/PasswordField/passwordField.types";
import { TextField } from "@/Components/TextField";
import { resolveFieldAdornmentIconSize } from "@/Utils";

defineSlots<PasswordFieldSlots>();

defineOptions({ inheritAttrs: false });

const model = defineModel<string | null | undefined>();

const props = withDefaults(defineProps<PasswordFieldOwnProps>(), {
  visible: null,
});

const visible = toRef(props, "visible");

const mergedClasses = usePasswordFieldClasses(props);

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
    onVisibilityChange: _onVisibilityChange,
    ...rest
  } = props;

  return rest;
});

const toggleIconSize = computed(() => {
  return resolveFieldAdornmentIconSize(props.size);
});
</script>

<template>
  <TextField
    v-model="model"
    v-bind="{
      ...textFieldProps,
      ...$attrs,
    }"
    :classes="mergedClasses"
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
          cn(
            'bridge-end-adornment bridge-field-adornment-button inline-flex h-full items-center justify-center px-2.5',
            mergedClasses.toggle,
          )
        "
      >
        <Icon :icon="isVisible ? EyeOff : Eye" :size="toggleIconSize" />
      </button>
    </template>
  </TextField>
</template>
