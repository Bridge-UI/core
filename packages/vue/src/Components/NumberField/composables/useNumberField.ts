// ** External Imports
import { isNil } from "es-toolkit/compat";
import { computed, useAttrs, type Ref } from "vue";

// ** Core Imports
import { cn } from "@bridge-ui/core";

// ** Local Imports
import { useFormField } from "@/Components/FormField/composables/useFormField";
import type {
  NumberFieldClasses,
  NumberFieldOwnProps,
} from "@/Components/NumberField/numberField.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

export type UseNumberFieldOptions = {
  onChange?: (value: number) => void;
};

/**
 * Composes `NumberField` form chrome, input bind, registry classes, and stepper logic.
 */
export function useNumberField(
  props: NumberFieldOwnProps,
  model: Ref<number | null | undefined>,
  options: UseNumberFieldOptions = {},
) {
  const attrs = useAttrs();
  const step = computed(() => props.step ?? 1);

  const { entry } = useBridgeUIComponent<
    Pick<NumberFieldOwnProps, "classes">,
    "NumberField"
  >({
    componentName: "NumberField",
    props: () => ({ classes: props.classes }),
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<NumberFieldClasses>({
    entry,
    props: () => ({ classes: props.classes }),
  });

  const formField = useFormField(
    () => {
      const {
        min: _min,
        max: _max,
        step: _step,
        classes: _classes,
        ...rest
      } = props;

      return {
        ...attrs,
        ...rest,
        withErrorIcon: false,
        classes: mergedClasses.value,
      };
    },
    {
      size: "md",
      rounded: "md",
      color: "primary",
      variant: "outline",
      withErrorIcon: false,
    },
    {
      reservedSlots: () => ["end"],
    },
  );

  const inputBind = computed(() => {
    return mergePartBind(
      formField.inputBind.value,
      {
        min: props.min,
        max: props.max,
        type: "number",
        step: step.value,
      },
      cn({
        "appearance:textfield [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none": true,
      }),
    );
  });

  const currentValue = computed(() => model.value ?? undefined);

  const stringModel = computed({
    get: () => {
      if (isNil(currentValue.value)) {
        return undefined;
      }

      return String(currentValue.value);
    },
    set: (raw: string | null | undefined) => {
      if (raw === "" || isNil(raw)) {
        model.value = undefined;

        return;
      }

      const parsed = Number(raw);

      if (!Number.isNaN(parsed)) {
        model.value = parsed;
        options.onChange?.(parsed);
      }
    },
  });

  const setValue = (next: number) => {
    model.value = next;
    options.onChange?.(next);
  };

  const increment = (): boolean => {
    const base = currentValue.value ?? props.min ?? 0;
    const next = base + step.value;

    if (!isNil(props.max) && next > props.max) {
      return false;
    }

    setValue(next);

    return true;
  };

  const decrement = (): boolean => {
    const base = currentValue.value ?? props.min ?? 0;
    const next = base - step.value;

    if (!isNil(props.min) && next < props.min) {
      return false;
    }

    setValue(next);

    return true;
  };

  return {
    decrement,
    formField,
    increment,
    inputBind,
    stringModel,
    mergedClasses,
  };
}
