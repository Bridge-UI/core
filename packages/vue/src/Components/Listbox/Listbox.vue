<script setup lang="ts">
// ** External Imports
import { isNil } from "es-toolkit/compat";
import { computed, provide, ref, useSlots, watch } from "vue";

// ** Core Imports
import {
  cn,
  entriesFromListboxOptions,
  flattenListboxOptions,
  mapListboxEntriesToRows,
  resolveMessage,
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
import { ListSection } from "@/Components/ListSection";
import { Menu } from "@/Components/Menu";
import { Progress } from "@/Components/Progress";
import { useI18nAdapter } from "@/I18n";
import {
  hasNamedSlot,
  mergeNestedComponentProps,
  resolveNamedSlot,
} from "@/Utils";

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
});

const i18n = useI18nAdapter();

const emptyMessage = computed(() => {
  return props.emptyMessage ?? resolveMessage("No options", i18n.value);
});

const loadingMessage = computed(() => {
  return props.loadingMessage ?? resolveMessage("Loading...", i18n.value);
});

const {
  merged,
  checkClass,
  scrollBind,
  messageBind,
  sizeClasses,
  mergedClasses,
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

const menuProps = computed(() => {
  return merged.value.customProps?.menu;
});

const listProps = computed(() => {
  return merged.value.customProps?.list;
});

const listItemProps = computed(() => {
  return merged.value.customProps?.listItem;
});

const progressProps = computed(() => {
  return merged.value.customProps?.progress;
});

const listSectionProps = computed(() => {
  return merged.value.customProps?.listSection;
});

const menuBind = computed(() => {
  return {
    ...(!isNil(props.rounded) ? { rounded: props.rounded } : {}),
    ...menuProps.value,
  };
});

const progressBind = computed(() => {
  return {
    size: "xs" as const,
    "aria-hidden": true,
    color: merged.value.color,
    ...mergeNestedComponentProps(progressProps.value, {
      class: "shrink-0",
      classes: { bar: mergedClasses.value.loading },
    }),
  };
});

const listBind = computed(() => {
  return {
    dense: true,
    role: "listbox",
    id: props.listboxId,
    "aria-labelledby": props.labelledBy,
    "aria-multiselectable": props.multiple || undefined,
    ...mergeNestedComponentProps(listProps.value, {
      class: "p-0",
    }),
  };
});
</script>

<template>
  <Menu
    v-model="open"
    :anchor-el="anchorEl"
    :placement="placement"
    :close-on-click-away="true"
    :disable-auto-focus="disableAutoFocus"
    v-bind="menuBind"
  >
    <component
      v-if="hasNamedSlot(slots, 'beforeOptions')"
      :is="resolveNamedSlot(slots, 'beforeOptions')"
    />

    <template v-if="loading">
      <Progress v-bind="progressBind" />

      <div v-bind="messageBind">
        <component
          v-if="hasNamedSlot(slots, 'loading')"
          :is="resolveNamedSlot(slots, 'loading')"
        />

        <span v-else>{{ loadingMessage }}</span>
      </div>
    </template>

    <div v-else v-bind="scrollBind">
      <List v-bind="listBind">
        <slot v-if="hasComposedChildren" />

        <template v-else :key="row.key" v-for="row in mappedRows">
          <ListSection
            :title="row.title"
            :sticky="row.sticky"
            v-bind="listSectionProps"
            v-if="row.kind === 'section'"
          />

          <ListItem
            v-else
            interactive
            :value="row.option.value"
            :disabled="row.option.disabled"
            :secondary="row.option.description"
            :primary="
              hasNamedSlot(slots, 'option') ? undefined : row.option.label
            "
            v-bind="listItemProps"
          >
            <template #default v-if="hasNamedSlot(slots, 'option')">
              <slot
                name="option"
                :option="row.option"
                :selected="row.selected"
              />
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
