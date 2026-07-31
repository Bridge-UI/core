// ** External Imports
import { ChevronDown, ChevronUp } from "lucide-react";
import { Fragment } from "react";

// ** Core Imports
import { cn } from "@bridge-ui/core";

// ** Local Imports
import { FormField } from "@/Components/FormField";
import { Icon } from "@/Components/Icon";
import { useNumberField } from "@/Components/NumberField/hooks/useNumberField";
import type { NumberFieldProps } from "@/Components/NumberField/numberField.types";
import {
  mergePartBind,
  resolveFieldAdornmentIconSize,
  useHoldRepeat,
} from "@/Utils";

function NumberField(props: NumberFieldProps) {
  const { formField, increment, decrement, inputBind, mergedClasses } =
    useNumberField(props);

  const incrementHold = useHoldRepeat(increment, {
    disabled: props.disabled,
  });

  const decrementHold = useHoldRepeat(decrement, {
    disabled: props.disabled,
  });

  const incrementProps = props.customProps?.increment;
  const decrementProps = props.customProps?.decrement;
  const incrementIconProps = props.customProps?.incrementIcon;
  const decrementIconProps = props.customProps?.decrementIcon;
  const stepperIconSize = resolveFieldAdornmentIconSize(props.size);

  return (
    <FormField
      field={{
        ...formField,
        slots: {
          ...props.slots,
          end: (
            <Fragment>
              <div className="bridge-end-adornment flex h-full min-w-9 flex-col gap-px overflow-hidden">
                <button
                  {...mergePartBind(
                    incrementProps,
                    {
                      type: "button",
                      disabled: props.disabled,
                      "aria-label": "Increment value",
                      ...incrementHold.handlers,
                    },
                    cn({
                      "bridge-field-adornment-button inline-flex min-h-0 min-w-8 flex-1 items-center justify-center": true,
                      [mergedClasses.increment ?? ""]: true,
                    }),
                  )}
                >
                  <Icon
                    icon={ChevronUp}
                    size={stepperIconSize}
                    {...incrementIconProps}
                  />
                </button>

                <button
                  {...mergePartBind(
                    decrementProps,
                    {
                      type: "button",
                      disabled: props.disabled,
                      "aria-label": "Decrement value",
                      ...decrementHold.handlers,
                    },
                    cn({
                      "bridge-field-adornment-button inline-flex min-h-0 min-w-8 flex-1 items-center justify-center": true,
                      [mergedClasses.decrement ?? ""]: true,
                    }),
                  )}
                >
                  <Icon
                    icon={ChevronDown}
                    size={stepperIconSize}
                    {...decrementIconProps}
                  />
                </button>
              </div>
            </Fragment>
          ),
        },
      }}
    >
      <input {...inputBind} />
    </FormField>
  );
}

export default NumberField;
