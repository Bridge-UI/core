// ** External Imports
import { useSlots } from "vue";

// ** Local Imports
import type { NumberFieldProps } from "@/Components/NumberField/numberField.types";
import { useBridgeUIComponent } from "@/Utils";

export function useNumberField(
  props: NumberFieldProps,
  libDefaults: Partial<NumberFieldProps>,
) {
  const slots = useSlots();

  const { entry: bridgeNumberField, merged } = useBridgeUIComponent({
    props,
    libDefaults,
    componentName: "TextField",
  });

  return {
    slots,
    merged,
    bridgeNumberField,
  };
}
