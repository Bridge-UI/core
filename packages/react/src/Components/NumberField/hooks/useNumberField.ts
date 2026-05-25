// ** External Imports
import type { ChangeEvent } from "react";
import { useCallback, useState } from "react";

// ** Local Imports
import type { NumberFieldProps } from "@/Components/NumberField/numberField.types";

type UseNumberFieldOptions = Pick<
  NumberFieldProps,
  "value" | "onChange" | "min" | "max" | "step" | "defaultValue"
>;

export function useNumberField(options: UseNumberFieldOptions) {
  const { min, max, value, onChange, step = 1, defaultValue } = options;

  const [internalValue, setInternalValue] = useState<number | undefined>(() => {
    if (defaultValue === undefined) {
      return undefined;
    }

    return Number(defaultValue);
  });

  const currentValue = value ?? internalValue;

  const setValue = useCallback(
    (next: number) => {
      if (value === undefined) {
        setInternalValue(next);
      }

      onChange?.(next);
    },
    [value, onChange],
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value;

      if (raw === "") {
        if (value === undefined) {
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
    [value, setValue],
  );

  const increment = useCallback(() => {
    const base = currentValue ?? min ?? 0;

    const next = base + step;

    if (max !== undefined && next > max) {
      return;
    }

    setValue(next);
  }, [max, min, step, setValue, currentValue]);

  const decrement = useCallback(() => {
    const base = currentValue ?? min ?? 0;

    const next = base - step;

    if (min !== undefined && next < min) {
      return;
    }

    setValue(next);
  }, [min, step, setValue, currentValue]);

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
