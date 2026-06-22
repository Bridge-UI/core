import { ChevronDown, ChevronUp } from "lucide-react";
import { Fragment } from "react";

// ** Core Imports
import { cn } from "@bridge-ui/core";

// ** Local Imports
import { FormField } from "@/Components/FormField";
import { Icon } from "@/Components/Icon";
import { useNumberField } from "@/Components/NumberField/hooks/useNumberField";
import type { NumberFieldProps } from "@/Components/NumberField/numberField.types";
import { resolveFieldAdornmentIconSize, useHoldRepeat } from "@/Utils";

function NumberField(props: NumberFieldProps) {
  const { formField, increment, decrement, inputBind, mergedClasses } =
    useNumberField(props);

  const incrementHold = useHoldRepeat(increment, {
    disabled: props.disabled,
  });

  const decrementHold = useHoldRepeat(decrement, {
    disabled: props.disabled,
  });

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
                  type="button"
                  disabled={props.disabled}
                  {...incrementHold.handlers}
                  aria-label="Increment value"
                  className={cn({
                    "bridge-field-adornment-button inline-flex min-h-0 min-w-8 flex-1 items-center justify-center": true,
                    [mergedClasses.increment ?? ""]: true,
                  })}
                >
                  <Icon
                    icon={ChevronUp}
                    size={resolveFieldAdornmentIconSize(props.size)}
                  />
                </button>

                <button
                  type="button"
                  disabled={props.disabled}
                  {...decrementHold.handlers}
                  aria-label="Decrement value"
                  className={cn({
                    "bridge-field-adornment-button inline-flex min-h-0 min-w-8 flex-1 items-center justify-center": true,
                    [mergedClasses.decrement ?? ""]: true,
                  })}
                >
                  <Icon
                    icon={ChevronDown}
                    size={resolveFieldAdornmentIconSize(props.size)}
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
