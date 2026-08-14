// ** External Imports
import { get, isArray, isNil, omit } from "es-toolkit/compat";
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
  isFieldOverlayDialog,
  resolveDatePickerMode,
  resolveFieldOverlay,
  resolveFieldShowFooter,
  type DatePickerModel,
} from "@bridge-ui/core/Domain";
import { colorProps as listboxColorProps } from "@bridge-ui/core/Tokens/Listbox";
import { cn, splitComponentProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useDateAdapter, useDateAdapterContext } from "@/Adapters/Date";
import type {
  DateFieldCustomProps,
  DateFieldEmits,
  DateFieldOwnProps,
} from "@/Components/DateField/dateField.types";
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

const dateFieldBridgeKeys = [
  "range",
  "classes",
  "maxDate",
  "minDate",
  "overlay",
  "multiple",
  "timeZone",
  "clearable",
  "hideYears",
  "hideMonths",
  "showFooter",
  "customProps",
  "defaultView",
  "startOfWeek",
  "defaultValue",
  "disableDates",
  "disableYears",
  "hideWeekdays",
  "disableMonths",
  "hideOutsideDays",
] as const satisfies readonly (keyof DateFieldOwnProps)[];

function formatModel(
  value: DatePickerModel,
  adapter: DateAdapter,
  context: DateAdapterContext,
): string {
  if (isNil(value)) {
    return "";
  }

  if (isDateRangeValue(value)) {
    return `${adapter.format(value[0], context)} – ${adapter.format(value[1], context)}`;
  }

  if (isArray(value)) {
    return value.map((entry) => adapter.format(entry, context)).join(", ");
  }

  return adapter.format(value, context);
}

function hasDateFieldValue(value: DatePickerModel): boolean {
  if (isNil(value)) {
    return false;
  }

  if (isArray(value)) {
    return value.length > 0;
  }

  return true;
}

export function useDateField(
  props: DateFieldOwnProps,
  model: Ref<null | undefined | DatePickerModel>,
  emit: SetupContext<DateFieldEmits>["emit"],
) {
  const attrs = useAttrs();
  const slots = useSlots();
  const adapter = useDateAdapter();
  const breakpoint = useBreakpoint();
  const resolveContext = useDateAdapterContext();

  const open = ref(false);
  const draftText = ref<null | string>(null);
  const containerRef = ref<null | HTMLElement>(null);

  const split = computed(() => {
    return splitComponentProps<
      DateFieldOwnProps & Record<string, unknown>,
      typeof dateFieldBridgeKeys
    >({
      props: { ...attrs, ...props },
      bridgeKeys: dateFieldBridgeKeys,
    });
  });

  const dateOnly = computed(() => {
    return split.value.componentProps;
  });

  const context = computed((): DateAdapterContext => {
    return resolveContext(dateOnly.value.timeZone);
  });
  const mode = computed(() => {
    return resolveDatePickerMode({
      range: dateOnly.value.range,
      multiple: dateOnly.value.multiple,
    });
  });

  const showFooter = computed(() => {
    return resolveFieldShowFooter(dateOnly.value.showFooter, breakpoint.mobile);
  });

  const modelValue = computed(() => {
    return model.value ?? null;
  });

  const clearable = computed(() => {
    return dateOnly.value.clearable !== false;
  });

  const hasValue = computed(() => {
    return hasDateFieldValue(modelValue.value);
  });

  const resolvedOverlay = computed(() => {
    return resolveFieldOverlay(dateOnly.value.overlay, breakpoint.mobile);
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
    open.value = next;

    if (next) {
      emit("open");
    } else {
      emit("close");
      draftText.value = null;
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
      datePicker: _datePicker,
      ...formFieldOnlyCustom
    } = (dateOnly.value.customProps ?? {}) as DateFieldCustomProps;

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
      componentName: "DateField",
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
    if (!isNil(draftText.value)) {
      return draftText.value;
    }

    return formatModel(modelValue.value, adapter.value, context.value);
  });

  function commitValue(next: DatePickerModel) {
    model.value = next;
    emit("change", next);
  }

  function handlePickerChange(next: DatePickerModel) {
    commitValue(next);
    draftText.value = null;

    // Close on immediate select (single, no footer) or when Apply commits (`showFooter`).
    if (mode.value === "single" || showFooter.value) {
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
    draftText.value = null;
    emit("clear");
    handleOpenChange(false);
  }

  function handleClearPointer(event: MouseEvent) {
    event.preventDefault();
  }

  function parseDraft() {
    if (isNil(draftText.value)) {
      return;
    }

    if (draftText.value.trim() === "") {
      commitValue(null);
      draftText.value = null;

      return;
    }

    if (mode.value !== "single") {
      draftText.value = null;

      return;
    }

    const parsed = adapter.value.parse(draftText.value, context.value);

    if (!isNil(parsed)) {
      commitValue(parsed);
    }

    draftText.value = null;
  }

  const inputBind = computed(() => {
    return mergePartBind(
      {
        value: displayText.value,
        readonly:
          mode.value !== "single" ? true : formField.inputBind.value.readonly,
        onBlur: (event: FocusEvent) => {
          formField.inputBind.value.onBlur?.(event);
          parseDraft();
        },
        onFocus: (event: FocusEvent) => {
          formField.inputBind.value.onFocus?.(event);
          handleOpenChange(true);
        },
        onInput: (event: Event) => {
          if (mode.value !== "single") {
            return;
          }

          draftText.value = (event.target as HTMLInputElement).value;
        },
        onKeydown: (event: KeyboardEvent) => {
          formField.inputBind.value.onKeydown?.(event);

          if (event.key === "Enter") {
            parseDraft();
          }

          if (event.key === "Escape") {
            draftText.value = null;
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

  const datePickerCustomProps = computed(() => {
    return dateOnly.value.customProps?.datePicker;
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
    mode,
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
    pickerClass,
    containerRef,
    clearIconSize,
    showClearIcon,
    handleOpenChange,
    handlePickerChange,
    handlePickerCancel,
    overlayCustomProps,
    datePickerCustomProps,
  };
}
