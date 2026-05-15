// ** External Imports
import { useSlots } from "vue";

// ** Local Imports
import type { ToggleProps } from "@/Components/Toggle/toggle.types";
import { useBridgeUIComponent } from "@/Utils";

export function useToggle(props: ToggleProps, defaults: Partial<ToggleProps>) {
  const slots = useSlots();

  const { entry: bridgeToggle, merged } = useBridgeUIComponent({
    props,
    libDefaults: defaults,
    componentName: "Toggle",
  });

  return {
    slots,
    merged,
    bridgeToggle,
  };
}
