import type { ChangeEvent } from "react";
import { useCallback, useRef, useState } from "react";

// ** Local Imports
import type { NumberFieldProps } from "@/Components/NumberField/numberField.types";

type UseNumberFieldOptions = Pick<
  NumberFieldProps,
  "modelValue" | "onChange" | "min" | "max" | "step"
>;

export function useNumberField(options: UseNumberFieldOptions) {
  const { min, max, modelValue, onChange, step = 1 } = options;

  const [internalValue, setInternalValue] = useState<number | undefined>(
    undefined,
  );

  const currentValue = modelValue ?? internalValue;

  const currentValueRef = useRef(currentValue);
  currentValueRef.current = currentValue;

  const setValue = useCallback(
    (next: number) => {
      currentValueRef.current = next;

      if (modelValue === undefined) {
        setInternalValue(next);
      }

      onChange?.(next);
    },
    [modelValue, onChange],
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value;

      if (raw === "") {
        if (modelValue === undefined) {
          setInternalValue(undefined);
        }

        return;
      }

      const parsed = Number(raw);

      if (Number.isNaN(parsed)) {
        return;
      }

      setValue(parsed);
    },
    [modelValue, setValue],
  );

  const increment = useCallback((): boolean => {
    const base = currentValueRef.current ?? min ?? 0;

    const next = base + step;

    if (max !== undefined && next > max) {
      return false;
    }

    setValue(next);

    return true;
  }, [max, min, step, setValue]);

  const decrement = useCallback((): boolean => {
    const base = currentValueRef.current ?? min ?? 0;

    const next = base - step;

    if (min !== undefined && next < min) {
      return false;
    }

    setValue(next);

    return true;
  }, [min, step, setValue]);

  const inputValue =
    currentValue === undefined ? undefined : String(currentValue);

  return {
    decrement,
    increment,
    inputValue,
    currentValue,
    handleChange,
  };
}
