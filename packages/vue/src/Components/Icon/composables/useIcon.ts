// ** External Imports
import { useSlots } from "vue";

// ** Local Imports
import type { IconProps } from "@/Components/Icon/icon.types";
import { useBridgeUIComponent } from "@/Utils";

export function useIcon(props: IconProps, defaults: Partial<IconProps>) {
  const slots = useSlots();

  const { entry: bridgeIcon, merged } = useBridgeUIComponent({
    props,
    libDefaults: defaults,
    componentName: "Icon",
  });

  return {
    slots,
    merged,
    bridgeIcon,
  };
}
