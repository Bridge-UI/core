// ** External Imports
import { useSlots } from "vue";

// ** Local Imports
import type { ButtonProps } from "@/Components/Button/button.types";
import { useBridgeUIComponent } from "@/Utils";

export function useButton(
  props: ButtonProps,
  libDefaults: Partial<ButtonProps>,
) {
  const slots = useSlots();

  const { entry: bridgeButton, merged } = useBridgeUIComponent({
    props,
    libDefaults,
    componentName: "Button",
  });

  return {
    slots,
    merged,
    bridgeButton,
  };
}
