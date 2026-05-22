// ** Local Imports
import { Icon } from "@/Components/Icon";
import { Label } from "@/Components/Label";
import { useTextField } from "@/Components/TextField/hooks/useTextField";
import type { TextFieldProps } from "@/Components/TextField/textField.types";
import {
  hasNamedSlot,
  hasSlotOrProp,
  isPropPresent,
  resolveSlotOrProp,
} from "@/Utils";

function TextField(props: TextFieldProps) {
  const {
    slots,
    merged,
    endBind,
    inputId,
    rootBind,
    errorBind,
    errorIcon,
    inputBind,
    labelBind,
    startBind,
    cornerBind,
    headerBind,
    isDisabled,
    isReadonly,
    endIconBind,
    endSlotBind,
    invalidated,
    containerBind,
    startIconBind,
    startSlotBind,
    descriptionBind,
  } = useTextField(props, {
    size: "md",
    rounded: "md",
    color: "primary",
    variant: "outline",
    withErrorIcon: true,
  });

  return (
    <div
      {...rootBind}
      aria-disabled={isDisabled || undefined}
      aria-readonly={isReadonly || undefined}
      data-invalid={invalidated || undefined}
    >
      {(hasSlotOrProp(slots, "label", merged.label) ||
        hasSlotOrProp(slots, "corner", merged.corner)) && (
        <div {...headerBind}>
          {hasSlotOrProp(slots, "label", merged.label) && (
            <Label
              {...labelBind}
              htmlFor={inputId}
              size={merged.size}
              error={invalidated}
              required={merged.required}
            >
              {resolveSlotOrProp({
                slots,
                name: "label",
                fallback: merged.label,
              })}
            </Label>
          )}

          {hasSlotOrProp(slots, "corner", merged.corner) && (
            <span {...cornerBind}>
              {resolveSlotOrProp({
                slots,
                name: "corner",
                fallback: merged.corner,
              })}
            </span>
          )}
        </div>
      )}

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

      {!invalidated &&
        hasSlotOrProp(slots, "description", merged.description) && (
          <p {...descriptionBind} id={`${inputId}-description`}>
            {resolveSlotOrProp({
              slots,
              name: "description",
              fallback: merged.description,
            })}
          </p>
        )}

      {hasSlotOrProp(slots, "errorMessage", merged.errorMessage) && (
        <p {...errorBind} id={`${inputId}-error`}>
          {resolveSlotOrProp({
            slots,
            name: "errorMessage",
            fallback: merged.errorMessage,
          })}
        </p>
      )}
    </div>
  );
}

export default TextField;
