// ** External Imports
import { get } from "es-toolkit/compat";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Fragment } from "react";

// ** Core Imports
import { cn } from "@bridge-ui/core";
import type { IconSize } from "@bridge-ui/core/Components/Icon";
import type { TextFieldSize } from "@bridge-ui/core/Components/TextField";

// ** Local Imports
import { Icon } from "@/Components/Icon";
import { useNumberField } from "@/Components/NumberField/hooks/useNumberField";
import type { NumberFieldProps } from "@/Components/NumberField/numberField.types";
import { TextField } from "@/Components/TextField";
import { useTextFieldEndAdornment } from "@/Utils";

// prettier-ignore
function resolveStepperIconSize(fieldSize?: keyof TextFieldSize) {
  return get({
    "2xs": "xs",
    "xs": "xs",
    "sm": "sm",
    "md": "md",
    "lg": "md",
    "xl": "lg",
    "2xl": "lg",
  }, fieldSize ?? "md") as keyof IconSize;
}

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

  const { endAdornmentShellClass, endAdornmentButtonClass } =
    useTextFieldEndAdornment(
      {
        color,
        error,
        rounded,
        variant,
      },
      {
        rounded: "md",
        color: "primary",
        variant: "outline",
      },
    );

  return (
    <TextField
      {...textFieldProps}
      min={min}
      max={max}
      step={step}
      type="number"
      color={color}
      error={error}
      classes={classes}
      rounded={rounded}
      variant={variant}
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
            <div
              className={cn({
                [endAdornmentShellClass]: true,
                "flex min-w-9 flex-col gap-px overflow-hidden": true,
              })}
            >
              <button
                type="button"
                onClick={increment}
                aria-label="Increment value"
                disabled={textFieldProps.disabled}
                className={cn({
                  "min-h-0 min-w-8 flex-1": true,
                  [endAdornmentButtonClass]: true,
                  [classes?.increment ?? ""]: true,
                })}
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
                className={cn({
                  "min-h-0 min-w-8 flex-1": true,
                  [endAdornmentButtonClass]: true,
                  [classes?.decrement ?? ""]: true,
                })}
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
