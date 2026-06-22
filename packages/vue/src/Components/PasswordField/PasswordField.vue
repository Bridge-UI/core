<script setup lang="ts">
// ** External Imports
import { Eye, EyeOff } from "lucide-vue-next";
import { computed } from "vue";

// ** Core Imports
import { cn } from "@bridge-ui/core";

// ** Local Imports
import { FormField } from "@/Components/FormField";
import { Icon } from "@/Components/Icon";
import { usePasswordField } from "@/Components/PasswordField/composables/usePasswordField";
import type {
  PasswordFieldEmits,
  PasswordFieldOwnProps,
  PasswordFieldSlots,
} from "@/Components/PasswordField/passwordField.types";
import { resolveFieldAdornmentIconSize } from "@/Utils";

defineSlots<PasswordFieldSlots>();

defineOptions({ inheritAttrs: false });

const emit = defineEmits<PasswordFieldEmits>();

const model = defineModel<string | null | undefined>();

const props = withDefaults(defineProps<PasswordFieldOwnProps>(), {
  visible: null,
});

const { formField, inputBind, isVisible, mergedClasses, toggleVisibility } =
  usePasswordField(props, {
    onVisibilityChange: (next) => emit("visibility-change", next),
  });

const toggleIconSize = computed(() => {
  return resolveFieldAdornmentIconSize(props.size);
});
</script>

<template>
  <FormField :field="formField">
    <input v-model="model" v-bind="inputBind" />

    <template #end>
      <button
        type="button"
        :disabled="props.disabled"
        v-on:click="toggleVisibility"
        :aria-label="isVisible ? 'Hide password' : 'Show password'"
        :class="
          cn({
            'bridge-end-adornment bridge-field-adornment-button inline-flex h-full items-center justify-center px-2.5': true,
            [mergedClasses.toggle ?? '']: true,
          })
        "
      >
        <Icon :icon="isVisible ? EyeOff : Eye" :size="toggleIconSize" />
      </button>
    </template>
  </FormField>
</template>
