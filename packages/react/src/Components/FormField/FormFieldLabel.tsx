// ** Local Imports
import type { UseFormFieldReturn } from "@/Components/FormField/hooks/useFormField";
import { Label } from "@/Components/Label";
import { hasNamedSlot, hasSlotOrProp } from "@/Utils";

type FormFieldLabelProps = {
  api: UseFormFieldReturn;
};

/**
 * Renders the FormField label via `Label` for the string prop and named slots.
 */
function FormFieldLabel({ api }: FormFieldLabelProps) {
  if (!hasSlotOrProp(api.slots, "label", api.merged.label)) {
    return null;
  }

  const content = hasNamedSlot(api.slots, "label")
    ? api.slots?.label
    : api.merged.label;

  return <Label {...api.fieldLabelProps}>{content}</Label>;
}

export default FormFieldLabel;
