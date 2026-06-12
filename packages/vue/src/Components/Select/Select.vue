<script setup lang="ts">
// ** External Imports
import { X } from "lucide-vue-next";
import { provide, ref, useTemplateRef } from "vue";

// ** Local Imports
import { FormField } from "@/Components/FormField";
import { Icon } from "@/Components/Icon";
import { Listbox } from "@/Components/Listbox";
import { useSelect } from "@/Components/Select/composables/useSelect";
import type {
  SelectEmits,
  SelectOption,
  SelectOwnProps,
  SelectSlots,
  SelectValue,
} from "@/Components/Select/select.types";
import { SELECT_OPTION_KEY } from "@/Components/Select/selectInjectionKey";
import { hasNamedSlot, resolveNamedSlot } from "@/Utils";

defineSlots<SelectSlots>();

defineOptions({ inheritAttrs: false });

const model = defineModel<SelectValue | SelectValue[] | null>();

const props = withDefaults(defineProps<SelectOwnProps>(), {
  clearable: true,
  searchable: false,
  withErrorIcon: true,
  minItemsForSearch: 11,
  emptyMessage: "No options",
});

const emit = defineEmits<SelectEmits>();

const triggerRef = useTemplateRef<HTMLInputElement | HTMLTextAreaElement>(
  "trigger",
);

const declarativeOptions = ref<SelectOption[]>([]);

provide(SELECT_OPTION_KEY, {
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
  listboxId,
  formField,
  isLoading,
  clearable,
  clearBind,
  isSelected,
  clearValue,
  removeChip,
  triggerBind,
  selectOption,
  containerRef,
  emptyMessage,
  listboxColor,
  clearIconSize,
  visibleOptions,
  selectedOptions,
  highlightedIndex,
  hideEmptyMessage,
} = useSelect(props, model, triggerRef, emit, declarativeOptions);
</script>

<template>
  <FormField :field="formField">
    <div
      v-if="multiple"
      class="flex min-w-0 flex-1 flex-wrap items-center gap-1"
    >
      <span
        :key="String(option.value)"
        v-for="option in selectedOptions"
        class="inline-flex max-w-full items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-100"
      >
        <slot name="chip" :option="option">
          <span class="truncate">{{ option.label }}</span>
        </slot>

        <span
          v-bind="clearBind"
          :aria-label="`Remove ${option.label}`"
          v-on:click="removeChip(option, $event)"
          v-on:keydown.enter.prevent="removeChip(option, $event)"
          v-on:keydown.space.prevent="removeChip(option, $event)"
        >
          <Icon :icon="X" :size="clearIconSize" />
        </span>
      </span>

      <textarea ref="trigger" v-bind="triggerBind" />
    </div>

    <div v-else class="flex min-w-0 flex-1 items-center gap-1">
      <input ref="trigger" class="min-w-0 flex-1" v-bind="triggerBind" />

      <span
        v-bind="clearBind"
        v-on:click="clearValue"
        aria-label="Clear selection"
        v-on:keydown.enter.prevent="clearValue"
        v-on:keydown.space.prevent="clearValue"
        v-if="clearable && hasValue && !formField.isDisabled.value"
      >
        <Icon :icon="X" :size="clearIconSize" />
      </span>
    </div>
  </FormField>

  <Listbox
    v-model="open"
    :loading="isLoading"
    :multiple="multiple"
    :color="listboxColor"
    :listbox-id="listboxId"
    :anchor-el="containerRef"
    :options="visibleOptions"
    :is-selected="isSelected"
    v-on:select="selectOption"
    :disable-auto-focus="true"
    :empty-message="emptyMessage"
    :highlighted-index="highlightedIndex"
    :hide-empty-message="hideEmptyMessage"
    :labelled-by="formField.controlId.value"
  >
    <template v-if="hasNamedSlot(slots, 'beforeOptions')" #beforeOptions>
      <component :is="resolveNamedSlot(slots, 'beforeOptions')" />
    </template>

    <template v-if="hasNamedSlot(slots, 'loading')" #loading>
      <component :is="resolveNamedSlot(slots, 'loading')" />
    </template>

    <template v-if="hasNamedSlot(slots, 'option')" #option="slotProps">
      <slot name="option" v-bind="slotProps" />
    </template>

    <template v-if="hasNamedSlot(slots, 'empty')" #empty>
      <component :is="resolveNamedSlot(slots, 'empty')" />
    </template>

    <template v-if="hasNamedSlot(slots, 'afterOptions')" #afterOptions>
      <component :is="resolveNamedSlot(slots, 'afterOptions')" />
    </template>
  </Listbox>

  <slot />
</template>
