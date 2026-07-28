// ** External Imports
import { get, isNil } from "es-toolkit/compat";
import { computed, useAttrs } from "vue";

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
  props: ProgressOwnProps,
  libDefaults: ProgressLibDefaults,
) {
  const attrs = useAttrs();

  const split = computed(() => {
    return splitComponentProps<ProgressProps, typeof progressBridgeKeys>({
      props: { ...attrs, ...props },
      bridgeKeys: progressBridgeKeys,
    });
  });

  const { merged, entry: bridgeProgress } = useBridgeUIComponent<
    ProgressMerged,
    "Progress"
  >({
    libDefaults,
    componentName: "Progress",
    props: () => split.value.componentProps,
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<ProgressClasses>({
    entry: bridgeProgress,
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const colorPalette = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeProgress.value?.customProps?.color,
    );

    return get(classes, merged.value.color);
  });

  const sizeClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeProgress.value?.customProps?.size,
    );

    return get(classes, merged.value.size);
  });

  const roundedClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeProgress.value?.customProps?.rounded,
    );

    return get(classes, merged.value.rounded);
  });

  const variantClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeProgress.value?.customProps?.variant,
    );

    return get(classes, merged.value.variant);
  });

  const isBuffer = computed(() => {
    return merged.value.variant === "buffer";
  });

  const isDeterminate = computed(() => {
    return (
      merged.value.variant === "determinate" ||
      merged.value.variant === "buffer"
    );
  });

  const isAnimated = computed(() => {
    return (
      merged.value.variant === "indeterminate" ||
      merged.value.variant === "query"
    );
  });

  const clampedValue = computed(() => {
    return clampProgress(merged.value.value);
  });
  const clampedBuffer = computed(() => {
    return clampProgress(merged.value.valueBuffer);
  });

  const rootBind = computed(() => {
    return mergePartBind(customProps.value?.root, split.value.inheritedAttrs, {
      role: "progressbar",
      ...(isDeterminate.value
        ? {
            "aria-valuemin": 0,
            "aria-valuemax": 100,
            "aria-valuenow": clampedValue.value,
          }
        : {}),
      class: cn({
        "relative w-full overflow-hidden": true,
        [sizeClass.value ?? ""]: true,
        [roundedClass.value ?? ""]: true,
        [mergedClasses.value.root ?? ""]: true,
      }),
    });
  });

  const trackBind = computed(() => {
    return mergePartBind(
      customProps.value?.track,
      {},
      cn({
        "absolute inset-0": true,
        [colorPalette.value?.track ?? ""]: true,
        [roundedClass.value ?? ""]: true,
        [mergedClasses.value.track ?? ""]: true,
      }),
    );
  });

  const bufferBind = computed(() => {
    if (!isBuffer.value) {
      return null;
    }

    return mergePartBind(
      customProps.value?.buffer,
      {
        style: { width: `${clampedBuffer.value}%` },
      },
      cn({
        "absolute top-0 left-0 h-full transition-[width] duration-200 ease-linear": true,
        [colorPalette.value?.buffer ?? ""]: true,
        [roundedClass.value ?? ""]: true,
        [mergedClasses.value.buffer ?? ""]: true,
      }),
    );
  });

  const barBind = computed(() => {
    return mergePartBind(
      customProps.value?.bar,
      isDeterminate.value ? { style: { width: `${clampedValue.value}%` } } : {},
      cn({
        "absolute top-0 left-0 h-full": true,
        "transition-[width] duration-200 ease-linear": isDeterminate.value,
        [variantClass.value ?? ""]: isAnimated.value,
        [colorPalette.value?.bar ?? ""]: true,
        [roundedClass.value ?? ""]: true,
        [mergedClasses.value.bar ?? ""]: true,
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
