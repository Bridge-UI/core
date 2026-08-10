// ** External Imports
import { get, isNil, omit } from "es-toolkit/compat";
import {
  computed,
  ref,
  useAttrs,
  useSlots,
  type Ref,
  type SetupContext,
} from "vue";

// ** Core Imports
import {
  cn,
  isFieldOverlayDialog,
  isTimeRangeValue,
  resolveFieldOverlay,
  resolveFieldShowFooter,
  splitComponentProps,
  type DateAdapter,
  type DateAdapterContext,
  type TimeRangeValue,
} from "@bridge-ui/core";
import { colorProps as listboxColorProps } from "@bridge-ui/core/Tokens/Listbox";

// ** Local Imports
import { useDateAdapter, useDateAdapterContext } from "@/Adapters/Date";
import {
  formFieldBridgeKeys,
  useFormField,
} from "@/Components/FormField/composables/useFormField";
import type { FormFieldOwnProps } from "@/Components/FormField/formField.types";
import type {
  TimeRangeFieldCustomProps,
  TimeRangeFieldEmits,
  TimeRangeFieldOwnProps,
} from "@/Components/TimeRangeField/timeRangeField.types";
import {
  hasNamedSlot,
  mergePartBind,
  resolveFieldAdornmentIconSize,
} from "@/Utils";
import { useBreakpoint } from "@/Utils/useBreakpoint";

const timeRangeFieldBridgeKeys = [
  "ampm",
  "classes",
  "maxTime",
  "minTime",
  "overlay",
  "interval",
  "timeZone",
  "clearable",
  "showFooter",
  "customProps",
  "defaultValue",
  "disableTimes",
] as const satisfies readonly (keyof TimeRangeFieldOwnProps)[];

function formatTimeRange(
  value: null | TimeRangeValue,
  adapter: DateAdapter,
  context: DateAdapterContext,
  ampm?: boolean,
): string {
  if (isNil(value) || !isTimeRangeValue(value)) {
    return "";
  }

  return `${adapter.formatTime(value[0], context, { ampm })} – ${adapter.formatTime(value[1], context, { ampm })}`;
}

/**
 * Composes FormField + Menu + TimeRangePicker for a time range input field.
 */
