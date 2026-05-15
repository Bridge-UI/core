// ** External Imports
import { useSlots } from "vue";

// ** Local Imports
import type { BadgeProps } from "@/Components/Badge/badge.types";
import { useBridgeUIComponent } from "@/Utils";

export function useBadge(props: BadgeProps, libDefaults: Partial<BadgeProps>) {
  const slots = useSlots();

  const { entry: bridgeBadge, merged } = useBridgeUIComponent({
    props,
    libDefaults,
    componentName: "Badge",
  });

  return {
    slots,
    merged,
    bridgeBadge,
  };
}
