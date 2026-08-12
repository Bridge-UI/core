import type { ReactNode } from "react";

// ** Local Imports
import FormFieldLabel from "@/Components/FormField/FormFieldLabel";
import type { UseFormFieldReturn } from "@/Components/FormField/hooks/useFormField";
import { Icon } from "@/Components/Icon";
import { hasNamedSlot, hasSlotOrProp, isPropPresent } from "@/Utils";

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
        {hasNamedSlot(api.slots, "start") && (
          <div {...api.startSlotBind}>{api.slots?.start}</div>
        )}

        <div {...api.stackedBodyBind}>
          {api.hasInsetLabelRow && (
            <div {...api.insetLabelRowBind}>
              <FormFieldLabel api={api} />

              {hasSlotOrProp(api.slots, "corner", api.merged.corner) && (
                <span {...api.cornerBind}>
                  {hasNamedSlot(api.slots, "corner")
                    ? api.slots?.corner
                    : api.merged.corner}
                </span>
              )}
            </div>
          )}

          <div {...api.stackedInputRowBind}>
            {isPropPresent(api.merged.start) && (
              <div {...api.startBind}>{api.merged.start}</div>
            )}

            {!isPropPresent(api.merged.start) && api.merged.startIcon && (
              <div {...api.startBind}>
                <Icon
                  {...api.startIconBind}
                  size={api.merged.size}
                  icon={api.merged.startIcon}
                />
              </div>
            )}

            {children}

            {isPropPresent(api.merged.end) && (
              <div {...api.endBind}>{api.merged.end}</div>
            )}

            {api.invalidated &&
            !isPropPresent(api.merged.end) &&
            api.merged.showErrorIcon !== false ? (
              <div {...api.endBind}>
                <Icon
                  {...api.endIconBind}
                  icon={api.errorIcon}
                  size={api.merged.size}
                />
              </div>
            ) : !isPropPresent(api.merged.end) && api.merged.endIcon ? (
              <div {...api.endBind}>
                <Icon
                  {...api.endIconBind}
                  size={api.merged.size}
                  icon={api.merged.endIcon}
                />
              </div>
            ) : null}
          </div>
        </div>

        {hasNamedSlot(api.slots, "end") && (
          <div {...api.endSlotBind}>{api.slots?.end}</div>
        )}
      </div>

      {!api.invalidated &&
        hasSlotOrProp(api.slots, "description", api.merged.description) && (
          <p {...api.descriptionBind} id={`${api.controlId}-description`}>
            {hasNamedSlot(api.slots, "description")
              ? api.slots?.description
              : api.merged.description}
          </p>
        )}

      {!api.merged.hideErrorMessage && (
        <p
          {...api.errorBind}
          id={`${api.controlId}-error`}
          aria-hidden={api.showErrorMessageContent ? undefined : true}
        >
          {api.showErrorMessageContent &&
            (hasNamedSlot(api.slots, "errorMessage")
              ? api.slots?.errorMessage
              : isPropPresent(api.merged.errorMessage)
                ? api.merged.errorMessage
                : null)}
        </p>
      )}
    </div>
  );
}

export default StackedFormField;
