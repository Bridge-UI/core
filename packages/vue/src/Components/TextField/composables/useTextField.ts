// ** Local Imports
import { useFormField } from "@/Components/FormField/composables/useFormField";
import type { TextFieldOwnProps } from "@/Components/TextField/textField.types";

export function useTextField(props: TextFieldOwnProps) {
  // Setup
  const formField = useFormField(() => props, {
    size: "md",
    rounded: "md",
    color: "primary",
    variant: "outline",
    withErrorIcon: true,
  });

  return {
    formField,
    inputBind: formField.inputBind,
  };
}
