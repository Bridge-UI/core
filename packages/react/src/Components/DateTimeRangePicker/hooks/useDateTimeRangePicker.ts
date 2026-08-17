// ** External Imports
import { get, isNil, omit } from "es-toolkit/compat";
import { useEffect, useState } from "react";

// ** Core Imports
import type { DateAdapter, DateAdapterContext } from "@bridge-ui/core/Adapters";
import {
  combineDateAndTime,
  type DateRangeValue,
  type TimeValue,
} from "@bridge-ui/core/Domain";
import { menuRoundedProps as shellRoundedProps } from "@bridge-ui/core/Tokens";
import {
  cn,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import { useDateAdapter, useDateAdapterContext } from "@/Adapters/Date";
import { useResolveMessage } from "@/Adapters/I18n";
import type {
  DateTimeRangePickerClasses,
  DateTimeRangePickerOwnProps,
  DateTimeRangePickerProps,
} from "@/Components/DateTimeRangePicker/dateTimeRangePicker.types";
import { useFieldOverlayFooter } from "@/Components/FieldOverlay/FieldOverlayContext";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const dateTimeRangePickerBridgeKeys = [
  "ampm",
  "fill",
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
  "invalidated",
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
] as const satisfies readonly (keyof DateTimeRangePickerOwnProps)[];

type DateTimeRangePickerLibDefaults = LibDefaultsShape<
  DateTimeRangePickerOwnProps,
  | "ampm"
  | "color"
  | "rounded"
  | "interval"
  | "orientation"
  | "showSeconds"
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
  const resolveMessage = useResolveMessage();
  const overlayFooter = useFieldOverlayFooter();
  const resolveContext = useDateAdapterContext();

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
    return omit(inheritedAttrs, ["slots", "onApply", "onCancel", "onChange"]);
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
    props.onApply?.();
    overlayFooter.apply();
  };

  const handleCancel = () => {
    setDraftValue(committedValue);
    props.onCancel?.();
    overlayFooter.cancel();
  };

  const rootBind = derived(() => {
    const shellRounded = get(shellRoundedProps, merged.rounded ?? "md");

    return mergePartBind(
      customProps?.root,
      rootInheritedAttrs,
      cn({
        "flex flex-col overflow-hidden bg-white shadow-lg dark:bg-dark-900": true,
        "w-full": merged.fill,
        "w-fit": !merged.fill,
        [shellRounded]: true,
        [mergedClasses.root ?? ""]: true,
      }),
    );
  });

  const contentBind = derived(() => {
    return cn({
      "flex w-full flex-col": true,
    });
  });

  const calendarBind = derived(() => {
    return cn({
      "w-full": true,
      [mergedClasses.calendar ?? ""]: true,
    });
  });

  const timeBind = derived(() => {
    return cn({
      "relative isolate shrink-0 self-stretch overflow-hidden border-l border-dark-100 dark:border-dark-800": true,
      [mergedClasses.time ?? ""]: true,
    });
  });

  const timePanelCustomProps = derived(() => {
    return {
      root: { className: "h-full max-h-full overflow-hidden" },
    };
  });

  /** Invisible in-flow sizer so the shell keeps TimePanel's content width. */
  const timeSizerBind = derived(() => {
    return cn({
      "invisible flex h-px w-fit gap-2 overflow-hidden px-2.5": true,
    });
  });

  /** Absolutely fills the stretched shell; hosts the real TimePanel. */
  const timeFillBind = derived(() => {
    return cn({
      "absolute inset-0 flex w-full px-2.5": true,
    });
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
    timeBind,
    timeTokens,
    footerBind,
    contentBind,
    handleApply,
    displayValue,
    handleCancel,
    calendarBind,
    timeFillBind,
    endTimeValue,
    timeSizerBind,
    calendarTokens,
    startTimeValue,
    handleCalendarChange,
    handleEndPanelChange,
    timePanelCustomProps,
    handleStartPanelChange,
    applyLabel: resolveMessage("Apply"),
    cancelLabel: resolveMessage("Cancel"),
    showFooter: Boolean(merged.showFooter),
    applyButtonProps: customProps?.applyButton,
    cancelButtonProps: customProps?.cancelButton,
  };
}
