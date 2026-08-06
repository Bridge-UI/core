// ** External Imports
import { isNil, omit } from "es-toolkit/compat";
import type { FocusEvent, KeyboardEvent } from "react";
import { useCallback, useRef, useState } from "react";

// ** Core Imports
import {
  cn,
  splitComponentProps,
  type DateAdapterContext,
} from "@bridge-ui/core";

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
import { derived, mergePartBind } from "@/Utils";

const dateTimeFieldBridgeKeys = [
  "ampm",
  "value",
  "classes",
  "maxDate",
  "maxTime",
  "minDate",
  "minTime",
  "interval",
  "timeZone",
  "hideYears",
  "hideMonths",
  "showFooter",
  "customProps",
  "defaultView",
  "startOfWeek",
  "defaultValue",
  "disableDates",
  "disableTimes",
  "disableYears",
  "hideWeekdays",
  "disableMonths",
] as const satisfies readonly (keyof DateTimeFieldOwnProps)[];

function formatDateTimeValue(
  value: Date | null,
  adapter: ReturnType<typeof useDateAdapter>,
  context: DateAdapterContext,
  ampm?: boolean,
): string {
  if (isNil(value)) {
    return "";
  }

  return `${adapter.format(value, context)} ${adapter.formatTime(value, context, { ampm })}`.trim();
}

export function useDateTimeField(props: DateTimeFieldProps) {
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
      componentName: "DateTimeField",
    },
  );

  const displayText = derived(() => {
    return formatDateTimeValue(modelValue, adapter, context, dateTimeOnly.ampm);
  });

  const commitValue = (next: Date | null) => {
    if (!isControlled) {
      setUncontrolledValue(next);
    }

    onChange?.(next);
  };

  const handlePickerChange = (next: Date | null) => {
    commitValue(next);

    if (!dateTimeOnly.showFooter) {
      handleOpenChange(false);
    }
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
    menuProps: dateTimeOnly.customProps?.menu,
    dateTimePickerCustomProps: dateTimeOnly.customProps?.dateTimePicker,
  };
}
