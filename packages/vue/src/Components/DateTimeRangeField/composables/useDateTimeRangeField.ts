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
  isDateRangeValue,
  isFieldOverlayDialog,
  resolveFieldOverlay,
  resolveFieldShowFooter,
  resolveRangePickerOrientation,
  splitComponentProps,
  type DateAdapter,
  type DateAdapterContext,
  type DateRangeValue,
} from "@bridge-ui/core";
import { colorProps as listboxColorProps } from "@bridge-ui/core/Tokens/Listbox";

// ** Local Imports
import { useDateAdapter, useDateAdapterContext } from "@/Adapters/Date";
import type {
  DateTimeRangeFieldCustomProps,
  DateTimeRangeFieldEmits,
  DateTimeRangeFieldOwnProps,
} from "@/Components/DateTimeRangeField/dateTimeRangeField.types";
import {
  formFieldBridgeKeys,
  useFormField,
} from "@/Components/FormField/composables/useFormField";
import type { FormFieldOwnProps } from "@/Components/FormField/formField.types";
import {
  hasNamedSlot,
  mergePartBind,
  resolveFieldAdornmentIconSize,
} from "@/Utils";
import { useBreakpoint } from "@/Utils/useBreakpoint";

const dateTimeRangeFieldBridgeKeys = [
  "ampm",
  "classes",
  "maxDate",
  "maxTime",
  "minDate",
  "minTime",
  "overlay",
  "interval",
  "timeZone",
  "clearable",
  "hideYears",
  "hideMonths",
  "showFooter",
  "customProps",
  "orientation",
  "startOfWeek",
  "defaultValue",
  "disableDates",
  "disableTimes",
  "disableYears",
  "hideWeekdays",
  "disableMonths",
  "hideOutsideDays",
] as const satisfies readonly (keyof DateTimeRangeFieldOwnProps)[];

function formatDateTimeRange(
  value: null | DateRangeValue,
  adapter: DateAdapter,
  context: DateAdapterContext,
  ampm?: boolean,
): string {
  if (isNil(value) || !isDateRangeValue(value)) {
    return "";
  }

  const start =
    `${adapter.format(value[0], context)} ${adapter.formatTime(value[0], context, { ampm })}`.trim();
  const end =
    `${adapter.format(value[1], context)} ${adapter.formatTime(value[1], context, { ampm })}`.trim();

  return `${start} – ${end}`;
}

/**
 * Composes FormField + Menu + DateTimeRangePicker for a datetime range input field.
 */
export function useDateTimeRangeField(
  props: DateTimeRangeFieldOwnProps,
  model: Ref<null | undefined | DateRangeValue>,
  emit: SetupContext<DateTimeRangeFieldEmits>["emit"],
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
      DateTimeRangeFieldOwnProps & Record<string, unknown>,
      typeof dateTimeRangeFieldBridgeKeys
    >({
      props: { ...attrs, ...props },
      bridgeKeys: dateTimeRangeFieldBridgeKeys,
    });
  });

  const dateTimeOnly = computed(() => {
    return split.value.componentProps;
  });

  const context = computed((): DateAdapterContext => {
    return resolveContext(dateTimeOnly.value.timeZone);
  });

  const modelValue = computed(() => {
    return model.value ?? null;
  });

  const clearable = computed(() => {
    return dateTimeOnly.value.clearable !== false;
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
      (hasNamedSlot(slots, "end") ? undefined : "calendar");

    const {
      menu: _menu,
      clearIcon: _clearIcon,
      dateTimeRangePicker: _dateTimeRangePicker,
      ...formFieldOnlyCustom
    } = (dateTimeOnly.value.customProps ?? {}) as DateTimeRangeFieldCustomProps;

    return {
      ...formFieldCustom,
      endIcon,
      classes: dateTimeOnly.value.classes,
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
      componentName: "DateTimeRangeField",
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
    return formatDateTimeRange(
      modelValue.value,
      adapter.value,
      context.value,
      dateTimeOnly.value.ampm,
    );
  });

  function commitValue(next: null | DateRangeValue) {
    model.value = next;
    emit("change", next);
  }

  const resolvedOverlay = computed(() => {
    return resolveFieldOverlay(dateTimeOnly.value.overlay, breakpoint.mobile);
  });

  const orientation = computed(() => {
    return resolveRangePickerOrientation(
      dateTimeOnly.value.orientation,
      resolvedOverlay.value,
      breakpoint.mobile,
    );
  });

  const showFooter = computed(() => {
    return resolveFieldShowFooter(
      dateTimeOnly.value.showFooter,
      breakpoint.mobile,
    );
  });

  function handlePickerChange(next: null | DateRangeValue) {
    commitValue(next);

    // Close when Apply commits (`showFooter`). Without footer, keep open while picking.
    if (showFooter.value) {
      handleOpenChange(false);
    }
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
    return dateTimeOnly.value.overlay;
  });

  const overlayCustomProps = computed(() => {
    return {
      modal: dateTimeOnly.value.customProps?.modal,
      drawer: dateTimeOnly.value.customProps?.drawer,
      menu: {
        anchorEl: containerRef.value,
        placement: "bottom-start" as const,
        ...dateTimeOnly.value.customProps?.menu,
      },
    };
  });

  const dateTimeRangePickerCustomProps = computed(() => {
    return dateTimeOnly.value.customProps?.dateTimeRangePicker;
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
          [dateTimeOnly.value.classes?.clear ?? ""]: true,
        }),
      },
    );
  });

  return {
    open,
    overlay,
    hasValue,
    formField,
    inputBind,
    clearable,
    clearBind,
    clearValue,
    modelValue,
    showFooter,
    orientation,
    pickerClass,
    dateTimeOnly,
    containerRef,
    clearIconSize,
    showClearIcon,
    handleOpenChange,
    handlePickerChange,
    handlePickerCancel,
    overlayCustomProps,
    dateTimeRangePickerCustomProps,
  };
}
