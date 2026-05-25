// ** Local Imports
import type { FormFieldProps } from "@/Components/FormField/formField.types";
import { useFormField } from "@/Components/FormField/hooks/useFormField";
import { hasSlotOrProp, resolveSlotOrProp } from "@/Utils";

function FormField(props: FormFieldProps) {
  const { field, ...rest } = props;

  const local = useFormField(rest, {
    size: "md",
  });

  const {
    slots,
    merged,
    children,
    rootBind,
    controlId,
    errorBind,
    labelBind,
    cornerBind,
    headerBind,
    isDisabled,
    isReadonly,
    invalidated,
    requiredBind,
    descriptionBind,
  } = field ?? local;

  return (
    <div
      {...rootBind}
      data-invalid={invalidated || undefined}
      aria-disabled={isDisabled || undefined}
      aria-readonly={isReadonly || undefined}
    >
      {(hasSlotOrProp(slots, "label", merged.label) ||
        hasSlotOrProp(slots, "corner", merged.corner)) && (
        <div {...headerBind}>
          {hasSlotOrProp(slots, "label", merged.label) && (
            <label {...labelBind} htmlFor={controlId}>
              {resolveSlotOrProp({
                slots,
                name: "label",
                fallback: merged.label,
              })}

              {merged.required && <span {...requiredBind}>*</span>}
            </label>
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

      {children}

      {!invalidated &&
        hasSlotOrProp(slots, "description", merged.description) && (
          <p {...descriptionBind} id={`${controlId}-description`}>
            {resolveSlotOrProp({
              slots,
              name: "description",
              fallback: merged.description,
            })}
          </p>
        )}

      {hasSlotOrProp(slots, "errorMessage", merged.errorMessage) && (
        <p {...errorBind} id={`${controlId}-error`}>
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

export default FormField;
