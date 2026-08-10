// ** External Imports
import { get, isNil, omit } from "es-toolkit/compat";
import type { FocusEvent, KeyboardEvent, MouseEvent } from "react";
import { useCallback, useRef, useState } from "react";

// ** Core Imports
import {
  cn,
  isDateRangeValue,
  isFieldOverlayDialog,
  resolveFieldOverlay,
  resolveFieldShowFooter,
  resolveRangePickerOrientation,
  splitComponentProps,
  type DateAdapterContext,
  type DateRangeValue,
} from "@bridge-ui/core";
import { colorProps as listboxColorProps } from "@bridge-ui/core/Tokens/Listbox";

// ** Local Imports
import { useDateAdapter, useDateAdapterContext } from "@/Adapters/Date";
import type {
  DateRangeFieldCustomProps,
  DateRangeFieldOwnProps,
  DateRangeFieldProps,
} from "@/Components/DateRangeField/dateRangeField.types";
import type { FormFieldOwnProps } from "@/Components/FormField/formField.types";
import {
  formFieldBridgeKeys,
  useFormField,
} from "@/Components/FormField/hooks/useFormField";
import { derived, mergePartBind, resolveFieldAdornmentIconSize } from "@/Utils";
import { useBreakpoint } from "@/Utils/useBreakpoint";

const dateRangeFieldBridgeKeys = [
  "value",
  "classes",
  "maxDate",
  "minDate",
  "overlay",
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
  adapter: ReturnType<typeof useDateAdapter>,
  context: DateAdapterContext,
): string {
  if (isNil(value) || !isDateRangeValue(value)) {
    return "";
  }

  return `${adapter.format(value[0], context)} – ${adapter.format(value[1], context)}`;
}

export function useDateRangeField(props: DateRangeFieldProps) {
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
  const [uncontrolledValue, setUncontrolledValue] =
    useState<null | DateRangeValue>(() => {
      return defaultValue ?? null;
    });

  const { inheritedAttrs, componentProps: dateOnly } = splitComponentProps<
    DateRangeFieldProps,
    typeof dateRangeFieldBridgeKeys
  >({
    bridgeKeys: dateRangeFieldBridgeKeys,
    props: propsForSplit as DateRangeFieldProps,
  });

  const isControlled = derived(() => {
    return valueProp !== undefined;
  });

  const modelValue = derived((): null | DateRangeValue => {
    if (isControlled) {
      return valueProp ?? null;
    }

    return uncontrolledValue;
  });

  const context = derived((): DateAdapterContext => {
    return resolveContext(dateOnly.timeZone);
  });

  const clearable = derived(() => {
    return dateOnly.clearable !== false;
  });

  const hasValue = derived(() => {
    return !isNil(modelValue);
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
      }
    },
    [onClose, onOpen],
  );

  const inherited = derived(() => {
    return omit(inheritedAttrs, [
      "onOpen",
      "onClose",
      "onClear",
      "onChange",
      "className",
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
    dateRangePicker: _dateRangePicker,
    ...formFieldOnlyCustom
  } = (dateOnly.customProps ?? {}) as DateRangeFieldCustomProps;

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
      componentName: "DateRangeField",
    },
  );

  const displayText = derived(() => {
    return formatRange(modelValue, adapter, context);
  });

  const showClearIcon = derived(() => {
    return hasValue && clearable && !props.readonly && !formField.isDisabled;
  });

  const commitValue = (next: null | DateRangeValue) => {
    if (!isControlled) {
      setUncontrolledValue(next);
    }

    onChange?.(next);
  };

  const resolvedOverlay = derived(() => {
    return resolveFieldOverlay(dateOnly.overlay, breakpoint.mobile);
  });

  const orientation = derived(() => {
    return resolveRangePickerOrientation(
      dateOnly.orientation,
      resolvedOverlay,
      breakpoint.mobile,
    );
  });

  const showFooter = derived(() => {
    return resolveFieldShowFooter(dateOnly.showFooter, breakpoint.mobile);
  });

  const handlePickerChange = (next: null | DateRangeValue) => {
    commitValue(next);

    // Close when Apply commits (`showFooter`). Without footer, keep open while picking.
    if (showFooter) {
      handleOpenChange(false);
    }
  };

  const handlePickerCancel = () => {
    handleOpenChange(false);
  };

  const clearValue = useCallback(
    (event?: { preventDefault: () => void; stopPropagation: () => void }) => {
      event?.preventDefault();
      event?.stopPropagation();

      if (props.disabled || props.readonly) {
        return;
      }

      commitValue(null);
      onClear?.();
      handleOpenChange(false);
    },
    [onClear, commitValue, handleOpenChange, props.disabled, props.readonly],
  );

  const handleClearPointer = useCallback((event: MouseEvent) => {
    event.preventDefault();
  }, []);

  const inputBind = derived(() => {
    return mergePartBind(
      {
        readOnly: true,
        value: displayText,
        onFocus: (event: FocusEvent<HTMLInputElement>) => {
          formField.inputBind.onFocus?.(event as never);
          handleOpenChange(true);
        },
        onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
          formField.inputBind.onKeyDown?.(event as never);

          if (event.key === "Escape") {
            handleOpenChange(false);
          }
        },
      },
      undefined,
      formField.inputBind,
    );
  });

  const pickerClassName = derived(() => {
    return isFieldOverlayDialog(resolvedOverlay)
      ? "mx-auto shadow-none"
      : undefined;
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
    orientation,
    containerRef,
    clearIconSize,
    showClearIcon,
    pickerClassName,
    handleOpenChange,
    handlePickerChange,
    handlePickerCancel,
    overlay: dateOnly.overlay,
    dateRangePickerCustomProps: dateOnly.customProps?.dateRangePicker,
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
