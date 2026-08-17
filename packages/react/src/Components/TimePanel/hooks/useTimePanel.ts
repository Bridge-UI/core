// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { useMemo } from "react";

// ** Core Imports
import type { DateAdapterContext } from "@bridge-ui/core/Adapters";
import {
  buildHourOptions,
  buildMinuteOptions,
  buildSecondOptions,
  isTimeDisabled,
  resolveCalendarDayInteractionState,
  snapMinutes,
  to12Hour,
  to24Hour,
  toMeridiem,
} from "@bridge-ui/core/Domain";
import {
  timeColorProps as colorProps,
  timeRoundedProps as roundedProps,
} from "@bridge-ui/core/Tokens";
import {
  cn,
  getColorToken,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import { useDateAdapter, useDateAdapterContext } from "@/Adapters/Date";
import type {
  TimePanelClasses,
  TimePanelOwnProps,
  TimePanelProps,
} from "@/Components/TimePanel/timePanel.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const timePanelBridgeKeys = [
  "ampm",
  "color",
  "error",
  "value",
  "tokens",
  "classes",
  "maxTime",
  "minTime",
  "rounded",
  "disabled",
  "interval",
  "readOnly",
  "timeZone",
  "customProps",
  "showSeconds",
  "disableTimes",
] as const satisfies readonly (keyof TimePanelOwnProps)[];

type TimePanelLibDefaults = LibDefaultsShape<
  TimePanelOwnProps,
  "ampm" | "color" | "rounded" | "interval" | "showSeconds"
>;

type TimePanelMerged = MergeLibDefaults<
  TimePanelOwnProps,
  TimePanelLibDefaults
>;

/**
 * Minimum outer width of one TimePanel scroll column (`w-12` tiles + scrollbar).
 * Keep DateTime width sizers in sync with this class.
 */
export const TIME_PANEL_COLUMN_WIDTH_CLASS = "w-[3.75rem]";
export const TIME_PANEL_COLUMN_MIN_WIDTH_CLASS = "min-w-[3.75rem]";

export type TimePanelItem = {
  disabled: boolean;
  label: string;
  selected: boolean;
  state: ReturnType<typeof resolveCalendarDayInteractionState>;
  value: "AM" | "PM" | number;
};

