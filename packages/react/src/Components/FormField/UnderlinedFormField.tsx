import type { ReactNode } from "react";

// ** Local Imports
import FormFieldCorner from "@/Components/FormField/FormFieldCorner";
import FormFieldLabel from "@/Components/FormField/FormFieldLabel";
import type { UseFormFieldReturn } from "@/Components/FormField/hooks/useFormField";
import { Icon } from "@/Components/Icon";
import { hasNamedSlot, hasSlotOrProp, isPropPresent } from "@/Utils";

type UnderlinedFormFieldProps = {
  api: UseFormFieldReturn;
  children?: ReactNode;
};

function UnderlinedFormField({ api, children }: UnderlinedFormFieldProps) {
  return (
    <div
      {...api.rootBind}
      data-invalid={api.invalidated || undefined}
      aria-disabled={api.isDisabled || undefined}
      aria-readonly={api.isReadonly || undefined}
    >
      {(hasSlotOrProp(api.slots, "label", api.merged.label) ||
        hasSlotOrProp(api.slots, "corner", api.merged.corner)) && (
        <div {...api.headerBind}>
          <FormFieldLabel api={api} />

          <FormFieldCorner api={api} />
        </div>
      )}

      <div {...api.containerBind}>
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
        ) : api.invalidated && api.merged.showErrorIcon !== false ? (
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

      {api.showDescriptionContent && (
        <p {...api.descriptionBind} id={`${api.controlId}-description`}>
          {hasNamedSlot(api.slots, "description")
            ? api.slots?.description
            : api.merged.description}
        </p>
      )}

      {api.showErrorMessageRow && (
        <p
          {...api.errorBind}
          id={`${api.controlId}-error`}
          aria-hidden={api.showErrorMessageContent ? undefined : true}
        >
          {api.showErrorMessageContent &&
            (hasNamedSlot(api.slots, "errorMessage")
              ? api.slots?.errorMessage
              : api.merged.errorMessage)}
        </p>
      )}
    </div>
  );
}

export default UnderlinedFormField;
