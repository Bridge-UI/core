<script setup lang="ts">
// ** Local Imports
import type {
  BreadcrumbItemOwnProps,
  BreadcrumbItemSlots,
} from "@/Components/BreadcrumbItem/breadcrumbItem.types";
import { useBreadcrumbItem } from "@/Components/BreadcrumbItem/composables/useBreadcrumbItem";
import { Icon } from "@/Components/Icon";
import { hasNamedSlot } from "@/Utils";

defineSlots<BreadcrumbItemSlots>();

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<BreadcrumbItemOwnProps>(), {
  current: false,
  disabled: false,
});

const {
  slots,
  merged,
  crumbAs,
  rootBind,
  linkBind,
  endIconBind,
  startIconBind,
  separatorBind,
  separatorIcon,
  separatorContent,
} = useBreadcrumbItem(props);
</script>

<template>
  <li v-bind="rootBind">
    <span aria-hidden="true" data-slot="separator" v-if="separatorContent">
      <component :is="separatorContent" />
    </span>

    <Icon v-else :icon="separatorIcon" v-bind="separatorBind" />

    <component :is="crumbAs" v-bind="linkBind">
      <slot name="start" v-if="hasNamedSlot(slots, 'start')" />

      <Icon
        :icon="merged.startIcon"
        v-bind="startIconBind"
        v-else-if="merged.startIcon"
      />

      <slot />

      <slot name="end" v-if="hasNamedSlot(slots, 'end')" />

      <Icon
        :icon="merged.endIcon"
        v-bind="endIconBind"
        v-else-if="merged.endIcon"
      />
    </component>
  </li>
</template>
