// ** External Imports
import {
  clamp,
  forEach,
  isArray,
  isFunction,
  isNil,
  isNumber,
  range,
} from "es-toolkit/compat";

// ** Local Imports
import type { DateAdapter, DateAdapterContext } from "@/Adapters/date";

/**
 * Public time-of-day value for TimePicker / TimeField (`Date` wall clock).
 */
export type TimeValue<TDate = Date> = TDate;

/**
 * Minute step used when building minute columns.
 */
export type TimeInterval = number;

/**
 * Input for disabling specific times.
 */
export type DisableTimesInput<TDate = Date> =
  null | TDate[] | undefined | ((date: TDate) => boolean);

/**
 * Options for {@link isTimeDisabled}.
 */
export type IsTimeDisabledOptions<TDate = Date> = {
  adapter: DateAdapter<TDate>;
  context?: DateAdapterContext;
  disableTimes?: DisableTimesInput<TDate>;
  maxTime?: TDate;
  minTime?: TDate;
};

/**
 * Builds hour option values (`0`–`23`, or `1`–`12` when `ampm`).
 */
export function buildHourOptions(options: { ampm?: boolean } = {}): number[] {
  if (options.ampm === true) {
    return range(1, 13);
  }

  return range(0, 24);
}

/**
 * Builds minute option values stepped by `interval`.
 */
export function buildMinuteOptions(
  options: {
    interval?: TimeInterval;
  } = {},
): number[] {
  const interval = Math.max(1, options.interval ?? 1);

  return range(0, 60, interval);
}

/**
 * Converts a 12-hour clock hour + meridiem into `0`–`23`.
 */
export function to24Hour(hour12: number, meridiem: "AM" | "PM"): number {
  if (meridiem === "AM") {
    return hour12 === 12 ? 0 : hour12;
  }

  return hour12 === 12 ? 12 : hour12 + 12;
}

/**
 * Converts a 24-hour value into a 12-hour clock hour (`1`–`12`).
 */
export function to12Hour(hours24: number): number {
  const mod = hours24 % 12;

  return mod === 0 ? 12 : mod;
}

/**
 * Returns `"AM"` or `"PM"` for a 24-hour value.
 */
export function toMeridiem(hours24: number): "AM" | "PM" {
  return hours24 < 12 ? "AM" : "PM";
}

/**
 * Minutes since midnight for comparison within a day.
 */
export function timeToMinutes<TDate>(
  value: TDate,
  adapter: DateAdapter<TDate>,
  context?: DateAdapterContext,
): number {
  return (
    adapter.getHours(value, context) * 60 + adapter.getMinutes(value, context)
  );
}

/**
 * Whether `candidate` is disabled by min/max/disableTimes (minute precision).
 */
export function isTimeDisabled<TDate>(
  candidate: TDate,
  options: IsTimeDisabledOptions<TDate>,
): boolean {
  const { adapter, context, minTime, maxTime, disableTimes } = options;
  const minutes = timeToMinutes(candidate, adapter, context);

  if (!isNil(minTime) && minutes < timeToMinutes(minTime, adapter, context)) {
    return true;
  }

  if (!isNil(maxTime) && minutes > timeToMinutes(maxTime, adapter, context)) {
    return true;
  }

  if (isNil(disableTimes)) {
    return false;
  }

  if (isFunction(disableTimes)) {
    return disableTimes(candidate);
  }

  if (isArray(disableTimes)) {
    return disableTimes.some((entry) => {
      return adapter.isSameTime(candidate, entry, context);
    });
  }

  return false;
}

/**
 * Snaps minutes to the nearest `interval` step (down).
 */
export function snapMinutes(minutes: number, interval: TimeInterval): number {
  const step = Math.max(1, interval);

  if (!isNumber(minutes)) {
    return 0;
  }

  return Math.floor(minutes / step) * step;
}

/**
 * Normalizes a time value onto `base` calendar day with snapped minutes.
 */
export function normalizeTimeValue<TDate>(
  value: null | TDate | undefined,
  options: {
    adapter: DateAdapter<TDate>;
    ampm?: boolean;
    base?: TDate;
    context?: DateAdapterContext;
    interval?: TimeInterval;
  },
): null | TDate {
  const { adapter, context, interval = 1 } = options;

  if (isNil(value)) {
    return null;
  }

  const base = options.base ?? adapter.now(context);
  const hours = adapter.getHours(value, context);
  const minutes = snapMinutes(adapter.getMinutes(value, context), interval);
  let next = adapter.setHours(base, hours, context);

  next = adapter.setMinutes(next, minutes, context);

  return next;
}

/**
 * Merges the calendar day from `datePart` with the hour/minute from `timePart`.
 */
export function combineDateAndTime<TDate>(
  datePart: TDate,
  timePart: TDate,
  adapter: DateAdapter<TDate>,
  context?: DateAdapterContext,
): TDate {
  const hours = adapter.getHours(timePart, context);
  const minutes = adapter.getMinutes(timePart, context);
  let next = adapter.setHours(datePart, hours, context);

  next = adapter.setMinutes(next, minutes, context);

  return next;
}

/**
 * Inclusive time-of-day range tuple (`[start, end]`).
 */
export type TimeRangeValue<TDate = Date> = [TDate, TDate];

/**
 * Sorts a time range so the earlier wall-clock time comes first.
 */
export function sortTimeRangeValue<TDate>(
  value: TimeRangeValue<TDate>,
  adapter: DateAdapter<TDate>,
  context?: DateAdapterContext,
): TimeRangeValue<TDate> {
  const [start, end] = value;

  if (
    timeToMinutes(start, adapter, context) <=
    timeToMinutes(end, adapter, context)
  ) {
    return value;
  }

  return [end, start];
}

/**
 * Whether `value` is a two-element time range tuple.
 */
export function isTimeRangeValue<TDate>(
  value: unknown,
): value is TimeRangeValue<TDate> {
  return isArray(value) && value.length === 2;
}

/**
 * Centers `[aria-pressed="true"]` tiles in their overflow columns.
 * Uses bounding rects so ancestors with `position: absolute` (DateTime shells)
 * do not break `offsetTop` math.
 */
export function scrollSelectedTimeItemsIntoView(root: HTMLElement) {
  forEach(root.querySelectorAll<HTMLElement>('[aria-pressed="true"]'), (el) => {
    const column = el.parentElement;

    if (!column || column.clientHeight <= 0) {
      return;
    }

    const elementRect = el.getBoundingClientRect();
    const columnRect = column.getBoundingClientRect();

    const columnCenter = columnRect.top + column.clientHeight / 2;
    const elementCenter = elementRect.top + elementRect.height / 2;
    const nextScrollTop = column.scrollTop + (elementCenter - columnCenter);

    column.scrollTop = clamp(
      nextScrollTop,
      0,
      Math.max(0, column.scrollHeight - column.clientHeight),
    );
  });
}

/**
 * Scrolls selected TimePanel tiles into view and re-syncs when the root or
 * columns resize (e.g. DateTime `h-full` resolving after the first paint).
 * Returns a disconnect callback.
 */
export function observeTimePanelSelectedScroll(root: HTMLElement): () => void {
  const syncScroll = () => {
    scrollSelectedTimeItemsIntoView(root);
  };

  syncScroll();

  const observer = new ResizeObserver(syncScroll);

  observer.observe(root);
  forEach(root.children, (column) => {
    observer.observe(column);
  });

  return () => {
    observer.disconnect();
  };
}
