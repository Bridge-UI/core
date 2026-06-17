import { isNil } from "es-toolkit/compat";
import { computed, type Ref } from "vue";

export type UseNumberFieldOptions = {
  max?: number;
  min?: number;
  onChange?: (value: number) => void;
  step?: number;
};

export function useNumberField(
  model: Ref<number | null | undefined>,
  options: UseNumberFieldOptions,
) {
  const step = options.step ?? 1;

  const currentValue = computed(() => model.value ?? undefined);

  const inputValue = computed(() => {
    if (isNil(currentValue.value)) {
      return undefined;
    }

    return String(currentValue.value);
  });

  const setValue = (next: number) => {
    model.value = next;
    options.onChange?.(next);
  };

  const increment = (): boolean => {
    const base = currentValue.value ?? options.min ?? 0;

    const next = base + step;

    if (!isNil(options.max) && next > options.max) {
      return false;
    }

    setValue(next);

    return true;
  };

  const decrement = (): boolean => {
    const base = currentValue.value ?? options.min ?? 0;

    const next = base - step;

    if (!isNil(options.min) && next < options.min) {
      return false;
    }

    setValue(next);

    return true;
  };

  return {
    decrement,
    increment,
    inputValue,
    currentValue,
  };
}
