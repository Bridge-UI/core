// ** Local Imports
import type {
  PasswordFieldClasses,
  PasswordFieldProps,
} from "@/Components/PasswordField/passwordField.types";
import {
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

type PasswordFieldRegistryProps = Pick<PasswordFieldProps, "classes">;

export function usePasswordFieldClasses(props: PasswordFieldRegistryProps) {
  const { entry } = useBridgeUIComponent<
    PasswordFieldRegistryProps,
    "PasswordField"
  >({
    props,
    componentName: "PasswordField",
  });

  return useBridgeUIMergedRegistryClasses<PasswordFieldClasses>({
    entry,
    props,
  });
}
