// ** External Imports
import { useSlots } from "vue";

// ** Local Imports
import type { RadioProps } from "@/Components/Radio/radio.types";
import { useBridgeUIComponent } from "@/Utils";

export function useRadio(props: RadioProps, libDefaults: Partial<RadioProps>) {
  const slots = useSlots();

  const { entry: bridgeRadio, merged } = useBridgeUIComponent({
    props,
    libDefaults,
    componentName: "Radio",
  });

  return {
    slots,
    merged,
    bridgeRadio,
  };
}
