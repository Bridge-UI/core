// ** Local Imports
import type { FormControlProps } from "@/Components/FormControl/formControl.types";
import type { UseFormControlReturn } from "@/Components/FormControl/hooks/useFormControl";
import { hasSlotOrProp, resolveSlotOrProp } from "@/Utils";

type FormControlComponentProps = Required<
  Pick<FormControlProps, "field" | "children">
>;

function FormControl({ field, children }: FormControlComponentProps) {
  const api: UseFormControlReturn = field;

  return (
    <div
      {...api.rootBind}
      data-invalid={api.invalidated || undefined}
      aria-disabled={api.isDisabled || undefined}
      aria-readonly={api.isReadonly || undefined}
    >
      <div {...api.rowBind}>
        {hasSlotOrProp(api.slots, "startLabel", api.merged.startLabel) && (
          <label {...api.startLabelBind}>
            {resolveSlotOrProp({
              slots: api.slots,
              name: "startLabel",
              fallback: api.merged.startLabel,
            })}
          </label>
        )}

        {children}

        {hasSlotOrProp(api.slots, "mainLabel", api.merged.mainLabel) && (
          <label {...api.mainLabelBind}>
            {resolveSlotOrProp({
              slots: api.slots,
              name: "mainLabel",
              fallback: api.merged.mainLabel,
            })}
          </label>
        )}

        {hasSlotOrProp(api.slots, "endLabel", api.merged.endLabel) && (
          <label {...api.endLabelBind}>
            {resolveSlotOrProp({
              name: "endLabel",
              slots: api.slots,
              fallback: api.merged.endLabel,
            })}
          </label>
        )}
      </div>

      {!api.invalidated &&
        hasSlotOrProp(api.slots, "description", api.merged.description) && (
          <p {...api.descriptionBind}>
            {resolveSlotOrProp({
              slots: api.slots,
              name: "description",
              fallback: api.merged.description,
            })}
          </p>
        )}

      {!api.merged.withoutErrorMessage && (
        <p
          {...api.errorMessageBind}
          aria-hidden={api.showErrorMessageContent ? undefined : true}
        >
          {api.showErrorMessageContent &&
            resolveSlotOrProp({
              slots: api.slots,
              name: "errorMessage",
              fallback: api.merged.errorMessage,
            })}
        </p>
      )}
    </div>
  );
}

export default FormControl;
