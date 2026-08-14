// ** External Imports
import { get, isNil, pick } from "es-toolkit/compat";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import { useEffect, useMemo, useRef, useState } from "react";

// ** Core Imports
import {
  getSliderBarGeometry,
  getSliderPointerClientX,
  isSliderStopCovered,
  normalizeSliderStops,
  percentFromSliderPointer,
  percentToValue,
  pickClosestSliderThumb,
  resolveSliderBounds,
  resolveSliderDefaultValue,
  snapSliderValue,
  sortSliderRangeValue,
  stepSliderValue,
  valueToPercent,
  writeSliderRangeThumb,
  type SliderRangeValue,
  type SliderStop,
} from "@bridge-ui/core/Domain";
import {
  colorProps,
  invalidatedProps,
  roundedProps,
  sizeProps,
} from "@bridge-ui/core/Tokens/Slider";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import {
  baseFieldBridgeKeys,
  useBaseField,
} from "@/Components/BaseField/hooks/useBaseField";
import type {
  SliderClasses,
  SliderOwnProps,
  SliderProps,
} from "@/Components/Slider/slider.types";
import { useBridgeUI } from "@/Provider";
import {
  derived,
  mergePartBind,
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
  "value",
  "rounded",
  "onChange",
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

function readThumbValue(
  value: number | SliderRangeValue,
  thumbIndex: 0 | 1,
  range: boolean,
) {
  if (range && Array.isArray(value)) {
    return value[thumbIndex];
  }

  return Array.isArray(value) ? value[0] : value;
}

function writeThumbValue(
  value: number | SliderRangeValue,
  thumbIndex: 0 | 1,
  next: number,
  range: boolean,
): { thumbIndex: 0 | 1; value: number | SliderRangeValue } {
  if (!range || !Array.isArray(value)) {
    return { thumbIndex, value: next };
  }

  return writeSliderRangeThumb(value, thumbIndex, next);
}

export function useSlider(props: SliderProps, libDefaults: SliderLibDefaults) {
  const bridge = useBridgeUI();
  const isRtlRef = useRef(false);
  const isRangeRef = useRef(false);
  const disabledRef = useRef(false);
  const readonlyRef = useRef(false);
  const controlledRef = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<null | DragState>(null);
  const boundsRef = useRef(resolveSliderBounds());
  const valueRef = useRef<number | SliderRangeValue>(0);
  const onChangeRef = useRef<SliderOwnProps["onChange"]>(undefined);

  const [draggingThumb, setDraggingThumb] = useState<0 | 1 | null>(null);
  const [hoveringThumb, setHoveringThumb] = useState<0 | 1 | null>(null);

  const { componentProps, inheritedAttrs } = splitComponentProps<
    SliderProps,
    typeof sliderBridgeKeys
  >({
    props,
    bridgeKeys: sliderBridgeKeys,
  });

  const baseField = useBaseField(
    {
      ...pick(componentProps, baseFieldBridgeKeys),
      ...inheritedAttrs,
      slots: props.slots,
    },
    {
      error: false,
      hideErrorMessage: false,
      size: libDefaults.size ?? "md",
    },
    {
      componentName: "Slider",
      labelHtmlFor: (controlId) => {
        return `${controlId}-thumb-0`;
      },
    },
  );

  const { merged, entry: bridgeSlider } = useBridgeUIComponent<
    SliderMerged,
    "Slider"
  >({
    libDefaults,
    componentName: "Slider",
    props: {
      ...pick(componentProps, sliderOnlyBridgeKeys),
      size: baseField.merged.size,
      classes: componentProps.classes,
      customProps: componentProps.customProps,
    },
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<SliderClasses>({
    entry: bridgeSlider,
    props: componentProps,
  });

  const bounds = derived(() => {
    return resolveSliderBounds({
      min: merged.min,
      max: merged.max,
      step: merged.step,
    });
  });

  const isRange = derived(() => {
    return Boolean(merged.range);
  });

  const showTooltip = derived(() => {
    return merged.showTooltip !== false;
  });

  const isRtl = derived(() => {
    return bridge?.global.direction === "rtl";
  });

  const { controlId, isDisabled, isReadonly, invalidated, ariaDescribedBy } =
    baseField;

  const [uncontrolledValue, setUncontrolledValue] = useState(() => {
    const initialBounds = resolveSliderBounds({
      min: props.min ?? libDefaults.min,
      max: props.max ?? libDefaults.max,
      step: props.step ?? libDefaults.step,
    });

    return resolveSliderDefaultValue({
      min: initialBounds.min,
      max: initialBounds.max,
      step: initialBounds.step,
      range: Boolean(props.range),
      defaultValue: props.defaultValue,
    });
  });

  const isControlled = derived(() => {
    return !isNil(componentProps.value);
  });

  const value = derived((): number | SliderRangeValue => {
    if (isControlled) {
      const next = merged.value;

      if (isRange) {
        if (Array.isArray(next)) {
          return sortSliderRangeValue(
            snapSliderValue(next[0], bounds.min, bounds.max, bounds.step),
            snapSliderValue(next[1], bounds.min, bounds.max, bounds.step),
          );
        }

        const single = snapSliderValue(
          typeof next === "number" ? next : bounds.min,
          bounds.min,
          bounds.max,
          bounds.step,
        );

        return [single, single];
      }

      if (Array.isArray(next)) {
        return snapSliderValue(next[0], bounds.min, bounds.max, bounds.step);
      }

      return snapSliderValue(
        typeof next === "number" ? next : bounds.min,
        bounds.min,
        bounds.max,
        bounds.step,
      );
    }

    return uncontrolledValue;
  });

  valueRef.current = value;
  isRtlRef.current = isRtl;
  boundsRef.current = bounds;
  isRangeRef.current = isRange;
  disabledRef.current = isDisabled;
  readonlyRef.current = isReadonly;
  controlledRef.current = isControlled;
  onChangeRef.current = merged.onChange;

  const resolvedStops = derived((): SliderStop[] => {
    return normalizeSliderStops({
      min: bounds.min,
      max: bounds.max,
      step: bounds.step,
      stops: merged.stops,
      showStops: merged.showStops,
    });
  });

  const barGeometry = derived(() => {
    return getSliderBarGeometry({
      value,
      range: isRange,
      min: bounds.min,
      max: bounds.max,
    });
  });

  const colorPalette = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeSlider?.tokens?.color,
    );

    return get(classes, merged.color ?? "primary");
  }, [merged.color, bridgeSlider?.tokens?.color]);

  const invalidatedPalette = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      invalidatedProps,
      bridgeSlider?.tokens?.invalidated,
      merged.customProps?.invalidated,
    );
  }, [merged.customProps?.invalidated, bridgeSlider?.tokens?.invalidated]);

  const colorClasses = derived(() => {
    return invalidated ? invalidatedPalette : colorPalette;
  });

  const sizeClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeSlider?.tokens?.size,
    );

    return get(classes, merged.size ?? "md");
  }, [merged.size, bridgeSlider?.tokens?.size]);

  const roundedClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeSlider?.tokens?.rounded,
    );

    return get(classes, merged.rounded ?? "full");
  }, [merged.rounded, bridgeSlider?.tokens?.rounded]);

  const hasStopLabels = derived(() => {
    return resolvedStops.some((stop) => Boolean(stop.label));
  });

  const controlBind = derived(() => {
    return mergePartBind({}, {}, cn("relative w-full min-w-0 flex-1"));
  });

  const trackBind = derived(() => {
    return mergePartBind(
      {
        ...customProps?.track,
        ref: trackRef,
        onPointerDown: handleTrackPointerDown,
      },
      {},
      cn({
        "relative w-full select-none touch-none": true,
        "cursor-pointer": !isDisabled && !isReadonly,
        "cursor-not-allowed": isDisabled,
        [sizeClasses?.track ?? ""]: true,
        [roundedClass ?? ""]: true,
        [colorClasses?.track ?? ""]: true,
        [mergedClasses.track ?? ""]: true,
      }),
    );
  });

  const barBind = derived(() => {
    return mergePartBind(
      {
        ...customProps?.bar,
        style: {
          width: barGeometry.width,
          insetInlineStart: barGeometry.start,
          ...customProps?.bar?.style,
        },
      },
      { "aria-hidden": true },
      cn({
        "absolute top-0 h-full": true,
        [roundedClass ?? ""]: true,
        [colorClasses?.bar ?? ""]: true,
        [mergedClasses.bar ?? ""]: true,
      }),
    );
  });

  const commitValue = (next: number | SliderRangeValue) => {
    if (!controlledRef.current) {
      setUncontrolledValue(next);
    }

    onChangeRef.current?.(next);
  };

  const syncDraggingThumb = (thumbIndex: 0 | 1) => {
    if (dragRef.current) {
      dragRef.current = { thumbIndex };
    }

    setDraggingThumb((current) => (current === null ? current : thumbIndex));
  };

  const setThumbFromPercent = (thumbIndex: 0 | 1, percent: number) => {
    if (disabledRef.current || readonlyRef.current) {
      return;
    }

    const currentBounds = boundsRef.current;
    const nextValue = percentToValue(
      percent,
      currentBounds.min,
      currentBounds.max,
      currentBounds.step,
    );

    const written = writeThumbValue(
      valueRef.current,
      thumbIndex,
      nextValue,
      isRangeRef.current,
    );

    if (written.thumbIndex !== thumbIndex) {
      syncDraggingThumb(written.thumbIndex);
    }

    commitValue(written.value);
  };

  const beginDrag = (
    event: ReactPointerEvent<HTMLElement>,
    thumbIndex: 0 | 1,
  ) => {
    if (disabledRef.current || readonlyRef.current) {
      return;
    }

    event.preventDefault();
    dragRef.current = { thumbIndex };
    setDraggingThumb(thumbIndex);
  };

  function handleTrackPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (disabledRef.current || readonlyRef.current) {
      return;
    }

    if ((event.target as HTMLElement).closest("[data-bridge-slider-thumb]")) {
      return;
    }

    const rect = trackRef.current?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    const percent = percentFromSliderPointer({
      rect,
      isRtl: isRtlRef.current,
      clientX: getSliderPointerClientX(event.nativeEvent),
    });

    const currentBounds = boundsRef.current;
    const targetValue = percentToValue(
      percent,
      currentBounds.min,
      currentBounds.max,
      currentBounds.step,
    );

    let thumbIndex: 0 | 1 = 0;
    const currentValue = valueRef.current;

    if (isRangeRef.current && Array.isArray(currentValue)) {
      thumbIndex = pickClosestSliderThumb(
        targetValue,
        currentValue[0],
        currentValue[1],
      );
    }

    const written = writeThumbValue(
      currentValue,
      thumbIndex,
      targetValue,
      isRangeRef.current,
    );

    commitValue(written.value);
    beginDrag(event, written.thumbIndex);
  }

  const handleThumbPointerDown =
    (thumbIndex: 0 | 1) => (event: ReactPointerEvent<HTMLButtonElement>) => {
      beginDrag(event, thumbIndex);
    };

  const handleThumbKeyDown =
    (thumbIndex: 0 | 1) => (event: ReactKeyboardEvent<HTMLButtonElement>) => {
      if (disabledRef.current || readonlyRef.current) {
        return;
      }

      const currentBounds = boundsRef.current;
      const current = readThumbValue(
        valueRef.current,
        thumbIndex,
        isRangeRef.current,
      );
      let next: null | number = null;
      const rtl = isRtlRef.current;

      switch (event.key) {
        case "ArrowRight":
          next = stepSliderValue(
            current,
            rtl ? -1 : 1,
            currentBounds.min,
            currentBounds.max,
            currentBounds.step,
          );
          break;
        case "ArrowLeft":
          next = stepSliderValue(
            current,
            rtl ? 1 : -1,
            currentBounds.min,
            currentBounds.max,
            currentBounds.step,
          );
          break;
        case "ArrowUp":
          next = stepSliderValue(
            current,
            1,
            currentBounds.min,
            currentBounds.max,
            currentBounds.step,
          );
          break;
        case "ArrowDown":
          next = stepSliderValue(
            current,
            -1,
            currentBounds.min,
            currentBounds.max,
            currentBounds.step,
          );
          break;
        case "Home":
          next = currentBounds.min;
          break;
        case "End":
          next = currentBounds.max;
          break;
        case "PageUp":
          next = stepSliderValue(
            current,
            1,
            currentBounds.min,
            currentBounds.max,
            currentBounds.step * 10,
          );
          break;
        case "PageDown":
          next = stepSliderValue(
            current,
            -1,
            currentBounds.min,
            currentBounds.max,
            currentBounds.step * 10,
          );
          break;
        default:
          break;
      }

      if (next === null) {
        return;
      }

      event.preventDefault();

      const written = writeThumbValue(
        valueRef.current,
        thumbIndex,
        next,
        isRangeRef.current,
      );

      commitValue(written.value);

      if (written.thumbIndex !== thumbIndex) {
        document
          .getElementById(`${controlId}-thumb-${written.thumbIndex}`)
          ?.focus();
      }
    };

  useEffect(() => {
    if (draggingThumb === null) {
      return;
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = trackRef.current?.getBoundingClientRect();

      if (!rect || dragRef.current === null) {
        return;
      }

      const percent = percentFromSliderPointer({
        rect,
        isRtl: isRtlRef.current,
        clientX: getSliderPointerClientX(event),
      });

      setThumbFromPercent(dragRef.current.thumbIndex, percent);
    };

    const onPointerUp = () => {
      dragRef.current = null;
      setDraggingThumb(null);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [draggingThumb]);

  const getThumbBind = (thumbIndex: 0 | 1) => {
    const thumbValue = readThumbValue(value, thumbIndex, isRange);
    const percent = valueToPercent(thumbValue, bounds.min, bounds.max);
    const isDragging = draggingThumb === thumbIndex;

    return mergePartBind(
      {
        ...customProps?.thumb,
        role: "slider",
        type: "button" as const,
        "aria-valuemin": bounds.min,
        "aria-valuemax": bounds.max,
        "aria-valuenow": thumbValue,
        tabIndex: isDisabled ? -1 : 0,
        disabled: isDisabled || undefined,
        "aria-describedby": ariaDescribedBy,
        id: `${controlId}-thumb-${thumbIndex}`,
        "data-bridge-slider-thumb": thumbIndex,
        "aria-disabled": isDisabled || undefined,
        "aria-readonly": isReadonly || undefined,
        "aria-invalid": invalidated || undefined,
        "aria-orientation": "horizontal" as const,
        onKeyDown: handleThumbKeyDown(thumbIndex),
        onFocus: () => setHoveringThumb(thumbIndex),
        onPointerDown: handleThumbPointerDown(thumbIndex),
        onPointerEnter: () => setHoveringThumb(thumbIndex),
        style: {
          insetInlineStart: `${percent}%`,
          ...customProps?.thumb?.style,
        },
        onBlur: () => {
          if (draggingThumb !== thumbIndex) {
            setHoveringThumb((current) =>
              current === thumbIndex ? null : current,
            );
          }
        },
        onPointerLeave: () => {
          if (draggingThumb !== thumbIndex) {
            setHoveringThumb((current) =>
              current === thumbIndex ? null : current,
            );
          }
        },
        "aria-label":
          customProps?.thumb?.["aria-label"] ??
          (isRange
            ? thumbIndex === 0
              ? "Minimum"
              : "Maximum"
            : baseField.merged.label || "Slider"),
      },
      {},
      cn({
        "group/thumb absolute z-10 flex -translate-x-1/2 items-center justify-center bg-transparent leading-none outline-none": true,
        "cursor-grab": !isDisabled && !isReadonly,
        "cursor-grabbing": isDragging,
        "cursor-not-allowed": isDisabled,
        [sizeClasses?.thumb ?? ""]: true,
        [mergedClasses.thumb ?? ""]: true,
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
        [mergedClasses.thumbKnob ?? ""]: true,
      }),
    );
  };

  const getStopBind = (stop: SliderStop) => {
    const percent = valueToPercent(stop.value, bounds.min, bounds.max);
    const covered = isSliderStopCovered({
      value,
      range: isRange,
      min: bounds.min,
      max: bounds.max,
      stopValue: stop.value,
    });

    return mergePartBind(
      {
        ...customProps?.stop,
        style: {
          insetInlineStart: `${percent}%`,
          display: covered ? "none" : undefined,
          ...customProps?.stop?.style,
        },
      },
      { "aria-hidden": true },
      cn({
        "absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white dark:bg-dark-400": true,
        [mergedClasses.stop ?? ""]: true,
      }),
    );
  };

  const stopLabelsBind = derived(() => {
    return mergePartBind(
      customProps?.stopLabels,
      { "aria-hidden": true },
      cn({
        "relative h-[1lh] w-full text-xs": true,
        [mergedClasses.stopLabels ?? ""]: true,
      }),
    );
  });

  const getStopLabelBind = (stop: SliderStop) => {
    const percent = valueToPercent(stop.value, bounds.min, bounds.max);

    return mergePartBind(
      {
        ...customProps?.stopLabel,
        style: {
          insetInlineStart: `${percent}%`,
          ...customProps?.stopLabel?.style,
        },
      },
      {},
      cn({
        "absolute top-0 -translate-x-1/2 whitespace-nowrap": true,
        "text-dark-700 dark:text-dark-400": !invalidated,
        [invalidatedPalette.stopLabel ?? ""]: invalidated,
        [mergedClasses.stopLabel ?? ""]: true,
      }),
    );
  };

  const thumbIndexes = derived((): Array<0 | 1> => {
    return isRange ? [0, 1] : [0];
  });

  const isTooltipOpen = (thumbIndex: 0 | 1) =>
    showTooltip &&
    (draggingThumb === thumbIndex || hoveringThumb === thumbIndex);

  return {
    value,
    merged,
    bounds,
    barBind,
    isRange,
    baseField,
    trackBind,
    controlBind,
    showTooltip,
    getStopBind,
    thumbIndexes,
    getThumbBind,
    resolvedStops,
    isTooltipOpen,
    hasStopLabels,
    stopLabelsBind,
    getStopLabelBind,
    getThumbKnobBind,
    tooltipProps: customProps?.tooltip,
    readThumbValue: (thumbIndex: 0 | 1) =>
      readThumbValue(value, thumbIndex, isRange),
  };
}

export type UseSliderReturn = ReturnType<typeof useSlider>;
