// ** External Imports
import { useSlots } from "vue";

// ** Local Imports
import type { MiniButtonProps } from "@/Components/MiniButton/miniButton.types";
import { useBridgeUIComponent } from "@/Utils";

export function useMiniButton(
  props: MiniButtonProps,
  defaults: Partial<MiniButtonProps>,
) {
  const slots = useSlots();

  const { entry: bridgeMiniButton, merged } = useBridgeUIComponent({
    props,
    libDefaults: defaults,
    componentName: "MiniButton",
  });

  return {
    slots,
    merged,
    bridgeMiniButton,
  };
}
