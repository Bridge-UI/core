// ** External Imports
import { useAttrs } from "vue";

// ** Local Imports
import { useFormField } from "@/Components/FormField/composables/useFormField";
import type { TextFieldOwnProps } from "@/Components/TextField/textField.types";

export function useTextField(props: TextFieldOwnProps) {
  const attrs = useAttrs();

  const formField = useFormField(
    () => {
      const { defaultValue: _defaultValue, ...rest } = props;

      return { ...attrs, ...rest };
    },
    {
      size: "md",
      rounded: "md",
      color: "primary",
      variant: "outline",
      withErrorIcon: true,
    },
  );

  return {
    formField,
    inputBind: formField.inputBind,
  };
}
