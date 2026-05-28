// ** Local Imports
import { FormField } from "@/Components/FormField";
import { useTextField } from "@/Components/TextField/hooks/useTextField";
import type { TextFieldProps } from "@/Components/TextField/textField.types";

function TextField(props: TextFieldProps) {
  const { formField, inputBind } = useTextField(props);

  return (
    <FormField field={formField}>
      <input {...inputBind} />
    </FormField>
  );
}

export default TextField;
