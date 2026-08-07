// ** External Imports
import { isNil, omit } from "es-toolkit/compat";
import type { FocusEvent, KeyboardEvent } from "react";
import { useCallback, useRef, useState } from "react";

// ** Core Imports
import {
  cn,
  isDateRangeValue,
  splitComponentProps,
  type DateAdapterContext,
  type DateRangeValue,
} from "@bridge-ui/core";

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
import { derived, mergePartBind } from "@/Utils";

const dateTimeRangeFieldBridgeKeys = [
  "ampm",
  "value",
  "classes",
  "maxDate",
  "maxTime",
  "minDate",
  "minTime",
  "overlay",
  "interval",
  "timeZone",
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
  adapter: ReturnType<typeof useDateAdapter>,
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

export function useDateTimeRangeField(props: DateTimeRangeFieldProps) {
  const adapter = useDateAdapter();
  const resolveContext = useDateAdapterContext();
  const containerRef = useRef<null | HTMLElement>(null);

  const {
    slots,
    onOpen,
    onClose,
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
    return omit(inheritedAttrs, ["onOpen", "onClose", "onChange", "className"]);
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
            onClick: () => {
              if (!props.disabled && !props.readonly) {
                handleOpenChange(true);
              }
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

  const displayText = derived(() => {
    return formatDateTimeRange(modelValue, adapter, context, dateTimeOnly.ampm);
  });

  const commitValue = (next: null | DateRangeValue) => {
    if (!isControlled) {
      setUncontrolledValue(next);
    }

    onChange?.(next);
  };

  const handlePickerChange = (next: null | DateRangeValue) => {
    commitValue(next);

    // Close when Apply commits (`showFooter`). Without footer, keep open while picking.
    if (dateTimeOnly.showFooter) {
      handleOpenChange(false);
    }
  };

  const handlePickerCancel = () => {
    handleOpenChange(false);
  };

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

  return {
    open,
    daySlot,
    formField,
    inputBind,
    modelValue,
    dateTimeOnly,
    containerRef,
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
