import { toValue, type MaybeRefOrGetter } from "vue";

// ** Local Imports
import type {
  PasswordFieldClasses,
  PasswordFieldOwnProps,
} from "@/Components/PasswordField/passwordField.types";
import {
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

type PasswordFieldRegistryProps = Pick<PasswordFieldOwnProps, "classes">;

export function usePasswordFieldClasses(
  props: MaybeRefOrGetter<PasswordFieldRegistryProps>,
) {
  const { entry } = useBridgeUIComponent<
    PasswordFieldRegistryProps,
    "PasswordField"
  >({
    props: () => toValue(props),
    componentName: "PasswordField",
  });

  return useBridgeUIMergedRegistryClasses<PasswordFieldClasses>({
    entry,
    props: () => toValue(props),
  });
}
