// ** External Imports
import { useSlots } from "vue";

// ** Local Imports
import type { TextareaProps } from "@/Components/Textarea/textarea.types";
import { useBridgeUIComponent } from "@/Utils";

export function useTextarea(
  props: TextareaProps,
  defaults: Partial<TextareaProps>,
) {
  const slots = useSlots();

  const { entry: bridgeTextarea, merged } = useBridgeUIComponent({
    props,
    libDefaults: defaults,
    componentName: "Textarea",
  });

  return {
    slots,
    merged,
    bridgeTextarea,
  };
}
