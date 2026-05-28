import type { ReactNode } from "react";

// ** Local Imports
import type { UseFormFieldReturn } from "@/Components/FormField/hooks/useFormField";
import { Icon } from "@/Components/Icon";
import {
  hasNamedSlot,
  hasSlotOrProp,
  isPropPresent,
  resolveSlotOrProp,
} from "@/Utils";

type StackedFormFieldProps = {
  api: UseFormFieldReturn;
  children?: ReactNode;
};

function StackedFormField({ api, children }: StackedFormFieldProps) {
  return (
    <div
      {...api.rootBind}
      data-invalid={api.invalidated || undefined}
      aria-disabled={api.isDisabled || undefined}
      aria-readonly={api.isReadonly || undefined}
    >
      <div {...api.containerBind}>
        {api.hasInsetLabelRow && (
          <div {...api.insetLabelRowBind}>
            {hasSlotOrProp(api.slots, "label", api.merged.label) && (
              <label htmlFor={api.controlId} {...api.labelBind}>
                {resolveSlotOrProp({
                  name: "label",
                  slots: api.slots,
                  fallback: api.merged.label,
                })}

                {api.merged.required && <span {...api.requiredBind}>*</span>}
              </label>
            )}

            {hasSlotOrProp(api.slots, "corner", api.merged.corner) && (
              <span {...api.cornerBind}>
                {resolveSlotOrProp({
                  name: "corner",
                  slots: api.slots,
                  fallback: api.merged.corner,
                })}
              </span>
            )}
          </div>
        )}

        <div className="flex min-h-0 w-full flex-1 items-stretch gap-x-2">
          {hasNamedSlot(api.slots, "start") ? (
            <div {...api.startSlotBind}>{api.slots?.start}</div>
          ) : isPropPresent(api.merged.start) ? (
            <div {...api.startBind}>{api.merged.start}</div>
          ) : (
            api.merged.startIcon && (
              <div {...api.startBind}>
                <Icon
                  {...api.startIconBind}
                  size={api.merged.size}
                  icon={api.merged.startIcon}
                />
              </div>
            )
          )}

          {children}

          {hasNamedSlot(api.slots, "end") ? (
            <div {...api.endSlotBind}>{api.slots?.end}</div>
          ) : isPropPresent(api.merged.end) ? (
            <div {...api.endBind}>{api.merged.end}</div>
          ) : api.invalidated && api.merged.withErrorIcon !== false ? (
            <div {...api.endBind}>
              <Icon
                {...api.endIconBind}
                icon={api.errorIcon}
                size={api.merged.size}
              />
            </div>
          ) : (
            api.merged.endIcon && (
              <div {...api.endBind}>
                <Icon
                  {...api.endIconBind}
                  size={api.merged.size}
                  icon={api.merged.endIcon}
                />
              </div>
            )
          )}
        </div>
      </div>

      {!api.invalidated &&
        hasSlotOrProp(api.slots, "description", api.merged.description) && (
          <p {...api.descriptionBind} id={`${api.controlId}-description`}>
            {resolveSlotOrProp({
              slots: api.slots,
              name: "description",
              fallback: api.merged.description,
            })}
          </p>
        )}

      {hasSlotOrProp(api.slots, "errorMessage", api.merged.errorMessage) && (
        <p id={`${api.controlId}-error`} {...api.errorBind}>
          {resolveSlotOrProp({
            slots: api.slots,
            name: "errorMessage",
            fallback: api.merged.errorMessage,
          })}
        </p>
      )}
    </div>
  );
}

export default StackedFormField;
