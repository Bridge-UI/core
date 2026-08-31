<script setup lang="ts">
// ** External Imports
import { computed, useAttrs } from "vue";

// ** Core Imports
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import List from "@/Components/List/List.vue";
import type { ListOwnProps } from "@/Components/List/list.types";
import { useSidebarList } from "@/Components/Sidebar/composables/useSidebarList";

defineOptions({ inheritAttrs: false });

const props = defineProps<ListOwnProps>();

const attrs = useAttrs();

const { rootClassName, iconOnly: resolvedIconOnly } = useSidebarList(props);

const listBind = computed(() => {
  const { classes, iconOnly: _iconOnly, ...listProps } = props;

  return {
    ...attrs,
    ...listProps,
    iconOnly: resolvedIconOnly.value,
    classes: {
      ...classes,
      root: cn(rootClassName.value, classes?.root),
    },
  };
});
</script>

<template>
  <List v-bind="listBind">
    <slot />
  </List>
</template>
