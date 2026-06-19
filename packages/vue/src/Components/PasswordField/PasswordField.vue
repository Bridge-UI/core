<script setup lang="ts">
// ** External Imports
import { Eye, EyeOff } from "lucide-vue-next";
import { computed, nextTick, toRef, watch } from "vue";

// ** Core Imports
import { cn } from "@bridge-ui/core";

// ** Local Imports
import { Icon } from "@/Components/Icon";
import { usePasswordField } from "@/Components/PasswordField/composables/usePasswordField";
import { usePasswordFieldClasses } from "@/Components/PasswordField/composables/usePasswordFieldClasses";
import type {
  PasswordFieldEmits,
  PasswordFieldOwnProps,
  PasswordFieldSlots,
} from "@/Components/PasswordField/passwordField.types";
import { TextField } from "@/Components/TextField";
import { resolveFieldAdornmentIconSize } from "@/Utils";

defineSlots<PasswordFieldSlots>();

defineOptions({ inheritAttrs: false });

const emit = defineEmits<PasswordFieldEmits>();

const model = defineModel<string | null | undefined>();

const props = withDefaults(defineProps<PasswordFieldOwnProps>(), {
  visible: null,
});

const visible = toRef(props, "visible");

const mergedClasses = usePasswordFieldClasses(props);

const { isVisible, toggleVisibility } = usePasswordField({
  visible,
  onVisibilityChange: (next) => emit("visibility-change", next),
});

const inputType = computed(() => (isVisible.value ? "text" : "password"));

watch(
  isVisible,
  async () => {
    const value = model.value;

    if (value == null || value === "") {
      return;
    }

    await nextTick();
    model.value = value;
  },
  { flush: "pre" },
);

const textFieldProps = computed(() => {
  const { visible: _visible, ...rest } = props;

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
    :type="inputType"
    :classes="mergedClasses"
    :with-error-icon="false"
    :custom-props="props.customProps"
  >
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
  </TextField>
</template>
