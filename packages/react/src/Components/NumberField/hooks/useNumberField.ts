// ** External Imports
import { isEmpty, isNaN, isNil, isNumber, isString } from "es-toolkit/compat";
import type { ChangeEvent } from "react";
import { useCallback, useRef, useState } from "react";

// ** Local Imports
import type { NumberFieldProps } from "@/Components/NumberField/numberField.types";

type UseNumberFieldOptions = Pick<
  NumberFieldProps,
  "max" | "min" | "step" | "value" | "onChange" | "defaultValue"
>;

function toNumericValue(
  raw: NumberFieldProps["value"] | NumberFieldProps["defaultValue"],
): number | undefined {
  if (isNil(raw)) {
    return undefined;
  }

  if (isNumber(raw)) {
    return isNaN(raw) ? undefined : raw;
  }

  if (isString(raw)) {
    if (isEmpty(raw)) {
      return undefined;
    }

    const parsed = Number(raw);

    return isNaN(parsed) ? undefined : parsed;
  }

  return undefined;
}

export function useNumberField(options: UseNumberFieldOptions) {
  const { min, max, value, onChange, step = 1, defaultValue } = options;

  const [internalValue, setInternalValue] = useState<number | undefined>(() => {
    return toNumericValue(defaultValue);
  });

  const controlledValue = toNumericValue(value);
  const currentValue = controlledValue ?? internalValue;

  const currentValueRef = useRef(currentValue);
  currentValueRef.current = currentValue;

  const setValue = useCallback(
    (next: number) => {
      currentValueRef.current = next;

      if (isNil(controlledValue)) {
        setInternalValue(next);
      }

      onChange?.(next);
    },
    [onChange, controlledValue],
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value;

      if (raw === "") {
        if (isNil(controlledValue)) {
          setInternalValue(undefined);
        }

        return;
      }

      const parsed = Number(raw);

      if (isNaN(parsed)) {
        return;
      }

      setValue(parsed);
    },
    [setValue, controlledValue],
  );

  const increment = useCallback((): boolean => {
    const base = currentValueRef.current ?? min ?? 0;

    const next = base + step;

    if (!isNil(max) && next > max) {
      return false;
    }

    setValue(next);

    return true;
  }, [max, min, step, setValue]);

  const decrement = useCallback((): boolean => {
    const base = currentValueRef.current ?? min ?? 0;

    const next = base - step;

    if (!isNil(min) && next < min) {
      return false;
    }

    setValue(next);

    return true;
  }, [min, step, setValue]);

  const inputValue = isNil(currentValue) ? undefined : String(currentValue);

  return {
    decrement,
    increment,
    inputValue,
    currentValue,
    handleChange,
  };
}
