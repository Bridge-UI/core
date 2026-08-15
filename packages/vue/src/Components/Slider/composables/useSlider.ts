// ** External Imports
import { get, omit, pick } from "es-toolkit/compat";
import {
  computed,
  ref,
  toValue,
  useAttrs,
  watch,
  type MaybeRefOrGetter,
  type Ref,
} from "vue";

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
  snapSliderValue,
  sortSliderRangeValue,
  stepSliderValue,
  valueToPercent,
  writeSliderRangeThumb,
  type SliderRangeValue,
  type SliderStop,
} from "@bridge-ui/core/Domain";
import {
  sliderColorProps as colorProps,
  sliderInvalidatedProps as invalidatedProps,
  sliderRoundedProps as roundedProps,
  sliderSizeProps as sizeProps,
} from "@bridge-ui/core/Tokens";
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
} from "@/Components/BaseField/composables/useBaseField";
import type {
  SliderClasses,
  SliderOwnProps,
  SliderProps,
} from "@/Components/Slider/slider.types";
import { useBridgeUI } from "@/Provider/useBridgeUI";
import {
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

export type UseSliderOptions = {
  /**
   * Called when the slider value changes.
   */
  onChange?: (value: number | SliderRangeValue) => void;
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

/**
 * Composes slider state, field chrome via BaseField, and pointer/keyboard handlers.
 */
export function useSlider(
  props: MaybeRefOrGetter<SliderOwnProps>,
  libDefaults: SliderLibDefaults,
  value: Ref<number | SliderRangeValue>,
  options: UseSliderOptions = {},
) {
  const attrs = useAttrs();
  const bridge = useBridgeUI();
  const dragRef = ref<null | DragState>(null);
  const draggingThumb = ref<0 | 1 | null>(null);
  const hoveringThumb = ref<0 | 1 | null>(null);
  const trackRef = ref<null | HTMLDivElement>(null);

  const split = computed(() => {
    return splitComponentProps<SliderProps, typeof sliderBridgeKeys>({
      bridgeKeys: sliderBridgeKeys,
      props: { ...attrs, ...toValue(props) },
    });
  });

  const baseFieldInput = computed(() => {
    return pick(split.value.componentProps, baseFieldBridgeKeys);
  });

  const baseField = useBaseField(
    baseFieldInput,
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
    props: () => {
      return {
        ...pick(split.value.componentProps, sliderOnlyBridgeKeys),
        size: baseField.merged.value.size,
        classes: split.value.componentProps.classes,
        customProps: split.value.componentProps.customProps,
      };
    },
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<SliderClasses>({
    entry: bridgeSlider,
    props: () => {
      return split.value.componentProps;
    },
  });

  const bounds = computed(() => {
    return resolveSliderBounds({
      min: merged.value.min,
      max: merged.value.max,
      step: merged.value.step,
    });
  });

  const isRange = computed(() => {
    return Boolean(merged.value.range);
  });

  const showTooltip = computed(() => {
    return merged.value.showTooltip !== false;
  });

  const isRtl = computed(() => {
    return bridge?.global.value.direction === "rtl";
  });

  const { controlId, isDisabled, isReadonly, invalidated, ariaDescribedBy } =
    baseField;

  const resolvedValue = computed((): number | SliderRangeValue => {
    const raw = value.value;
    const currentBounds = bounds.value;
    const range = isRange.value;

    if (range) {
      if (Array.isArray(raw)) {
        return sortSliderRangeValue(
          snapSliderValue(
            raw[0],
            currentBounds.min,
            currentBounds.max,
            currentBounds.step,
          ),
          snapSliderValue(
            raw[1],
            currentBounds.min,
            currentBounds.max,
            currentBounds.step,
          ),
        );
      }

      const single = snapSliderValue(
        typeof raw === "number" ? raw : currentBounds.min,
        currentBounds.min,
        currentBounds.max,
        currentBounds.step,
      );

      return [single, single];
    }

    if (Array.isArray(raw)) {
      return snapSliderValue(
        raw[0],
        currentBounds.min,
        currentBounds.max,
        currentBounds.step,
      );
    }

    return snapSliderValue(
      typeof raw === "number" ? raw : currentBounds.min,
      currentBounds.min,
      currentBounds.max,
      currentBounds.step,
    );
  });

  const resolvedStops = computed((): SliderStop[] => {
    return normalizeSliderStops({
      min: bounds.value.min,
      max: bounds.value.max,
      step: bounds.value.step,
      stops: merged.value.stops,
      showStops: merged.value.showStops,
    });
  });

  const barGeometry = computed(() => {
    return getSliderBarGeometry({
      range: isRange.value,
      min: bounds.value.min,
      max: bounds.value.max,
      value: resolvedValue.value,
    });
  });

  const colorPalette = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeSlider.value?.tokens?.color,
    );

    return get(classes, merged.value.color ?? "primary");
  });

  const invalidatedPalette = computed(() => {
    return mergeBridgeUILayeredClasses(
      invalidatedProps,
      bridgeSlider.value?.tokens?.invalidated,
      merged.value.customProps?.invalidated,
    );
  });

  const colorClasses = computed(() => {
    return invalidated.value ? invalidatedPalette.value : colorPalette.value;
  });

  const sizeClasses = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeSlider.value?.tokens?.size,
    );

    return get(classes, merged.value.size ?? "md");
  });

  const roundedClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeSlider.value?.tokens?.rounded,
    );

    return get(classes, merged.value.rounded ?? "full");
  });

  const hasStopLabels = computed(() => {
    return resolvedStops.value.some((stop) => {
      return Boolean(stop.label);
    });
  });

  const commitValue = (next: number | SliderRangeValue) => {
    value.value = next;
    options.onChange?.(next);
  };

  const syncDraggingThumb = (thumbIndex: 0 | 1) => {
    if (dragRef.value) {
      dragRef.value = { thumbIndex };
    }

    if (draggingThumb.value !== null) {
      draggingThumb.value = thumbIndex;
    }
  };

  const setThumbFromPercent = (thumbIndex: 0 | 1, percent: number) => {
    if (isDisabled.value || isReadonly.value) {
      return;
    }

    const currentBounds = bounds.value;
    const nextValue = percentToValue(
      percent,
      currentBounds.min,
      currentBounds.max,
      currentBounds.step,
    );

    const written = writeThumbValue(
      resolvedValue.value,
      thumbIndex,
      nextValue,
      isRange.value,
    );

    if (written.thumbIndex !== thumbIndex) {
      syncDraggingThumb(written.thumbIndex);
    }

    commitValue(written.value);
  };

  const beginDrag = (event: PointerEvent, thumbIndex: 0 | 1) => {
    if (isDisabled.value || isReadonly.value) {
      return;
    }

    event.preventDefault();
    dragRef.value = { thumbIndex };
    draggingThumb.value = thumbIndex;
  };

  const handleTrackPointerDown = (event: PointerEvent) => {
    if (isDisabled.value || isReadonly.value) {
      return;
    }

    if ((event.target as HTMLElement).closest("[data-bridge-slider-thumb]")) {
      return;
    }

    const rect = trackRef.value?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    const percent = percentFromSliderPointer({
      rect,
      isRtl: isRtl.value,
      clientX: getSliderPointerClientX(event),
    });

    const currentBounds = bounds.value;
    const targetValue = percentToValue(
      percent,
      currentBounds.min,
      currentBounds.max,
      currentBounds.step,
    );

    let thumbIndex: 0 | 1 = 0;
    const currentValue = resolvedValue.value;

    if (isRange.value && Array.isArray(currentValue)) {
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
      isRange.value,
    );

    commitValue(written.value);
    beginDrag(event, written.thumbIndex);
  };

  const handleThumbPointerDown =
    (thumbIndex: 0 | 1) => (event: PointerEvent) => {
      beginDrag(event, thumbIndex);
    };

  const handleThumbKeyDown = (thumbIndex: 0 | 1) => (event: KeyboardEvent) => {
    if (isDisabled.value || isReadonly.value) {
      return;
    }

    const currentBounds = bounds.value;
    const current = readThumbValue(
      resolvedValue.value,
      thumbIndex,
      isRange.value,
    );
    let next: null | number = null;
    const rtl = isRtl.value;

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
      resolvedValue.value,
      thumbIndex,
      next,
      isRange.value,
    );

    commitValue(written.value);

    if (written.thumbIndex !== thumbIndex) {
      document
        .getElementById(`${controlId.value}-thumb-${written.thumbIndex}`)
        ?.focus();
    }
  };

  watch(draggingThumb, (current, _previous, onCleanup) => {
    if (current === null) {
      return;
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = trackRef.value?.getBoundingClientRect();

      if (!rect || dragRef.value === null) {
        return;
      }

      const percent = percentFromSliderPointer({
        rect,
        isRtl: isRtl.value,
        clientX: getSliderPointerClientX(event),
      });

      setThumbFromPercent(dragRef.value.thumbIndex, percent);
    };

    const onPointerUp = () => {
      dragRef.value = null;
      draggingThumb.value = null;
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    onCleanup(() => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    });
  });

  const controlBind = computed(() => {
    return mergePartBind({}, {}, cn("relative w-full min-w-0 flex-1"));
  });

  const trackBind = computed(() => {
    return mergePartBind(
      {
        ...omit(customProps.value?.track ?? {}, ["style"]),
        onPointerdown: handleTrackPointerDown,
      },
      {},
      cn({
        "relative w-full select-none touch-none": true,
        "cursor-pointer": !isDisabled.value && !isReadonly.value,
        "cursor-not-allowed": isDisabled.value,
        [sizeClasses.value?.track ?? ""]: true,
        [roundedClass.value ?? ""]: true,
        [colorClasses.value?.track ?? ""]: true,
        [mergedClasses.value.track ?? ""]: true,
      }),
    );
  });

  const barBind = computed(() => {
    return mergePartBind(
      omit(customProps.value?.bar ?? {}, ["style"]),
      {
        "aria-hidden": true,
        style: {
          width: barGeometry.value.width,
          insetInlineStart: barGeometry.value.start,
        },
      },
      cn({
        "absolute top-0 h-full": true,
        [roundedClass.value ?? ""]: true,
        [colorClasses.value?.bar ?? ""]: true,
        [mergedClasses.value.bar ?? ""]: true,
      }),
    );
  });

  const getThumbBind = (thumbIndex: 0 | 1) => {
    const thumbValue = readThumbValue(
      resolvedValue.value,
      thumbIndex,
      isRange.value,
    );
    const percent = valueToPercent(
      thumbValue,
      bounds.value.min,
      bounds.value.max,
    );
    const isDragging = draggingThumb.value === thumbIndex;

    return mergePartBind(
      {
        ...omit(customProps.value?.thumb ?? {}, ["style"]),
        role: "slider",
        type: "button" as const,
        "aria-valuenow": thumbValue,
        "aria-valuemin": bounds.value.min,
        "aria-valuemax": bounds.value.max,
        tabIndex: isDisabled.value ? -1 : 0,
        "data-bridge-slider-thumb": thumbIndex,
        disabled: isDisabled.value || undefined,
        "aria-orientation": "horizontal" as const,
        "aria-describedby": ariaDescribedBy.value,
        onKeydown: handleThumbKeyDown(thumbIndex),
        id: `${controlId.value}-thumb-${thumbIndex}`,
        "aria-disabled": isDisabled.value || undefined,
        "aria-readonly": isReadonly.value || undefined,
        "aria-invalid": invalidated.value || undefined,
        onPointerdown: handleThumbPointerDown(thumbIndex),
        style: {
          insetInlineStart: `${percent}%`,
        },
        onFocus: () => {
          hoveringThumb.value = thumbIndex;
        },
        onPointerenter: () => {
          hoveringThumb.value = thumbIndex;
        },
        onBlur: () => {
          if (draggingThumb.value !== thumbIndex) {
            hoveringThumb.value =
              hoveringThumb.value === thumbIndex ? null : hoveringThumb.value;
          }
        },
        onPointerleave: () => {
          if (draggingThumb.value !== thumbIndex) {
            hoveringThumb.value =
              hoveringThumb.value === thumbIndex ? null : hoveringThumb.value;
          }
        },
        "aria-label":
          customProps.value?.thumb?.["aria-label"] ??
          (isRange.value
            ? thumbIndex === 0
              ? "Minimum"
              : "Maximum"
            : baseField.merged.value.label || "Slider"),
      },
      {},
      cn({
        "group/thumb absolute z-10 flex -translate-x-1/2 items-center justify-center bg-transparent leading-none outline-none": true,
        "cursor-grab": !isDisabled.value && !isReadonly.value,
        "cursor-grabbing": isDragging,
        "cursor-not-allowed": isDisabled.value,
        [sizeClasses.value?.thumb ?? ""]: true,
        [mergedClasses.value.thumb ?? ""]: true,
      }),
    );
  };

  const getThumbKnobBind = (thumbIndex: 0 | 1) => {
    const isDragging = draggingThumb.value === thumbIndex;

    return mergePartBind(
      customProps.value?.thumbKnob,
      { "aria-hidden": true },
      cn({
        "block rounded-full border-2 shadow-sm transition-transform duration-100": true,
        "group-focus-visible/thumb:ring-2 group-focus-visible/thumb:ring-offset-2": true,
        "scale-120": isDragging,
        [colorClasses.value?.focus ?? ""]: true,
        [sizeClasses.value?.thumbKnob ?? ""]: true,
        [colorClasses.value?.thumb ?? ""]: true,
        [mergedClasses.value.thumbKnob ?? ""]: true,
      }),
    );
  };

  const getStopBind = (stop: SliderStop) => {
    const percent = valueToPercent(
      stop.value,
      bounds.value.min,
      bounds.value.max,
    );
    const covered = isSliderStopCovered({
      range: isRange.value,
      min: bounds.value.min,
      max: bounds.value.max,
      stopValue: stop.value,
      value: resolvedValue.value,
    });

    return mergePartBind(
      omit(customProps.value?.stop ?? {}, ["style"]),
      {
        "aria-hidden": true,
        style: {
          insetInlineStart: `${percent}%`,
          display: covered ? "none" : undefined,
        },
      },
      cn({
        "absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white dark:bg-dark-400": true,
        [mergedClasses.value.stop ?? ""]: true,
      }),
    );
  };

  const stopLabelsBind = computed(() => {
    return mergePartBind(
      customProps.value?.stopLabels,
      { "aria-hidden": true },
      cn({
        "relative h-[1lh] w-full text-xs": true,
        [mergedClasses.value.stopLabels ?? ""]: true,
      }),
    );
  });

  const getStopLabelBind = (stop: SliderStop) => {
    const percent = valueToPercent(
      stop.value,
      bounds.value.min,
      bounds.value.max,
    );

    return mergePartBind(
      omit(customProps.value?.stopLabel ?? {}, ["style"]),
      {
        style: {
          insetInlineStart: `${percent}%`,
        },
      },
      cn({
        "absolute top-0 -translate-x-1/2 whitespace-nowrap": true,
        "text-dark-700 dark:text-dark-400": !invalidated.value,
        [invalidatedPalette.value.stopLabel ?? ""]: invalidated.value,
        [mergedClasses.value.stopLabel ?? ""]: true,
      }),
    );
  };

  const thumbIndexes = computed((): Array<0 | 1> => {
    return isRange.value ? [0, 1] : [0];
  });

  const isTooltipOpen = (thumbIndex: 0 | 1) => {
    return (
      showTooltip.value &&
      (draggingThumb.value === thumbIndex || hoveringThumb.value === thumbIndex)
    );
  };

  return {
    bounds,
    merged,
    barBind,
    isRange,
    trackRef,
    baseField,
    trackBind,
    controlBind,
    showTooltip,
    getStopBind,
    thumbIndexes,
    getThumbBind,
    resolvedStops,
    resolvedValue,
    isTooltipOpen,
    hasStopLabels,
    stopLabelsBind,
    getStopLabelBind,
    getThumbKnobBind,
    tooltipProps: computed(() => {
      return customProps.value?.tooltip;
    }),
    readThumbValue: (thumbIndex: 0 | 1) => {
      return readThumbValue(resolvedValue.value, thumbIndex, isRange.value);
    },
  };
}

export type UseSliderReturn = ReturnType<typeof useSlider>;