export function useTimeRangeField(
  props: TimeRangeFieldOwnProps,
  model: Ref<null | undefined | TimeRangeValue>,
  emit: SetupContext<TimeRangeFieldEmits>["emit"],
) {
  const attrs = useAttrs();
  const slots = useSlots();
  const adapter = useDateAdapter();
  const breakpoint = useBreakpoint();
  const resolveContext = useDateAdapterContext();

  const open = ref(false);
  const containerRef = ref<null | HTMLElement>(null);

  const split = computed(() => {
    return splitComponentProps<
      TimeRangeFieldOwnProps & Record<string, unknown>,
      typeof timeRangeFieldBridgeKeys
    >({
      props: { ...attrs, ...props },
      bridgeKeys: timeRangeFieldBridgeKeys,
    });
  });

  const timeOnly = computed(() => {
    return split.value.componentProps;
  });

  const context = computed((): DateAdapterContext => {
    return resolveContext(timeOnly.value.timeZone);
  });

  const modelValue = computed(() => {
    return model.value ?? null;
  });

  const clearable = computed(() => {
    return timeOnly.value.clearable !== false;
  });

  const hasValue = computed(() => {
    return !isNil(modelValue.value);
  });

  const handleContainerRef = (element: null | Element) => {
    containerRef.value = element instanceof HTMLElement ? element : null;
  };

  function handleOpenChange(next: boolean) {
    open.value = next;

    if (next) {
      emit("open");
    } else {
      emit("close");
    }
  }

  const inherited = computed(() => {
    return omit(split.value.inheritedAttrs, ["class"]);
  });

  const formFieldInput = computed((): Omit<FormFieldOwnProps, "field"> => {
    const formFieldCustom = splitComponentProps<
      Omit<FormFieldOwnProps, "field">,
      typeof formFieldBridgeKeys
    >({
      bridgeKeys: formFieldBridgeKeys,
      props: inherited.value as Omit<FormFieldOwnProps, "field">,
    }).componentProps;

    const endIcon =
      formFieldCustom.endIcon ??
      (hasNamedSlot(slots, "end") ? undefined : "clock");

    const {
      menu: _menu,
      clearIcon: _clearIcon,
      timeRangePicker: _timeRangePicker,
      ...formFieldOnlyCustom
    } = (timeOnly.value.customProps ?? {}) as TimeRangeFieldCustomProps;

    return {
      ...formFieldCustom,
      endIcon,
      classes: timeOnly.value.classes,
      customProps: {
        ...formFieldOnlyCustom,
        container: mergePartBind(
          formFieldOnlyCustom.container,
          {},
          {
            ref: handleContainerRef,
            class: cn({
              "cursor-pointer": !props.disabled && !props.readonly,
            }),
            onClick: (event: MouseEvent) => {
              if (props.disabled || props.readonly) {
                return;
              }

              if ((event.target as HTMLElement).closest("[data-field-clear]")) {
                return;
              }

              handleOpenChange(true);
            },
          },
        ),
      },
    };
  });

  const formField = useFormField(
    () => formFieldInput.value,
    {
      size: "md",
      rounded: "md",
      color: "primary",
      variant: "outline",
      showErrorIcon: true,
    },
    {
      componentName: "TimeRangeField",
    },
  );

  const showClearIcon = computed(() => {
    return (
      hasValue.value &&
      clearable.value &&
      !props.readonly &&
      !formField.isDisabled.value
    );
  });

  const displayText = computed(() => {
    return formatTimeRange(
      modelValue.value,
      adapter.value,
      context.value,
      timeOnly.value.ampm,
    );
  });

  function commitValue(next: null | TimeRangeValue) {
    model.value = next;
    emit("change", next);
  }

  const showFooter = computed(() => {
    return resolveFieldShowFooter(timeOnly.value.showFooter, breakpoint.mobile);
  });

  function handlePickerChange(next: null | TimeRangeValue) {
    commitValue(next);
    // Close on immediate select or when Apply commits (`showFooter`).
    handleOpenChange(false);
  }

  function handlePickerCancel() {
    handleOpenChange(false);
  }

  function clearValue(event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();

    if (props.disabled || props.readonly) {
      return;
    }

    commitValue(null);
    emit("clear");
    handleOpenChange(false);
  }

  function handleClearPointer(event: MouseEvent) {
    event.preventDefault();
  }

  const inputBind = computed(() => {
    return mergePartBind(
      {
        readonly: true,
        value: displayText.value,
        onFocus: (event: FocusEvent) => {
          formField.inputBind.value.onFocus?.(event);
          handleOpenChange(true);
        },
        onKeydown: (event: KeyboardEvent) => {
          formField.inputBind.value.onKeydown?.(event);

          if (event.key === "Escape") {
            handleOpenChange(false);
          }
        },
      },
      undefined,
      formField.inputBind.value,
    );
  });

  const overlay = computed(() => {
    return timeOnly.value.overlay;
  });

  const overlayCustomProps = computed(() => {
    return {
      modal: timeOnly.value.customProps?.modal,
      drawer: timeOnly.value.customProps?.drawer,
      menu: {
        anchorEl: containerRef.value,
        placement: "bottom-start" as const,
        ...timeOnly.value.customProps?.menu,
      },
    };
  });

  const timeRangePickerCustomProps = computed(() => {
    return timeOnly.value.customProps?.timeRangePicker;
  });

  const resolvedOverlay = computed(() => {
    return resolveFieldOverlay(timeOnly.value.overlay, breakpoint.mobile);
  });

  const pickerClass = computed(() => {
    return isFieldOverlayDialog(resolvedOverlay.value)
      ? "mx-auto shadow-none"
      : undefined;
  });

  const clearIconSize = computed(() => {
    return resolveFieldAdornmentIconSize(formField.merged.value.size);
  });

  const clearTone = computed(() => {
    return (
      get(listboxColorProps, [
        formField.merged.value.color ?? "primary",
        "clear",
      ]) ??
      "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
    );
  });

  const clearBind = computed(() => {
    return mergePartBind(
      {},
      {},
      {
        tabindex: 0,
        role: "button",
        "data-field-clear": true,
        onMousedown: handleClearPointer,
        class: cn({
          "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-sm transition-colors duration-150": true,
          [clearTone.value]: true,
          [timeOnly.value.classes?.clear ?? ""]: true,
        }),
      },
    );
  });

  return {
    open,
    overlay,
    hasValue,
    timeOnly,
    formField,
    inputBind,
    clearable,
    clearBind,
    clearValue,
    modelValue,
    showFooter,
    pickerClass,
    containerRef,
    clearIconSize,
    showClearIcon,
    handleOpenChange,
    handlePickerChange,
    handlePickerCancel,
    overlayCustomProps,
    timeRangePickerCustomProps,
  };
}
