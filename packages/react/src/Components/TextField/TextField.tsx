// ** Local Imports
import { Icon } from "@/Components/Icon";
import { Label } from "@/Components/Label";
import { useTextField } from "@/Components/TextField/hooks/useTextField";
import type { TextFieldProps } from "@/Components/TextField/textField.types";
import { hasSlotOrProp, resolveSlotOrProp } from "@/Utils";

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
    showError,
    startBind,
    cornerBind,
    hasEndSlot,
    headerBind,
    isDisabled,
    isReadonly,
    showHeader,
    endIconBind,
    endSlotBind,
    invalidated,
    showEndIcon,
    showEndText,
    hasStartSlot,
    containerBind,
    showErrorIcon,
    showStartIcon,
    showStartText,
    startIconBind,
    startSlotBind,
    descriptionBind,
    showDescription,
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
      {showHeader && (
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
        {hasStartSlot && <div {...startSlotBind}>{slots?.start}</div>}

        {!hasStartSlot && showStartText && (
          <div {...startBind}>{merged.start}</div>
        )}

        {!hasStartSlot && showStartIcon && merged.startIcon && (
          <div {...startBind}>
            <Icon
              icon={merged.startIcon}
              size={merged.size}
              {...startIconBind}
            />
          </div>
        )}

        <input {...inputBind} />

        {hasEndSlot && <div {...endSlotBind}>{slots?.end}</div>}

        {!hasEndSlot && showEndText && <div {...endBind}>{merged.end}</div>}

        {!hasEndSlot && showErrorIcon && (
          <div {...endBind}>
            <Icon icon={errorIcon} size={merged.size} {...endIconBind} />
          </div>
        )}

        {!hasEndSlot && showEndIcon && merged.endIcon && (
          <div {...endBind}>
            <Icon icon={merged.endIcon} size={merged.size} {...endIconBind} />
          </div>
        )}
      </label>

      {showDescription && (
        <p {...descriptionBind} id={`${inputId}-description`}>
          {resolveSlotOrProp({
            slots,
            name: "description",
            fallback: merged.description,
          })}
        </p>
      )}

      {showError && (
        <p {...errorBind} id={`${inputId}-error`}>
          {resolveSlotOrProp({
            slots,
            name: "error",
            fallback: merged.errorMessage,
          })}
        </p>
      )}
    </div>
  );
}

export default TextField;
