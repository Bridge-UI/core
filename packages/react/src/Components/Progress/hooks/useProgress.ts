// ** External Imports
import { get, isNil } from "es-toolkit/compat";
import { useMemo } from "react";

// ** Core Imports
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import {
  colorProps,
  roundedProps,
  sizeProps,
  variantProps,
} from "@bridge-ui/core/Components/Progress";

// ** Local Imports
import type {
  ProgressClasses,
  ProgressOwnProps,
  ProgressProps,
} from "@/Components/Progress/progress.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const progressBridgeKeys = [
  "size",
  "color",
  "value",
  "classes",
  "rounded",
  "variant",
  "customProps",
  "valueBuffer",
] as const satisfies readonly (keyof ProgressOwnProps)[];

type ProgressLibDefaults = LibDefaultsShape<
  ProgressOwnProps,
  "size" | "color" | "rounded" | "variant"
>;

type ProgressMerged = MergeLibDefaults<ProgressOwnProps, ProgressLibDefaults>;

/**
 * Clamps a progress value into the 0–100 range.
 */
function clampProgress(value: number | undefined): number {
  if (isNil(value) || Number.isNaN(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, value));
}

export function useProgress(
  props: ProgressProps,
  libDefaults: ProgressLibDefaults,
) {
  const { componentProps, inheritedAttrs } = splitComponentProps<
    ProgressProps,
    typeof progressBridgeKeys
  >({
    props,
    bridgeKeys: progressBridgeKeys,
  });

  const { merged, entry: bridgeProgress } = useBridgeUIComponent<
    ProgressMerged,
    "Progress"
  >({
    libDefaults,
    props: componentProps,
    componentName: "Progress",
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<ProgressClasses>({
    entry: bridgeProgress,
    props: componentProps,
  });

  const customProps = derived(() => merged.customProps);

  const colorPalette = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeProgress?.customProps?.color,
    );

    return get(classes, merged.color);
  }, [merged.color, bridgeProgress?.customProps?.color]);

  const sizeClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeProgress?.customProps?.size,
    );

    return get(classes, merged.size);
  }, [merged.size, bridgeProgress?.customProps?.size]);

  const roundedClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeProgress?.customProps?.rounded,
    );

    return get(classes, merged.rounded);
  }, [merged.rounded, bridgeProgress?.customProps?.rounded]);

  const variantClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeProgress?.customProps?.variant,
    );

    return get(classes, merged.variant);
  }, [merged.variant, bridgeProgress?.customProps?.variant]);

  const isBuffer = derived(() => {
    return merged.variant === "buffer";
  });

  const clampedValue = derived(() => {
    return clampProgress(merged.value);
  });

  const clampedBuffer = derived(() => {
    return clampProgress(merged.valueBuffer);
  });

  const isDeterminate = derived(() => {
    return merged.variant === "determinate" || merged.variant === "buffer";
  });

  const isAnimated = derived(() => {
    return merged.variant === "indeterminate" || merged.variant === "query";
  });

  const rootBind = derived(() => {
    return mergePartBind(customProps?.root, inheritedAttrs, {
      role: "progressbar",
      ...(isDeterminate
        ? {
            "aria-valuemin": 0,
            "aria-valuemax": 100,
            "aria-valuenow": clampedValue,
          }
        : {}),
      className: cn({
        "relative w-full overflow-hidden": true,
        [sizeClass ?? ""]: true,
        [roundedClass ?? ""]: true,
        [mergedClasses.root ?? ""]: true,
      }),
    });
  });

  const trackBind = derived(() => {
    return mergePartBind(
      customProps?.track,
      {},
      cn({
        "absolute inset-0": true,
        [colorPalette?.track ?? ""]: true,
        [roundedClass ?? ""]: true,
        [mergedClasses.track ?? ""]: true,
      }),
    );
  });

  const bufferBind = derived(() => {
    if (!isBuffer) {
      return null;
    }

    return mergePartBind(
      customProps?.buffer,
      {
        style: { width: `${clampedBuffer}%` },
      },
      cn({
        "absolute top-0 left-0 h-full transition-[width] duration-200 ease-linear": true,
        [colorPalette?.buffer ?? ""]: true,
        [roundedClass ?? ""]: true,
        [mergedClasses.buffer ?? ""]: true,
      }),
    );
  });

  const barBind = derived(() => {
    return mergePartBind(
      customProps?.bar,
      isDeterminate ? { style: { width: `${clampedValue}%` } } : {},
      cn({
        "absolute top-0 left-0 h-full": true,
        "transition-[width] duration-200 ease-linear": isDeterminate,
        [variantClass ?? ""]: isAnimated,
        [colorPalette?.bar ?? ""]: true,
        [roundedClass ?? ""]: true,
        [mergedClasses.bar ?? ""]: true,
      }),
    );
  });

  return {
    merged,
    barBind,
    isBuffer,
    rootBind,
    trackBind,
    bufferBind,
  };
}
