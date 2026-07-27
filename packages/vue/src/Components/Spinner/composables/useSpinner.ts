// ** External Imports
import { get, isNil } from "es-toolkit/compat";
import { computed, useAttrs } from "vue";

// ** Core Imports
import {
  cn,
  DEFAULT_SPINNER_THICKNESS,
  getSpinnerCircleGeometry,
  mergeBridgeUILayeredClasses,
  SPINNER_VIEWBOX_SIZE,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import {
  colorProps,
  sizeProps,
  variantProps,
} from "@bridge-ui/core/Components/Spinner";

// ** Local Imports
import type {
  SpinnerClasses,
  SpinnerOwnProps,
  SpinnerProps,
} from "@/Components/Spinner/spinner.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const spinnerBridgeKeys = [
  "size",
  "color",
  "value",
  "classes",
  "variant",
  "thickness",
  "customProps",
  "enableTrack",
  "disableShrink",
] as const satisfies readonly (keyof SpinnerOwnProps)[];

type SpinnerLibDefaults = LibDefaultsShape<
  SpinnerOwnProps,
  "size" | "color" | "variant" | "thickness" | "enableTrack" | "disableShrink"
>;

type SpinnerMerged = MergeLibDefaults<SpinnerOwnProps, SpinnerLibDefaults>;

/**
 * Clamps a spinner value into the 0–100 range.
 */
function clampSpinner(value: number | undefined): number {
  if (isNil(value) || Number.isNaN(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, value));
}

export function useSpinner(
  props: SpinnerOwnProps,
  libDefaults: SpinnerLibDefaults,
) {
  const attrs = useAttrs();

  const split = computed(() => {
    return splitComponentProps<SpinnerProps, typeof spinnerBridgeKeys>({
      props: { ...attrs, ...props },
      bridgeKeys: spinnerBridgeKeys,
    });
  });

  const { merged, entry: bridgeSpinner } = useBridgeUIComponent<
    SpinnerMerged,
    "Spinner"
  >({
    libDefaults,
    componentName: "Spinner",
    props: () => split.value.componentProps,
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<SpinnerClasses>({
    entry: bridgeSpinner,
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => merged.value.customProps);

  const colorPalette = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeSpinner.value?.customProps?.color,
    );

    return get(classes, merged.value.color);
  });

  const sizeClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeSpinner.value?.customProps?.size,
    );

    return get(classes, merged.value.size);
  });

  const variantClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeSpinner.value?.customProps?.variant,
    );

    return get(classes, merged.value.variant);
  });

  const thickness = computed(
    () => merged.value.thickness ?? DEFAULT_SPINNER_THICKNESS,
  );
  const isDeterminate = computed(() => merged.value.variant === "determinate");
  const isIndeterminate = computed(
    () => merged.value.variant === "indeterminate",
  );
  const enableTrack = computed(() => Boolean(merged.value.enableTrack));
  const disableShrink = computed(() => Boolean(merged.value.disableShrink));
  const clampedValue = computed(() => clampSpinner(merged.value.value));
  const geometry = computed(() => getSpinnerCircleGeometry(thickness.value));
  const center = SPINNER_VIEWBOX_SIZE / 2;

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
        "inline-flex": true,
        [sizeClass.value ?? ""]: true,
        [mergedClasses.value.root ?? ""]: true,
      }),
    });
  });

  const svgBind = computed(() => {
    return mergePartBind(
      customProps.value?.svg,
      {
        viewBox: `0 0 ${SPINNER_VIEWBOX_SIZE} ${SPINNER_VIEWBOX_SIZE}`,
      },
      {
        class: cn({
          "size-full": true,
          [variantClass.value ?? ""]: isIndeterminate.value,
          [mergedClasses.value.svg ?? ""]: true,
        }),
      },
    );
  });

  const trackBind = computed(() => {
    if (!enableTrack.value) {
      return null;
    }

    return mergePartBind(
      customProps.value?.track,
      {
        cx: center,
        cy: center,
        fill: "none",
        r: geometry.value.radius,
        strokeWidth: thickness.value,
      },
      {
        class: cn({
          [colorPalette.value?.track ?? ""]: true,
          [mergedClasses.value.track ?? ""]: true,
        }),
      },
    );
  });

  const circleBind = computed(() => {
    const { radius, circumference } = geometry.value;

    const determinateStyle = isDeterminate.value
      ? {
          transformOrigin: "50% 50%",
          transform: "rotate(-90deg)",
          strokeDasharray: circumference,
          transition: "stroke-dashoffset 200ms linear",
          strokeDashoffset: ((100 - clampedValue.value) / 100) * circumference,
        }
      : {};

    const indeterminateStyle =
      isIndeterminate.value && disableShrink.value
        ? {
            strokeDashoffset: 0,
            strokeDasharray: `${circumference * 0.8}px, ${circumference}px`,
          }
        : {};

    return mergePartBind(
      customProps.value?.circle,
      {
        r: radius,
        cx: center,
        cy: center,
        fill: "none",
        strokeWidth: thickness.value,
        strokeLinecap: "round" as const,
        style: {
          ...determinateStyle,
          ...indeterminateStyle,
        },
      },
      {
        class: cn({
          [colorPalette.value?.circle ?? ""]: true,
          "animate-bridge-spinner-dash":
            isIndeterminate.value && !disableShrink.value,
          [mergedClasses.value.circle ?? ""]: true,
        }),
      },
    );
  });

  return {
    merged,
    svgBind,
    rootBind,
    trackBind,
    circleBind,
    enableTrack,
  };
}
