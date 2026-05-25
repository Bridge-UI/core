// ** External Imports
import { ChevronDown, ChevronUp } from "lucide-react";
import { Fragment } from "react";

// ** Core Imports
import { cn } from "@bridge-ui/core";

// ** Local Imports
import { Icon } from "@/Components/Icon";
import { useNumberField } from "@/Components/NumberField/hooks/useNumberField";
import type { NumberFieldProps } from "@/Components/NumberField/numberField.types";
import { TextField } from "@/Components/TextField";

function NumberField(props: NumberFieldProps) {
  const {
    min,
    max,
    slots,
    value,
    classes,
    onChange,
    step = 1,
    partsProps,
    defaultValue,
    ...textFieldProps
  } = props;

  const { increment, decrement, handleChange, inputValue } = useNumberField({
    min,
    max,
    step,
    value,
    onChange,
    defaultValue,
  });

  return (
    <TextField
      {...textFieldProps}
      min={min}
      max={max}
      step={step}
      type="number"
      classes={classes}
      value={inputValue}
      withErrorIcon={false}
      onChange={handleChange}
      partsProps={{
        ...partsProps,
        input: {
          ...partsProps?.input,
          className: cn({
            "appearance:textfield [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none": true,
            [partsProps?.input?.className ?? ""]: true,
          }),
        },
      }}
      slots={{
        ...slots,
        end: (
          <Fragment>
            <div className="flex min-h-0 flex-1 flex-col self-stretch py-0.5 pe-0.5">
              <button
                type="button"
                onClick={increment}
                aria-label="Increment value"
                disabled={textFieldProps.disabled}
                className={cn({
                  "inline-flex flex-1 items-center justify-center text-gray-500 transition-colors": true,
                  "disabled:pointer-events-none disabled:opacity-50": true,
                  "hover:text-gray-700 dark:hover:text-gray-300": true,
                  [classes?.increment ?? ""]: true,
                })}
              >
                <Icon icon={ChevronUp} size={textFieldProps.size ?? "md"} />
              </button>

              <button
                type="button"
                onClick={decrement}
                disabled={textFieldProps.disabled}
                aria-label="Decrement value"
                className={cn({
                  "inline-flex flex-1 items-center justify-center text-gray-500 transition-colors": true,
                  "disabled:pointer-events-none disabled:opacity-50": true,
                  "hover:text-gray-700 dark:hover:text-gray-300": true,
                  [classes?.decrement ?? ""]: true,
                })}
              >
                <Icon icon={ChevronDown} size={textFieldProps.size ?? "md"} />
              </button>
            </div>
          </Fragment>
        ),
      }}
    />
  );
}

export default NumberField;
