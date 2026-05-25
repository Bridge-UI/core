// ** Local Imports
import { FormField } from "@/Components/FormField";
import { useTextarea } from "@/Components/Textarea/hooks/useTextarea";
import type { TextareaProps } from "@/Components/Textarea/textarea.types";

function Textarea(props: TextareaProps) {
  const { formField, textareaBind, containerBind } = useTextarea(props, {
    size: "md",
    rounded: "md",
    color: "primary",
    variant: "outline",
  });

  return (
    <FormField field={formField}>
      <div {...containerBind}>
        <textarea {...textareaBind} />
      </div>
    </FormField>
  );
}

export default Textarea;
