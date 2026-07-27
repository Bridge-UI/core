<script setup lang="ts">
// ** External Imports
import { Check } from "@lucide/vue";
import { computed, provide, ref, useSlots, watch } from "vue";

// ** Core Imports
import {
  cn,
  entriesFromListboxOptions,
  flattenListboxOptions,
  mapListboxEntriesToRows,
  type ListboxOption,
  type ListboxValue,
} from "@bridge-ui/core";

// ** Local Imports
import { List } from "@/Components/List";
import { useListbox } from "@/Components/Listbox/composables/useListbox";
import type {
  ListboxEmits,
  ListboxOwnProps,
  ListboxSlots,
} from "@/Components/Listbox/listbox.types";
import {
  LISTBOX_INJECTION_KEY,
  type ListboxContextValue,
} from "@/Components/Listbox/listboxInjectionKey";
import { ListItem } from "@/Components/ListItem";
import type { ListItemCustomProps } from "@/Components/ListItem/listItem.types";
import { ListSection } from "@/Components/ListSection";
import { Menu } from "@/Components/Menu";
import { hasNamedSlot, resolveNamedSlot } from "@/Utils";

defineSlots<ListboxSlots>();

const slots = useSlots();

const emit = defineEmits<ListboxEmits>();

const open = defineModel<boolean>({ default: false });

watch(open, (show) => {
  emit("show-change", show);
});

const props = withDefaults(defineProps<ListboxOwnProps>(), {
  size: "md",
  loading: false,
  multiple: false,
  color: "primary",
  showCheckmark: true,
  highlightedIndex: -1,
  hideEmptyMessage: false,
  disableAutoFocus: false,
  placement: "bottom-start",
  emptyMessage: "No options",
  loadingMessage: "Loading...",
});

const {
  merged,
  checkClass,
  scrollBind,
  messageBind,
  loadingBind,
  sizeClasses,
  mergedClasses,
  loadingTrackBind,
  optionSelectedClass,
  optionHighlightedClass,
} = useListbox(props, {
  size: "md",
  color: "primary",
});

const resolvedOptions = computed(() => {
  return props.options ?? [];
});

const resolvedEntries = computed(() => {
  if (props.entries) {
    return props.entries;
  }

  return entriesFromListboxOptions(resolvedOptions.value);
});

const flatOptions = computed(() => {
  return flattenListboxOptions(resolvedEntries.value);
});

const hasComposedChildren = computed(() => {
  return hasNamedSlot(slots, "default");
});

const showEmptyState = computed(() => {
  return (
    !props.loading &&
    !hasComposedChildren.value &&
    flatOptions.value.length === 0 &&
    props.hideEmptyMessage !== true
  );
});

const resolvedCheckClass = computed(() => {
  return cn(checkClass.value, mergedClasses.value.check);
});

const registeredOptions = ref<ListboxOption[]>([]);

function resolveSelected(value: ListboxValue) {
  return props.isSelected?.(value) ?? false;
}

function isOptionHighlighted(index: number) {
  return props.highlightedIndex === index;
}

function keepFocusOnCombobox(event: MouseEvent) {
  event.preventDefault();
}

function getOptionCustomProps(
  option: ListboxOption,
  index: number,
): ListItemCustomProps {
  const interactive: NonNullable<ListItemCustomProps["interactive"]> = {
    tabindex: -1,
    onMousedown: keepFocusOnCombobox,
    class: cn(sizeClasses.value?.option),
  };

  if (resolveSelected(option.value)) {
    interactive.class = cn(
      interactive.class,
      optionSelectedClass.value,
      mergedClasses.value.optionSelected,
    );
  } else if (isOptionHighlighted(index)) {
    interactive.class = cn(
      interactive.class,
      optionHighlightedClass.value,
      mergedClasses.value.optionHighlighted,
    );
  }

  return {
    interactive,
    primary: { class: sizeClasses.value?.primary },
    secondary: { class: sizeClasses.value?.secondary },
  };
}

function handleSelect(option: ListboxOption) {
  if (option.disabled) {
    return;
  }

  emit("select", option);
}

