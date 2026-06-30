<script setup lang="ts">
// ** External Imports
import { computed, useSlots } from "vue";

// ** Local Imports
import { useListSection } from "@/Components/ListSection/composables/useListSection";
import type {
  ListSectionOwnProps,
  ListSectionSlots,
} from "@/Components/ListSection/listSection.types";

defineSlots<ListSectionSlots>();

const slots = useSlots();

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ListSectionOwnProps>(), {
  as: "li",
  inset: false,
  sticky: false,
});

const { label, merged, rootBind, titleBind } = useListSection(props, slots);

const rootTag = computed(() => {
  return merged.value.as ?? "li";
});
</script>

<template>
  <div v-bind="titleBind" v-if="rootTag === 'div'">
    <component :is="label" />
  </div>

  <component v-else :is="rootTag" v-bind="rootBind">
    <div v-bind="titleBind">
      <component :is="label" />
    </div>
  </component>
</template>
