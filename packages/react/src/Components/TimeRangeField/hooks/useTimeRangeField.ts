// ** External Imports
import { get, isNil, omit } from "es-toolkit/compat";
import type { FocusEvent, KeyboardEvent, MouseEvent } from "react";
import { useCallback, useRef, useState } from "react";

// ** Core Imports
import {
  cn,
  isFieldOverlayDialog,
  isTimeRangeValue,
  resolveFieldOverlay,
  resolveFieldShowFooter,
  splitComponentProps,
  type DateAdapterContext,
  type TimeRangeValue,
} from "@bridge-ui/core";
import { colorProps as listboxColorProps } from "@bridge-ui/core/Tokens/Listbox";

// ** Local Imports
import { useDateAdapter, useDateAdapterContext } from "@/Adapters/Date";
import type { FormFieldOwnProps } from "@/Components/FormField/formField.types";
import {
  formFieldBridgeKeys,
  useFormField,
} from "@/Components/FormField/hooks/useFormField";
import type {
  TimeRangeFieldCustomProps,
  TimeRangeFieldOwnProps,
  TimeRangeFieldProps,
} from "@/Components/TimeRangeField/timeRangeField.types";
import { derived, mergePartBind, resolveFieldAdornmentIconSize } from "@/Utils";
import { useBreakpoint } from "@/Utils/useBreakpoint";

const timeRangeFieldBridgeKeys = [
  "ampm",
  "value",
  "classes",
  "maxTime",
  "minTime",
  "overlay",
  "interval",
  "timeZone",
  "clearable",
  "showFooter",
  "customProps",
  "showSeconds",
  "defaultValue",
  "disableTimes",
] as const satisfies readonly (keyof TimeRangeFieldOwnProps)[];

function formatTimeRange(
  value: null | TimeRangeValue,
  adapter: ReturnType<typeof useDateAdapter>,
  context: DateAdapterContext,
  ampm?: boolean,
  showSeconds?: boolean,
): string {
  if (isNil(value) || !isTimeRangeValue(value)) {
    return "";
  }

  return `${adapter.formatTime(value[0], context, { ampm, showSeconds })} – ${adapter.formatTime(value[1], context, { ampm, showSeconds })}`;
}

export function useTimeRangeField(props: TimeRangeFieldProps) {
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

  const [open, setOpen] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] =
    useState<null | TimeRangeValue>(() => defaultValue ?? null);

  const { inheritedAttrs, componentProps: timeOnly } = splitComponentProps<
    TimeRangeFieldProps,
    typeof timeRangeFieldBridgeKeys
  >({
    bridgeKeys: timeRangeFieldBridgeKeys,
    props: propsForSplit as TimeRangeFieldProps,
  });

  const isControlled = derived(() => {
    return valueProp !== undefined;
  });

  const modelValue = derived((): null | TimeRangeValue => {
    if (isControlled) {
      return valueProp ?? null;
    }

    return uncontrolledValue;
  });

  const context = derived((): DateAdapterContext => {
    return resolveContext(timeOnly.timeZone);
  });

  const clearable = derived(() => {
    return timeOnly.clearable !== false;
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
    timeRangePicker: _timeRangePicker,
    ...formFieldOnlyCustom
  } = (timeOnly.customProps ?? {}) as TimeRangeFieldCustomProps;

  const formField = useFormField(
    {
      ...formFieldCustom,
      slots,
      classes: timeOnly.classes,
      endIcon: formFieldCustom.endIcon ?? (slots?.end ? undefined : "clock"),
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
      componentName: "TimeRangeField",
    },
  );

  const displayText = derived(() => {
    return formatTimeRange(
      modelValue,
      adapter,
      context,
      timeOnly.ampm,
      timeOnly.showSeconds,
    );
  });

  const showClearIcon = derived(() => {
    return hasValue && clearable && !props.readonly && !formField.isDisabled;
  });

  const commitValue = (next: null | TimeRangeValue) => {
    if (!isControlled) {
      setUncontrolledValue(next);
    }

    onChange?.(next);
  };

  const showFooter = derived(() => {
    return resolveFieldShowFooter(timeOnly.showFooter, breakpoint.mobile);
  });

  const handlePickerChange = (next: null | TimeRangeValue) => {
    commitValue(next);
    // Close on immediate select or when Apply commits (`showFooter`).
    handleOpenChange(false);
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

  const resolvedOverlay = derived(() => {
    return resolveFieldOverlay(timeOnly.overlay, breakpoint.mobile);
  });

  const pickerClassName = derived(() => {
    return isFieldOverlayDialog(resolvedOverlay)
      ? "w-full shadow-none"
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
          [timeOnly.classes?.clear ?? ""]: true,
        }),
      },
    );
  });

  return {
    open,
    timeOnly,
    hasValue,
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
    overlay: timeOnly.overlay,
    timeRangePickerCustomProps: timeOnly.customProps?.timeRangePicker,
    overlayCustomProps: {
      modal: timeOnly.customProps?.modal,
      drawer: timeOnly.customProps?.drawer,
      menu: {
        anchorEl: containerRef,
        placement: "bottom-start" as const,
        ...timeOnly.customProps?.menu,
      },
    },
  };
}
