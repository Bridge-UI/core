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
  isFieldOverlayDialog,
  resolveFieldOverlay,
} from "@bridge-ui/core/Domain";
import { listboxColorProps } from "@bridge-ui/core/Tokens";
import { cn, splitComponentProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useDateAdapter, useDateAdapterContext } from "@/Adapters/Date";
import type {
  DateTimeFieldCustomProps,
  DateTimeFieldEmits,
  DateTimeFieldOwnProps,
} from "@/Components/DateTimeField/dateTimeField.types";
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
} from "@/Utils";
import { useBreakpoint } from "@/Utils/useBreakpoint";

const dateTimeFieldBridgeKeys = [
  "ampm",
  "classes",
  "maxDate",
  "maxTime",
  "minDate",
  "minTime",
  "overlay",
  "editable",
  "interval",
  "timeZone",
  "clearable",
  "hideYears",
  "hideMonths",
  "showFooter",
  "customProps",
  "defaultView",
  "showSeconds",
  "startOfWeek",
  "defaultValue",
  "disableDates",
  "disableTimes",
  "disableYears",
  "hideWeekdays",
  "disableMonths",
  "hideOutsideDays",
] as const satisfies readonly (keyof DateTimeFieldOwnProps)[];

function formatDateTimeValue(
  value: Date | null,
  adapter: DateAdapter,
  context: DateAdapterContext,
  ampm?: boolean,
  showSeconds?: boolean,
): string {
  if (isNil(value)) {
    return "";
  }

  return `${adapter.format(value, context)} ${adapter.formatTime(value, context, { ampm, showSeconds })}`.trim();
}

/**
 * Composes FormField + Menu + DateTimePicker for a date-time input field.
 */
export function useDateTimeField(
  props: DateTimeFieldOwnProps,
  model: Ref<Date | null | undefined>,
  emit: SetupContext<DateTimeFieldEmits>["emit"],
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
      DateTimeFieldOwnProps & Record<string, unknown>,
      typeof dateTimeFieldBridgeKeys
    >({
      props: { ...attrs, ...props },
      bridgeKeys: dateTimeFieldBridgeKeys,
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

  const resolvedOverlay = computed(() => {
    return resolveFieldOverlay(dateTimeOnly.value.overlay, breakpoint.mobile);
  });

  const pickerClass = computed(() => {
    return isFieldOverlayDialog(resolvedOverlay.value)
      ? "w-full shadow-none"
      : undefined;
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
      dateTimePicker: _dateTimePicker,
      ...formFieldOnlyCustom
    } = (dateTimeOnly.value.customProps ?? {}) as DateTimeFieldCustomProps;

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
      componentName: "DateTimeField",
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
    return formatDateTimeValue(
      modelValue.value,
      adapter.value,
      context.value,
      dateTimeOnly.value.ampm,
      dateTimeOnly.value.showSeconds,
    );
  });

  function commitValue(next: Date | null) {
    model.value = next;
    emit("change", next);
  }

  const showFooter = useFieldShowFooter({
    overlay: resolvedOverlay,
    componentName: "DateTimeField",
    showFooter: () => dateTimeOnly.value.showFooter,
  });

  function handlePickerChange(next: Date | null) {
    commitValue(next);

    if (showFooter.value) {
      emit("apply");

      return;
    }

    handleOpenChange(false);
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
        readonly: dateTimeOnly.value.editable
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

  const dateTimePickerCustomProps = computed(() => {
    return dateTimeOnly.value.customProps?.dateTimePicker;
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
    pickerClass,
    dateTimeOnly,
    containerRef,
    clearIconSize,
    showClearIcon,
    handleOpenChange,
    handlePickerChange,
    handlePickerCancel,
    overlayCustomProps,
    dateTimePickerCustomProps,
  };
}
