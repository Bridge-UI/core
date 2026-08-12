// ** Local Imports
import type { UseBaseFieldReturn } from "@/Components/BaseField/hooks/useBaseField";
import { Label } from "@/Components/Label";
import { hasNamedSlot, hasSlotOrProp } from "@/Utils";

type BaseFieldLabelProps = {
  field: UseBaseFieldReturn;
};

/**
 * Renders the BaseField label via `Label` for the string prop and named slots.
 */
function BaseFieldLabel({ field }: BaseFieldLabelProps) {
  if (!hasSlotOrProp(field.slots, "label", field.merged.label)) {
    return null;
  }

  const content = hasNamedSlot(field.slots, "label")
    ? field.slots?.label
    : field.merged.label;

  return <Label {...field.fieldLabelProps}>{content}</Label>;
}

export default BaseFieldLabel;
