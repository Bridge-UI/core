// ** Local Imports
import type { UseBaseFieldReturn } from "@/Components/BaseField/hooks/useBaseField";
import { Label } from "@/Components/Label";
import { hasNamedSlot, hasSlotOrProp } from "@/Utils";

type BaseFieldCornerProps = {
  field: UseBaseFieldReturn;
};

/**
 * Renders the BaseField corner via `Label` for the string prop and named slots.
 */
function BaseFieldCorner({ field }: BaseFieldCornerProps) {
  if (!hasSlotOrProp(field.slots, "corner", field.merged.corner)) {
    return null;
  }

  const content = hasNamedSlot(field.slots, "corner")
    ? field.slots?.corner
    : field.merged.corner;

  return <Label {...field.fieldCornerProps}>{content}</Label>;
}

export default BaseFieldCorner;
