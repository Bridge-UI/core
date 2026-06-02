// ** Local Imports
import { Label } from "@/Components/Label";
import type { UseSwitcherReturn } from "@/Components/Switcher/hooks/useSwitcher";
import type { SwitcherProps } from "@/Components/Switcher/switcher.types";
import { hasSlotOrProp, resolveSlotOrProp } from "@/Utils";

type SwitcherComponentProps = Required<
  Pick<SwitcherProps, "field" | "children">
>;

function Switcher({ field, children }: SwitcherComponentProps) {
  const api: UseSwitcherReturn = field;

  return (
    <div
      {...api.rootBind}
      data-invalid={api.invalidated || undefined}
      aria-disabled={api.isDisabled || undefined}
      aria-readonly={api.isReadonly || undefined}
    >
      <div {...api.rowBind}>
        {hasSlotOrProp(api.slots, "leftLabel", api.merged.leftLabel) && (
          <Label {...api.leftLabelProps}>
            {resolveSlotOrProp({
              name: "leftLabel",
              slots: api.slots,
              fallback: api.merged.leftLabel,
            })}
          </Label>
        )}

        {children}

        {hasSlotOrProp(api.slots, "label", api.merged.label) && (
          <Label {...api.labelProps}>
            {resolveSlotOrProp({
              name: "label",
              slots: api.slots,
              fallback: api.merged.label,
            })}
          </Label>
        )}
      </div>

      {!api.invalidated &&
        hasSlotOrProp(api.slots, "description", api.merged.description) && (
          <p {...api.descriptionBind}>
            {resolveSlotOrProp({
              name: "description",
              slots: api.slots,
              fallback: api.merged.description,
            })}
          </p>
        )}

      {!api.merged.errorless && api.reservesErrorMessageSpace && (
        <p
          {...api.errorMessageBind}
          aria-hidden={api.showErrorMessageContent ? undefined : true}
        >
          {api.showErrorMessageContent &&
            resolveSlotOrProp({
              name: "errorMessage",
              slots: api.slots,
              fallback: api.merged.errorMessage,
            })}
        </p>
      )}
    </div>
  );
}

export default Switcher;
