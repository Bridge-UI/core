<script setup lang="ts">
// ** External Imports
import { computed, useAttrs } from "vue";

// ** Core Imports
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import List from "@/Components/List/List.vue";
import type { ListOwnProps } from "@/Components/List/list.types";
import { useSidebarList } from "@/Components/Sidebar/composables/useSidebarList";
import type { SidebarListOwnProps } from "@/Components/Sidebar/sidebar.types";

defineOptions({ inheritAttrs: false });

const props = defineProps<ListOwnProps & SidebarListOwnProps>();

const attrs = useAttrs();

const { rootClassName, iconOnly: resolvedIconOnly } = useSidebarList(props);

const listBind = computed(() => {
  const { classes, iconOnly: _iconOnly, ...listProps } = props;

  return {
    ...attrs,
    ...listProps,
    ...(props.nested === true && resolvedIconOnly.value
      ? { hidden: true as const }
      : {}),
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
