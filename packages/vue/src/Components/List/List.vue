<script setup lang="ts">
// ** External Imports
import { computed, useSlots } from "vue";

// ** Local Imports
import { useList } from "@/Components/List/composables/useList";
import type { ListOwnProps } from "@/Components/List/list.types";
import { resolveNamedSlot } from "@/Utils";

const slots = useSlots();

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ListOwnProps>(), {
  as: "ul",
  dense: false,
  nested: false,
  padding: "normal",
});

const { merged, rootBind } = useList(props, {
  padding: "normal",
});

const rootTag = computed(() => {
  return merged.value.as ?? "ul";
});
</script>

<template>
  <component :is="rootTag" v-bind="rootBind">
    <component :is="resolveNamedSlot(slots, 'default')" />
  </component>
</template>
