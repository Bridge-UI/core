<script setup lang="ts">
// ** External Imports
import { cn } from "@bridge-ui/core";
import { Check } from "lucide-vue-next";
import { computed, useSlots, watch } from "vue";

// ** Local Imports
import { List } from "@/Components/List";
import { useListbox } from "@/Components/Listbox/composables/useListbox";
import type {
  ListboxEmits,
  ListboxOption,
  ListboxOwnProps,
  ListboxSlots,
  ListboxValue,
} from "@/Components/Listbox/listbox.types";
import { ListItem } from "@/Components/ListItem";
import type { ListItemCustomProps } from "@/Components/ListItem/listItem.types";
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
  loading: false,
  multiple: false,
  color: "primary",
  showCheckmark: true,
  highlightedIndex: -1,
  hideEmptyMessage: false,
  disableAutoFocus: false,
  placement: "bottom-start",
  emptyMessage: "No options",
});

const {
  merged,
  checkClass,
  scrollBind,
  mergedClasses,
  optionSelectedClass,
  optionHighlightedClass,
} = useListbox(props, {
  color: "primary",
});

const showEmptyState = computed(() => {
  return (
    !props.loading &&
    props.options.length === 0 &&
    props.hideEmptyMessage !== true
  );
});

const resolvedCheckClass = computed(() => {
  return cn(checkClass.value, mergedClasses.value.check);
});

const scrollPartsBind = computed(() => {
  const { class: _class, style: _style, ...rest } = scrollBind.value;

  return rest;
});

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
  };

  if (resolveSelected(option.value)) {
    interactive.class = cn(
      optionSelectedClass.value,
      mergedClasses.value.optionSelected,
    );
  } else if (isOptionHighlighted(index)) {
    interactive.class = cn(
      optionHighlightedClass.value,
      mergedClasses.value.optionHighlighted,
    );
  }

  return { interactive };
}

function handleSelect(option: ListboxOption) {
  if (option.disabled) {
    return;
  }

  emit("select", option);
}
</script>

<template>
  <Menu
    v-model="open"
    :anchor-el="anchorEl"
    :placement="placement"
    :close-on-click-away="true"
    :disable-auto-focus="disableAutoFocus"
    :parts-props="{ content: merged.customProps?.content }"
  >
    <component
      v-if="hasNamedSlot(slots, 'beforeOptions')"
      :is="resolveNamedSlot(slots, 'beforeOptions')"
    />

    <div class="px-4 py-3 text-sm text-gray-500" v-if="loading">
      <component
        v-if="hasNamedSlot(slots, 'loading')"
        :is="resolveNamedSlot(slots, 'loading')"
      />
      <span v-else>Loading...</span>
    </div>

    <div
      v-else
      :class="scrollBind.class"
      :style="scrollBind.style"
      v-bind="scrollPartsBind"
    >
      <List
        dense
        role="listbox"
        padding="none"
        :id="listboxId"
        :aria-labelledby="labelledBy"
        :aria-multiselectable="multiple || undefined"
      >
        <ListItem
          interactive
          role="option"
          :selected="false"
          :primary="option.label"
          :key="String(option.value)"
          :disabled="option.disabled"
          :secondary="option.description"
          v-on:click="handleSelect(option)"
          v-for="(option, index) in options"
          :id="`${listboxId}-option-${index}`"
          :aria-selected="resolveSelected(option.value)"
          :parts-props="getOptionCustomProps(option, index)"
        >
          <template v-if="hasNamedSlot(slots, 'option')" #default>
            <slot
              name="option"
              :option="option"
              :selected="resolveSelected(option.value)"
            />
          </template>

          <template #end v-if="showCheckmark && resolveSelected(option.value)">
            <Check :class="resolvedCheckClass" class="size-4" />
          </template>
        </ListItem>
      </List>
    </div>

    <div
      class="px-4 py-3 text-sm text-gray-500"
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
