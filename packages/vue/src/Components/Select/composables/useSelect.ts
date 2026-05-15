// ** External Imports
import { useSlots } from "vue";

// ** Local Imports
import type { SelectProps } from "@/Components/Select/select.types";
import { useBridgeUIComponent } from "@/Utils";

export function useSelect(props: SelectProps, defaults: Partial<SelectProps>) {
  const slots = useSlots();

  const { entry: bridgeSelect, merged } = useBridgeUIComponent({
    props,
    libDefaults: defaults,
    componentName: "Select",
  });

  return {
    slots,
    merged,
    bridgeSelect,
  };
}
