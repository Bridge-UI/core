<script setup lang="ts">
// ** External Imports
import { computed, useSlots } from "vue";

// ** Local Imports
import { useListSection } from "@/Components/ListSection/composables/useListSection";
import type {
  ListSectionOwnProps,
  ListSectionSlots,
} from "@/Components/ListSection/listSection.types";
import { hasNamedSlot, isPropPresent } from "@/Utils";

defineSlots<ListSectionSlots>();

const slots = useSlots();

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ListSectionOwnProps>(), {
  as: "li",
  inset: false,
  sticky: false,
});

const { merged, rootBind, titleBind, isIconOnly } = useListSection(props);

const rootTag = computed(() => {
  return merged.value.as ?? "li";
});
</script>

<template>
  <template v-if="!isIconOnly">
    <div v-bind="titleBind" v-if="rootTag === 'div'">
      <slot v-if="hasNamedSlot(slots, 'default')" />

      <template v-else-if="isPropPresent(merged.title)">
        {{ merged.title }}
      </template>
    </div>

    <component v-else :is="rootTag" v-bind="rootBind">
      <div v-bind="titleBind">
        <slot v-if="hasNamedSlot(slots, 'default')" />

        <template v-else-if="isPropPresent(merged.title)">
          {{ merged.title }}
        </template>
      </div>
    </component>
  </template>
</template>
