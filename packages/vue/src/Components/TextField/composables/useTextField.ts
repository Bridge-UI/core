// ** External Imports
import { omit } from "es-toolkit/compat";
import { computed, useAttrs } from "vue";

// ** Core Imports
import { splitComponentProps, type LibDefaultsShape } from "@bridge-ui/core";

// ** Local Imports
import {
  formFieldOwnPropKeys,
  useFormField,
} from "@/Components/FormField/composables/useFormField";
import type {
  TextFieldOwnProps,
  TextFieldProps,
} from "@/Components/TextField/textField.types";

type TextFieldLibDefaults = LibDefaultsShape<
  TextFieldOwnProps,
  "color" | "rounded" | "size" | "variant" | "withErrorIcon"
>;

export function useTextField(
  props: TextFieldOwnProps,
  libDefaults: TextFieldLibDefaults,
) {
  // Setup
  const attrs = useAttrs();

  const split = computed(() => {
    return splitComponentProps<TextFieldProps, typeof formFieldOwnPropKeys>({
      props: { ...attrs, ...props },
      bridgeKeys: formFieldOwnPropKeys,
    });
  });

  const inputInheritedAttrs = computed(() => {
    return omit(split.value.inheritedAttrs, ["class"]);
  });

  // prettier-ignore
  const formField = useFormField(() => {
    return split.value.customProps;
  }, libDefaults, {
    controlId: () => inputInheritedAttrs.value.id,
    inputAttributes: () => inputInheritedAttrs.value,
    rootClassName: () => split.value.inheritedAttrs.class,
  });

  return {
    formField,
    inputBind: formField.inputBind,
  };
}
