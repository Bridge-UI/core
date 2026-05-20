// ** External Imports
import { useSlots } from "vue";

// ** Local Imports
import type { TextFieldProps } from "@/Components/TextField/textField.types";
import { useBridgeUIComponent } from "@/Utils";

export function useTextField(
  props: TextFieldProps,
  libDefaults: Partial<TextFieldProps>,
) {
  const slots = useSlots();

  const { entry: bridgeTextField, merged } = useBridgeUIComponent({
    props,
    libDefaults,
    componentName: "TextField",
  });

  return {
    slots,
    merged,
    bridgeTextField,
  };
}
