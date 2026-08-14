// ** External Imports
import { get, isNil } from "es-toolkit/compat";
import { computed, useAttrs } from "vue";

// ** Core Imports
import {
  DEFAULT_SPINNER_THICKNESS,
  getSpinnerCircleGeometry,
  SPINNER_VIEWBOX_SIZE,
} from "@bridge-ui/core/Domain";
import {
  colorProps,
  sizeProps,
  variantProps,
} from "@bridge-ui/core/Tokens/Spinner";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

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

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const colorPalette = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeSpinner.value?.tokens?.color,
    );

    return get(classes, merged.value.color);
  });

  const sizeClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeSpinner.value?.tokens?.size,
    );

    return get(classes, merged.value.size);
  });

  const variantClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeSpinner.value?.tokens?.variant,
    );

    return get(classes, merged.value.variant);
  });

  const thickness = computed(() => {
    return merged.value.thickness ?? DEFAULT_SPINNER_THICKNESS;
  });

  const geometry = computed(() => {
    return getSpinnerCircleGeometry(thickness.value);
  });

  const center = SPINNER_VIEWBOX_SIZE / 2;

  const clampedValue = computed(() => {
    return clampSpinner(merged.value.value);
  });

  const enableTrack = computed(() => {
    return Boolean(merged.value.enableTrack);
  });

  const disableShrink = computed(() => {
    return Boolean(merged.value.disableShrink);
  });

  const isDeterminate = computed(() => {
    return merged.value.variant === "determinate";
  });

  const isIndeterminate = computed(() => {
    return merged.value.variant === "indeterminate";
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
        "inline-block": true,
        [sizeClass.value ?? ""]: true,
        [variantClass.value ?? ""]: isIndeterminate.value,
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
      cn({
        // Keeps the progress centered while the root rotates.
        "block size-full": true,
        [mergedClasses.value.svg ?? ""]: true,
      }),
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
        // Vue SVG attrs need kebab-case (`strokeWidth` is ignored → default 1).
        "stroke-width": thickness.value,
      },
      cn({
        [colorPalette.value?.track ?? ""]: true,
        [mergedClasses.value.track ?? ""]: true,
      }),
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

    // Butt caps (SVG default). Round caps + a 1px dash reads as a jittering speck.
    const indeterminateStyle = isIndeterminate.value
      ? {
          strokeDashoffset: 0,
          strokeDasharray: disableShrink.value
            ? `${circumference * 0.8}px, ${circumference}px`
            : "80px, 200px",
        }
      : {};

    return mergePartBind(
      customProps.value?.circle,
      {
        r: radius,
        cx: center,
        cy: center,
        fill: "none",
        // Vue SVG attrs need kebab-case (`strokeWidth` is ignored → default 1).
        "stroke-width": thickness.value,
        style: {
          ...determinateStyle,
          ...indeterminateStyle,
        },
      },
      cn({
        [colorPalette.value?.circle ?? ""]: true,
        "animate-bridge-spinner-dash":
          isIndeterminate.value && !disableShrink.value,
        [mergedClasses.value.circle ?? ""]: true,
      }),
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
