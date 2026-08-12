<script setup lang="ts">
// ** Local Imports
import type {
  BreadcrumbOwnProps,
  BreadcrumbSlots,
} from "@/Components/Breadcrumb/breadcrumb.types";
import { useBreadcrumb } from "@/Components/Breadcrumb/composables/useBreadcrumb";
import { BreadcrumbItem } from "@/Components/BreadcrumbItem";

defineSlots<BreadcrumbSlots>();

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<BreadcrumbOwnProps>(), {
  separator: "chevronRight",
});

const { rootBind, listBind, collapsedItems, hasDefaultSlot } = useBreadcrumb(
  props,
  {
    size: "md",
    separator: "chevronRight",
  },
);
</script>

<template>
  <nav v-bind="rootBind">
    <ol v-bind="listBind">
      <template v-if="!hasDefaultSlot && collapsedItems.length > 0">
        <template
          v-for="(entry, index) in collapsedItems"
          :key="entry.type === 'ellipsis' ? `ellipsis-${index}` : entry.index"
        >
          <BreadcrumbItem as="span" v-if="entry.type === 'ellipsis'">
            …
          </BreadcrumbItem>

          <BreadcrumbItem
            v-else
            :as="entry.item.as"
            :href="entry.item.href"
            :current="entry.item.current"
            :end-icon="entry.item.endIcon"
            :disabled="entry.item.disabled"
            :icon-only="entry.item.iconOnly"
            :start-icon="entry.item.startIcon"
          >
            {{ entry.item.label }}
          </BreadcrumbItem>
        </template>
      </template>

      <slot />
    </ol>
  </nav>
</template>
