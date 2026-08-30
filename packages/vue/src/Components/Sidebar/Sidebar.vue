<script setup lang="ts">
// ** Local Imports
import { Drawer } from "@/Components/Drawer";
import { useSidebarShell } from "@/Components/Sidebar/composables/useSidebarShell";
import type {
  SidebarOwnProps,
  SidebarSlots,
} from "@/Components/Sidebar/sidebar.types";
import { hasNamedSlot } from "@/Utils";

defineSlots<SidebarSlots>();

defineOptions({ inheritAttrs: false, name: "Sidebar" });

const props = withDefaults(defineProps<SidebarOwnProps>(), {
  side: "left",
  variant: "sidebar",
  ariaLabel: "Sidebar",
  collapsible: "offcanvas",
});

const {
  slots,
  merged,
  panelId,
  gapBind,
  rootBind,
  isMobile,
  asideBind,
  panelBind,
  headerBind,
  footerBind,
  openMobile,
  contentBind,
  showAsDrawer,
  setOpenMobile,
} = useSidebarShell(props, {
  side: "left",
  variant: "sidebar",
  ariaLabel: "Sidebar",
  collapsible: "offcanvas",
});
</script>

<template>
  <div v-bind="rootBind">
    <div v-bind="gapBind" />

    <aside v-bind="asideBind">
      <div v-bind="panelBind">
        <template v-if="!showAsDrawer">
          <div v-bind="headerBind" v-if="hasNamedSlot(slots, 'header')">
            <slot name="header" />
          </div>

          <div v-bind="contentBind">
            <slot />
          </div>

          <div v-bind="footerBind" v-if="hasNamedSlot(slots, 'footer')">
            <slot name="footer" />
          </div>
        </template>
      </div>
    </aside>
  </div>

  <Drawer
    v-if="isMobile"
    :placement="merged.side"
    :model-value="openMobile"
    @show-change="setOpenMobile"
    :aria-label="merged.ariaLabel"
    @update:model-value="setOpenMobile"
    :custom-props="{
      panel: {
        id: showAsDrawer ? panelId : undefined,
        class: 'p-0',
        style: { width: 'var(--bridge-sidebar-width-mobile)' },
      },
    }"
  >
    <div v-bind="panelBind" v-if="showAsDrawer">
      <div v-bind="headerBind" v-if="hasNamedSlot(slots, 'header')">
        <slot name="header" />
      </div>

      <div v-bind="contentBind">
        <slot />
      </div>

      <div v-bind="footerBind" v-if="hasNamedSlot(slots, 'footer')">
        <slot name="footer" />
      </div>
    </div>
  </Drawer>
</template>
