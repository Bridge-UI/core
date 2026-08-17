// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { useCallback, useId, useMemo, useRef, useState } from "react";

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
  StepperContextValue,
  StepperStepMeta,
} from "@/Components/Stepper/StepperContext";
import type {
  StepperOwnProps,
  StepperProps,
} from "@/Components/Stepper/stepper.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const stepperBridgeKeys = [
  "size",
  "color",
  "linear",
  "classes",
  "onChange",
  "activeStep",
  "customProps",
  "orientation",
  "defaultActiveStep",
] as const satisfies readonly (keyof StepperOwnProps)[];

type StepperLibDefaults = LibDefaultsShape<
  StepperOwnProps,
  "size" | "color" | "linear" | "orientation"
>;

type StepperMerged = MergeLibDefaults<StepperOwnProps, StepperLibDefaults>;

export function useStepper(
  props: StepperProps,
  libDefaults: StepperLibDefaults,
) {
  const reactId = useId();
  const stepperId = `bridge-stepper${reactId.replace(/:/g, "")}`;

  const counterRef = useRef(0);
  const metaRef = useRef<Map<number, StepperStepMeta>>(new Map());

  counterRef.current = 0;
  metaRef.current = new Map();

  const { componentProps, inheritedAttrs } = splitComponentProps<
    StepperProps,
    typeof stepperBridgeKeys
  >({
    props,
    bridgeKeys: stepperBridgeKeys,
  });

  const { merged, entry: bridgeStepper } = useBridgeUIComponent<
    StepperMerged,
    "Stepper"
  >({
    libDefaults,
    props: componentProps,
    componentName: "Stepper",
  });

  const isControlled = derived(() => {
    return props.activeStep !== undefined;
  });

  const [uncontrolled, setUncontrolled] = useState(
    () => props.defaultActiveStep ?? 0,
  );

  const activeStep = derived(() => {
    return isControlled ? (props.activeStep ?? 0) : uncontrolled;
  });

  const children = derived(() => {
    return props.children;
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["children", "onChange"]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeStepper,
    props: componentProps,
  });

  const sizeClasses = useMemo(() => {
    return mergeBridgeUILayeredClasses(sizeProps, bridgeStepper?.tokens?.size);
  }, [bridgeStepper?.tokens?.size]);

  const colorClasses = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      colorProps,
      bridgeStepper?.tokens?.color,
    );
  }, [bridgeStepper?.tokens?.color]);

  const orientationClasses = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      orientationProps,
      bridgeStepper?.tokens?.orientation,
    );
  }, [bridgeStepper?.tokens?.orientation]);

  const sizeItem = derived(() => {
    return get(sizeClasses, merged.size);
  });

  const colorItem = derived(() => {
    return get(colorClasses, merged.color);
  });

  const errorColorItem = derived(() => {
    return get(colorClasses, "error");
  });

  const orientationItem = derived(() => {
    return get(orientationClasses, merged.orientation);
  });

  const takeIndex = useCallback(() => {
    const index = counterRef.current;
    counterRef.current += 1;

    return index;
  }, []);

  const registerStepMeta = useCallback(
    (index: number, meta: StepperStepMeta) => {
      metaRef.current.set(index, meta);
    },
    [],
  );

  const selectStep = useCallback(
    (index: number) => {
      const meta = metaRef.current.get(index);

      if (meta?.disabled || meta?.clickable === false) {
        return;
      }

      if (!isControlled) {
        setUncontrolled(index);
      }

      merged.onChange?.(index);
    },
    [isControlled, merged],
  );

  const focusStep = useCallback(
    (index: number) => {
      document.getElementById(getStepperStepId(stepperId, index))?.focus();
    },
    [stepperId],
  );

  const getAdjacentIndex = useCallback((from: number, direction: 1 | -1) => {
    const blocked = new Set<number>();

    metaRef.current.forEach((meta, index) => {
      if (meta.disabled || !meta.clickable) {
        blocked.add(index);
      }
    });

    return getAdjacentStepperIndex(
      counterRef.current,
      from,
      direction,
      blocked,
    );
  }, []);

  const contextValue = useMemo((): StepperContextValue => {
    return {
      sizeItem,
      colorItem,
      takeIndex,
      focusStep,
      selectStep,
      activeStep,
      id: stepperId,
      errorColorItem,
      orientationItem,
      getAdjacentIndex,
      registerStepMeta,
      linear: merged.linear === true,
      orientation: String(merged.orientation),
    };
  }, [
    activeStep,
    colorItem,
    errorColorItem,
    focusStep,
    getAdjacentIndex,
    merged.linear,
    merged.orientation,
    orientationItem,
    registerStepMeta,
    selectStep,
    sizeItem,
    stepperId,
    takeIndex,
  ]);

  const rootBind = derived(() => {
    return mergePartBind(customProps?.root, rootInheritedAttrs, {
      "aria-label": "Progress",
      className: cn({
        [get(mergedClasses, "root") ?? ""]: true,
      }),
    });
  });

  const listBind = derived(() => {
    return mergePartBind(
      customProps?.list,
      {},
      {
        className: cn({
          [chromeProps.list]: true,
          [get(sizeItem, "track") ?? ""]: true,
          [get(orientationItem, "list") ?? ""]: true,
          [get(mergedClasses, "list") ?? ""]: true,
          "[&>li:last-child_[data-part=connector]]:hidden": true,
        }),
      },
    );
  });

  return {
    merged,
    children,
    listBind,
    rootBind,
    contextValue,
  };
}
