// ** External Imports
import { useSlots } from "vue";

// ** Local Imports
import type { RadioProps } from "@/Components/Radio/radio.types";
import { useBridgeUIComponent } from "@/Utils";

export function useRadio(props: RadioProps, defaults: Partial<RadioProps>) {
  const slots = useSlots();

  const { entry: bridgeRadio, merged } = useBridgeUIComponent({
    props,
    libDefaults: defaults,
    componentName: "Radio",
  });

  return {
    slots,
    merged,
    bridgeRadio,
  };
}
