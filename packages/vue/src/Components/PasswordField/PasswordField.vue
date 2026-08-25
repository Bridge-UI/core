<script setup lang="ts">
// ** External Imports
import { isUndefined } from "es-toolkit/compat";
import { computed, ref } from "vue";

// ** Core Imports
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import {
  FORM_FIELD_CHROME_SLOT_NAMES,
  FormField,
} from "@/Components/FormField";
import { Icon } from "@/Components/Icon";
import { usePasswordField } from "@/Components/PasswordField/composables/usePasswordField";
import type {
  PasswordFieldEmits,
  PasswordFieldOwnProps,
  PasswordFieldSlots,
} from "@/Components/PasswordField/passwordField.types";
import {
  mergePartBind,
  presentSlotNames,
  resolveFieldAdornmentIconSize,
} from "@/Utils";

defineSlots<PasswordFieldSlots>();

defineOptions({ inheritAttrs: false });

const emit = defineEmits<PasswordFieldEmits>();

const model = defineModel<null | string | undefined>();

const props = withDefaults(defineProps<PasswordFieldOwnProps>(), {
  visible: null,
});

const uncontrolledValue = ref<null | string | undefined>(props.defaultValue);

const value = computed({
  set: (next) => {
    model.value = next;
    uncontrolledValue.value = next;
  },
  get: () => {
    return isUndefined(model.value) ? uncontrolledValue.value : model.value;
  },
});

const resolveMessage = useResolveMessage();

const { formField, inputBind, isVisible, mergedClasses, toggleVisibility } =
  usePasswordField(props, {
    onVisibilityChange: (next) => emit("visibility-change", next),
  });

const toggleBind = computed(() => {
  return mergePartBind(
    props.customProps?.toggle,
    {
      type: "button" as const,
      disabled: props.disabled,
      onClick: toggleVisibility,
      "aria-label": isVisible.value
        ? resolveMessage("Hide password")
        : resolveMessage("Show password"),
    },
    cn({
      "bridge-end-adornment bridge-field-adornment-button inline-flex h-auto! min-h-0 self-stretch overflow-hidden items-center justify-center px-2.5": true,
      [mergedClasses.value.toggle ?? ""]: true,
    }),
  );
});
</script>

<template>
  <FormField :field="formField">
    <template
      #[name]="slotData"
      v-for="name in presentSlotNames(
        FORM_FIELD_CHROME_SLOT_NAMES.filter((n) => n !== 'end'),
        $slots,
      )"
    >
      <slot :name="name" v-bind="slotData || {}" />
    </template>

    <input v-model="value" v-bind="inputBind" />

    <template #end>
      <button v-bind="toggleBind">
        <Icon
          :icon="isVisible ? 'eyeOff' : 'eye'"
          :size="resolveFieldAdornmentIconSize(props.size)"
          v-bind="props.customProps?.toggleIcon"
        />
      </button>
    </template>
  </FormField>
</template>
