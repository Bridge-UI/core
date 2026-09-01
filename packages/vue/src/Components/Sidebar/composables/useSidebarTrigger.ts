// ** External Imports
import { isFunction, isString, omit } from "es-toolkit/compat";
import { computed, useAttrs, type useSlots } from "vue";

// ** Local Imports
import type { IconSource } from "@/Adapters/Icon";
import { useSidebar } from "@/Components/Sidebar/composables/useSidebar";
import { hasNamedSlot } from "@/Utils";

export function useSidebarTrigger(slots: ReturnType<typeof useSlots>) {
  const sidebar = useSidebar();
  const attrs = useAttrs();

  const hasDefaultSlot = computed(() => {
    return hasNamedSlot(slots, "default");
  });

  const icon = computed((): undefined | IconSource => {
    if (hasDefaultSlot.value) {
      return undefined;
    }

    return "panelLeft";
  });

  const expanded = computed(() => {
    return sidebar.value.isMobile
      ? sidebar.value.openMobile
      : sidebar.value.open;
  });

  const iconClass = computed(() => {
    return sidebar.value.side === "right"
      ? "rotate-180 rtl:rotate-0"
      : "rtl:rotate-180";
  });

  const ariaLabel = computed(() => {
    const label = attrs["aria-label"];

    return isString(label) ? label : "Toggle sidebar";
  });

  const rootAttrs = computed(() => {
    return omit(attrs, ["onClick", "aria-label"]);
  });

  const handleClick = (event: MouseEvent) => {
    const onClick = attrs.onClick;

    if (isFunction(onClick)) {
      onClick(event);
    }

    if (event.defaultPrevented) {
      return;
    }

    sidebar.value.toggleSidebar();
  };

  return {
    icon,
    expanded,
    iconClass,
    ariaLabel,
    handleClick,
    hasDefaultSlot,
    attrs: rootAttrs,
    panelId: computed(() => {
      return sidebar.value.panelId;
    }),
  };
}
