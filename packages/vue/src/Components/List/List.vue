<script setup lang="ts">
// ** External Imports
import { computed } from "vue";

// ** Local Imports
import { useList } from "@/Components/List/composables/useList";
import type { ListOwnProps } from "@/Components/List/list.types";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ListOwnProps>(), {
  as: "ul",
  dense: false,
  nested: false,
});

const { merged, rootBind } = useList(props);

const rootTag = computed(() => {
  return merged.value.as ?? "ul";
});
</script>

<template>
  <component :is="rootTag" v-bind="rootBind">
    <slot />
  </component>
</template>
