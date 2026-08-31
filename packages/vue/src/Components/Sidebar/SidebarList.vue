<script setup lang="ts">
// ** External Imports
import { computed, useAttrs } from "vue";

// ** Local Imports
import List from "@/Components/List/List.vue";
import type { ListOwnProps } from "@/Components/List/list.types";
import { useSidebarList } from "@/Components/Sidebar/composables/useSidebarList";

defineOptions({ inheritAttrs: false });

const props = defineProps<ListOwnProps>();

const attrs = useAttrs();

const { iconOnly: resolvedIconOnly } = useSidebarList(props);

const listBind = computed(() => {
  const { iconOnly: _iconOnly, ...listProps } = props;

  return {
    ...attrs,
    ...listProps,
    iconOnly: resolvedIconOnly.value,
  };
});
</script>

<template>
  <List v-bind="listBind">
    <slot />
  </List>
</template>
