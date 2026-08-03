// ** Local Imports
import { Label } from "@/Components/Label";
import type { UseOtpFieldReturn } from "@/Components/OtpField/hooks/useOtpField";
import {
  hasNamedSlot,
  hasSlotOrProp,
  isPropPresent,
  resolveSlotOrProp,
} from "@/Utils";

type OtpFieldLabelProps = {
  api: UseOtpFieldReturn;
};

/**
 * Renders the OtpField label via `Label` for the string prop and named slots.
 */
function OtpFieldLabel({ api }: OtpFieldLabelProps) {
  if (!hasSlotOrProp(api.slots, "label", api.merged.label)) {
    return null;
  }

  const content = hasNamedSlot(api.slots, "label")
    ? resolveSlotOrProp({
        name: "label",
        slots: api.slots,
        fallback: api.merged.label,
      })
    : isPropPresent(api.merged.label)
      ? api.merged.label
      : null;

  if (content === null) {
    return null;
  }

  return <Label {...api.fieldLabelProps}>{content}</Label>;
}

export default OtpFieldLabel;
