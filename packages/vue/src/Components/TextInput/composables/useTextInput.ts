// ** External Imports
import { useSlots } from "vue";

// ** Local Imports
import type { TextInputProps } from "@/Components/TextInput/textInput.types";
import { useBridgeUIComponent } from "@/Utils";

export function useTextInput(
  props: TextInputProps,
  libDefaults: Partial<TextInputProps>,
) {
  const slots = useSlots();

  const { entry: bridgeTextInput, merged } = useBridgeUIComponent({
    props,
    libDefaults,
    componentName: "TextInput",
  });

  return {
    slots,
    merged,
    bridgeTextInput,
  };
}
