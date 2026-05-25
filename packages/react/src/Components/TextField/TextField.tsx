// ** Local Imports
import { FormField } from "@/Components/FormField";
import { Icon } from "@/Components/Icon";
import { useTextField } from "@/Components/TextField/hooks/useTextField";
import type { TextFieldProps } from "@/Components/TextField/textField.types";
import { hasNamedSlot, isPropPresent } from "@/Utils";

function TextField(props: TextFieldProps) {
  const {
    field,
    slots,
    merged,
    endBind,
    inputId,
    errorIcon,
    inputBind,
    startBind,
    endIconBind,
    endSlotBind,
    invalidated,
    containerBind,
    startIconBind,
    startSlotBind,
  } = useTextField(props, {
    size: "md",
    rounded: "md",
    color: "primary",
    variant: "outline",
    withErrorIcon: true,
  });

  return (
    <FormField field={field}>
      <label {...containerBind} htmlFor={inputId}>
        {hasNamedSlot(slots, "start") && (
          <div {...startSlotBind}>{slots?.start}</div>
        )}

        {!hasNamedSlot(slots, "start") && isPropPresent(merged.start) && (
          <div {...startBind}>{merged.start}</div>
        )}

        {!hasNamedSlot(slots, "start") && merged.startIcon && (
          <div {...startBind}>
            <Icon
              icon={merged.startIcon}
              size={merged.size}
              {...startIconBind}
            />
          </div>
        )}

        <input {...inputBind} />

        {hasNamedSlot(slots, "end") && <div {...endSlotBind}>{slots?.end}</div>}

        {!hasNamedSlot(slots, "end") && isPropPresent(merged.end) && (
          <div {...endBind}>{merged.end}</div>
        )}

        {!hasNamedSlot(slots, "end") &&
          invalidated &&
          merged.withErrorIcon !== false && (
            <div {...endBind}>
              <Icon icon={errorIcon} size={merged.size} {...endIconBind} />
            </div>
          )}

        {!hasNamedSlot(slots, "end") &&
          !(invalidated && merged.withErrorIcon !== false) &&
          merged.endIcon && (
            <div {...endBind}>
              <Icon icon={merged.endIcon} size={merged.size} {...endIconBind} />
            </div>
          )}
      </label>
    </FormField>
  );
}

export default TextField;
