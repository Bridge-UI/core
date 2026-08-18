// ** External Imports
import { get, isNil, omit } from "es-toolkit/compat";
import type { KeyboardEvent, PointerEvent } from "react";
import { useEffect, useState } from "react";

// ** Core Imports
import {
  DEFAULT_COLOR_FORMAT,
  DEFAULT_HSVA,
  colorStringsEqual,
  formatColor,
  hueToCssRgb,
  parseColor,
  resolveColorAlpha,
  saturationValueFromPointer,
  toCssRgba,
  unitFromPointer,
  type ColorFormat,
  type HsvaColor,
} from "@bridge-ui/core/Domain";
import {
  colorPickerColorProps as colorProps,
  colorPickerRoundedProps as roundedProps,
  menuRoundedProps as shellRoundedProps,
  colorPickerSizeProps as sizeProps,
} from "@bridge-ui/core/Tokens";
import {
  cn,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import type {
  ColorPickerClasses,
  ColorPickerOwnProps,
  ColorPickerProps,
} from "@/Components/ColorPicker/colorPicker.types";
import { useFieldOverlayFooter } from "@/Components/FieldOverlay/FieldOverlayContext";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const colorPickerBridgeKeys = [
  "fill",
  "alpha",
  "color",
  "error",
  "value",
  "format",
  "tokens",
  "classes",
  "rounded",
  "disabled",
  "readOnly",
  "swatches",
  "showFooter",
  "customProps",
  "defaultValue",
] as const satisfies readonly (keyof ColorPickerOwnProps)[];

type ColorPickerLibDefaults = LibDefaultsShape<
  ColorPickerOwnProps,
  "color" | "format" | "rounded"
>;

type ColorPickerMerged = MergeLibDefaults<
  ColorPickerOwnProps,
  ColorPickerLibDefaults
>;

const HUE_GRADIENT =
  "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)";

const CHECKERBOARD_CLASS =
  "bg-[image:repeating-conic-gradient(#d1d5db_0%_25%,#ffffff_0%_50%)] bg-[size:0.5rem_0.5rem] dark:bg-[image:repeating-conic-gradient(#4b5563_0%_25%,#1f2937_0%_50%)]";

function resolveHsva(value: null | string | undefined): HsvaColor {
  return parseColor(value) ?? DEFAULT_HSVA;
}

/**
 * Owns controlled/uncontrolled value, optional footer draft, and panel binds.
 */
export function useColorPicker(
  props: ColorPickerProps,
  libDefaults: ColorPickerLibDefaults,
) {
  const resolveMessage = useResolveMessage();
  const overlayFooter = useFieldOverlayFooter();

  const { componentProps, inheritedAttrs } = splitComponentProps<
    ColorPickerProps,
    typeof colorPickerBridgeKeys
  >({
    props,
    bridgeKeys: colorPickerBridgeKeys,
  });

  const { merged, entry: bridgeColorPicker } = useBridgeUIComponent<
    ColorPickerMerged,
    "ColorPicker"
  >({
    libDefaults,
    props: componentProps,
    componentName: "ColorPicker",
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["slots", "onApply", "onCancel", "onChange"]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<ColorPickerClasses>({
    props: componentProps,
    entry: bridgeColorPicker,
  });

  const isControlled = derived(() => {
    return !isNil(props.value);
  });

  const [uncontrolledValue, setUncontrolledValue] = useState<null | string>(
    () => merged.defaultValue ?? null,
  );

  const committedValue = derived((): null | string => {
    return isControlled ? (props.value ?? null) : uncontrolledValue;
  });

  const format = derived((): ColorFormat => {
    return merged.format ?? DEFAULT_COLOR_FORMAT;
  });

  const [draftHsva, setDraftHsva] = useState<HsvaColor>(() => {
    return resolveHsva(committedValue);
  });

  useEffect(() => {
    if (merged.showFooter) {
      setDraftHsva(resolveHsva(committedValue));
    }
  }, [committedValue, merged.showFooter]);

  const displayHsva = derived((): HsvaColor => {
    return merged.showFooter ? draftHsva : resolveHsva(committedValue);
  });

  const showAlpha = derived(() => {
    return resolveColorAlpha(merged.alpha, format);
  });

  const formattedValue = derived(() => {
    return formatColor(displayHsva, format);
  });

  const cssColor = derived(() => {
    return toCssRgba(displayHsva);
  });

  const hueCss = derived(() => {
    return hueToCssRgb(displayHsva.h);
  });

  const solidCss = derived(() => {
    return toCssRgba({ ...displayHsva, a: 1 });
  });

  const swatchRounded = derived(() => {
    return get(roundedProps, merged.rounded ?? "md") ?? "rounded-md";
  });

  const swatchSize = derived(() => {
    return get(sizeProps, ["md", "swatch"]) ?? "h-6 w-6";
  });

  const tone = derived(() => {
    return merged.error ? "error" : (merged.color ?? "primary");
  });

  const swatchTone = derived(() => {
    return get(colorProps, tone) ?? colorProps.primary;
  });

  const presetSwatches = derived(() => {
    return (merged.swatches ?? []).filter((entry) => parseColor(entry));
  });

  const interactive = derived(() => {
    return !merged.disabled && !merged.readOnly;
  });

  const commitValue = (next: null | string) => {
    if (!isControlled) {
      setUncontrolledValue(next);
    }

    props.onChange?.(next);
  };

  const commitHsva = (next: HsvaColor) => {
    if (merged.showFooter) {
      setDraftHsva(next);

      return;
    }

    commitValue(formatColor(next, format));
  };

  const patchHsva = (patch: Partial<HsvaColor>) => {
    commitHsva({ ...displayHsva, ...patch });
  };

  const handleSwatchClick = (value: string) => {
    const parsed = parseColor(value);

    if (!parsed || !interactive) {
      return;
    }

    commitHsva(parsed);
  };

  const handleApply = () => {
    commitValue(formatColor(draftHsva, format));
    props.onApply?.();
    overlayFooter.apply();
  };

  const handleCancel = () => {
    setDraftHsva(resolveHsva(committedValue));
    props.onCancel?.();
    overlayFooter.cancel();
  };

  const handleAreaPointer = (event: PointerEvent<HTMLDivElement>) => {
    if (!interactive) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const next = saturationValueFromPointer(event.clientX, event.clientY, rect);

    patchHsva(next);
  };

  const handleHuePointer = (event: PointerEvent<HTMLDivElement>) => {
    if (!interactive) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const unit = unitFromPointer(event.clientX, rect.left, rect.width);

    patchHsva({ h: unit * 360 });
  };

  const handleAlphaPointer = (event: PointerEvent<HTMLDivElement>) => {
    if (!interactive) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const unit = unitFromPointer(event.clientX, rect.left, rect.width);

    patchHsva({ a: unit });
  };

  const bindPointerDrag = (
    handler: (event: PointerEvent<HTMLDivElement>) => void,
  ) => {
    return {
      onPointerDown: (event: PointerEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        handler(event);
      },
      onPointerMove: (event: PointerEvent<HTMLDivElement>) => {
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
          return;
        }

        handler(event);
      },
    };
  };

  const handleAreaKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) {
      return;
    }

    const step = event.shiftKey ? 10 : 1;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      patchHsva({ s: displayHsva.s - step });
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      patchHsva({ s: displayHsva.s + step });
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      patchHsva({ v: displayHsva.v - step });
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      patchHsva({ v: displayHsva.v + step });
    }
  };

  const handleHueKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) {
      return;
    }

    const step = event.shiftKey ? 10 : 1;

    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      patchHsva({ h: displayHsva.h - step });
    } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      patchHsva({ h: displayHsva.h + step });
    }
  };

  const handleAlphaKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) {
      return;
    }

    const step = event.shiftKey ? 0.1 : 0.01;

    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      patchHsva({ a: displayHsva.a - step });
    } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      patchHsva({ a: displayHsva.a + step });
    }
  };

  const rootBind = derived(() => {
    const shellRounded = get(shellRoundedProps, merged.rounded ?? "md");

    return mergePartBind(
      customProps?.root,
      rootInheritedAttrs,
      cn({
        "flex flex-col overflow-hidden bg-white shadow-lg dark:bg-dark-900": true,
        "w-full": merged.fill,
        "w-72": !merged.fill,
        [shellRounded]: true,
        [mergedClasses.root ?? ""]: true,
      }),
    );
  });

  const contentBind = derived(() => {
    return cn({
      "flex flex-col gap-3 p-3": true,
    });
  });

  const areaBind = derived(() => {
    return mergePartBind(
      customProps?.area,
      {},
      {
        ...bindPointerDrag(handleAreaPointer),
        role: "slider",
        onKeyDown: handleAreaKeyDown,
        tabIndex: interactive ? 0 : -1,
        style: { backgroundColor: hueCss },
        "aria-label": resolveMessage("Saturation and brightness"),
        "aria-valuetext": `Saturation ${Math.round(displayHsva.s)}%, Brightness ${Math.round(displayHsva.v)}%`,
        className: cn({
          "relative h-40 w-full cursor-crosshair overflow-hidden touch-none": true,
          [swatchRounded]: true,
          "cursor-not-allowed": !interactive,
          [mergedClasses.area ?? ""]: true,
        }),
      },
    );
  });

  const areaThumbBind = derived(() => {
    return {
      "aria-hidden": true,
      style: {
        left: `${displayHsva.s}%`,
        top: `${100 - displayHsva.v}%`,
      },
      className:
        "pointer-events-none absolute z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow",
    };
  });

  const hueBind = derived(() => {
    return mergePartBind(
      customProps?.hue,
      {},
      {
        ...bindPointerDrag(handleHuePointer),
        role: "slider",
        "aria-valuemin": 0,
        "aria-valuemax": 360,
        onKeyDown: handleHueKeyDown,
        tabIndex: interactive ? 0 : -1,
        "aria-label": resolveMessage("Hue"),
        style: { backgroundImage: HUE_GRADIENT },
        "aria-valuenow": Math.round(displayHsva.h),
        className: cn({
          "relative h-3 w-full cursor-pointer touch-none": true,
          [swatchRounded]: true,
          "cursor-not-allowed": !interactive,
          [mergedClasses.hue ?? ""]: true,
        }),
      },
    );
  });

  const hueThumbBind = derived(() => {
    return {
      "aria-hidden": true,
      style: {
        backgroundColor: hueCss,
        left: `${(displayHsva.h / 360) * 100}%`,
      },
      className:
        "pointer-events-none absolute top-1/2 z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow",
    };
  });

  const alphaBind = derived(() => {
    return mergePartBind(
      customProps?.alpha,
      {},
      {
        ...bindPointerDrag(handleAlphaPointer),
        role: "slider",
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        onKeyDown: handleAlphaKeyDown,
        tabIndex: interactive ? 0 : -1,
        "aria-label": resolveMessage("Alpha"),
        "aria-valuenow": Math.round(displayHsva.a * 100),
        className: cn({
          "relative h-3 w-full cursor-pointer overflow-hidden touch-none": true,
          [CHECKERBOARD_CLASS]: true,
          [swatchRounded]: true,
          "cursor-not-allowed": !interactive,
          [mergedClasses.alpha ?? ""]: true,
        }),
      },
    );
  });

  const alphaFillBind = derived(() => {
    return {
      "aria-hidden": true,
      className: "pointer-events-none absolute inset-0",
      style: {
        backgroundImage: `linear-gradient(to right, transparent, ${solidCss})`,
      },
    };
  });

  const alphaThumbBind = derived(() => {
    return {
      "aria-hidden": true,
      style: {
        backgroundColor: cssColor,
        left: `${displayHsva.a * 100}%`,
      },
      className:
        "pointer-events-none absolute top-1/2 z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow",
    };
  });

  const previewBind = derived(() => {
    return mergePartBind(
      customProps?.preview,
      {},
      cn({
        "flex items-center gap-2": true,
        [mergedClasses.preview ?? ""]: true,
      }),
    );
  });

  const previewSwatchBind = derived(() => {
    return {
      "aria-hidden": true,
      className: cn({
        "relative shrink-0 overflow-hidden": true,
        [CHECKERBOARD_CLASS]: true,
        [swatchSize]: true,
        [swatchRounded]: true,
      }),
    };
  });

  const previewSwatchFillBind = derived(() => {
    return {
      className: "absolute inset-0",
      style: { backgroundColor: cssColor },
    };
  });

  const swatchesBind = derived(() => {
    return mergePartBind(
      customProps?.swatches,
      {},
      cn({
        "flex flex-wrap gap-2": true,
        [mergedClasses.swatches ?? ""]: true,
      }),
    );
  });

  const footerBind = derived(() => {
    return mergePartBind(
      customProps?.footer,
      {},
      cn({
        "flex items-center justify-end gap-2 border-t border-dark-100 bg-dark-50 px-3 py-2 dark:border-dark-800 dark:bg-dark-950/40": true,
        [mergedClasses.footer ?? ""]: true,
      }),
    );
  });

  return {
    merged,
    hueBind,
    rootBind,
    areaBind,
    cssColor,
    alphaBind,
    showAlpha,
    footerBind,
    previewBind,
    contentBind,
    handleApply,
    swatchesBind,
    handleCancel,
    hueThumbBind,
    areaThumbBind,
    alphaFillBind,
    formattedValue,
    alphaThumbBind,
    presetSwatches,
    previewSwatchBind,
    handleSwatchClick,
    previewSwatchFillBind,
    applyLabel: resolveMessage("Apply"),
    checkerboardClass: CHECKERBOARD_CLASS,
    cancelLabel: resolveMessage("Cancel"),
    showFooter: Boolean(merged.showFooter),
    applyButtonProps: customProps?.applyButton,
    cancelButtonProps: customProps?.cancelButton,
    swatchSelectedClass: derived(() => {
      return swatchTone.selected;
    }),
    isSwatchSelected: (value: string) => {
      return colorStringsEqual(value, formattedValue);
    },
    swatchCss: (value: string) => {
      const parsed = parseColor(value);

      return parsed ? toCssRgba(parsed) : undefined;
    },
    swatchButtonClass: derived(() => {
      return cn({
        "relative shrink-0 overflow-hidden": true,
        [CHECKERBOARD_CLASS]: true,
        [swatchSize]: true,
        [swatchRounded]: true,
        [swatchTone.base]: true,
        [swatchTone.hover]: interactive,
        [swatchTone.disabled]: !interactive,
      });
    }),
  };
}
