// ** External Imports
import { get, isString, omit, pick } from "es-toolkit/compat";
import type { Attachment } from "svelte/attachments";

// ** Core Imports
import {
  getSliderBarGeometry,
  getSliderPointerClientX,
  isSliderStopCovered,
  normalizeSliderStops,
  normalizeSliderValue,
  percentFromSliderPointer,
  percentToValue,
  readSliderThumbValue as readThumbValue,
  resolveSliderBounds,
  resolveSliderKeyValue,
  resolveSliderTrackPress,
  valueToPercent,
  writeSliderThumbValue as writeThumbValue,
  type SliderRangeValue,
  type SliderStop,
} from "@bridge-ui/core/Domain";
import {
  sliderColorProps as colorProps,
  sliderRoundedProps as roundedProps,
  sliderSizeProps as sizeProps,
} from "@bridge-ui/core/Tokens";
import {
  cn,
  getColorToken,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import {
  baseFieldBridgeKeys,
  useBaseField,
} from "@/Components/BaseField/hooks/useBaseField.svelte";
import type {
  SliderClasses,
  SliderOwnProps,
  SliderProps,
} from "@/Components/Slider/slider.types";
import { useBridgeUI } from "@/Provider/context";
import {
  joinStyles,
  mergePartBind,
  styleToString,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const sliderOnlyBridgeKeys = [
  "max",
  "min",
  "step",
  "color",
  "range",
  "stops",
  "rounded",
  "showStops",
  "showTooltip",
  "defaultValue",
] as const satisfies readonly (keyof SliderOwnProps)[];

export const sliderBridgeKeys = [
  ...baseFieldBridgeKeys,
  ...sliderOnlyBridgeKeys,
] as const satisfies readonly (keyof SliderOwnProps)[];

type SliderLibDefaults = LibDefaultsShape<
  SliderOwnProps,
  | "max"
  | "min"
  | "size"
  | "step"
  | "color"
  | "rounded"
  | "showStops"
  | "showTooltip"
>;

type SliderMerged = MergeLibDefaults<SliderOwnProps, SliderLibDefaults>;

type DragState = {
  thumbIndex: 0 | 1;
};

/**
 * Boxed value owned by the component (a `$bindable` prop or local state).
 */
export type SliderModel = {
  current: number | SliderRangeValue;
};

export type UseSliderOptions = {
  /**
   * Fallback control id, from `$props.id()` in the owning component.
   */
  autoId: string;

  /**
   * Called when the slider value changes.
   */
  onChange?: (value: number | SliderRangeValue) => void;
};

/**
 * Composes slider state, field chrome via BaseField, and pointer/keyboard handlers.
 */
export function useSlider(
  props: () => SliderProps,
  libDefaults: SliderLibDefaults,
  model: SliderModel,
  options: UseSliderOptions,
) {
  const bridge = useBridgeUI();
  let dragRef: null | DragState = null;
  let draggingThumb = $state<0 | 1 | null>(null);
  let hoveringThumb = $state<0 | 1 | null>(null);
  let trackEl: null | HTMLDivElement = null;

  const split = $derived.by(() => {
    return splitComponentProps<SliderProps, typeof sliderBridgeKeys>({
      bridgeKeys: sliderBridgeKeys,
      props: { ...props() },
    });
  });

  const baseFieldInput = $derived.by(() => {
    return pick(split.componentProps, baseFieldBridgeKeys);
  });

  const baseField = useBaseField(
    () => baseFieldInput,
    {
      error: false,
      hideErrorMessage: false,
      size: libDefaults.size ?? "md",
    },
    {
      componentName: "Slider",
      autoId: options.autoId,
      labelHtmlFor: (controlId) => {
        return `${controlId}-thumb-0`;
      },
    },
  );

  const bridgeSlider = useBridgeUIComponent<SliderMerged, "Slider">({
    libDefaults,
    chrome: "BaseField",
    componentName: "Slider",
    props: () => {
      return {
        ...pick(split.componentProps, sliderOnlyBridgeKeys),
        size: baseField.merged.size,
        classes: split.componentProps.classes,
        customProps: split.componentProps.customProps,
      };
    },
  });

  const customProps = $derived.by(() => {
    return bridgeSlider.merged.customProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<SliderClasses>(() => {
    return {
      entry: bridgeSlider.entry,
      props: split.componentProps,
    };
  });

  const bounds = $derived.by(() => {
    return resolveSliderBounds({
      min: bridgeSlider.merged.min,
      max: bridgeSlider.merged.max,
      step: bridgeSlider.merged.step,
    });
  });

  const isRange = $derived.by(() => {
    return Boolean(bridgeSlider.merged.range);
  });

  const showTooltip = $derived.by(() => {
    return bridgeSlider.merged.showTooltip !== false;
  });

  const isRtl = $derived.by(() => {
    return bridge?.global.direction === "rtl";
  });

  const resolvedValue = $derived.by((): number | SliderRangeValue => {
    return normalizeSliderValue({
      ...bounds,
      value: model.current,
      range: isRange,
    });
  });

  const resolvedStops = $derived.by((): SliderStop[] => {
    return normalizeSliderStops({
      min: bounds.min,
      max: bounds.max,
      step: bounds.step,
      stops: bridgeSlider.merged.stops,
      showStops: bridgeSlider.merged.showStops,
    });
  });

  const barGeometry = $derived.by(() => {
    return getSliderBarGeometry({
      range: isRange,
      min: bounds.min,
      max: bounds.max,
      value: resolvedValue,
    });
  });

  const colorClasses = $derived.by(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeSlider.entry?.tokens?.color,
    );

    return getColorToken({
      tokens: classes,
      color: bridgeSlider.merged.color,
      invalid: baseField.invalidated,
    });
  });

  const sizeClasses = $derived.by(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeSlider.entry?.tokens?.size,
    );

    return get(classes, bridgeSlider.merged.size ?? "md");
  });

  const roundedClass = $derived.by(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeSlider.entry?.tokens?.rounded,
    );

    return get(classes, bridgeSlider.merged.rounded ?? "full");
  });

  const hasStopLabels = $derived.by(() => {
    return resolvedStops.some((stop) => {
      return Boolean(stop.label);
    });
  });

  const commitValue = (next: number | SliderRangeValue) => {
    model.current = next;
    options.onChange?.(next);
  };

  const syncDraggingThumb = (thumbIndex: 0 | 1) => {
    if (dragRef) {
      dragRef = { thumbIndex };
    }

    if (draggingThumb !== null) {
      draggingThumb = thumbIndex;
    }
  };

  const setThumbFromPercent = (thumbIndex: 0 | 1, percent: number) => {
    if (baseField.isDisabled || baseField.isReadonly) {
      return;
    }

    const currentBounds = bounds;
    const nextValue = percentToValue(
      percent,
      currentBounds.min,
      currentBounds.max,
      currentBounds.step,
    );

    const written = writeThumbValue(
      resolvedValue,
      thumbIndex,
      nextValue,
      isRange,
    );

    if (written.thumbIndex !== thumbIndex) {
      syncDraggingThumb(written.thumbIndex);
    }

    commitValue(written.value);
  };

  const beginDrag = (event: PointerEvent, thumbIndex: 0 | 1) => {
    if (baseField.isDisabled || baseField.isReadonly) {
      return;
    }

    event.preventDefault();
    dragRef = { thumbIndex };
    draggingThumb = thumbIndex;
  };

  const handleTrackPointerDown = (event: PointerEvent) => {
    if (baseField.isDisabled || baseField.isReadonly) {
      return;
    }

    if ((event.target as HTMLElement).closest("[data-bridge-slider-thumb]")) {
      return;
    }

    const rect = trackEl?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    const percent = percentFromSliderPointer({
      rect,
      isRtl: isRtl,
      clientX: getSliderPointerClientX(event),
    });

    const written = resolveSliderTrackPress({
      percent,
      bounds: bounds,
      range: isRange,
      value: resolvedValue,
    });

    commitValue(written.value);
    beginDrag(event, written.thumbIndex);
  };

  const handleThumbPointerDown =
    (thumbIndex: 0 | 1) => (event: PointerEvent) => {
      beginDrag(event, thumbIndex);
    };

  const handleThumbKeyDown = (thumbIndex: 0 | 1) => (event: KeyboardEvent) => {
    if (baseField.isDisabled || baseField.isReadonly) {
      return;
    }

    const next = resolveSliderKeyValue({
      key: event.key,
      isRtl: isRtl,
      bounds: bounds,
      current: readThumbValue(resolvedValue, thumbIndex, isRange),
    });

    if (next === null) {
      return;
    }

    event.preventDefault();

    const written = writeThumbValue(resolvedValue, thumbIndex, next, isRange);

    commitValue(written.value);

    if (written.thumbIndex !== thumbIndex) {
      document
        .getElementById(`${baseField.controlId}-thumb-${written.thumbIndex}`)
        ?.focus();
    }
  };

  // Track the pointer on window while a thumb is dragged.
  $effect(() => {
    if (draggingThumb === null) {
      return;
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = trackEl?.getBoundingClientRect();

      if (!rect || dragRef === null) {
        return;
      }

      const percent = percentFromSliderPointer({
        rect,
        isRtl: isRtl,
        clientX: getSliderPointerClientX(event),
      });

      setThumbFromPercent(dragRef.thumbIndex, percent);
    };

    const onPointerUp = () => {
      dragRef = null;
      draggingThumb = null;
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  });

  const controlBind = $derived.by(() => {
    return mergePartBind({}, {}, cn("relative w-full min-w-0 flex-1"));
  });

  const trackBind = $derived.by(() => {
    return mergePartBind(
      {
        ...customProps?.track,
        onpointerdown: handleTrackPointerDown,
      },
      {},
      cn({
        "relative w-full select-none touch-none": true,
        "cursor-pointer": !baseField.isDisabled && !baseField.isReadonly,
        "cursor-not-allowed": baseField.isDisabled,
        [sizeClasses?.track ?? ""]: true,
        [roundedClass ?? ""]: true,
        [colorClasses?.track ?? ""]: true,
        [mergedClasses().track ?? ""]: true,
      }),
    );
  });

  const barBind = $derived.by(() => {
    return mergePartBind(
      omit(customProps?.bar ?? {}, ["style"]),
      {
        "aria-hidden": true,
        style: joinStyles(
          styleToString({
            width: barGeometry.width,
            insetInlineStart: barGeometry.start,
          }),
          customProps?.bar?.style,
        ),
      },
      cn({
        "absolute top-0 h-full": true,
        [roundedClass ?? ""]: true,
        [colorClasses?.bar ?? ""]: true,
        [mergedClasses().bar ?? ""]: true,
      }),
    );
  });

  const getThumbBind = (thumbIndex: 0 | 1) => {
    const thumbValue = readThumbValue(resolvedValue, thumbIndex, isRange);
    const percent = valueToPercent(thumbValue, bounds.min, bounds.max);
    const isDragging = draggingThumb === thumbIndex;

    return mergePartBind(
      {
        ...omit(customProps?.thumb ?? {}, ["style"]),
        role: "slider",
        type: "button" as const,
        "aria-valuenow": thumbValue,
        "aria-valuemin": bounds.min,
        "aria-valuemax": bounds.max,
        tabIndex: baseField.isDisabled ? -1 : 0,
        "data-bridge-slider-thumb": thumbIndex,
        disabled: baseField.isDisabled || undefined,
        "aria-orientation": "horizontal" as const,
        "aria-describedby": baseField.ariaDescribedBy,
        onkeydown: handleThumbKeyDown(thumbIndex),
        id: `${baseField.controlId}-thumb-${thumbIndex}`,
        "aria-disabled": baseField.isDisabled || undefined,
        "aria-readonly": baseField.isReadonly || undefined,
        "aria-invalid": baseField.invalidated || undefined,
        onpointerdown: handleThumbPointerDown(thumbIndex),
        style: joinStyles(
          styleToString({
            insetInlineStart: `${percent}%`,
          }),
          customProps?.thumb?.style,
        ),
        onfocus: () => {
          hoveringThumb = thumbIndex;
        },
        onpointerenter: () => {
          hoveringThumb = thumbIndex;
        },
        onblur: () => {
          if (draggingThumb !== thumbIndex) {
            hoveringThumb = hoveringThumb === thumbIndex ? null : hoveringThumb;
          }
        },
        onpointerleave: () => {
          if (draggingThumb !== thumbIndex) {
            hoveringThumb = hoveringThumb === thumbIndex ? null : hoveringThumb;
          }
        },
        "aria-label":
          customProps?.thumb?.["aria-label"] ??
          (isRange
            ? thumbIndex === 0
              ? "Minimum"
              : "Maximum"
            : (isString(baseField.merged.label) && baseField.merged.label) ||
              "Slider"),
      },
      {},
      cn({
        "group/thumb absolute z-10 flex -translate-x-1/2 items-center justify-center bg-transparent leading-none outline-none": true,
        "cursor-grab": !baseField.isDisabled && !baseField.isReadonly,
        "cursor-grabbing": isDragging,
        "cursor-not-allowed": baseField.isDisabled,
        [sizeClasses?.thumb ?? ""]: true,
        [mergedClasses().thumb ?? ""]: true,
      }),
    );
  };

  const getThumbKnobBind = (thumbIndex: 0 | 1) => {
    const isDragging = draggingThumb === thumbIndex;

    return mergePartBind(
      customProps?.thumbKnob,
      { "aria-hidden": true },
      cn({
        "block rounded-full border-2 shadow-sm transition-transform duration-100": true,
        "group-focus-visible/thumb:ring-2 group-focus-visible/thumb:ring-offset-2": true,
        "scale-120": isDragging,
        [colorClasses?.focus ?? ""]: true,
        [sizeClasses?.thumbKnob ?? ""]: true,
        [colorClasses?.thumb ?? ""]: true,
        [mergedClasses().thumbKnob ?? ""]: true,
      }),
    );
  };

  const getStopBind = (stop: SliderStop) => {
    const percent = valueToPercent(stop.value, bounds.min, bounds.max);
    const covered = isSliderStopCovered({
      range: isRange,
      min: bounds.min,
      max: bounds.max,
      stopValue: stop.value,
      value: resolvedValue,
    });

    return mergePartBind(
      omit(customProps?.stop ?? {}, ["style"]),
      {
        "aria-hidden": true,
        style: joinStyles(
          styleToString({
            insetInlineStart: `${percent}%`,
            display: covered ? "none" : undefined,
          }),
          customProps?.stop?.style,
        ),
      },
      cn({
        "absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white dark:bg-dark-400": true,
        [mergedClasses().stop ?? ""]: true,
      }),
    );
  };

  const stopLabelsBind = $derived.by(() => {
    return mergePartBind(
      customProps?.stopLabels,
      { "aria-hidden": true },
      cn({
        "relative h-[1lh] w-full text-xs": true,
        [mergedClasses().stopLabels ?? ""]: true,
      }),
    );
  });

  const getStopLabelBind = (stop: SliderStop) => {
    const percent = valueToPercent(stop.value, bounds.min, bounds.max);

    return mergePartBind(
      omit(customProps?.stopLabel ?? {}, ["style"]),
      {
        style: joinStyles(
          styleToString({
            insetInlineStart: `${percent}%`,
          }),
          customProps?.stopLabel?.style,
        ),
      },
      cn({
        "absolute top-0 -translate-x-1/2 whitespace-nowrap": true,
        "text-dark-700 dark:text-dark-400": !baseField.invalidated,
        "text-error-600 dark:text-error-400": baseField.invalidated,
        [mergedClasses().stopLabel ?? ""]: true,
      }),
    );
  };

  const thumbIndexes = $derived.by((): Array<0 | 1> => {
    return isRange ? [0, 1] : [0];
  });

  const isTooltipOpen = (thumbIndex: 0 | 1) => {
    return (
      showTooltip &&
      (draggingThumb === thumbIndex || hoveringThumb === thumbIndex)
    );
  };

  const attachTrack: Attachment<HTMLDivElement> = (element) => {
    trackEl = element;

    return () => {
      trackEl = null;
    };
  };

  return {
    baseField,
    attachTrack,
    getStopBind,
    getThumbBind,
    isTooltipOpen,
    getStopLabelBind,
    getThumbKnobBind,
    readThumbValue: (thumbIndex: 0 | 1) => {
      return readThumbValue(resolvedValue, thumbIndex, isRange);
    },
    get merged() {
      return bridgeSlider.merged;
    },
    get tooltipProps() {
      return customProps?.tooltip;
    },
    get bounds() {
      return bounds;
    },
    get barBind() {
      return barBind;
    },
    get isRange() {
      return isRange;
    },
    get trackBind() {
      return trackBind;
    },
    get controlBind() {
      return controlBind;
    },
    get showTooltip() {
      return showTooltip;
    },
    get thumbIndexes() {
      return thumbIndexes;
    },
    get resolvedStops() {
      return resolvedStops;
    },
    get resolvedValue() {
      return resolvedValue;
    },
    get hasStopLabels() {
      return hasStopLabels;
    },
    get stopLabelsBind() {
      return stopLabelsBind;
    },
  };
}

export type UseSliderReturn = ReturnType<typeof useSlider>;
