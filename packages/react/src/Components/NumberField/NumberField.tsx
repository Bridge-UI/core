// ** External Imports
import { ChevronDown, ChevronUp } from "lucide-react";
import { Fragment } from "react";

// ** Core Imports
import {
  fieldStepperButtonClasses,
  numberFieldStepperWrapperClasses,
  resolveStepperIconSize,
} from "@/Components/TextField/fieldAdornment";
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
            <div className={numberFieldStepperWrapperClasses}>
              <button
                type="button"
                onClick={increment}
                aria-label="Increment value"
                disabled={textFieldProps.disabled}
                className={cn(fieldStepperButtonClasses, classes?.increment)}
              >
                <Icon
                  icon={ChevronUp}
                  size={resolveStepperIconSize(textFieldProps.size)}
                />
              </button>

              <button
                type="button"
                onClick={decrement}
                disabled={textFieldProps.disabled}
                aria-label="Decrement value"
                className={cn(fieldStepperButtonClasses, classes?.decrement)}
              >
                <Icon
                  icon={ChevronDown}
                  size={resolveStepperIconSize(textFieldProps.size)}
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
