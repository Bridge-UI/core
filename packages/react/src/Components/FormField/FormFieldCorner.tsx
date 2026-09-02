// ** Local Imports
import type { UseFormFieldReturn } from "@/Components/FormField/hooks/useFormField";
import { Label } from "@/Components/Label";
import { hasNamedSlot, hasSlotOrProp } from "@/Utils";

type FormFieldCornerProps = {
  api: UseFormFieldReturn;
};

/**
 * Renders the FormField corner via `Label` for the string prop and named slots.
 */
function FormFieldCorner({ api }: FormFieldCornerProps) {
  if (!hasSlotOrProp(api.slots, "corner", api.merged.corner)) {
    return null;
  }

  const content = hasNamedSlot(api.slots, "corner")
    ? api.slots?.corner
    : api.merged.corner;

  return <Label {...api.fieldCornerProps}>{content}</Label>;
}

export default FormFieldCorner;
