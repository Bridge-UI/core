// ** External Imports
import { useSlots } from "vue";

// ** Local Imports
import type { ButtonProps } from "@/Components/Button/button.types";
import { useBridgeUIComponent } from "@/Utils";

export function useButton(props: ButtonProps, defaults: Partial<ButtonProps>) {
  const slots = useSlots();

  const { entry: bridgeButton, merged } = useBridgeUIComponent({
    componentName: "Button",
    props,
    libDefaults: defaults,
  });

  return {
    slots,
    merged,
    bridgeButton,
  };
}
