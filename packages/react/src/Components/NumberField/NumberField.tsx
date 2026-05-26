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
            <div className="flex h-full min-h-0 w-full min-w-9 flex-col gap-px overflow-hidden">
              <button
                type="button"
                onClick={increment}
                aria-label="Increment value"
                disabled={textFieldProps.disabled}
                className={cn({
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary-500/40": true,
                  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50": true,
                  "dark:hover:bg-gray-700/50 dark:hover:text-gray-300 dark:active:bg-gray-600": true,
                  "inline-flex min-h-0 min-w-8 flex-1 items-center justify-center": true,
                  "cursor-pointer rounded-sm text-gray-500 transition-colors": true,
                  "hover:bg-gray-100 hover:text-gray-700 active:bg-gray-200": true,
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
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary-500/40": true,
                  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50": true,
                  "dark:hover:bg-gray-700/50 dark:hover:text-gray-300 dark:active:bg-gray-600": true,
                  "inline-flex min-h-0 min-w-8 flex-1 items-center justify-center": true,
                  "cursor-pointer rounded-sm text-gray-500 transition-colors": true,
                  "hover:bg-gray-100 hover:text-gray-700 active:bg-gray-200": true,
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
