<script setup lang="ts">
// ** External Imports
import { useSlots } from "vue";

// ** Local Imports
import { useTabList } from "@/Components/TabList/composables/useTabList";
import type {
  TabListOwnProps,
  TabListSlots,
} from "@/Components/TabList/tabList.types";
import { SlotOrProp } from "@/Utils";

defineSlots<TabListSlots>();

const slots = useSlots();

defineOptions({ inheritAttrs: false });

const props = defineProps<TabListOwnProps>();

const { rootBind } = useTabList(props);
</script>

<template>
  <div v-bind="rootBind">
    <SlotOrProp name="default" :slots="slots" />
  </div>
</template>
