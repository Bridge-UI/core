// ** External Imports
import { get, isArray, isNil, omit } from "es-toolkit/compat";
import type { ChangeEvent, FocusEvent, KeyboardEvent, MouseEvent } from "react";
import { useCallback, useRef, useState } from "react";

// ** Core Imports
import {
  cn,
  isDateRangeValue,
  isFieldOverlayDialog,
  resolveDatePickerMode,
  resolveFieldOverlay,
  resolveFieldShowFooter,
  splitComponentProps,
  type DateAdapterContext,
  type DatePickerModel,
} from "@bridge-ui/core";
import { colorProps as listboxColorProps } from "@bridge-ui/core/Tokens/Listbox";

// ** Local Imports
import { useDateAdapter, useDateAdapterContext } from "@/Adapters/Date";
import type {
  DateFieldCustomProps,
  DateFieldOwnProps,
  DateFieldProps,
} from "@/Components/DateField/dateField.types";
import type { FormFieldOwnProps } from "@/Components/FormField/formField.types";
import {
  formFieldBridgeKeys,
  useFormField,
} from "@/Components/FormField/hooks/useFormField";
import {
  derived,
  mergePartBind,
  resolveFieldAdornmentIconSize,
  useBreakpoint,
} from "@/Utils";

const dateFieldBridgeKeys = [
  "range",
  "value",
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
  adapter: ReturnType<typeof useDateAdapter>,
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

export function useDateField(props: DateFieldProps) {
  const adapter = useDateAdapter();
  const breakpoint = useBreakpoint();
  const resolveContext = useDateAdapterContext();
  const containerRef = useRef<null | HTMLElement>(null);

  const {
    slots,
    onOpen,
    onClose,
    onClear,
    onChange,
    defaultValue,
    value: valueProp,
    ...propsForSplit
  } = props;

  const { day: daySlot, ...formFieldSlots } = slots ?? {};

  const [open, setOpen] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState<DatePickerModel>(
    () => defaultValue ?? null,
  );
  const [draftText, setDraftText] = useState<null | string>(null);

  const { inheritedAttrs, componentProps: dateOnly } = splitComponentProps<
    DateFieldProps,
    typeof dateFieldBridgeKeys
  >({
    bridgeKeys: dateFieldBridgeKeys,
    props: propsForSplit as DateFieldProps,
  });

  const isControlled = derived(() => {
    return valueProp !== undefined;
  });

  const modelValue = derived((): DatePickerModel => {
    if (isControlled) {
      return valueProp ?? null;
    }

    return uncontrolledValue;
  });

  const context = derived((): DateAdapterContext => {
    return resolveContext(dateOnly.timeZone);
  });

  const mode = derived(() => {
    return resolveDatePickerMode({
      range: dateOnly.range,
      multiple: dateOnly.multiple,
    });
  });

  const showFooter = derived(() => {
    return resolveFieldShowFooter(dateOnly.showFooter, breakpoint.mobile);
  });

  const clearable = derived(() => {
    return dateOnly.clearable !== false;
  });

  const hasValue = derived(() => {
    return hasDateFieldValue(modelValue);
  });

  const resolvedOverlay = derived(() => {
    return resolveFieldOverlay(dateOnly.overlay, breakpoint.mobile);
  });

  const pickerClassName = derived(() => {
    return isFieldOverlayDialog(resolvedOverlay)
      ? "w-full shadow-none"
      : undefined;
  });

  const handleContainerRef = useCallback((element: null | HTMLElement) => {
    containerRef.current = element;
  }, []);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      setOpen(next);

      if (next) {
        onOpen?.();
      } else {
        onClose?.();
        setDraftText(null);
      }
    },
    [onClose, onOpen],
  );

  const inherited = derived(() => {
    return omit(inheritedAttrs, [
      "className",
      "onChange",
      "onClear",
      "onOpen",
      "onClose",
    ]);
  });

  const { componentProps: formFieldCustom } = splitComponentProps<
    Omit<FormFieldOwnProps, "field">,
    typeof formFieldBridgeKeys
  >({
    bridgeKeys: formFieldBridgeKeys,
    props: inherited as Omit<FormFieldOwnProps, "field">,
  });

  const {
    menu: _menu,
    clearIcon: _clearIcon,
    datePicker: _datePicker,
    ...formFieldOnlyCustom
  } = (dateOnly.customProps ?? {}) as DateFieldCustomProps;

  const formField = useFormField(
    {
      ...formFieldCustom,
      slots: formFieldSlots,
      classes: dateOnly.classes,
      endIcon: formFieldCustom.endIcon ?? (slots?.end ? undefined : "calendar"),
      customProps: {
        ...formFieldOnlyCustom,
        container: mergePartBind(
          formFieldOnlyCustom.container,
          {},
          {
            ref: handleContainerRef,
            className: cn({
              "cursor-pointer": !props.disabled && !props.readonly,
            }),
            onClick: (event: MouseEvent<HTMLElement>) => {
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
    },
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

  const showClearIcon = derived(() => {
    return hasValue && clearable && !props.readonly && !formField.isDisabled;
  });

  const displayText = derived(() => {
    if (!isNil(draftText)) {
      return draftText;
    }

    return formatModel(modelValue, adapter, context);
  });

  const commitValue = useCallback(
    (next: DatePickerModel) => {
      if (!isControlled) {
        setUncontrolledValue(next);
      }

      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const clearValue = useCallback(
    (event?: { preventDefault: () => void; stopPropagation: () => void }) => {
      event?.preventDefault();
      event?.stopPropagation();

      if (props.disabled || props.readonly) {
        return;
      }

      commitValue(null);
      setDraftText(null);
      onClear?.();
      handleOpenChange(false);
    },
    [onClear, commitValue, handleOpenChange, props.disabled, props.readonly],
  );

  const handleClearPointer = useCallback((event: MouseEvent) => {
    event.preventDefault();
  }, []);

  const handlePickerChange = (next: DatePickerModel) => {
    commitValue(next);
    setDraftText(null);

    // Close on immediate select (single, no footer) or when Apply commits (`showFooter`).
    if (mode === "single" || showFooter) {
      handleOpenChange(false);
    }
  };

  const handlePickerCancel = () => {
    handleOpenChange(false);
  };

  const parseDraft = () => {
    if (isNil(draftText)) {
      return;
    }

    if (draftText.trim() === "") {
      commitValue(null);
      setDraftText(null);

      return;
    }

    if (mode !== "single") {
      setDraftText(null);

      return;
    }

    const parsed = adapter.parse(draftText, context);

    if (!isNil(parsed)) {
      commitValue(parsed);
    }

    setDraftText(null);
  };

  const inputBind = derived(() => {
    return mergePartBind(
      {
        value: displayText,
        readOnly: mode !== "single" ? true : formField.inputBind.readOnly,
        onBlur: (event: FocusEvent<HTMLInputElement>) => {
          formField.inputBind.onBlur?.(event as never);
          parseDraft();
        },
        onFocus: (event: FocusEvent<HTMLInputElement>) => {
          formField.inputBind.onFocus?.(event as never);
          handleOpenChange(true);
        },
        onChange: (event: ChangeEvent<HTMLInputElement>) => {
          if (mode !== "single") {
            return;
          }

          setDraftText(event.target.value);
        },
        onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
          formField.inputBind.onKeyDown?.(event as never);

          if (event.key === "Enter") {
            parseDraft();
          }

          if (event.key === "Escape") {
            setDraftText(null);
            handleOpenChange(false);
          }
        },
      },
      undefined,
      formField.inputBind,
    );
  });

  const clearIconSize = resolveFieldAdornmentIconSize(formField.merged.size);

  const clearTone = derived(() => {
    return (
      get(listboxColorProps, [formField.merged.color ?? "primary", "clear"]) ??
      "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
    );
  });

  const clearBind = derived(() => {
    return mergePartBind(
      {},
      {},
      {
        tabIndex: 0,
        role: "button",
        "data-field-clear": true,
        onMouseDown: handleClearPointer,
        className: cn({
          "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-sm transition-colors duration-150": true,
          [clearTone]: true,
          [dateOnly.classes?.clear ?? ""]: true,
        }),
      },
    );
  });

  return {
    open,
    mode,
    daySlot,
    hasValue,
    dateOnly,
    formField,
    inputBind,
    clearable,
    clearBind,
    clearValue,
    modelValue,
    showFooter,
    containerRef,
    clearIconSize,
    showClearIcon,
    pickerClassName,
    handleOpenChange,
    handlePickerChange,
    handlePickerCancel,
    overlay: dateOnly.overlay,
    datePickerCustomProps: dateOnly.customProps?.datePicker,
    overlayCustomProps: {
      modal: dateOnly.customProps?.modal,
      drawer: dateOnly.customProps?.drawer,
      menu: {
        anchorEl: containerRef,
        placement: "bottom-start" as const,
        ...dateOnly.customProps?.menu,
      },
    },
  };
}
