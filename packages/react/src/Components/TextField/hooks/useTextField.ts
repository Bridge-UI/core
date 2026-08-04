// ** Local Imports
import { useFormField } from "@/Components/FormField";
import type { TextFieldProps } from "@/Components/TextField/textField.types";

export function useTextField(props: TextFieldProps) {
  const formField = useFormField(props, {
    size: "md",
    rounded: "md",
    color: "primary",
    variant: "outline",
    showErrorIcon: true,
  });

  return {
    formField,
    inputBind: formField.inputBind,
  };
}
