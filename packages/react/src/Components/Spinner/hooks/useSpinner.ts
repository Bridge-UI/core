// ** External Imports
import { get, isNil } from "es-toolkit/compat";
import { useMemo } from "react";

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
  derived,
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
  props: SpinnerProps,
  libDefaults: SpinnerLibDefaults,
) {
  const { componentProps, inheritedAttrs } = splitComponentProps<
    SpinnerProps,
    typeof spinnerBridgeKeys
  >({
    props,
    bridgeKeys: spinnerBridgeKeys,
  });

  const { merged, entry: bridgeSpinner } = useBridgeUIComponent<
    SpinnerMerged,
    "Spinner"
  >({
    libDefaults,
    props: componentProps,
    componentName: "Spinner",
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<SpinnerClasses>({
    entry: bridgeSpinner,
    props: componentProps,
  });

  const customProps = derived(() => merged.customProps);

  const colorPalette = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeSpinner?.customProps?.color,
    );

    return get(classes, merged.color);
  }, [merged.color, bridgeSpinner?.customProps?.color]);

  const sizeClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeSpinner?.customProps?.size,
    );

    return get(classes, merged.size);
  }, [merged.size, bridgeSpinner?.customProps?.size]);

  const variantClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeSpinner?.customProps?.variant,
    );

    return get(classes, merged.variant);
  }, [merged.variant, bridgeSpinner?.customProps?.variant]);

  const radius = derived(() => {
    return geometry.radius;
  });

  const circumference = derived(() => {
    return geometry.circumference;
  });

  const center = derived(() => {
    return SPINNER_VIEWBOX_SIZE / 2;
  });

  const clampedValue = derived(() => {
    return clampSpinner(merged.value);
  });

  const enableTrack = derived(() => {
    return Boolean(merged.enableTrack);
  });

  const disableShrink = derived(() => {
    return Boolean(merged.disableShrink);
  });

  const isDeterminate = derived(() => {
    return merged.variant === "determinate";
  });

  const isIndeterminate = derived(() => {
    return merged.variant === "indeterminate";
  });

  const geometry = derived(() => {
    return getSpinnerCircleGeometry(thickness);
  });

  const thickness = derived(() => {
    return merged.thickness ?? DEFAULT_SPINNER_THICKNESS;
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
        "inline-block": true,
        [sizeClass ?? ""]: true,
        [variantClass ?? ""]: isIndeterminate,
        [mergedClasses.root ?? ""]: true,
      }),
    });
  });

  const svgBind = derived(() => {
    return mergePartBind(
      customProps?.svg,
      {
        viewBox: `0 0 ${SPINNER_VIEWBOX_SIZE} ${SPINNER_VIEWBOX_SIZE}`,
      },
      cn({
        // Keeps the progress centered while the root rotates.
        "block size-full": true,
        [mergedClasses.svg ?? ""]: true,
      }),
    );
  });

  const trackBind = derived(() => {
    if (!enableTrack) {
      return null;
    }

    return mergePartBind(
      customProps?.track,
      {
        r: radius,
        cx: center,
        cy: center,
        fill: "none",
        strokeWidth: thickness,
      },
      cn({
        [colorPalette?.track ?? ""]: true,
        [mergedClasses.track ?? ""]: true,
      }),
    );
  });

  const circleBind = derived(() => {
    const determinateStyle = isDeterminate
      ? {
          transformOrigin: "50% 50%",
          transform: "rotate(-90deg)",
          strokeDasharray: circumference,
          transition: "stroke-dashoffset 200ms linear",
          strokeDashoffset: ((100 - clampedValue) / 100) * circumference,
        }
      : {};

    // Butt caps (SVG default). Round caps + a 1px dash reads as a jittering speck.
    const indeterminateStyle = isIndeterminate
      ? {
          strokeDashoffset: 0,
          strokeDasharray: disableShrink
            ? `${circumference * 0.8}px, ${circumference}px`
            : "80px, 200px",
        }
      : {};

    return mergePartBind(
      customProps?.circle,
      {
        r: radius,
        cx: center,
        cy: center,
        fill: "none",
        strokeWidth: thickness,
        style: {
          ...determinateStyle,
          ...indeterminateStyle,
        },
      },
      cn({
        [colorPalette?.circle ?? ""]: true,
        "animate-bridge-spinner-dash": isIndeterminate && !disableShrink,
        [mergedClasses.circle ?? ""]: true,
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
