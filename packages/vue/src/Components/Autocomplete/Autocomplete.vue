<script setup lang="ts">
// ** External Imports
import { isUndefined } from "es-toolkit/compat";
import { computed, provide, ref, useTemplateRef } from "vue";

// ** Core Imports
import { cn } from "@bridge-ui/core";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import type {
  AutocompleteEmits,
  AutocompleteOwnProps,
  AutocompleteSlots,
  SelectOption,
  SelectValue,
} from "@/Components/Autocomplete/autocomplete.types";
import { AUTOCOMPLETE_OPTION_KEY } from "@/Components/Autocomplete/autocompleteInjectionKey";
import { useAutocomplete } from "@/Components/Autocomplete/composables/useAutocomplete";
import { Chip } from "@/Components/Chip";
import { FormField } from "@/Components/FormField";
import { Icon } from "@/Components/Icon";
import { Listbox } from "@/Components/Listbox";
import {
  hasNamedSlot,
  mergeNestedComponentProps,
  resolveNamedSlot,
} from "@/Utils";

defineSlots<AutocompleteSlots>();

defineOptions({ inheritAttrs: false });

const model = defineModel<null | SelectValue | SelectValue[]>();

const props = withDefaults(defineProps<AutocompleteOwnProps>(), {
  freeSolo: true,
  clearable: true,
  searchable: true,
  withErrorIcon: true,
  minItemsForSearch: 11,
});

const resolveMessage = useResolveMessage();

const emit = defineEmits<AutocompleteEmits>();

const uncontrolledValue = ref<null | undefined | SelectValue | SelectValue[]>(
  props.defaultValue,
);

const value = computed({
  set: (next) => {
    model.value = next;
    uncontrolledValue.value = next;
  },
  get: () => {
    return isUndefined(model.value) ? uncontrolledValue.value : model.value;
  },
});

const triggerRef = useTemplateRef<HTMLInputElement | HTMLTextAreaElement>(
  "trigger",
);

const declarativeOptions = ref<SelectOption[]>([]);

provide(AUTOCOMPLETE_OPTION_KEY, {
  unregister(value) {
    declarativeOptions.value = declarativeOptions.value.filter(
      (item) => String(item.value) !== String(value),
    );
  },
  register(option) {
    if (
      declarativeOptions.value.some(
        (item) => String(item.value) === String(option.value),
      )
    ) {
      return;
    }

    declarativeOptions.value = [...declarativeOptions.value, option];
  },
});

const {
  open,
  slots,
  hasValue,
  multiple,
  formField,
  clearable,
  clearBind,
  clearValue,
  removeChip,
  triggerBind,
  selectOption,
  containerRef,
  listboxProps,
  clearIconSize,
  mergedClasses,
  selectedOptions,
  hasComposedList,
  handleRegisteredOptionsChange,
} = useAutocomplete(props, value, triggerRef, emit, declarativeOptions);
</script>

<template>
  <FormField :field="formField">
    <div
      v-if="multiple"
      class="flex min-w-0 flex-1 flex-wrap items-center gap-0.5"
    >
      <Chip
        dismissible
        :key="String(option.value)"
        v-for="option in selectedOptions"
        :size="formField.merged.value.size"
        :disabled="formField.isDisabled.value"
        :clear-label="`Remove ${option.label}`"
        v-on:dismiss="removeChip(option, $event)"
        v-bind="
          mergeNestedComponentProps(props.customProps?.chip, {
            customProps: { clear: clearBind },
            classes: {
              root: cn({
                'bg-white ring-1 ring-inset ring-gray-200 dark:bg-gray-700 dark:ring-gray-600': true,
                [mergedClasses.chip ?? '']: true,
              }),
            },
          })
        "
      >
        <slot name="chip" :option="option">
          {{ option.label }}
        </slot>
      </Chip>

      <textarea ref="trigger" v-bind="triggerBind" />
    </div>

    <div v-else class="flex min-w-0 flex-1 items-center gap-1">
      <input ref="trigger" class="min-w-0 flex-1" v-bind="triggerBind" />

      <span
        v-bind="clearBind"
        v-on:click="clearValue"
        v-on:keydown.enter.prevent="clearValue"
        v-on:keydown.space.prevent="clearValue"
        :aria-label="resolveMessage('Clear selection')"
        v-if="clearable && hasValue && !formField.isDisabled.value"
      >
        <Icon
          icon="clear"
          :size="clearIconSize"
          v-bind="props.customProps?.clearIcon"
        />
      </span>
    </div>
  </FormField>

  <Listbox
    v-model="open"
    v-bind="listboxProps"
    :anchor-el="containerRef"
    v-on:select="selectOption"
    v-on:registered-options-change="handleRegisteredOptionsChange"
  >
    <template #default v-if="hasComposedList">
      <slot />
    </template>

    <template #beforeOptions v-if="hasNamedSlot(slots, 'beforeOptions')">
      <component :is="resolveNamedSlot(slots, 'beforeOptions')" />
    </template>

    <template #loading v-if="hasNamedSlot(slots, 'loading')">
      <component :is="resolveNamedSlot(slots, 'loading')" />
    </template>

    <template #option="slotProps" v-if="hasNamedSlot(slots, 'option')">
      <slot name="option" v-bind="slotProps" />
    </template>

    <template #empty v-if="hasNamedSlot(slots, 'empty')">
      <component :is="resolveNamedSlot(slots, 'empty')" />
    </template>

    <template #afterOptions v-if="hasNamedSlot(slots, 'afterOptions')">
      <component :is="resolveNamedSlot(slots, 'afterOptions')" />
    </template>
  </Listbox>

  <!-- Declarative `AutocompleteOption` children register here (data-only). -->
  <div hidden aria-hidden="true" v-if="!hasComposedList">
    <slot />
  </div>
</template>
