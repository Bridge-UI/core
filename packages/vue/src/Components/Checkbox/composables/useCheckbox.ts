// ** External Imports
import { useSlots } from "vue";

// ** Local Imports
import type { CheckboxProps } from "@/Components/Checkbox/checkbox.types";
import { useBridgeUIComponent } from "@/Utils";

export function useCheckbox(
  props: CheckboxProps,
  libDefaults: Partial<CheckboxProps>,
) {
  const slots = useSlots();

  const { entry: bridgeCheckbox, merged } = useBridgeUIComponent({
    props,
    libDefaults,
    componentName: "Checkbox",
  });

  return {
    slots,
    merged,
    bridgeCheckbox,
  };
}
