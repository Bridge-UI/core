// ** External Imports
import { get } from "es-toolkit/compat";
import {
  computed,
  provide,
  ref,
  useAttrs,
  useId,
  type Ref,
  type SetupContext,
} from "vue";

// ** Core Imports
import {
  getAdjacentStepperIndex,
  getStepperStepId,
} from "@bridge-ui/core/Domain";
import {
  stepperChromeProps as chromeProps,
  stepperColorProps as colorProps,
  stepperOrientationProps as orientationProps,
  stepperSizeProps as sizeProps,
} from "@bridge-ui/core/Tokens";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  StepperEmits,
  StepperOwnProps,
  StepperProps,
} from "@/Components/Stepper/stepper.types";
import {
  STEPPER_INJECTION_KEY,
  type StepperContextValue,
  type StepperStepMeta,
} from "@/Components/Stepper/stepperInjectionKey";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const stepperBridgeKeys = [
  "size",
  "color",
  "linear",
  "classes",
  "customProps",
  "orientation",
] as const satisfies readonly (keyof StepperOwnProps)[];

type StepperLibDefaults = LibDefaultsShape<
  StepperOwnProps,
  "size" | "color" | "linear" | "orientation"
>;

type StepperMerged = MergeLibDefaults<StepperOwnProps, StepperLibDefaults>;

export function useStepper(
  props: StepperOwnProps,
  libDefaults: StepperLibDefaults,
  model: Ref<number | undefined>,
  emit: SetupContext<StepperEmits>["emit"],
) {
  const vueId = useId();
  const attrs = useAttrs();
  const stepperId = `bridge-stepper${vueId}`;

  const stepIds = ref<string[]>([]);
  const metaMap = new Map<number, StepperStepMeta>();

  const split = computed(() => {
    return splitComponentProps<StepperProps, typeof stepperBridgeKeys>({
      props: { ...attrs, ...props },
      bridgeKeys: stepperBridgeKeys,
    });
  });

  const { merged, entry: bridgeStepper } = useBridgeUIComponent<
    StepperMerged,
    "Stepper"
  >({
    libDefaults,
    componentName: "Stepper",
    props: () => split.value.componentProps,
  });

  const activeStep = computed(() => {
    return model.value ?? 0;
  });

  function registerStep(id: string) {
    if (!stepIds.value.includes(id)) {
      stepIds.value = [...stepIds.value, id];
    }

    return () => {
      stepIds.value = stepIds.value.filter((item) => item !== id);
    };
  }

  function registerStepMeta(index: number, meta: StepperStepMeta) {
    metaMap.set(index, meta);
  }

  function selectStep(index: number) {
    const meta = metaMap.get(index);

    if (meta?.disabled || meta?.clickable === false) {
      return;
    }

    model.value = index;
    emit("update:modelValue", index);
    emit("change", index);
  }

  function focusStep(index: number) {
    document.getElementById(getStepperStepId(stepperId, index))?.focus();
  }

  function getAdjacentIndex(from: number, direction: 1 | -1) {
    const blocked = new Set<number>();

    metaMap.forEach((meta, index) => {
      if (meta.disabled || !meta.clickable) {
        blocked.add(index);
      }
    });

    return getAdjacentStepperIndex(
      stepIds.value.length,
      from,
      direction,
      blocked,
    );
  }

  function getIndex(id: string) {
    return stepIds.value.indexOf(id);
  }

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeStepper,
    props: () => split.value.componentProps,
  });

  const sizeClasses = computed(() => {
    return mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeStepper.value?.tokens?.size,
    );
  });

  const colorClasses = computed(() => {
    return mergeBridgeUILayeredClasses(
      colorProps,
      bridgeStepper.value?.tokens?.color,
    );
  });

  const orientationClasses = computed(() => {
    return mergeBridgeUILayeredClasses(
      orientationProps,
      bridgeStepper.value?.tokens?.orientation,
    );
  });

  const sizeItem = computed(() => {
    return get(sizeClasses.value, merged.value.size);
  });

  const colorItem = computed(() => {
    return get(colorClasses.value, merged.value.color);
  });

  const errorColorItem = computed(() => {
    return get(colorClasses.value, "error");
  });

  const orientationItem = computed(() => {
    return get(orientationClasses.value, merged.value.orientation);
  });

  const contextValue = computed((): StepperContextValue => {
    return {
      getIndex,
      focusStep,
      selectStep,
      registerStep,
      id: stepperId,
      getAdjacentIndex,
      registerStepMeta,
      sizeItem: sizeItem.value,
      colorItem: colorItem.value,
      activeStep: activeStep.value,
      errorColorItem: errorColorItem.value,
      linear: merged.value.linear === true,
      orientationItem: orientationItem.value,
      orientation: String(merged.value.orientation),
    };
  });

  provide(STEPPER_INJECTION_KEY, contextValue);

  const rootBind = computed(() => {
    return mergePartBind(
      merged.value.customProps?.root,
      split.value.inheritedAttrs,
      {
        "aria-label": "Progress",
        class: cn({
          [get(mergedClasses.value, "root") ?? ""]: true,
        }),
      },
    );
  });

  const listBind = computed(() => {
    return mergePartBind(
      merged.value.customProps?.list,
      {},
      {
        class: cn({
          [chromeProps.list]: true,
          [get(orientationItem.value, "list") ?? ""]: true,
          [get(mergedClasses.value, "list") ?? ""]: true,
          "[&>li:last-child_[data-part=connector]]:hidden": true,
        }),
      },
    );
  });

  return {
    merged,
    listBind,
    rootBind,
    contextValue,
  };
}
