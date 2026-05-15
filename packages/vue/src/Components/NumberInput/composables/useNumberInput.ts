// ** External Imports
import { useSlots } from "vue";

// ** Local Imports
import type { NumberInputProps } from "@/Components/NumberInput/numberInput.types";
import { useBridgeUIComponent } from "@/Utils";

export function useNumberInput(
  props: NumberInputProps,
  defaults: Partial<NumberInputProps>,
) {
  const slots = useSlots();

  const { entry: bridgeNumberInput, merged } = useBridgeUIComponent({
    props,
    libDefaults: defaults,
    componentName: "NumberInput",
  });

  return {
    slots,
    merged,
    bridgeNumberInput,
  };
}
