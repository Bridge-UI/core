// ** Local Imports
import type { UseFormControlReturn } from "@/Components/FormControl/hooks/useFormControl";
import { Label } from "@/Components/Label";
import {
  hasNamedSlot,
  hasSlotOrProp,
  isPropPresent,
  resolveSlotOrProp,
} from "@/Utils";

type FormControlLabelPart = "endLabel" | "startLabel";

type FormControlLabelProps = {
  api: UseFormControlReturn;
  name: FormControlLabelPart;
};

/**
 * Renders a FormControl label via `Label` for string props and named slots.
 */
function FormControlLabel({ api, name }: FormControlLabelProps) {
  const value = api.merged[name];

  if (!hasSlotOrProp(api.slots, name, value)) {
    return null;
  }

  const content = hasNamedSlot(api.slots, name)
    ? resolveSlotOrProp({
        name,
        fallback: value,
        slots: api.slots,
      })
    : isPropPresent(value)
      ? value
      : null;

  if (content === null) {
    return null;
  }

  return <Label {...api.fieldLabelProps[name]}>{content}</Label>;
}

export default FormControlLabel;
