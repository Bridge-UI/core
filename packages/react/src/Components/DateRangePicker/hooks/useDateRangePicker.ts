// ** External Imports
import { isNil, omit } from "es-toolkit/compat";
import { useEffect, useState } from "react";

// ** Core Imports
import {
  cn,
  splitComponentProps,
  type DateRangeValue,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import type {
  DateRangePickerClasses,
  DateRangePickerOwnProps,
  DateRangePickerProps,
} from "@/Components/DateRangePicker/dateRangePicker.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const dateRangePickerBridgeKeys = [
  "color",
  "value",
  "tokens",
  "classes",
  "maxDate",
  "minDate",
  "rounded",
  "disabled",
  "readOnly",
  "timeZone",
  "hideYears",
  "hideMonths",
  "showFooter",
  "customProps",
  "startOfWeek",
  "defaultValue",
  "disableDates",
  "disableYears",
  "hideWeekdays",
  "disableMonths",
] as const satisfies readonly (keyof DateRangePickerOwnProps)[];

type DateRangePickerLibDefaults = LibDefaultsShape<
  DateRangePickerOwnProps,
  "color" | "rounded" | "showFooter" | "startOfWeek"
>;

type DateRangePickerMerged = MergeLibDefaults<
  DateRangePickerOwnProps,
  DateRangePickerLibDefaults
>;

export function useDateRangePicker(
  props: DateRangePickerProps,
  libDefaults: DateRangePickerLibDefaults,
) {
  const resolveMessage = useResolveMessage();

  const { componentProps, inheritedAttrs } = splitComponentProps<
    DateRangePickerProps,
    typeof dateRangePickerBridgeKeys
  >({
    props,
    bridgeKeys: dateRangePickerBridgeKeys,
  });

  const { merged, entry: bridgeDateRangePicker } = useBridgeUIComponent<
    DateRangePickerMerged,
    "DateRangePicker"
  >({
    libDefaults,
    props: componentProps,
    componentName: "DateRangePicker",
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["slots", "onCancel", "onChange"]);
  });

  const mergedClasses =
    useBridgeUIMergedRegistryClasses<DateRangePickerClasses>({
      props: componentProps,
      entry: bridgeDateRangePicker,
    });

  const isControlled = derived(() => {
    return !isNil(props.value);
  });

  const [uncontrolledValue, setUncontrolledValue] =
    useState<null | DateRangeValue>(() => {
      return merged.defaultValue ?? null;
    });

  const committedValue = derived((): null | DateRangeValue => {
    if (isControlled) {
      return props.value ?? null;
    }

    return uncontrolledValue;
  });

  const [draftValue, setDraftValue] = useState<null | DateRangeValue>(
    committedValue,
  );

  useEffect(() => {
    if (merged.showFooter) {
      setDraftValue(committedValue);
    }
  }, [committedValue, merged.showFooter]);

  const displayValue = derived(() => {
    if (merged.showFooter) {
      return draftValue;
    }

    return committedValue;
  });

  const calendarTokens = derived(() => {
    return {
      day: merged.tokens?.calendar?.day ?? merged.tokens?.day,
      color: merged.tokens?.calendar?.color ?? merged.tokens?.color,
      rounded: merged.tokens?.calendar?.rounded ?? merged.tokens?.rounded,
    };
  });

  const commitValue = (next: null | DateRangeValue) => {
    if (!isControlled) {
      setUncontrolledValue(next);
    }

    props.onChange?.(next);
  };

  const handleCalendarChange = (next: null | DateRangeValue) => {
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
        "flex flex-col overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-900": true,
        [mergedClasses.root ?? ""]: true,
      }),
    );
  });

  const footerBind = derived(() => {
    return mergePartBind(
      customProps?.footer,
      {},
      cn({
        "flex items-center justify-end gap-2 border-t border-gray-100 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-gray-950/40": true,
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
