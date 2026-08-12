// ** External Imports
import { isNil, omit } from "es-toolkit/compat";
import { useEffect, useState } from "react";

// ** Core Imports
import {
  cn,
  splitComponentProps,
  type DatePickerModel,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import type {
  DatePickerClasses,
  DatePickerOwnProps,
  DatePickerProps,
} from "@/Components/DatePicker/datePicker.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const datePickerBridgeKeys = [
  "color",
  "range",
  "value",
  "tokens",
  "classes",
  "maxDate",
  "minDate",
  "rounded",
  "disabled",
  "multiple",
  "readOnly",
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
  "hideOutsideDays",
] as const satisfies readonly (keyof DatePickerOwnProps)[];

type DatePickerLibDefaults = LibDefaultsShape<
  DatePickerOwnProps,
  "color" | "rounded" | "showFooter" | "startOfWeek"
>;

type DatePickerMerged = MergeLibDefaults<
  DatePickerOwnProps,
  DatePickerLibDefaults
>;

export function useDatePicker(
  props: DatePickerProps,
  libDefaults: DatePickerLibDefaults,
) {
  const resolveMessage = useResolveMessage();

  const { componentProps, inheritedAttrs } = splitComponentProps<
    DatePickerProps,
    typeof datePickerBridgeKeys
  >({
    props,
    bridgeKeys: datePickerBridgeKeys,
  });

  const { merged, entry: bridgeDatePicker } = useBridgeUIComponent<
    DatePickerMerged,
    "DatePicker"
  >({
    libDefaults,
    props: componentProps,
    componentName: "DatePicker",
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["slots", "onCancel", "onChange"]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<DatePickerClasses>({
    props: componentProps,
    entry: bridgeDatePicker,
  });

  const isControlled = derived(() => {
    return !isNil(props.value);
  });

  const [uncontrolledValue, setUncontrolledValue] = useState<DatePickerModel>(
    () => merged.defaultValue ?? null,
  );

  const committedValue = derived((): DatePickerModel => {
    return isControlled ? (props.value ?? null) : uncontrolledValue;
  });

  const [draftValue, setDraftValue] = useState<DatePickerModel>(committedValue);

  useEffect(() => {
    if (merged.showFooter) {
      setDraftValue(committedValue);
    }
  }, [committedValue, merged.showFooter]);

  const displayValue = derived(() => {
    return merged.showFooter ? draftValue : committedValue;
  });

  const calendarTokens = derived(() => {
    return {
      day: merged.tokens?.calendar?.day ?? merged.tokens?.day,
      color: merged.tokens?.calendar?.color ?? merged.tokens?.color,
      rounded: merged.tokens?.calendar?.rounded ?? merged.tokens?.rounded,
    };
  });

  const commitValue = (next: DatePickerModel) => {
    if (!isControlled) {
      setUncontrolledValue(next);
    }

    props.onChange?.(next);
  };

  const handleCalendarChange = (next: DatePickerModel) => {
    if (merged.showFooter) {
      setDraftValue(next);

      return;
    }

    commitValue(next);
  };

  const handleApply = () => {
    commitValue(draftValue);
  };

  const handleCancel = () => {
    setDraftValue(committedValue);
    props.onCancel?.();
  };

  const rootBind = derived(() => {
    return mergePartBind(
      customProps?.root,
      rootInheritedAttrs,
      cn({
        "flex w-fit flex-col overflow-hidden rounded-lg bg-white shadow-lg dark:bg-dark-900": true,
        [mergedClasses.root ?? ""]: true,
      }),
    );
  });

  const footerBind = derived(() => {
    return mergePartBind(
      customProps?.footer,
      {},
      cn({
        "flex items-center justify-end gap-2 border-t border-dark-100 bg-dark-50 px-3 py-2 dark:border-dark-800 dark:bg-dark-950/40": true,
        [mergedClasses.footer ?? ""]: true,
      }),
    );
  });

  return {
    merged,
    rootBind,
    footerBind,
    handleApply,
    displayValue,
    handleCancel,
    calendarTokens,
    handleCalendarChange,
    applyLabel: resolveMessage("Apply"),
    cancelLabel: resolveMessage("Cancel"),
    showFooter: Boolean(merged.showFooter),
    applyButtonProps: customProps?.applyButton,
    cancelButtonProps: customProps?.cancelButton,
  };
}
