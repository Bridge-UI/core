<script setup lang="ts">
// ** External Imports
import { useSlots } from "vue";

// ** Local Imports
import type {
  AccordionItemOwnProps,
  AccordionItemSlots,
} from "@/Components/AccordionItem/accordionItem.types";
import { useAccordionItem } from "@/Components/AccordionItem/composables/useAccordionItem";
import { Icon } from "@/Components/Icon";
import { resolveNamedSlot } from "@/Utils";

defineSlots<AccordionItemSlots>();

const slots = useSlots();

defineOptions({ inheritAttrs: false });

const props = defineProps<AccordionItemOwnProps>();

const {
  merged,
  rootBind,
  titleBind,
  panelBind,
  triggerBind,
  collapseBind,
  hasTitleSlot,
  indicatorBind,
  panelInnerBind,
  hasIndicatorSlot,
} = useAccordionItem(props);
</script>

<template>
  <div v-bind="rootBind">
    <button v-bind="triggerBind">
      <span v-bind="titleBind">
        <component v-if="hasTitleSlot" :is="resolveNamedSlot(slots, 'title')" />

        <template v-else>
          {{ merged.title }}
        </template>
      </span>

      <component
        v-if="hasIndicatorSlot"
        :is="resolveNamedSlot(slots, 'indicator')"
      />

      <Icon v-else icon="chevronDown" v-bind="indicatorBind" />
    </button>

    <div v-bind="collapseBind">
      <div v-bind="panelInnerBind">
        <div v-bind="panelBind">
          <component :is="resolveNamedSlot(slots, 'default')" />
        </div>
      </div>
    </div>
  </div>
</template>
