// ** External Imports
import { isArray, isNil, omit } from "es-toolkit/compat";
import { useEffect, useState } from "react";

// ** Core Imports
import {
  cn,
  combineDateAndTime,
  splitComponentProps,
  type DateAdapterContext,
  type DatePickerModel,
  type LibDefaultsShape,
  type MergeLibDefaults,
  type TimeValue,
} from "@bridge-ui/core";

// ** Local Imports
import { useDateAdapter, useDateAdapterContext } from "@/Adapters/Date";
import { useResolveMessage } from "@/Adapters/I18n";
import type {
  DateTimePickerClasses,
  DateTimePickerOwnProps,
  DateTimePickerProps,
} from "@/Components/DateTimePicker/dateTimePicker.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const dateTimePickerBridgeKeys = [
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
  "defaultView",
  "startOfWeek",
  "defaultValue",
  "disableDates",
  "disableTimes",
  "disableYears",
  "hideWeekdays",
  "disableMonths",
] as const satisfies readonly (keyof DateTimePickerOwnProps)[];

type DateTimePickerLibDefaults = LibDefaultsShape<
  DateTimePickerOwnProps,
  | "ampm"
  | "color"
  | "rounded"
  | "interval"
  | "showFooter"
  | "defaultView"
  | "startOfWeek"
>;

type DateTimePickerMerged = MergeLibDefaults<
  DateTimePickerOwnProps,
  DateTimePickerLibDefaults
>;

export function useDateTimePicker(
  props: DateTimePickerProps,
  libDefaults: DateTimePickerLibDefaults,
) {
  const adapter = useDateAdapter();
  const resolveContext = useDateAdapterContext();
  const resolveMessage = useResolveMessage();

  const { componentProps, inheritedAttrs } = splitComponentProps<
    DateTimePickerProps,
    typeof dateTimePickerBridgeKeys
  >({
    props,
    bridgeKeys: dateTimePickerBridgeKeys,
  });

  const { merged, entry: bridgeDateTimePicker } = useBridgeUIComponent<
    DateTimePickerMerged,
    "DateTimePicker"
  >({
    libDefaults,
    props: componentProps,
    componentName: "DateTimePicker",
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["slots", "onCancel", "onChange"]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<DateTimePickerClasses>(
    {
      props: componentProps,
      entry: bridgeDateTimePicker,
    },
  );

  const context = derived((): DateAdapterContext => {
    return resolveContext(merged.timeZone);
  });

  const isControlled = derived(() => {
    return !isNil(props.value);
  });

  const [uncontrolledValue, setUncontrolledValue] = useState<Date | null>(
    () => merged.defaultValue ?? null,
  );

  const committedValue = derived((): Date | null => {
    return isControlled ? (props.value ?? null) : uncontrolledValue;
  });

  const [draftValue, setDraftValue] = useState<Date | null>(committedValue);

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

  const commitValue = (next: Date | null) => {
    if (!isControlled) {
      setUncontrolledValue(next);
    }

    props.onChange?.(next);
  };

  const applyNext = (next: Date | null) => {
    if (merged.showFooter) {
      setDraftValue(next);

      return;
    }

    commitValue(next);
  };

  const handleCalendarChange = (next: DatePickerModel) => {
    if (isNil(next) || isArray(next)) {
      applyNext(null);

      return;
    }

    const combined = combineDateAndTime(
      next,
      displayValue ?? adapter.now(context),
      adapter,
      context,
    );

    applyNext(combined);
  };

  const handlePanelChange = (next: null | TimeValue) => {
    if (isNil(next)) {
      applyNext(null);

      return;
    }

    const combined = combineDateAndTime(
      displayValue ?? adapter.now(context),
      next,
      adapter,
      context,
    );

    applyNext(combined);
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
      "flex flex-row items-stretch": true,
    });
  });

  const calendarBind = derived(() => {
    return cn({
      "shrink-0": true,
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
    calendarTokens,
    handlePanelChange,
    handleCalendarChange,
    applyLabel: resolveMessage("Apply"),
    cancelLabel: resolveMessage("Cancel"),
    showFooter: Boolean(merged.showFooter),
    applyButtonProps: customProps?.applyButton,
    cancelButtonProps: customProps?.cancelButton,
  };
}
