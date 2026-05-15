// ** External Imports
import { useSlots } from "vue";

// ** Local Imports
import type { PasswordInputProps } from "@/Components/PasswordInput/passwordInput.types";
import { useBridgeUIComponent } from "@/Utils";

export function usePasswordInput(
  props: PasswordInputProps,
  defaults: Partial<PasswordInputProps>,
) {
  const slots = useSlots();

  const { entry: bridgePasswordInput, merged } = useBridgeUIComponent({
    props,
    libDefaults: defaults,
    componentName: "PasswordInput",
  });

  return {
    slots,
    merged,
    bridgePasswordInput,
  };
}
