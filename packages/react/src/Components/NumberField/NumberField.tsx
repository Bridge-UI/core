import { ChevronDown, ChevronUp } from "lucide-react";
import { Fragment } from "react";

// ** Core Imports
import { cn } from "@bridge-ui/core";

// ** Local Imports
import { Icon } from "@/Components/Icon";
import { useNumberField } from "@/Components/NumberField/hooks/useNumberField";
import { useNumberFieldClasses } from "@/Components/NumberField/hooks/useNumberFieldClasses";
import type { NumberFieldProps } from "@/Components/NumberField/numberField.types";
import { TextField } from "@/Components/TextField";
import { resolveFieldAdornmentIconSize, useHoldRepeat } from "@/Utils";

function NumberField(props: NumberFieldProps) {
  const {
    min,
    max,
    color,
    error,
    slots,
    value,
    classes,
    rounded,
    variant,
    onChange,
    step = 1,
    customProps,
    defaultValue,
    ...textFieldProps
  } = props;

  const mergedClasses = useNumberFieldClasses({ classes });

  const { increment, decrement, inputValue, handleChange } = useNumberField({
    min,
    max,
    step,
    value,
    onChange,
    defaultValue,
  });

  const incrementHold = useHoldRepeat(increment, {
    disabled: textFieldProps.disabled,
  });

  const decrementHold = useHoldRepeat(decrement, {
    disabled: textFieldProps.disabled,
  });

  return (
    <TextField
      {...textFieldProps}
      min={min}
      max={max}
      step={step}
      type="number"
      color={color}
      error={error}
      rounded={rounded}
      variant={variant}
      value={inputValue}
      withErrorIcon={false}
      classes={mergedClasses}
      onChange={handleChange}
      customProps={{
        ...customProps,
        input: {
          ...customProps?.input,
          className: cn({
            "appearance:textfield [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none": true,
            [customProps?.input?.className ?? ""]: true,
          }),
        },
      }}
      slots={{
        ...slots,
        end: (
          <Fragment>
            <div className="bridge-end-adornment flex h-full min-w-9 flex-col gap-px overflow-hidden">
              <button
                type="button"
                {...incrementHold.handlers}
                aria-label="Increment value"
                disabled={textFieldProps.disabled}
                className={cn({
                  "bridge-field-adornment-button inline-flex min-h-0 min-w-8 flex-1 items-center justify-center": true,
                  [mergedClasses.increment ?? ""]: true,
                })}
              >
                <Icon
                  icon={ChevronUp}
                  size={resolveFieldAdornmentIconSize(textFieldProps.size)}
                />
              </button>

              <button
                type="button"
                {...decrementHold.handlers}
                aria-label="Decrement value"
                disabled={textFieldProps.disabled}
                className={cn({
                  "bridge-field-adornment-button inline-flex min-h-0 min-w-8 flex-1 items-center justify-center": true,
                  [mergedClasses.decrement ?? ""]: true,
                })}
              >
                <Icon
                  icon={ChevronDown}
                  size={resolveFieldAdornmentIconSize(textFieldProps.size)}
                />
              </button>
            </div>
          </Fragment>
        ),
      }}
    />
  );
}

export default NumberField;
