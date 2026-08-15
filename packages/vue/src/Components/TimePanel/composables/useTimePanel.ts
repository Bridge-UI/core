// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { computed, toValue, useAttrs, type MaybeRefOrGetter } from "vue";

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
} from "@/Components/TimePanel/timePanel.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const timePanelBridgeKeys = [
  "ampm",
  "color",
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

/**
 * Builds hour / minute / second / AM-PM columns and tile binds for `TimePanel`.
 */
export function useTimePanel(
  props: MaybeRefOrGetter<TimePanelOwnProps>,
  libDefaults: TimePanelLibDefaults,
  emit: (event: "change", value: Date | null) => void,
) {
  const attrs = useAttrs();
  const adapter = useDateAdapter();
  const resolveContext = useDateAdapterContext();

  const split = computed(() => {
    return splitComponentProps<TimePanelOwnProps, typeof timePanelBridgeKeys>({
      bridgeKeys: timePanelBridgeKeys,
      props: { ...attrs, ...toValue(props) },
    });
  });

  const { merged } = useBridgeUIComponent<TimePanelMerged>({
    libDefaults,
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const rootInheritedAttrs = computed(() => {
    return omit(split.value.inheritedAttrs, ["onChange"]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<TimePanelClasses>({
    props: () => split.value.componentProps,
    entry: computed(() => {
      return undefined;
    }),
  });

  const context = computed((): DateAdapterContext => {
    return resolveContext(merged.value.timeZone);
  });

  const colorTokens = computed(() => {
    return mergeBridgeUILayeredClasses(colorProps, merged.value.tokens?.color);
  });

  const roundedClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      merged.value.tokens?.rounded,
    );

    return get(classes, merged.value.rounded);
  });

  const colorClass = computed(() => {
    return get(colorTokens.value, merged.value.color);
  });

  const displayDate = computed(() => {
    const base = merged.value.value ?? adapter.value.now(context.value);
    const minutes = snapMinutes(
      adapter.value.getMinutes(base, context.value),
      merged.value.interval,
    );
    const seconds = merged.value.showSeconds
      ? adapter.value.getSeconds(base, context.value)
      : 0;
    let next = adapter.value.setHours(
      base,
      adapter.value.getHours(base, context.value),
      context.value,
    );

    next = adapter.value.setMinutes(next, minutes, context.value);
    next = adapter.value.setSeconds(next, seconds, context.value);

    return next;
  });

  const hours = computed(() => {
    return buildHourOptions({ ampm: merged.value.ampm });
  });

  const minutes = computed(() => {
    return buildMinuteOptions({ interval: merged.value.interval });
  });

  const seconds = computed(() => {
    return buildSecondOptions();
  });

  const meridiem = computed(() => {
    return toMeridiem(adapter.value.getHours(displayDate.value, context.value));
  });

  const isItemDisabled = (candidate: Date) => {
    return (
      Boolean(merged.value.disabled) ||
      isTimeDisabled(candidate, {
        adapter: adapter.value,
        context: context.value,
        maxTime: merged.value.maxTime,
        minTime: merged.value.minTime,
        disableTimes: merged.value.disableTimes,
      })
    );
  };

  const commitTime = (next: Date) => {
    if (merged.value.disabled || merged.value.readOnly) {
      return;
    }

    if (isItemDisabled(next)) {
      return;
    }

    emit("change", next);
  };

  const selectHour = (hour: number) => {
    const hours24 = merged.value.ampm ? to24Hour(hour, meridiem.value) : hour;
    let next = adapter.value.setHours(
      displayDate.value,
      hours24,
      context.value,
    );

    next = adapter.value.setMinutes(
      next,
      adapter.value.getMinutes(displayDate.value, context.value),
      context.value,
    );

    commitTime(next);
  };

  const selectMinute = (minute: number) => {
    const next = adapter.value.setMinutes(
      displayDate.value,
      minute,
      context.value,
    );

    commitTime(next);
  };

  const selectSecond = (second: number) => {
    const next = adapter.value.setSeconds(
      displayDate.value,
      second,
      context.value,
    );

    commitTime(next);
  };

  const selectMeridiem = (nextMeridiem: "AM" | "PM") => {
    const hour12 = to12Hour(
      adapter.value.getHours(displayDate.value, context.value),
    );
    const hours24 = to24Hour(hour12, nextMeridiem);
    let next = adapter.value.setHours(
      displayDate.value,
      hours24,
      context.value,
    );

    next = adapter.value.setMinutes(
      next,
      adapter.value.getMinutes(displayDate.value, context.value),
      context.value,
    );

    commitTime(next);
  };

  const hourItems = computed((): TimePanelItem[] => {
    const selectedHour24 = adapter.value.getHours(
      displayDate.value,
      context.value,
    );
    const selectedHour = merged.value.ampm
      ? to12Hour(selectedHour24)
      : selectedHour24;

    return hours.value.map((hour) => {
      const hours24 = merged.value.ampm ? to24Hour(hour, meridiem.value) : hour;
      let candidate = adapter.value.setHours(
        displayDate.value,
        hours24,
        context.value,
      );

      candidate = adapter.value.setMinutes(
        candidate,
        adapter.value.getMinutes(displayDate.value, context.value),
        context.value,
      );

      const disabled = isItemDisabled(candidate);
      const selected = hour === selectedHour;
      const state = resolveCalendarDayInteractionState({
        disabled,
        selected,
        readOnly: merged.value.readOnly,
      });

      return {
        state,
        selected,
        value: hour,
        disabled: disabled || Boolean(merged.value.readOnly),
        label: merged.value.ampm ? String(hour) : String(hour).padStart(2, "0"),
      };
    });
  });

  const minuteItems = computed((): TimePanelItem[] => {
    const selectedMinute = adapter.value.getMinutes(
      displayDate.value,
      context.value,
    );

    return minutes.value.map((minute) => {
      const candidate = adapter.value.setMinutes(
        displayDate.value,
        minute,
        context.value,
      );
      const disabled = isItemDisabled(candidate);
      const selected = minute === selectedMinute;
      const state = resolveCalendarDayInteractionState({
        disabled,
        selected,
        readOnly: merged.value.readOnly,
      });

      return {
        state,
        selected,
        value: minute,
        label: String(minute).padStart(2, "0"),
        disabled: disabled || Boolean(merged.value.readOnly),
      };
    });
  });

  const secondItems = computed((): TimePanelItem[] => {
    if (!merged.value.showSeconds) {
      return [];
    }

    const selectedSecond = adapter.value.getSeconds(
      displayDate.value,
      context.value,
    );

    return seconds.value.map((second) => {
      const candidate = adapter.value.setSeconds(
        displayDate.value,
        second,
        context.value,
      );
      const disabled = isItemDisabled(candidate);
      const selected = second === selectedSecond;
      const state = resolveCalendarDayInteractionState({
        disabled,
        selected,
        readOnly: merged.value.readOnly,
      });

      return {
        state,
        selected,
        value: second,
        label: String(second).padStart(2, "0"),
        disabled: disabled || Boolean(merged.value.readOnly),
      };
    });
  });

  const meridiemItems = computed((): TimePanelItem[] => {
    if (!merged.value.ampm) {
      return [];
    }

    return (["AM", "PM"] as const).map((entry) => {
      const hour12 = to12Hour(
        adapter.value.getHours(displayDate.value, context.value),
      );
      const hours24 = to24Hour(hour12, entry);
      let candidate = adapter.value.setHours(
        displayDate.value,
        hours24,
        context.value,
      );

      candidate = adapter.value.setMinutes(
        candidate,
        adapter.value.getMinutes(displayDate.value, context.value),
        context.value,
      );

      const disabled = isItemDisabled(candidate);
      const selected = entry === meridiem.value;
      const state = resolveCalendarDayInteractionState({
        disabled,
        selected,
        readOnly: merged.value.readOnly,
      });

      return {
        state,
        selected,
        label: entry,
        value: entry,
        disabled: disabled || Boolean(merged.value.readOnly),
      };
    });
  });

  const rootBind = computed(() => {
    return mergePartBind(
      customProps.value?.root,
      rootInheritedAttrs.value,
      cn({
        "flex h-72 w-full min-w-fit flex-row gap-2": true,
        [mergedClasses.value.root ?? ""]: true,
      }),
    );
  });

  const columnBind = computed(() => {
    return mergePartBind(
      customProps.value?.column,
      {},
      cn({
        "box-border flex h-full min-w-0 flex-1 flex-col items-stretch gap-1 overflow-x-hidden overflow-y-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-button]:hidden [&::-webkit-scrollbar-corner]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-dark-300 dark:[&::-webkit-scrollbar-thumb]:bg-dark-600": true,
        [TIME_PANEL_COLUMN_MIN_WIDTH_CLASS]: true,
        [mergedClasses.value.column ?? ""]: true,
      }),
    );
  });

  const getItemBind = (
    item: TimePanelItem,
    onSelect: (value: TimePanelItem["value"]) => void,
  ) => {
    const color = colorClass.value;

    return mergePartBind(
      customProps.value?.item,
      {
        type: "button" as const,
        disabled: item.disabled,
        "aria-pressed": item.selected,
        onClick: () => onSelect(item.value),
      },
      cn({
        "w-full cursor-pointer px-3 py-2 text-sm transition-all duration-150 ease-in-out outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed": true,
        [roundedClass.value ?? ""]: true,
        [color?.base ?? ""]: item.state === "base" || item.state === "hover",
        [color?.hover ?? ""]: item.state === "base" || item.state === "hover",
        [color?.selected ?? ""]: item.state === "selected",
        [color?.disabled ?? ""]: item.state === "disabled",
        [mergedClasses.value.item ?? ""]: true,
      }),
    );
  };

  const getHourBind = (item: TimePanelItem) => {
    return getItemBind(item, (value) => {
      if (typeof value === "number") {
        selectHour(value);
      }
    });
  };

  const getMinuteBind = (item: TimePanelItem) => {
    return getItemBind(item, (value) => {
      if (typeof value === "number") {
        selectMinute(value);
      }
    });
  };

  const getSecondBind = (item: TimePanelItem) => {
    return getItemBind(item, (value) => {
      if (typeof value === "number") {
        selectSecond(value);
      }
    });
  };

  const getMeridiemBind = (item: TimePanelItem) => {
    return getItemBind(item, (value) => {
      if (value === "AM" || value === "PM") {
        selectMeridiem(value);
      }
    });
  };

  const showMeridiem = computed(() => {
    return Boolean(merged.value.ampm);
  });

  const showSeconds = computed(() => {
    return Boolean(merged.value.showSeconds);
  });

  return {
    merged,
    rootBind,
    hourItems,
    columnBind,
    getHourBind,
    minuteItems,
    secondItems,
    displayDate,
    showSeconds,
    showMeridiem,
    getMinuteBind,
    getSecondBind,
    meridiemItems,
    getMeridiemBind,
  };
}
