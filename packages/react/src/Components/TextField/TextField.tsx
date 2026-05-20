// ** Local Imports
import { Icon } from "@/Components/Icon";
import { useTextField } from "@/Components/TextField/hooks/useTextField";
import type { TextFieldProps } from "@/Components/TextField/textField.types";

function TextField(props: TextFieldProps) {
  const {
    slots,
    merged,
    errorIcon,
    inputBind,
    labelBind,
    rootBind,
    endBind,
    errorBind,
    startBind,
    cornerBind,
    headerBind,
    endIconBind,
    containerBind,
    startIconBind,
    endSlotClass,
    startSlotClass,
    showHeader,
    showEndIcon,
    showErrorIcon,
    invalidated,
    showStartIcon,
    hasStartSlot,
    hasEndSlot,
    inputId,
    isDisabled,
    isReadonly,
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
          {(slots?.label != null || merged.label) && (
            <label {...labelBind} htmlFor={inputId}>
              {slots?.label ?? merged.label}
            </label>
          )}

          {(slots?.corner != null || merged.corner) && (
            <span {...cornerBind}>{slots?.corner ?? merged.corner}</span>
          )}
        </div>
      )}

      <label {...containerBind} htmlFor={inputId}>
        {hasStartSlot && <div className={startSlotClass}>{slots?.start}</div>}

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

        {hasEndSlot && <div className={endSlotClass}>{slots?.end}</div>}

        {!hasEndSlot && showEndIcon && merged.endIcon && (
          <div {...endBind}>
            <Icon icon={merged.endIcon} size={merged.size} {...endIconBind} />
          </div>
        )}

        {!hasEndSlot && showErrorIcon && (
          <div {...endBind}>
            <Icon icon={errorIcon} size={merged.size} {...endIconBind} />
          </div>
        )}
      </label>

      {!merged.errorless &&
        invalidated &&
        (slots?.error != null || merged.error) && (
          <p {...errorBind} id={`${inputId}-error`}>
            {slots?.error ?? merged.error}
          </p>
        )}
    </div>
  );
}

export default TextField;
