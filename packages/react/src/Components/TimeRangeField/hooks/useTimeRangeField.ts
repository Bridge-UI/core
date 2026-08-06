// ** External Imports
import { isNil, omit } from "es-toolkit/compat";
import type { FocusEvent, KeyboardEvent } from "react";
import { useCallback, useRef, useState } from "react";

// ** Core Imports
import {
  cn,
  isTimeRangeValue,
  splitComponentProps,
  type DateAdapterContext,
  type TimeRangeValue,
} from "@bridge-ui/core";

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
import { derived, mergePartBind } from "@/Utils";

const timeRangeFieldBridgeKeys = [
  "ampm",
  "value",
  "classes",
  "maxTime",
  "minTime",
  "interval",
  "timeZone",
  "showFooter",
  "customProps",
  "defaultValue",
  "disableTimes",
] as const satisfies readonly (keyof TimeRangeFieldOwnProps)[];

function formatTimeRange(
  value: null | TimeRangeValue,
  adapter: ReturnType<typeof useDateAdapter>,
  context: DateAdapterContext,
  ampm?: boolean,
): string {
  if (isNil(value) || !isTimeRangeValue(value)) {
    return "";
  }

  return `${adapter.formatTime(value[0], context, { ampm })} – ${adapter.formatTime(value[1], context, { ampm })}`;
}

export function useTimeRangeField(props: TimeRangeFieldProps) {
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
      componentName: "TimeRangeField",
    },
  );

  const displayText = derived(() => {
    return formatTimeRange(modelValue, adapter, context, timeOnly.ampm);
  });

  const commitValue = (next: null | TimeRangeValue) => {
    if (!isControlled) {
      setUncontrolledValue(next);
    }

    onChange?.(next);
  };

  const handlePickerChange = (next: null | TimeRangeValue) => {
    commitValue(next);

    if (!timeOnly.showFooter) {
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
    timeOnly,
    formField,
    inputBind,
    modelValue,
    containerRef,
    handleOpenChange,
    handlePickerChange,
    menuProps: timeOnly.customProps?.menu,
    timeRangePickerCustomProps: timeOnly.customProps?.timeRangePicker,
  };
}
