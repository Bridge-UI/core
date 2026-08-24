// ** External Imports
import {
  get,
  isEmpty,
  isNaN,
  isNil,
  isNumber,
  isString,
} from "es-toolkit/compat";
import type { ChangeEvent } from "react";
import { useCallback, useMemo, useRef, useState } from "react";

// ** Core Imports
import {
  getNumberFieldStepper,
  resolveNumberFieldStepperIconSize,
} from "@bridge-ui/core/Domain";
import { numberFieldControlVariantProps as controlVariantProps } from "@bridge-ui/core/Tokens";
import {
  cn,
  mergeBridgeUILayeredClasses,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import { useFormField } from "@/Components/FormField/hooks/useFormField";
import type {
  NumberFieldClasses,
  NumberFieldProps,
} from "@/Components/NumberField/numberField.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

type NumberFieldRegistryProps = Pick<
  NumberFieldProps,
  "classes" | "controlVariant"
>;

type NumberFieldLibDefaults = LibDefaultsShape<
  NumberFieldRegistryProps,
  "controlVariant"
>;

type NumberFieldMerged = MergeLibDefaults<
  NumberFieldRegistryProps,
  NumberFieldLibDefaults
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

/**
 * Composes `NumberField` form chrome, input bind, registry classes, and stepper logic.
 */
export function useNumberField(props: NumberFieldProps) {
  const {
    min,
    max,
    value,
    slots,
    classes,
    onChange,
    step = 1,
    customProps,
    defaultValue,
    controlVariant: controlVariantProp,
    ...formFieldProps
  } = props;

  const registryProps = useMemo((): NumberFieldRegistryProps => {
    return {
      classes,
      controlVariant: controlVariantProp,
    };
  }, [classes, controlVariantProp]);

  const { entry, merged: numberFieldMerged } = useBridgeUIComponent<
    NumberFieldMerged,
    "NumberField"
  >({
    props: registryProps,
    componentName: "NumberField",
    libDefaults: {
      controlVariant: "stacked",
    },
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<NumberFieldClasses>({
    entry,
    props: registryProps,
  });

  const controlVariant = numberFieldMerged.controlVariant ?? "stacked";

  const controlVariantClasses = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      controlVariantProps,
      entry?.tokens?.controlVariant,
    );
  }, [entry?.tokens?.controlVariant]);

  const controlVariantItem = derived(() => {
    return (
      get(controlVariantClasses, controlVariant) ?? controlVariantProps.stacked
    );
  });

  const stepper = getNumberFieldStepper(controlVariant);

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

  const formField = useFormField(
    {
      ...formFieldProps,
      slots,
      showErrorIcon: false,
      classes: mergedClasses,
    },
    {
      size: "md",
      rounded: "md",
      color: "primary",
      variant: "outline",
      showErrorIcon: false,
    },
    {
      componentName: "NumberField",
      reservedSlots: () => (stepper.isSplit ? ["start", "end"] : ["end"]),
    },
  );

  const stepperIconSize = resolveNumberFieldStepperIconSize(
    formField.merged.size,
    controlVariant,
  );

  const inputBind = derived(() => {
    return mergePartBind(
      formField.inputBind,
      {
        min,
        max,
        step,
        type: "number",
        onChange: handleChange,
        value: isNil(currentValue) ? "" : String(currentValue),
      },
      cn({
        "appearance:textfield [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none": true,
        [customProps?.input?.className ?? ""]: true,
      }),
    );
  });

  return {
    decrement,
    formField,
    increment,
    inputBind,
    mergedClasses,
    stepperIconSize,
    controlVariantItem,
    isSplit: stepper.isSplit,
    decrementIcon: stepper.decrementIcon,
    incrementIcon: stepper.incrementIcon,
    incrementFirst: stepper.incrementFirst,
  };
}
