<script setup lang="ts">
// ** Local Imports
import type {
  AccordionItemOwnProps,
  AccordionItemSlots,
} from "@/Components/AccordionItem/accordionItem.types";
import { useAccordionItem } from "@/Components/AccordionItem/composables/useAccordionItem";
import { Icon } from "@/Components/Icon";
import { hasNamedSlot, isPropPresent } from "@/Utils";

defineSlots<AccordionItemSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<AccordionItemOwnProps>();

const {
  slots,
  merged,
  rootBind,
  titleBind,
  panelBind,
  triggerBind,
  collapseBind,
  indicatorBind,
  panelInnerBind,
} = useAccordionItem(props);
</script>

<template>
  <div v-bind="rootBind">
    <button v-bind="triggerBind">
      <span v-bind="titleBind">
        <slot name="title" v-if="hasNamedSlot(slots, 'title')" />

        <template v-else-if="isPropPresent(merged.title)">
          {{ merged.title }}
        </template>
      </span>

      <slot name="indicator" v-if="hasNamedSlot(slots, 'indicator')" />

      <Icon v-else icon="chevronDown" v-bind="indicatorBind" />
    </button>

    <div v-bind="collapseBind">
      <div v-bind="panelInnerBind">
        <div v-bind="panelBind">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
