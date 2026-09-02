<script setup lang="ts">
// ** External Imports
import { isString } from "es-toolkit/compat";
import { computed } from "vue";

// ** Local Imports
import Tab from "@/Components/Tab/Tab.vue";
import TabList from "@/Components/TabList/TabList.vue";
import TabPanel from "@/Components/TabPanel/TabPanel.vue";
import { useTabs } from "@/Components/Tabs/composables/useTabs";
import type {
  TabsEmits,
  TabsOwnProps,
  TabsSlots,
} from "@/Components/Tabs/tabs.types";
import { RenderFn } from "@/Utils";

defineSlots<TabsSlots>();

const emit = defineEmits<TabsEmits>();

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TabsOwnProps>(), {
  keepMounted: true,
});

const model = defineModel<string>({ default: "" });

const { rootBind, tabItems } = useTabs(
  props,
  {
    size: "md",
    color: "dark",
    variant: "pill",
    keepMounted: true,
    activation: "automatic",
    orientation: "horizontal",
  },
  model,
  emit,
);

const hasTabItems = computed(() => {
  return tabItems.value.length > 0;
});
</script>

<template>
  <div v-bind="rootBind">
    <template v-if="hasTabItems">
      <TabList v-bind="props.customProps?.tabList">
        <Tab
          :key="item.value"
          :value="item.value"
          v-for="item in tabItems"
          :end-icon="item.endIcon"
          :disabled="item.disabled"
          :start-icon="item.startIcon"
          v-bind="props.customProps?.tab"
        >
          <template #start v-if="item.slots?.start">
            <RenderFn :fn="item.slots.start" />
          </template>

          <template v-if="isString(item.label)">
            {{ item.label }}
          </template>

          <RenderFn v-else :fn="item.label" />

          <template #end v-if="item.slots?.end">
            <RenderFn :fn="item.slots.end" />
          </template>
        </Tab>
      </TabList>

      <TabPanel
        :key="item.value"
        :value="item.value"
        v-for="item in tabItems"
        :keep-mounted="item.keepMounted"
        v-bind="props.customProps?.tabPanel"
      >
        <RenderFn :fn="item.panel" />
      </TabPanel>
    </template>

    <slot />
  </div>
</template>
