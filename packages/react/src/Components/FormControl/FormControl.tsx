// ** Local Imports
import FormControlLabel from "@/Components/FormControl/FormControlLabel";
import type { FormControlProps } from "@/Components/FormControl/formControl.types";
import type { UseFormControlReturn } from "@/Components/FormControl/hooks/useFormControl";
import { hasNamedSlot, hasSlotOrProp, isPropPresent } from "@/Utils";

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
        <FormControlLabel api={api} name="startLabel" />

        {children}

        <FormControlLabel api={api} name="endLabel" />
      </div>

      {!api.invalidated &&
        hasSlotOrProp(api.slots, "description", api.merged.description) && (
          <p {...api.descriptionBind}>
            {hasNamedSlot(api.slots, "description")
              ? api.slots?.description
              : api.merged.description}
          </p>
        )}

      {!api.merged.hideErrorMessage && (
        <p
          {...api.errorMessageBind}
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

export default FormControl;
