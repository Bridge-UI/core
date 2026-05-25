// ** External Imports
import { computed, type Ref } from "vue";

export type UseNumberFieldOptions = {
  min?: number;
  max?: number;
  step?: number;
};

export function useNumberField(
  model: Ref<number | null | undefined>,
  options: UseNumberFieldOptions,
) {
  const step = options.step ?? 1;

  const currentValue = computed(() => model.value ?? undefined);

  const inputValue = computed(() => {
    if (currentValue.value === undefined) {
      return undefined;
    }

    return String(currentValue.value);
  });

  const setValue = (next: number) => {
    model.value = next;
  };

  const increment = () => {
    const base = currentValue.value ?? options.min ?? 0;

    const next = base + step;

    if (options.max !== undefined && next > options.max) {
      return;
    }

    setValue(next);
  };

  const decrement = () => {
    const base = currentValue.value ?? options.min ?? 0;

    const next = base - step;

    if (options.min !== undefined && next < options.min) {
      return;
    }

    setValue(next);
  };

  return {
    decrement,
    increment,
    inputValue,
    currentValue,
  };
}