function registerOption(option: ListboxOption) {
  const alreadyRegistered = registeredOptions.value.some(
    (entry) => String(entry.value) === String(option.value),
  );

  if (!alreadyRegistered) {
    registeredOptions.value = [...registeredOptions.value, option];
  }

  return () => {
    registeredOptions.value = registeredOptions.value.filter(
      (entry) => String(entry.value) !== String(option.value),
    );
  };
}

function getOptionIndex(value: ListboxValue) {
  const source = hasComposedChildren.value
    ? registeredOptions.value
    : flatOptions.value;

  return source.findIndex((option) => String(option.value) === String(value));
}

watch(
  registeredOptions,
  (options) => {
    if (!hasComposedChildren.value) {
      return;
    }

    emit("registered-options-change", options);
  },
  { deep: true },
);

const listboxContext = computed((): ListboxContextValue => {
  return {
    getOptionIndex,
    registerOption,
    onSelect: handleSelect,
    listboxId: props.listboxId,
    isSelected: resolveSelected,
    sizeClasses: sizeClasses.value,
    showCheckmark: props.showCheckmark,
    checkClass: resolvedCheckClass.value,
    highlightedIndex: props.highlightedIndex,
    optionSelectedClass: optionSelectedClass.value,
    optionHighlightedClass: optionHighlightedClass.value,
    mergedClasses: {
      optionSelected: mergedClasses.value.optionSelected,
      optionHighlighted: mergedClasses.value.optionHighlighted,
    },
  };
});

provide(LISTBOX_INJECTION_KEY, listboxContext);

const mappedRows = computed(() => {
  return mapListboxEntriesToRows(resolvedEntries.value, resolveSelected);
});
</script>

<template>
  <Menu
    v-model="open"
    :anchor-el="anchorEl"
    :placement="placement"
    :close-on-click-away="true"
    :disable-auto-focus="disableAutoFocus"
    :custom-props="{ content: merged.customProps?.content }"
  >
    <component
      v-if="hasNamedSlot(slots, 'beforeOptions')"
      :is="resolveNamedSlot(slots, 'beforeOptions')"
    />

    <template v-if="loading">
      <div v-bind="loadingTrackBind">
        <div v-bind="loadingBind" />
      </div>

      <div v-bind="messageBind">
        <component
          v-if="hasNamedSlot(slots, 'loading')"
          :is="resolveNamedSlot(slots, 'loading')"
        />

        <span v-else>{{ loadingMessage }}</span>
      </div>
    </template>

    <div v-else v-bind="scrollBind">
      <List
        dense
        class="p-0"
        role="listbox"
        :id="listboxId"
        :aria-labelledby="labelledBy"
        :aria-multiselectable="multiple || undefined"
      >
        <slot v-if="hasComposedChildren" />

        <template v-else :key="row.key" v-for="row in mappedRows">
          <ListSection
            :title="row.title"
            :sticky="row.sticky"
            v-if="row.kind === 'section'"
          />

          <ListItem
            v-else
            interactive
            role="option"
            :selected="false"
            :aria-selected="row.selected"
            :disabled="row.option.disabled"
            :secondary="row.option.description"
            v-on:click="handleSelect(row.option)"
            :id="`${listboxId}-option-${row.index}`"
            :custom-props="getOptionCustomProps(row.option, row.index)"
            :primary="
              hasNamedSlot(slots, 'option') ? undefined : row.option.label
            "
          >
            <template #default v-if="hasNamedSlot(slots, 'option')">
              <slot
                name="option"
                :option="row.option"
                :selected="row.selected"
              />
            </template>

            <template #end v-if="showCheckmark && row.selected">
              <Check :class="resolvedCheckClass" />
            </template>
          </ListItem>
        </template>
      </List>
    </div>

    <div
      v-bind="messageBind"
      v-if="showEmptyState && !hasNamedSlot(slots, 'empty')"
    >
      {{ emptyMessage }}
    </div>

    <component
      :is="resolveNamedSlot(slots, 'empty')"
      v-else-if="showEmptyState && hasNamedSlot(slots, 'empty')"
    />

    <component
      v-if="hasNamedSlot(slots, 'afterOptions')"
      :is="resolveNamedSlot(slots, 'afterOptions')"
    />
  </Menu>
</template>
