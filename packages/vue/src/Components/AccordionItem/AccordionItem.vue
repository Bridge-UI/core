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
import { SlotOrProp } from "@/Utils";

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
  indicatorBind,
  panelInnerBind,
  hasIndicatorSlot,
} = useAccordionItem(props);
</script>

<template>
  <div v-bind="rootBind">
    <button v-bind="triggerBind">
      <span v-bind="titleBind">
        <SlotOrProp name="title" :slots="slots" :fallback="merged.title" />
      </span>

      <SlotOrProp :slots="slots" name="indicator" v-if="hasIndicatorSlot" />

      <Icon v-else icon="chevronDown" v-bind="indicatorBind" />
    </button>

    <div v-bind="collapseBind">
      <div v-bind="panelInnerBind">
        <div v-bind="panelBind">
          <SlotOrProp name="default" :slots="slots" />
        </div>
      </div>
    </div>
  </div>
</template>