export function useTimePanel(
  props: TimePanelProps,
  libDefaults: TimePanelLibDefaults,
) {
  const adapter = useDateAdapter();
  const resolveContext = useDateAdapterContext();

  const { componentProps, inheritedAttrs } = splitComponentProps<
    TimePanelProps,
    typeof timePanelBridgeKeys
  >({
    props,
    bridgeKeys: timePanelBridgeKeys,
  });

  const { merged } = useBridgeUIComponent<TimePanelMerged>({
    libDefaults,
    props: componentProps,
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["onChange"]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<TimePanelClasses>({
    props: componentProps,
  });

  const context = derived((): DateAdapterContext => {
    return resolveContext(merged.timeZone);
  });

  const roundedClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      merged.tokens?.rounded,
    );

    return get(classes, merged.rounded);
  }, [merged.rounded, merged.tokens?.rounded]);

  const colorClass = derived(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      merged.tokens?.color,
    );

    return getColorToken({
      tokens: classes,
      color: merged.color,
      invalid: merged.error,
    });
  });

  const displayDate = derived(() => {
    const base = merged.value ?? adapter.now(context);
    const minutes = snapMinutes(
      adapter.getMinutes(base, context),
      merged.interval,
    );
    const seconds = merged.showSeconds ? adapter.getSeconds(base, context) : 0;
    let next = adapter.setHours(base, adapter.getHours(base, context), context);

    next = adapter.setMinutes(next, minutes, context);
    next = adapter.setSeconds(next, seconds, context);

    return next;
  });

  const hours = derived(() => {
    return buildHourOptions({ ampm: merged.ampm });
  });

  const minutes = derived(() => {
    return buildMinuteOptions({ interval: merged.interval });
  });

  const seconds = derived(() => {
    return buildSecondOptions();
  });

  const meridiem = derived(() => {
    return toMeridiem(adapter.getHours(displayDate, context));
  });

  const isItemDisabled = (candidate: Date) => {
    return (
      Boolean(merged.disabled) ||
      isTimeDisabled(candidate, {
        adapter,
        context,
        maxTime: merged.maxTime,
        minTime: merged.minTime,
        disableTimes: merged.disableTimes,
      })
    );
  };

  const commitTime = (next: Date) => {
    if (merged.disabled || merged.readOnly) {
      return;
    }

    if (isItemDisabled(next)) {
      return;
    }

    props.onChange?.(next);
  };

  const selectHour = (hour: number) => {
    const hours24 = merged.ampm ? to24Hour(hour, meridiem) : hour;
    let next = adapter.setHours(displayDate, hours24, context);

    next = adapter.setMinutes(
      next,
      adapter.getMinutes(displayDate, context),
      context,
    );

    commitTime(next);
  };

  const selectMinute = (minute: number) => {
    const next = adapter.setMinutes(displayDate, minute, context);

    commitTime(next);
  };

  const selectSecond = (second: number) => {
    const next = adapter.setSeconds(displayDate, second, context);

    commitTime(next);
  };

  const selectMeridiem = (nextMeridiem: "AM" | "PM") => {
    const hour12 = to12Hour(adapter.getHours(displayDate, context));
    const hours24 = to24Hour(hour12, nextMeridiem);
    let next = adapter.setHours(displayDate, hours24, context);

    next = adapter.setMinutes(
      next,
      adapter.getMinutes(displayDate, context),
      context,
    );

    commitTime(next);
  };

  const hourItems = derived((): TimePanelItem[] => {
    const selectedHour24 = adapter.getHours(displayDate, context);
    const selectedHour = merged.ampm
      ? to12Hour(selectedHour24)
      : selectedHour24;

    return hours.map((hour) => {
      const hours24 = merged.ampm ? to24Hour(hour, meridiem) : hour;
      let candidate = adapter.setHours(displayDate, hours24, context);

      candidate = adapter.setMinutes(
        candidate,
        adapter.getMinutes(displayDate, context),
        context,
      );

      const disabled = isItemDisabled(candidate);
      const selected = hour === selectedHour;
      const state = resolveCalendarDayInteractionState({
        disabled,
        selected,
        readOnly: merged.readOnly,
      });

      return {
        state,
        selected,
        value: hour,
        disabled: disabled || Boolean(merged.readOnly),
        label: merged.ampm ? String(hour) : String(hour).padStart(2, "0"),
      };
    });
  });

  const minuteItems = derived((): TimePanelItem[] => {
    const selectedMinute = adapter.getMinutes(displayDate, context);

    return minutes.map((minute) => {
      const candidate = adapter.setMinutes(displayDate, minute, context);
      const disabled = isItemDisabled(candidate);
      const selected = minute === selectedMinute;
      const state = resolveCalendarDayInteractionState({
        disabled,
        selected,
        readOnly: merged.readOnly,
      });

      return {
        state,
        selected,
        value: minute,
        label: String(minute).padStart(2, "0"),
        disabled: disabled || Boolean(merged.readOnly),
      };
    });
  });

  const secondItems = derived((): TimePanelItem[] => {
    if (!merged.showSeconds) {
      return [];
    }

    const selectedSecond = adapter.getSeconds(displayDate, context);

    return seconds.map((second) => {
      const candidate = adapter.setSeconds(displayDate, second, context);
      const disabled = isItemDisabled(candidate);
      const selected = second === selectedSecond;
      const state = resolveCalendarDayInteractionState({
        disabled,
        selected,
        readOnly: merged.readOnly,
      });

      return {
        state,
        selected,
        value: second,
        label: String(second).padStart(2, "0"),
        disabled: disabled || Boolean(merged.readOnly),
      };
    });
  });

  const meridiemItems = derived((): TimePanelItem[] => {
    if (!merged.ampm) {
      return [];
    }

    return (["AM", "PM"] as const).map((entry) => {
      const hour12 = to12Hour(adapter.getHours(displayDate, context));
      const hours24 = to24Hour(hour12, entry);
      let candidate = adapter.setHours(displayDate, hours24, context);

      candidate = adapter.setMinutes(
        candidate,
        adapter.getMinutes(displayDate, context),
        context,
      );

      const disabled = isItemDisabled(candidate);
      const selected = entry === meridiem;
      const state = resolveCalendarDayInteractionState({
        disabled,
        selected,
        readOnly: merged.readOnly,
      });

      return {
        state,
        selected,
        label: entry,
        value: entry,
        disabled: disabled || Boolean(merged.readOnly),
      };
    });
  });

  const rootBind = derived(() => {
    return mergePartBind(
      customProps?.root,
      rootInheritedAttrs,
      cn({
        "flex h-72 w-full min-w-fit flex-row gap-2": true,
        [mergedClasses.root ?? ""]: true,
      }),
    );
  });

  const columnBind = derived(() => {
    return mergePartBind(
      customProps?.column,
      {},
      cn({
        "box-border flex h-full min-w-0 flex-1 flex-col items-stretch gap-1 overflow-x-hidden overflow-y-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-button]:hidden [&::-webkit-scrollbar-corner]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-dark-300 dark:[&::-webkit-scrollbar-thumb]:bg-dark-600": true,
        [TIME_PANEL_COLUMN_MIN_WIDTH_CLASS]: true,
        [mergedClasses.column ?? ""]: true,
      }),
    );
  });

  const getItemBind = (
    item: TimePanelItem,
    onSelect: (value: TimePanelItem["value"]) => void,
    ariaLabel: string,
  ) => {
    const color = colorClass;

    return mergePartBind(
      customProps?.item,
      {
        type: "button" as const,
        "aria-label": ariaLabel,
        disabled: item.disabled,
        "aria-pressed": item.selected,
        onClick: () => onSelect(item.value),
      },
      cn({
        "w-full cursor-pointer px-3 py-2 text-sm transition-all duration-150 ease-in-out outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed": true,
        [roundedClass ?? ""]: true,
        [color?.base ?? ""]: item.state === "base" || item.state === "hover",
        [color?.hover ?? ""]: item.state === "base" || item.state === "hover",
        [color?.selected ?? ""]: item.state === "selected",
        [color?.disabled ?? ""]: item.state === "disabled",
        [mergedClasses.item ?? ""]: true,
      }),
    );
  };

  const getHourBind = (item: TimePanelItem) => {
    return getItemBind(
      item,
      (value) => {
        if (typeof value === "number") {
          selectHour(value);
        }
      },
      `Hour ${item.label}`,
    );
  };

  const getMinuteBind = (item: TimePanelItem) => {
    return getItemBind(
      item,
      (value) => {
        if (typeof value === "number") {
          selectMinute(value);
        }
      },
      `Minute ${item.label}`,
    );
  };

  const getSecondBind = (item: TimePanelItem) => {
    return getItemBind(
      item,
      (value) => {
        if (typeof value === "number") {
          selectSecond(value);
        }
      },
      `Second ${item.label}`,
    );
  };

  const getMeridiemBind = (item: TimePanelItem) => {
    return getItemBind(
      item,
      (value) => {
        if (value === "AM" || value === "PM") {
          selectMeridiem(value);
        }
      },
      String(item.label),
    );
  };

  return {
    merged,
    rootBind,
    hourItems,
    columnBind,
    getHourBind,
    minuteItems,
    secondItems,
    displayDate,
    getMinuteBind,
    getSecondBind,
    meridiemItems,
    getMeridiemBind,
    showMeridiem: Boolean(merged.ampm),
    showSeconds: Boolean(merged.showSeconds),
  };
}
