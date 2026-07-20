<script setup lang="ts">
// ** External Imports
import { X } from "@lucide/vue";
import { provide, ref, useTemplateRef } from "vue";

// ** Local Imports
import { Chip } from "@/Components/Chip";
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

const model = defineModel<null | SelectValue | SelectValue[]>();

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
} = useSelect(props, model, triggerRef, emit, declarativeOptions);
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
        :custom-props="{ clear: clearBind }"
        :disabled="formField.isDisabled.value"
        :clear-label="`Remove ${option.label}`"
        :classes="{ root: mergedClasses.chip }"
        v-on:dismiss="removeChip(option, $event)"
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
    v-bind="listboxProps"
    v-model="open"
    :anchor-el="containerRef"
    v-on:select="selectOption"
  >
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

  <slot />
</template>
