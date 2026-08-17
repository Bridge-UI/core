// ** External Imports
import { get, isNil, omit } from "es-toolkit/compat";
import type { FocusEvent, KeyboardEvent, MouseEvent } from "react";
import { useCallback, useRef, useState } from "react";

// ** Core Imports
import type { DateAdapterContext } from "@bridge-ui/core/Adapters";
import {
  isDateRangeValue,
  resolveFieldOverlay,
  resolveFieldPickerClassName,
  resolvePickerFill,
  resolveRangePickerOrientation,
  type DateRangeValue,
} from "@bridge-ui/core/Domain";
import { listboxColorProps } from "@bridge-ui/core/Tokens";
import { cn, splitComponentProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useDateAdapter, useDateAdapterContext } from "@/Adapters/Date";
import type {
  DateTimeRangeFieldCustomProps,
  DateTimeRangeFieldOwnProps,
  DateTimeRangeFieldProps,
} from "@/Components/DateTimeRangeField/dateTimeRangeField.types";
import type { FormFieldOwnProps } from "@/Components/FormField/formField.types";
import {
  formFieldBridgeKeys,
  useFormField,
} from "@/Components/FormField/hooks/useFormField";
import {
  derived,
  mergePartBind,
  resolveFieldAdornmentIconSize,
  useFieldShowFooter,
} from "@/Utils";
import { useBreakpoint } from "@/Utils/useBreakpoint";

const dateTimeRangeFieldBridgeKeys = [
  "ampm",
  "fill",
  "value",
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
  "showSeconds",
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
  adapter: ReturnType<typeof useDateAdapter>,
  context: DateAdapterContext,
  ampm?: boolean,
  showSeconds?: boolean,
): string {
  if (isNil(value) || !isDateRangeValue(value)) {
    return "";
  }

  const start =
    `${adapter.format(value[0], context)} ${adapter.formatTime(value[0], context, { ampm, showSeconds })}`.trim();
  const end =
    `${adapter.format(value[1], context)} ${adapter.formatTime(value[1], context, { ampm, showSeconds })}`.trim();

  return `${start} – ${end}`;
}

export function useDateTimeRangeField(props: DateTimeRangeFieldProps) {
  const adapter = useDateAdapter();
  const breakpoint = useBreakpoint();
  const resolveContext = useDateAdapterContext();
  const containerRef = useRef<null | HTMLElement>(null);

  const {
    slots,
    onOpen,
    onClose,
    onClear,
    onApply,
    onChange,
    onCancel,
    defaultValue,
    value: valueProp,
    ...propsForSplit
  } = props;

  const { day: daySlot, footer: footerSlot, ...formFieldSlots } = slots ?? {};

  const openRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] =
    useState<null | DateRangeValue>(() => {
      return defaultValue ?? null;
    });

  const { inheritedAttrs, componentProps: dateTimeOnly } = splitComponentProps<
    DateTimeRangeFieldProps,
    typeof dateTimeRangeFieldBridgeKeys
  >({
    bridgeKeys: dateTimeRangeFieldBridgeKeys,
    props: propsForSplit as DateTimeRangeFieldProps,
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
    return resolveContext(dateTimeOnly.timeZone);
  });

  const clearable = derived(() => {
    return dateTimeOnly.clearable !== false;
  });

  const hasValue = derived(() => {
    return !isNil(modelValue);
  });

  const handleContainerRef = useCallback((element: null | HTMLElement) => {
    containerRef.current = element;
  }, []);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (openRef.current === next) {
        return;
      }

      openRef.current = next;
      setOpen(next);

      if (next) {
        onOpen?.();
      } else {
        onClose?.();
      }
    },
    [onOpen, onClose],
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
    dateTimeRangePicker: _dateTimeRangePicker,
    ...formFieldOnlyCustom
  } = (dateTimeOnly.customProps ?? {}) as DateTimeRangeFieldCustomProps;

  const formField = useFormField(
    {
      ...formFieldCustom,
      slots: formFieldSlots,
      classes: dateTimeOnly.classes,
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
      componentName: "DateTimeRangeField",
    },
  );

  const showClearIcon = derived(() => {
    return hasValue && clearable && !props.readonly && !formField.isDisabled;
  });

  const displayText = derived(() => {
    return formatDateTimeRange(
      modelValue,
      adapter,
      context,
      dateTimeOnly.ampm,
      dateTimeOnly.showSeconds,
    );
  });

  const commitValue = (next: null | DateRangeValue) => {
    if (!isControlled) {
      setUncontrolledValue(next);
    }

    onChange?.(next);
  };

  const resolvedOverlay = derived(() => {
    return resolveFieldOverlay(dateTimeOnly.overlay, breakpoint.mobile);
  });

  const orientation = derived(() => {
    return resolveRangePickerOrientation(
      dateTimeOnly.orientation,
      resolvedOverlay,
      breakpoint.mobile,
    );
  });

  const showFooter = useFieldShowFooter({
    overlay: resolvedOverlay,
    showFooter: dateTimeOnly.showFooter,
    componentName: "DateTimeRangeField",
  });

  const handlePickerChange = (next: null | DateRangeValue) => {
    commitValue(next);

    if (showFooter) {
      onApply?.();
    }
  };

  const handlePickerCancel = () => {
    onCancel?.();
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

  const fill = derived(() => {
    return resolvePickerFill(dateTimeOnly.fill, resolvedOverlay);
  });

  const pickerClassName = derived(() => {
    return resolveFieldPickerClassName(fill, resolvedOverlay);
  });

  const clearIconSize = resolveFieldAdornmentIconSize(formField.merged.size);

  const clearTone = derived(() => {
    return (
      get(listboxColorProps, [formField.merged.color ?? "primary", "clear"]) ??
      "text-dark-400 hover:text-dark-600 dark:text-dark-500 dark:hover:text-dark-300"
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
          [dateTimeOnly.classes?.clear ?? ""]: true,
        }),
      },
    );
  });

  return {
    open,
    fill,
    daySlot,
    hasValue,
    formField,
    inputBind,
    clearable,
    clearBind,
    footerSlot,
    clearValue,
    modelValue,
    showFooter,
    orientation,
    dateTimeOnly,
    containerRef,
    clearIconSize,
    showClearIcon,
    pickerClassName,
    handleOpenChange,
    handlePickerChange,
    handlePickerCancel,
    overlay: dateTimeOnly.overlay,
    dateTimeRangePickerCustomProps:
      dateTimeOnly.customProps?.dateTimeRangePicker,
    overlayCustomProps: {
      modal: dateTimeOnly.customProps?.modal,
      drawer: dateTimeOnly.customProps?.drawer,
      menu: {
        anchorEl: containerRef,
        placement: "bottom-start" as const,
        ...dateTimeOnly.customProps?.menu,
      },
    },
  };
}
