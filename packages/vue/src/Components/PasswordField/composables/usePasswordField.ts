// ** External Imports
import { useSlots } from "vue";

// ** Local Imports
import type { PasswordFieldProps } from "@/Components/PasswordField/passwordField.types";
import { useBridgeUIComponent } from "@/Utils";

export function usePasswordField(
  props: PasswordFieldProps,
  libDefaults: Partial<PasswordFieldProps>,
) {
  const slots = useSlots();

  const { entry: bridgePasswordField, merged } = useBridgeUIComponent({
    props,
    libDefaults,
    componentName: "TextField",
  });

  return {
    slots,
    merged,
    bridgePasswordField,
  };
}
