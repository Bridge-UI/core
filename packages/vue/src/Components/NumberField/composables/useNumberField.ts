// ** External Imports
import { get, isNil } from "es-toolkit/compat";
import { computed, useAttrs, type Ref } from "vue";

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

type NumberFieldRegistryProps = Pick<
  NumberFieldOwnProps,
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

/**
 * Composes `NumberField` form chrome, input bind, registry classes, and stepper logic.
 */
export function useNumberField(
  props: NumberFieldOwnProps,
  model: Ref<null | number | undefined>,
  options: UseNumberFieldOptions = {},
) {
  const attrs = useAttrs();
  const step = computed(() => {
    return props.step ?? 1;
  });

  const registryProps = computed((): NumberFieldRegistryProps => {
    return {
      classes: props.classes,
      controlVariant: props.controlVariant,
    };
  });

  const { entry, merged: numberFieldMerged } = useBridgeUIComponent<
    NumberFieldMerged,
    "NumberField"
  >({
    componentName: "NumberField",
    props: () => registryProps.value,
    libDefaults: {
      controlVariant: "stacked",
    },
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<NumberFieldClasses>({
    entry,
    props: () => registryProps.value,
  });

  const controlVariant = computed(() => {
    return numberFieldMerged.value.controlVariant ?? "stacked";
  });

  const stepper = computed(() => {
    return getNumberFieldStepper(controlVariant.value);
  });

  const controlVariantItem = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      controlVariantProps,
      entry.value?.tokens?.controlVariant,
    );

    return get(classes, controlVariant.value) ?? controlVariantProps.stacked;
  });

  const formField = useFormField(
    () => {
      const {
        min: _min,
        max: _max,
        step: _step,
        classes: _classes,
        defaultValue: _defaultValue,
        controlVariant: _controlVariant,
        ...rest
      } = props;

      return {
        ...attrs,
        ...rest,
        showErrorIcon: false,
        classes: mergedClasses.value,
      };
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
      reservedSlots: () => {
        return stepper.value.isSplit ? ["start", "end"] : ["end"];
      },
    },
  );

  const stepperIconSize = computed(() => {
    return resolveNumberFieldStepperIconSize(
      formField.merged.value.size,
      controlVariant.value,
    );
  });

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

  const currentValue = computed(() => {
    return model.value ?? undefined;
  });

  const stringModel = computed({
    get: () => {
      if (isNil(currentValue.value)) {
        return "";
      }

      return String(currentValue.value);
    },
    set: (raw: null | string | undefined) => {
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
    stepperIconSize,
    controlVariantItem,
    isSplit: computed(() => stepper.value.isSplit),
    decrementIcon: computed(() => stepper.value.decrementIcon),
    incrementIcon: computed(() => stepper.value.incrementIcon),
    incrementFirst: computed(() => stepper.value.incrementFirst),
  };
}
