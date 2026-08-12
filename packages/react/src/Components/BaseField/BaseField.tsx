// ** External Imports
import type { ReactNode } from "react";

// ** Local Imports
import BaseFieldLabel from "@/Components/BaseField/BaseFieldLabel";
import type { UseBaseFieldReturn } from "@/Components/BaseField/hooks/useBaseField";
import { hasNamedSlot, hasSlotOrProp, isPropPresent } from "@/Utils";

type BaseFieldComponentProps = {
  children?: ReactNode;
  field: UseBaseFieldReturn;
};

function BaseField({ field, children }: BaseFieldComponentProps) {
  const {
    slots,
    merged,
    rootBind,
    errorBind,
    groupBind,
    controlId,
    headerBind,
    cornerBind,
    endSlotBind,
    invalidated,
    startSlotBind,
    descriptionBind,
    showErrorMessageContent,
  } = field;

  const showHeader =
    hasSlotOrProp(slots, "label", merged.label) ||
    hasSlotOrProp(slots, "corner", merged.corner);

  return (
    <div
      {...rootBind}
      data-invalid={invalidated || undefined}
      aria-disabled={merged.disabled || undefined}
      aria-readonly={merged.readonly || undefined}
    >
      {showHeader && (
        <div {...headerBind}>
          <BaseFieldLabel field={field} />

          {hasSlotOrProp(slots, "corner", merged.corner) && (
            <span {...cornerBind}>
              {hasNamedSlot(slots, "corner") ? slots?.corner : merged.corner}
            </span>
          )}
        </div>
      )}

      <div {...groupBind}>
        {hasNamedSlot(slots, "start") && (
          <div {...startSlotBind}>{slots?.start}</div>
        )}

        {children}

        {hasNamedSlot(slots, "end") && <div {...endSlotBind}>{slots?.end}</div>}
      </div>

      {!invalidated &&
        hasSlotOrProp(slots, "description", merged.description) && (
          <p {...descriptionBind} id={`${controlId}-description`}>
            {hasNamedSlot(slots, "description")
              ? slots?.description
              : merged.description}
          </p>
        )}

      {!merged.hideErrorMessage && (
        <p
          {...errorBind}
          id={`${controlId}-error`}
          aria-hidden={showErrorMessageContent ? undefined : true}
        >
          {showErrorMessageContent &&
            (hasNamedSlot(slots, "errorMessage")
              ? slots?.errorMessage
              : isPropPresent(merged.errorMessage)
                ? merged.errorMessage
                : null)}
        </p>
      )}
    </div>
  );
}

export default BaseField;
