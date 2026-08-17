// ** External Imports
import { get, isArray, isNil, omit } from "es-toolkit/compat";
import { useEffect, useState } from "react";

// ** Core Imports
import type { DateAdapterContext } from "@bridge-ui/core/Adapters";
import {
  combineDateAndTime,
  type DatePickerModel,
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
  DateTimePickerClasses,
  DateTimePickerOwnProps,
  DateTimePickerProps,
} from "@/Components/DateTimePicker/dateTimePicker.types";
import { useFieldOverlayFooter } from "@/Components/FieldOverlay/FieldOverlayContext";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const dateTimePickerBridgeKeys = [
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
  "defaultView",
  "invalidated",
  "showSeconds",
  "startOfWeek",
  "defaultValue",
  "disableDates",
  "disableTimes",
  "disableYears",
  "hideWeekdays",
  "disableMonths",
  "hideOutsideDays",
] as const satisfies readonly (keyof DateTimePickerOwnProps)[];

type DateTimePickerLibDefaults = LibDefaultsShape<
  DateTimePickerOwnProps,
  | "ampm"
  | "color"
  | "rounded"
  | "interval"
  | "defaultView"
  | "showSeconds"
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
  const resolveMessage = useResolveMessage();
  const overlayFooter = useFieldOverlayFooter();
  const resolveContext = useDateAdapterContext();

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
    return omit(inheritedAttrs, ["slots", "onApply", "onCancel", "onChange"]);
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
      "flex w-full flex-row items-stretch": true,
    });
  });

  const calendarBind = derived(() => {
    return cn({
      "min-w-0 flex-1": true,
      [mergedClasses.calendar ?? ""]: true,
    });
  });

  /**
   * Time column shell: stretches to the calendar height without letting
   * TimePanel content contribute to the row's intrinsic height.
   */
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
    timeSizerBind,
    calendarTokens,
    handlePanelChange,
    handleCalendarChange,
    timePanelCustomProps,
    applyLabel: resolveMessage("Apply"),
    cancelLabel: resolveMessage("Cancel"),
    showFooter: Boolean(merged.showFooter),
    applyButtonProps: customProps?.applyButton,
    cancelButtonProps: customProps?.cancelButton,
  };
}
