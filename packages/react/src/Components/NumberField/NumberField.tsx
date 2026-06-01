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
    classes,
    rounded,
    variant,
    onChange,
    step = 1,
    modelValue,
    partsProps,
    ...textFieldProps
  } = props;

  const mergedClasses = useNumberFieldClasses({ classes });

  const { increment, decrement, handleChange, inputValue } = useNumberField({
    min,
    max,
    step,
    onChange,
    modelValue,
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
      partsProps={{
        ...partsProps,
        input: {
          ...partsProps?.input,
          className: cn(
            "appearance:textfield [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
            partsProps?.input?.className,
          ),
        },
      }}
      slots={{
        ...slots,
        end: (
          <Fragment>
            <div
              className={cn(
                "bridge-end-adornment flex h-full min-w-9 flex-col gap-px overflow-hidden",
              )}
            >
              <button
                type="button"
                {...incrementHold.handlers}
                aria-label="Increment value"
                disabled={textFieldProps.disabled}
                className={cn(
                  "inline-flex min-h-0 min-w-8 flex-1 items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800",
                  mergedClasses.increment,
                )}
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
                className={cn(
                  "inline-flex min-h-0 min-w-8 flex-1 items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800",
                  mergedClasses.decrement,
                )}
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
