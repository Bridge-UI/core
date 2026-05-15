// ** External Imports
import { useSlots } from "vue";

// ** Local Imports
import type { MiniBadgeProps } from "@/Components/MiniBadge/miniBadge.types";
import { useBridgeUIComponent } from "@/Utils";

export function useMiniBadge(
  props: MiniBadgeProps,
  defaults: Partial<MiniBadgeProps>,
) {
  const slots = useSlots();

  const { entry: bridgeMiniBadge, merged } = useBridgeUIComponent({
    props,
    libDefaults: defaults,
    componentName: "MiniBadge",
  });

  return {
    slots,
    merged,
    bridgeMiniBadge,
  };
}
