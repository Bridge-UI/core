// ** External Imports
import { get, isNil, omit } from "es-toolkit/compat";
import type { ChangeEvent, FocusEvent, KeyboardEvent, MouseEvent } from "react";
import { useCallback, useRef, useState } from "react";

// ** Core Imports
import type { DateAdapterContext } from "@bridge-ui/core/Adapters";
import {
  resolveFieldOverlay,
  resolveFieldPickerClassName,
} from "@bridge-ui/core/Domain";
import { listboxColorProps } from "@bridge-ui/core/Tokens";
import { cn, splitComponentProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useDateAdapter, useDateAdapterContext } from "@/Adapters/Date";
import type {
  DateTimeFieldCustomProps,
  DateTimeFieldOwnProps,
  DateTimeFieldProps,
} from "@/Components/DateTimeField/dateTimeField.types";
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
  useFieldShowFooter,
  usePickerFill,
} from "@/Utils";

const dateTimeFieldBridgeKeys = [
  "ampm",
  "fill",
  "value",
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
  adapter: ReturnType<typeof useDateAdapter>,
  context: DateAdapterContext,
  ampm?: boolean,
  showSeconds?: boolean,
): string {
  if (isNil(value)) {
    return "";
  }

  return `${adapter.format(value, context)} ${adapter.formatTime(value, context, { ampm, showSeconds })}`.trim();
}

export function useDateTimeField(props: DateTimeFieldProps) {
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
  const [uncontrolledValue, setUncontrolledValue] = useState<Date | null>(
    () => defaultValue ?? null,
  );

  const { inheritedAttrs, componentProps: dateTimeOnly } = splitComponentProps<
    DateTimeFieldProps,
    typeof dateTimeFieldBridgeKeys
  >({
    bridgeKeys: dateTimeFieldBridgeKeys,
    props: propsForSplit as DateTimeFieldProps,
  });

  const isControlled = derived(() => {
    return valueProp !== undefined;
  });

  const modelValue = derived((): Date | null => {
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

  const resolvedOverlay = derived(() => {
    return resolveFieldOverlay(dateTimeOnly.overlay, breakpoint.mobile);
  });

  const fill = usePickerFill({
    fill: dateTimeOnly.fill,
    overlay: resolvedOverlay,
    componentName: "DateTimeField",
  });

  const pickerClassName = derived(() => {
    return resolveFieldPickerClassName(fill, resolvedOverlay);
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
    dateTimePicker: _dateTimePicker,
    ...formFieldOnlyCustom
  } = (dateTimeOnly.customProps ?? {}) as DateTimeFieldCustomProps;

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
      componentName: "DateTimeField",
    },
  );

  const showClearIcon = derived(() => {
    return hasValue && clearable && !props.readonly && !formField.isDisabled;
  });

  const showFooter = useFieldShowFooter({
    overlay: resolvedOverlay,
    componentName: "DateTimeField",
    showFooter: dateTimeOnly.showFooter,
  });

  const displayText = derived(() => {
    return formatDateTimeValue(
      modelValue,
      adapter,
      context,
      dateTimeOnly.ampm,
      dateTimeOnly.showSeconds,
    );
  });

  const commitValue = (next: Date | null) => {
    if (!isControlled) {
      setUncontrolledValue(next);
    }

    onChange?.(next);
  };

  const handlePickerChange = (next: Date | null) => {
    commitValue(next);

    if (showFooter) {
      onApply?.();

      return;
    }

    handleOpenChange(false);
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
        value: displayText,
        readOnly: dateTimeOnly.editable ? formField.inputBind.readOnly : true,
        onChange: (event: ChangeEvent<HTMLInputElement>) => {
          formField.inputBind.onChange?.(event as never);
        },
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

  const overlayCustomProps = derived(() => {
    return {
      modal: dateTimeOnly.customProps?.modal,
      drawer: dateTimeOnly.customProps?.drawer,
      menu: {
        anchorEl: containerRef,
        placement: "bottom-start" as const,
        ...dateTimeOnly.customProps?.menu,
      },
    };
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
    dateTimeOnly,
    containerRef,
    clearIconSize,
    showClearIcon,
    pickerClassName,
    handleOpenChange,
    handlePickerChange,
    handlePickerCancel,
    overlayCustomProps,
    overlay: dateTimeOnly.overlay,
    dateTimePickerCustomProps: dateTimeOnly.customProps?.dateTimePicker,
  };
}
