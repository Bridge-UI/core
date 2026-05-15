// ** External Imports
import { useSlots } from "vue";

// ** Local Imports
import type { SelectProps } from "@/Components/Select/select.types";
import { useBridgeUIComponent } from "@/Utils";

export function useSelect(
  props: SelectProps,
  libDefaults: Partial<SelectProps>,
) {
  const slots = useSlots();

  const { entry: bridgeSelect, merged } = useBridgeUIComponent({
    props,
    libDefaults,
    componentName: "Select",
  });

  return {
    slots,
    merged,
    bridgeSelect,
  };
}
