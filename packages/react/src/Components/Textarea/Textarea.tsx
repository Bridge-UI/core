// ** Local Imports
import { FormField } from "@/Components/FormField";
import { useTextarea } from "@/Components/Textarea/hooks/useTextarea";
import type { TextareaProps } from "@/Components/Textarea/textarea.types";

function Textarea(props: TextareaProps) {
  const { formField, textareaBind } = useTextarea(props);

  return (
    <FormField field={formField}>
      <textarea {...textareaBind} />
    </FormField>
  );
}

export default Textarea;
