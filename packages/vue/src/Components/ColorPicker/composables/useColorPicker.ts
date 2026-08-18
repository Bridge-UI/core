// ** External Imports
import { get, isNil, omit } from "es-toolkit/compat";
import {
  computed,
  inject,
  ref,
  toValue,
  useAttrs,
  watch,
  type MaybeRefOrGetter,
  type SetupContext,
} from "vue";

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
  ColorPickerEmits,
  ColorPickerOwnProps,
} from "@/Components/ColorPicker/colorPicker.types";
import { FIELD_OVERLAY_INJECTION_KEY } from "@/Components/FieldOverlay/fieldOverlayInjectionKey";
import {
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
  props: MaybeRefOrGetter<ColorPickerOwnProps>,
  libDefaults: ColorPickerLibDefaults,
  emit: SetupContext<ColorPickerEmits>["emit"],
) {
  const attrs = useAttrs();
  const overlayFooter = inject(FIELD_OVERLAY_INJECTION_KEY, {
    apply: () => undefined,
    cancel: () => undefined,
  });
  const resolveMessage = useResolveMessage();

  const split = computed(() => {
    return splitComponentProps<
      ColorPickerOwnProps,
      typeof colorPickerBridgeKeys
    >({
      bridgeKeys: colorPickerBridgeKeys,
      props: { ...attrs, ...toValue(props) },
    });
  });

  const { merged, entry: bridgeColorPicker } = useBridgeUIComponent<
    ColorPickerMerged,
    "ColorPicker"
  >({
    libDefaults,
    componentName: "ColorPicker",
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const rootInheritedAttrs = computed(() => {
    return omit(split.value.inheritedAttrs, [
      "onApply",
      "onCancel",
      "onChange",
    ]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<ColorPickerClasses>({
    entry: bridgeColorPicker,
    props: () => split.value.componentProps,
  });

  const propsValue = computed(() => {
    return toValue(props);
  });

  const isControlled = computed(() => {
    return !isNil(propsValue.value.value);
  });

  const uncontrolledValue = ref<null | string>(
    merged.value.defaultValue ?? null,
  );

  const committedValue = computed((): null | string => {
    return isControlled.value
      ? (propsValue.value.value ?? null)
      : uncontrolledValue.value;
  });

  const format = computed((): ColorFormat => {
    return merged.value.format ?? DEFAULT_COLOR_FORMAT;
  });

  const draftHsva = ref<HsvaColor>(resolveHsva(committedValue.value));

  watch(
    () => [committedValue.value, merged.value.showFooter] as const,
    ([committed, showFooter]) => {
      if (showFooter) {
        draftHsva.value = resolveHsva(committed);
      }
    },
  );

  const displayHsva = computed((): HsvaColor => {
    return merged.value.showFooter
      ? draftHsva.value
      : resolveHsva(committedValue.value);
  });

  const showAlpha = computed(() => {
    return resolveColorAlpha(merged.value.alpha, format.value);
  });

  const formattedValue = computed(() => {
    return formatColor(displayHsva.value, format.value);
  });

  const cssColor = computed(() => {
    return toCssRgba(displayHsva.value);
  });

  const hueCss = computed(() => {
    return hueToCssRgb(displayHsva.value.h);
  });

  const solidCss = computed(() => {
    return toCssRgba({ ...displayHsva.value, a: 1 });
  });

  const swatchRounded = computed(() => {
    return get(roundedProps, merged.value.rounded ?? "md") ?? "rounded-md";
  });

  const swatchSize = computed(() => {
    return get(sizeProps, ["md", "swatch"]) ?? "h-6 w-6";
  });

  const tone = computed(() => {
    return merged.value.error ? "error" : (merged.value.color ?? "primary");
  });

  const swatchTone = computed(() => {
    return get(colorProps, tone.value) ?? colorProps.primary;
  });

  const presetSwatches = computed(() => {
    return (merged.value.swatches ?? []).filter((entry) => parseColor(entry));
  });

  const interactive = computed(() => {
    return !merged.value.disabled && !merged.value.readOnly;
  });

  const commitValue = (next: null | string) => {
    if (!isControlled.value) {
      uncontrolledValue.value = next;
    }

    emit("change", next);
  };

  const commitHsva = (next: HsvaColor) => {
    if (merged.value.showFooter) {
      draftHsva.value = next;

      return;
    }

    commitValue(formatColor(next, format.value));
  };

  const patchHsva = (patch: Partial<HsvaColor>) => {
    commitHsva({ ...displayHsva.value, ...patch });
  };

  const handleSwatchClick = (value: string) => {
    const parsed = parseColor(value);

    if (!parsed || !interactive.value) {
      return;
    }

    commitHsva(parsed);
  };

  const handleApply = () => {
    commitValue(formatColor(draftHsva.value, format.value));
    emit("apply");
    overlayFooter.apply();
  };

  const handleCancel = () => {
    draftHsva.value = resolveHsva(committedValue.value);
    emit("cancel");
    overlayFooter.cancel();
  };

  const handleAreaPointer = (event: PointerEvent) => {
    if (!interactive.value) {
      return;
    }

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const next = saturationValueFromPointer(event.clientX, event.clientY, rect);

    patchHsva(next);
  };

  const handleHuePointer = (event: PointerEvent) => {
    if (!interactive.value) {
      return;
    }

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const unit = unitFromPointer(event.clientX, rect.left, rect.width);

    patchHsva({ h: unit * 360 });
  };

  const handleAlphaPointer = (event: PointerEvent) => {
    if (!interactive.value) {
      return;
    }

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const unit = unitFromPointer(event.clientX, rect.left, rect.width);

    patchHsva({ a: unit });
  };

  const bindPointerDrag = (handler: (event: PointerEvent) => void) => {
    return {
      onPointerdown: (event: PointerEvent) => {
        event.preventDefault();
        (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
        handler(event);
      },
      onPointermove: (event: PointerEvent) => {
        if (
          !(event.currentTarget as HTMLElement).hasPointerCapture(
            event.pointerId,
          )
        ) {
          return;
        }

        handler(event);
      },
    };
  };

  const handleAreaKeydown = (event: KeyboardEvent) => {
    if (!interactive.value) {
      return;
    }

    const step = event.shiftKey ? 10 : 1;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      patchHsva({ s: displayHsva.value.s - step });
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      patchHsva({ s: displayHsva.value.s + step });
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      patchHsva({ v: displayHsva.value.v - step });
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      patchHsva({ v: displayHsva.value.v + step });
    }
  };

  const handleHueKeydown = (event: KeyboardEvent) => {
    if (!interactive.value) {
      return;
    }

    const step = event.shiftKey ? 10 : 1;

    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      patchHsva({ h: displayHsva.value.h - step });
    } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      patchHsva({ h: displayHsva.value.h + step });
    }
  };

  const handleAlphaKeydown = (event: KeyboardEvent) => {
    if (!interactive.value) {
      return;
    }

    const step = event.shiftKey ? 0.1 : 0.01;

    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      patchHsva({ a: displayHsva.value.a - step });
    } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      patchHsva({ a: displayHsva.value.a + step });
    }
  };

  const rootBind = computed(() => {
    const shellRounded = get(shellRoundedProps, merged.value.rounded ?? "md");

    return mergePartBind(
      customProps.value?.root,
      rootInheritedAttrs.value,
      cn({
        "flex flex-col overflow-hidden bg-white shadow-lg dark:bg-dark-900": true,
        "w-full": merged.value.fill,
        "w-72": !merged.value.fill,
        [shellRounded]: true,
        [mergedClasses.value.root ?? ""]: true,
      }),
    );
  });

  const contentBind = computed(() => {
    return cn({
      "flex flex-col gap-3 p-3": true,
    });
  });

  const areaBind = computed(() => {
    return mergePartBind(
      customProps.value?.area,
      {
        ...bindPointerDrag(handleAreaPointer),
        role: "slider",
        onKeydown: handleAreaKeydown,
        tabindex: interactive.value ? 0 : -1,
        style: { backgroundColor: hueCss.value },
        "aria-label": resolveMessage("Saturation and brightness"),
        "aria-valuetext": `Saturation ${Math.round(displayHsva.value.s)}%, Brightness ${Math.round(displayHsva.value.v)}%`,
      },
      cn({
        "relative h-40 w-full cursor-crosshair overflow-hidden touch-none": true,
        [swatchRounded.value]: true,
        "cursor-not-allowed": !interactive.value,
        [mergedClasses.value.area ?? ""]: true,
      }),
    );
  });

  const areaThumbBind = computed(() => {
    return {
      "aria-hidden": true,
      style: {
        left: `${displayHsva.value.s}%`,
        top: `${100 - displayHsva.value.v}%`,
      },
      class:
        "pointer-events-none absolute z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow",
    };
  });

  const hueBind = computed(() => {
    return mergePartBind(
      customProps.value?.hue,
      {
        ...bindPointerDrag(handleHuePointer),
        role: "slider",
        "aria-valuemin": 0,
        "aria-valuemax": 360,
        onKeydown: handleHueKeydown,
        "aria-label": resolveMessage("Hue"),
        tabindex: interactive.value ? 0 : -1,
        style: { backgroundImage: HUE_GRADIENT },
        "aria-valuenow": Math.round(displayHsva.value.h),
      },
      cn({
        "relative h-3 w-full cursor-pointer touch-none": true,
        [swatchRounded.value]: true,
        "cursor-not-allowed": !interactive.value,
        [mergedClasses.value.hue ?? ""]: true,
      }),
    );
  });

  const hueThumbBind = computed(() => {
    return {
      "aria-hidden": true,
      style: {
        backgroundColor: hueCss.value,
        left: `${(displayHsva.value.h / 360) * 100}%`,
      },
      class:
        "pointer-events-none absolute top-1/2 z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow",
    };
  });

  const alphaBind = computed(() => {
    return mergePartBind(
      customProps.value?.alpha,
      {
        ...bindPointerDrag(handleAlphaPointer),
        role: "slider",
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        onKeydown: handleAlphaKeydown,
        tabindex: interactive.value ? 0 : -1,
        "aria-label": resolveMessage("Alpha"),
        "aria-valuenow": Math.round(displayHsva.value.a * 100),
      },
      cn({
        "relative h-3 w-full cursor-pointer overflow-hidden touch-none": true,
        [CHECKERBOARD_CLASS]: true,
        [swatchRounded.value]: true,
        "cursor-not-allowed": !interactive.value,
        [mergedClasses.value.alpha ?? ""]: true,
      }),
    );
  });

  const alphaFillBind = computed(() => {
    return {
      "aria-hidden": true,
      class: "pointer-events-none absolute inset-0",
      style: {
        backgroundImage: `linear-gradient(to right, transparent, ${solidCss.value})`,
      },
    };
  });

  const alphaThumbBind = computed(() => {
    return {
      "aria-hidden": true,
      style: {
        backgroundColor: cssColor.value,
        left: `${displayHsva.value.a * 100}%`,
      },
      class:
        "pointer-events-none absolute top-1/2 z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow",
    };
  });

  const previewBind = computed(() => {
    return mergePartBind(
      customProps.value?.preview,
      {},
      cn({
        "flex items-center gap-2": true,
        [mergedClasses.value.preview ?? ""]: true,
      }),
    );
  });

  const previewSwatchBind = computed(() => {
    return {
      "aria-hidden": true,
      class: cn({
        "relative shrink-0 overflow-hidden": true,
        [CHECKERBOARD_CLASS]: true,
        [swatchSize.value]: true,
        [swatchRounded.value]: true,
      }),
    };
  });

  const previewSwatchFillBind = computed(() => {
    return {
      class: "absolute inset-0",
      style: { backgroundColor: cssColor.value },
    };
  });

  const swatchesBind = computed(() => {
    return mergePartBind(
      customProps.value?.swatches,
      {},
      cn({
        "flex flex-wrap gap-2": true,
        [mergedClasses.value.swatches ?? ""]: true,
      }),
    );
  });

  const footerBind = computed(() => {
    return mergePartBind(
      customProps.value?.footer,
      {},
      cn({
        "flex items-center justify-end gap-2 border-t border-dark-100 bg-dark-50 px-3 py-2 dark:border-dark-800 dark:bg-dark-950/40": true,
        [mergedClasses.value.footer ?? ""]: true,
      }),
    );
  });

  const showFooter = computed(() => {
    return Boolean(merged.value.showFooter);
  });

  const swatchButtonClass = computed(() => {
    return cn({
      "relative shrink-0 overflow-hidden": true,
      [CHECKERBOARD_CLASS]: true,
      [swatchSize.value]: true,
      [swatchRounded.value]: true,
      [swatchTone.value.base]: true,
      [swatchTone.value.hover]: interactive.value,
      [swatchTone.value.disabled]: !interactive.value,
    });
  });

  const swatchSelectedClass = computed(() => {
    return swatchTone.value.selected;
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
    showFooter,
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
    swatchButtonClass,
    swatchSelectedClass,
    previewSwatchFillBind,
    applyLabel: computed(() => {
      return resolveMessage("Apply");
    }),
    cancelLabel: computed(() => {
      return resolveMessage("Cancel");
    }),
    applyButtonProps: computed(() => {
      return customProps.value?.applyButton;
    }),
    cancelButtonProps: computed(() => {
      return customProps.value?.cancelButton;
    }),
    isSwatchSelected: (value: string) => {
      return colorStringsEqual(value, formattedValue.value);
    },
    swatchCss: (value: string) => {
      const parsed = parseColor(value);

      return parsed ? toCssRgba(parsed) : undefined;
    },
  };
}
