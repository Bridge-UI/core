// ** Local Imports
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

        {(hasSlotOrProp(api.slots, "endLabel", api.merged.endLabel) ||
          hasSlotOrProp(api.slots, "mainLabel", api.merged.mainLabel)) && (
          <label {...api.mainLabelBind}>
            {hasSlotOrProp(api.slots, "mainLabel", api.merged.mainLabel)
              ? resolveSlotOrProp({
                  name: "mainLabel",
                  slots: api.slots,
                  fallback: api.merged.mainLabel,
                })
              : resolveSlotOrProp({
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

      {api.reservesErrorMessageSpace && (
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

export default Switcher;
