// ** External Imports
import { isNil, omit } from "es-toolkit/compat";
import { useEffect, useState } from "react";

// ** Core Imports
import {
  cn,
  combineDateAndTime,
  splitComponentProps,
  type DateAdapter,
  type DateAdapterContext,
  type DateRangeValue,
  type LibDefaultsShape,
  type MergeLibDefaults,
  type TimeValue,
} from "@bridge-ui/core";

// ** Local Imports
import { useDateAdapter, useDateAdapterContext } from "@/Adapters/Date";
import { useResolveMessage } from "@/Adapters/I18n";
import type {
  DateTimeRangePickerClasses,
  DateTimeRangePickerOwnProps,
  DateTimeRangePickerProps,
} from "@/Components/DateTimeRangePicker/dateTimeRangePicker.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const dateTimeRangePickerBridgeKeys = [
  "ampm",
  "color",
  "value",
  "tokens",
  "classes",
  "maxDate",
  "maxTime",
  "minDate",
  "minTime",
  "rounded",
  "disabled",
  "interval",
  "readOnly",
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
] as const satisfies readonly (keyof DateTimeRangePickerOwnProps)[];

type DateTimeRangePickerLibDefaults = LibDefaultsShape<
  DateTimeRangePickerOwnProps,
  | "ampm"
  | "color"
  | "rounded"
  | "interval"
  | "showFooter"
  | "orientation"
  | "startOfWeek"
>;

type DateTimeRangePickerMerged = MergeLibDefaults<
  DateTimeRangePickerOwnProps,
  DateTimeRangePickerLibDefaults
>;

/**
 * Sorts a datetime range so the earlier instant comes first.
 */
function sortDateTimeRangeValue(
  value: DateRangeValue,
  adapter: DateAdapter,
  context?: DateAdapterContext,
): DateRangeValue {
  const [start, end] = value;

  if (adapter.isAfter(start, end, context)) {
    return [end, start];
  }

  return value;
}

export function useDateTimeRangePicker(
  props: DateTimeRangePickerProps,
  libDefaults: DateTimeRangePickerLibDefaults,
) {
  const adapter = useDateAdapter();
  const resolveContext = useDateAdapterContext();
  const resolveMessage = useResolveMessage();

  const { componentProps, inheritedAttrs } = splitComponentProps<
    DateTimeRangePickerProps,
    typeof dateTimeRangePickerBridgeKeys
  >({
    props,
    bridgeKeys: dateTimeRangePickerBridgeKeys,
  });

  const { merged, entry: bridgeDateTimeRangePicker } = useBridgeUIComponent<
    DateTimeRangePickerMerged,
    "DateTimeRangePicker"
  >({
    libDefaults,
    props: componentProps,
    componentName: "DateTimeRangePicker",
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["slots", "onCancel", "onChange"]);
  });

  const mergedClasses =
    useBridgeUIMergedRegistryClasses<DateTimeRangePickerClasses>({
      props: componentProps,
      entry: bridgeDateTimeRangePicker,
    });

  const context = derived((): DateAdapterContext => {
    return resolveContext(merged.timeZone);
  });

  const isControlled = derived(() => {
    return !isNil(props.value);
  });

  const [uncontrolledValue, setUncontrolledValue] =
    useState<null | DateRangeValue>(() => {
      return merged.defaultValue ?? null;
    });

  const committedValue = derived((): null | DateRangeValue => {
    return isControlled ? (props.value ?? null) : uncontrolledValue;
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
    return merged.showFooter ? draftValue : committedValue;
  });

  const calendarTokens = derived(() => {
    return {
      day: merged.tokens?.calendar?.day ?? merged.tokens?.day,
      color: merged.tokens?.calendar?.color ?? merged.tokens?.color,
      rounded: merged.tokens?.calendar?.rounded ?? merged.tokens?.rounded,
    };
  });

  const timeTokens = derived(() => {
    return {
      color: merged.tokens?.time?.color ?? merged.tokens?.color,
      rounded: merged.tokens?.time?.rounded ?? merged.tokens?.rounded,
    };
  });

  const startTimeValue = derived(() => {
    return displayValue?.[0] ?? null;
  });

  const endTimeValue = derived(() => {
    return displayValue?.[1] ?? null;
  });

  const commitValue = (next: null | DateRangeValue) => {
    if (!isControlled) {
      setUncontrolledValue(next);
    }

    props.onChange?.(next);
  };

  const applyNext = (next: null | DateRangeValue) => {
    if (merged.showFooter) {
      setDraftValue(next);

      return;
    }

    commitValue(next);
  };

  const handleCalendarChange = (next: null | DateRangeValue) => {
    if (isNil(next)) {
      applyNext(null);

      return;
    }

    const now = adapter.now(context);
    const start = combineDateAndTime(
      next[0],
      displayValue?.[0] ?? now,
      adapter,
      context,
    );
    const end = combineDateAndTime(
      next[1],
      displayValue?.[1] ?? now,
      adapter,
      context,
    );

    applyNext(sortDateTimeRangeValue([start, end], adapter, context));
  };

  const handleStartPanelChange = (next: null | TimeValue) => {
    if (isNil(next)) {
      applyNext(null);

      return;
    }

    const now = adapter.now(context);
    const start = combineDateAndTime(
      displayValue?.[0] ?? now,
      next,
      adapter,
      context,
    );
    const end = displayValue?.[1] ?? now;

    applyNext(sortDateTimeRangeValue([start, end], adapter, context));
  };

  const handleEndPanelChange = (next: null | TimeValue) => {
    if (isNil(next)) {
      applyNext(null);

      return;
    }

    const now = adapter.now(context);
    const start = displayValue?.[0] ?? now;
    const end = combineDateAndTime(
      displayValue?.[1] ?? now,
      next,
      adapter,
      context,
    );

    applyNext(sortDateTimeRangeValue([start, end], adapter, context));
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

  const contentBind = derived(() => {
    return cn({
      "flex min-w-0 flex-col": true,
    });
  });

  const calendarBind = derived(() => {
    return cn({
      "min-w-0": true,
      [mergedClasses.calendar ?? ""]: true,
    });
  });

  const timeBind = derived(() => {
    return cn({
      "flex self-stretch flex-col border-l border-gray-100 dark:border-gray-800": true,
      [mergedClasses.time ?? ""]: true,
    });
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
    timeBind,
    timeTokens,
    footerBind,
    contentBind,
    handleApply,
    displayValue,
    handleCancel,
    calendarBind,
    endTimeValue,
    calendarTokens,
    startTimeValue,
    handleCalendarChange,
    handleEndPanelChange,
    handleStartPanelChange,
    applyLabel: resolveMessage("Apply"),
    cancelLabel: resolveMessage("Cancel"),
    showFooter: Boolean(merged.showFooter),
    applyButtonProps: customProps?.applyButton,
    cancelButtonProps: customProps?.cancelButton,
  };
}
