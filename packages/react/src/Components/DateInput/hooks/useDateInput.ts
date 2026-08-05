// ** External Imports
import { isArray, isNil, omit } from "es-toolkit/compat";
import type { ChangeEvent, FocusEvent, KeyboardEvent, RefObject } from "react";
import { useCallback, useRef, useState } from "react";

// ** Core Imports
import {
  cn,
  isDateRangeValue,
  resolveDatePickerMode,
  splitComponentProps,
  type DateAdapterContext,
  type DatePickerModel,
} from "@bridge-ui/core";

// ** Local Imports
import { useDateAdapter } from "@/Adapters/Date";
import type {
  DateInputCustomProps,
  DateInputOwnProps,
  DateInputProps,
} from "@/Components/DateInput/dateInput.types";
import type { FormFieldOwnProps } from "@/Components/FormField/formField.types";
import {
  formFieldBridgeKeys,
  useFormField,
} from "@/Components/FormField/hooks/useFormField";
import { useBridgeUI } from "@/Provider/useBridgeUI";
import { derived, mergePartBind } from "@/Utils";

const dateInputBridgeKeys = [
  "range",
  "value",
  "locale",
  "classes",
  "maxDate",
  "minDate",
  "multiple",
  "timeZone",
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
] as const satisfies readonly (keyof DateInputOwnProps)[];

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

export function useDateInput(
  props: DateInputProps,
  triggerRef: RefObject<null | HTMLInputElement>,
) {
  const adapter = useDateAdapter();
  const bridge = useBridgeUI();
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
  const [uncontrolledValue, setUncontrolledValue] = useState<DatePickerModel>(
    () => defaultValue ?? null,
  );
  const [draftText, setDraftText] = useState<null | string>(null);

  const isControlled = valueProp !== undefined;
  const modelValue = isControlled ? (valueProp ?? null) : uncontrolledValue;

  const { inheritedAttrs, componentProps: dateOnly } = splitComponentProps<
    DateInputProps,
    typeof dateInputBridgeKeys
  >({
    bridgeKeys: dateInputBridgeKeys,
    props: propsForSplit as DateInputProps,
  });

  const context = derived((): DateAdapterContext => {
    return {
      locale: dateOnly.locale ?? bridge?.global.locale,
      timeZone: dateOnly.timeZone ?? bridge?.global.timeZone,
    };
  });

  const mode = derived(() => {
    return resolveDatePickerMode({
      range: dateOnly.range,
      multiple: dateOnly.multiple,
    });
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

  const inherited = omit(inheritedAttrs, [
    "className",
    "onChange",
    "onOpen",
    "onClose",
  ]);

  const { componentProps: formFieldCustom } = splitComponentProps<
    Omit<FormFieldOwnProps, "field">,
    typeof formFieldBridgeKeys
  >({
    bridgeKeys: formFieldBridgeKeys,
    props: inherited as Omit<FormFieldOwnProps, "field">,
  });

  const {
    menu: _menu,
    datePicker: _datePicker,
    ...formFieldOnlyCustom
  } = (dateOnly.customProps ?? {}) as DateInputCustomProps;

  const formField = useFormField(
    {
      ...formFieldCustom,
      slots,
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
      componentName: "DateInput",
    },
  );

  const displayText = derived(() => {
    if (!isNil(draftText)) {
      return draftText;
    }

    return formatModel(modelValue, adapter, context);
  });

  const commitValue = (next: DatePickerModel) => {
    if (!isControlled) {
      setUncontrolledValue(next);
    }

    onChange?.(next);
  };

  const handlePickerChange = (next: DatePickerModel) => {
    commitValue(next);
    setDraftText(null);

    if (mode === "single" && !dateOnly.showFooter) {
      handleOpenChange(false);
    }
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
    return mergePartBind(formField.inputBind, {
      ref: triggerRef,
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
    });
  });

  return {
    open,
    mode,
    dateOnly,
    formField,
    inputBind,
    modelValue,
    containerRef,
    handleOpenChange,
    handlePickerChange,
    menuProps: dateOnly.customProps?.menu,
    datePickerCustomProps: dateOnly.customProps?.datePicker,
  };
}
