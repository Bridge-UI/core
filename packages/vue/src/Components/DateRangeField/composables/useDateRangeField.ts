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
import type { DateAdapter, DateAdapterContext } from "@bridge-ui/core/Adapters";
import {
  isDateRangeValue,
  resolveFieldOverlay,
  resolveFieldPickerClassName,
  resolveRangePickerOrientation,
  type DateRangeValue,
} from "@bridge-ui/core/Domain";
import { listboxColorProps } from "@bridge-ui/core/Tokens";
import { cn, splitComponentProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useDateAdapter, useDateAdapterContext } from "@/Adapters/Date";
import type {
  DateRangeFieldCustomProps,
  DateRangeFieldEmits,
  DateRangeFieldOwnProps,
} from "@/Components/DateRangeField/dateRangeField.types";
import {
  formFieldBridgeKeys,
  useFormField,
} from "@/Components/FormField/composables/useFormField";
import type { FormFieldOwnProps } from "@/Components/FormField/formField.types";
import {
  hasNamedSlot,
  mergePartBind,
  resolveFieldAdornmentIconSize,
  useFieldShowFooter,
  usePickerFill,
} from "@/Utils";
import { useBreakpoint } from "@/Utils/useBreakpoint";

const dateRangeFieldBridgeKeys = [
  "fill",
  "classes",
  "maxDate",
  "minDate",
  "overlay",
  "editable",
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
  "disableYears",
  "hideWeekdays",
  "disableMonths",
  "hideOutsideDays",
] as const satisfies readonly (keyof DateRangeFieldOwnProps)[];

function formatRange(
  value: null | DateRangeValue,
  adapter: DateAdapter,
  context: DateAdapterContext,
): string {
  if (isNil(value) || !isDateRangeValue(value)) {
    return "";
  }

  return `${adapter.format(value[0], context)} – ${adapter.format(value[1], context)}`;
}

export function useDateRangeField(
  props: DateRangeFieldOwnProps,
  model: Ref<null | undefined | DateRangeValue>,
  emit: SetupContext<DateRangeFieldEmits>["emit"],
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
      DateRangeFieldOwnProps & Record<string, unknown>,
      typeof dateRangeFieldBridgeKeys
    >({
      props: { ...attrs, ...props },
      bridgeKeys: dateRangeFieldBridgeKeys,
    });
  });

  const dateOnly = computed(() => {
    return split.value.componentProps;
  });

  const context = computed((): DateAdapterContext => {
    return resolveContext(dateOnly.value.timeZone);
  });

  const modelValue = computed(() => {
    return model.value ?? null;
  });

  const clearable = computed(() => {
    return dateOnly.value.clearable !== false;
  });

  const hasValue = computed(() => {
    return !isNil(modelValue.value);
  });

  const handleContainerRef = (element: null | Element) => {
    containerRef.value = element instanceof HTMLElement ? element : null;
  };

  function handleOpenChange(next: boolean) {
    if (open.value === next) {
      return;
    }

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
      dateRangePicker: _dateRangePicker,
      ...formFieldOnlyCustom
    } = (dateOnly.value.customProps ?? {}) as DateRangeFieldCustomProps;

    return {
      ...formFieldCustom,
      endIcon,
      classes: dateOnly.value.classes,
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
      componentName: "DateRangeField",
    },
  );

  const displayText = computed(() => {
    return formatRange(modelValue.value, adapter.value, context.value);
  });

  const showClearIcon = computed(() => {
    return (
      hasValue.value &&
      clearable.value &&
      !props.readonly &&
      !formField.isDisabled.value
    );
  });

  function commitValue(next: null | DateRangeValue) {
    model.value = next;
    emit("change", next);
  }

  const resolvedOverlay = computed(() => {
    return resolveFieldOverlay(dateOnly.value.overlay, breakpoint.mobile);
  });

  const orientation = computed(() => {
    return resolveRangePickerOrientation(
      dateOnly.value.orientation,
      resolvedOverlay.value,
      breakpoint.mobile,
    );
  });

  const showFooter = useFieldShowFooter({
    overlay: resolvedOverlay,
    componentName: "DateRangeField",
    showFooter: () => dateOnly.value.showFooter,
  });

  function handlePickerChange(next: null | DateRangeValue) {
    commitValue(next);

    if (showFooter.value) {
      emit("apply");
    }
  }

  function handlePickerCancel() {
    emit("cancel");
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
        value: displayText.value,
        readonly: dateOnly.value.editable
          ? formField.inputBind.value.readonly
          : true,
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
    return dateOnly.value.overlay;
  });

  const overlayCustomProps = computed(() => {
    return {
      modal: dateOnly.value.customProps?.modal,
      drawer: dateOnly.value.customProps?.drawer,
      menu: {
        anchorEl: containerRef.value,
        placement: "bottom-start" as const,
        ...dateOnly.value.customProps?.menu,
      },
    };
  });

  const dateRangePickerCustomProps = computed(() => {
    return dateOnly.value.customProps?.dateRangePicker;
  });

  const fill = usePickerFill({
    overlay: resolvedOverlay,
    componentName: "DateRangeField",
    fill: () => dateOnly.value.fill,
  });

  const pickerClass = computed(() => {
    return resolveFieldPickerClassName(fill.value, resolvedOverlay.value);
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
      "text-dark-400 hover:text-dark-600 dark:text-dark-500 dark:hover:text-dark-300"
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
          [dateOnly.value.classes?.clear ?? ""]: true,
        }),
      },
    );
  });

  return {
    open,
    fill,
    overlay,
    hasValue,
    dateOnly,
    formField,
    inputBind,
    clearable,
    clearBind,
    clearValue,
    modelValue,
    showFooter,
    orientation,
    pickerClass,
    containerRef,
    clearIconSize,
    showClearIcon,
    handleOpenChange,
    handlePickerChange,
    handlePickerCancel,
    overlayCustomProps,
    dateRangePickerCustomProps,
  };
}
