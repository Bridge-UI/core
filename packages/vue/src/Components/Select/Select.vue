<script setup lang="ts">
// ** External Imports
import { isUndefined } from "es-toolkit/compat";
import { computed, provide, ref, useTemplateRef } from "vue";

// ** Core Imports
import { cn } from "@bridge-ui/core";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import { Chip } from "@/Components/Chip";
import {
  FORM_FIELD_CHROME_SLOT_NAMES,
  FormField,
} from "@/Components/FormField";
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
import {
  hasNamedSlot,
  mergeNestedComponentProps,
  presentSlotNames,
} from "@/Utils";

defineSlots<SelectSlots>();

defineOptions({ inheritAttrs: false });

const model = defineModel<null | SelectValue | SelectValue[]>();

const props = withDefaults(defineProps<SelectOwnProps>(), {
  clearable: true,
  searchable: false,
  showErrorIcon: true,
  minItemsForSearch: 11,
});

const emit = defineEmits<SelectEmits>();

const resolveMessage = useResolveMessage();

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
  multiple,
  formField,
  clearBind,
  clearValue,
  removeChip,
  triggerBind,
  handleApply,
  selectOption,
  handleCancel,
  containerRef,
  listboxProps,
  clearIconSize,
  mergedClasses,
  showClearIcon,
  selectedOptions,
  hasComposedList,
  handleRegisteredOptionsChange,
} = useSelect(props, value, triggerRef, emit, declarativeOptions);
</script>

<template>
  <FormField :field="formField">
    <template
      #[name]="slotData"
      v-for="name in presentSlotNames(FORM_FIELD_CHROME_SLOT_NAMES, $slots)"
    >
      <slot :name="name" v-bind="slotData || {}" />
    </template>

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
                'bg-white ring-1 ring-inset ring-dark-200 dark:bg-dark-700 dark:ring-dark-600': true,
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
        v-if="showClearIcon"
        v-on:click="clearValue"
        v-on:keydown.enter.prevent="clearValue"
        v-on:keydown.space.prevent="clearValue"
        :aria-label="resolveMessage('Clear selection')"
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
    v-on:apply="handleApply"
    :anchor-el="containerRef"
    v-on:cancel="handleCancel"
    v-on:select="selectOption"
    v-on:registered-options-change="handleRegisteredOptionsChange"
  >
    <template #default v-if="hasComposedList">
      <slot />
    </template>

    <template #beforeOptions v-if="hasNamedSlot(slots, 'beforeOptions')">
      <slot name="beforeOptions" />
    </template>

    <template #loading v-if="hasNamedSlot(slots, 'loading')">
      <slot name="loading" />
    </template>

    <template #option="slotProps" v-if="hasNamedSlot(slots, 'option')">
      <slot name="option" v-bind="slotProps" />
    </template>

    <template #empty v-if="hasNamedSlot(slots, 'empty')">
      <slot name="empty" />
    </template>

    <template #afterOptions v-if="hasNamedSlot(slots, 'afterOptions')">
      <slot name="afterOptions" />
    </template>
  </Listbox>

  <!-- Declarative `SelectOption` children register here (data-only). -->
  <div hidden aria-hidden="true" v-if="!hasComposedList">
    <slot />
  </div>
</template>
