// ** External Imports
import { isArray, isNil, padStart } from "es-toolkit/compat";

// ** Local Imports
import type { DateAdapter } from "@/Adapters/date";
import type { CalendarGranularity } from "@/Domain/date";

/**
 * A value, a list of values (multiple / range), or nothing.
 */
type FormValueModel<T> = T | null | undefined | readonly T[];

/**
 * Options for {@link toTimeFormValues} / {@link toDateTimeFormValues}.
 */
export type TimeFormValueOptions = {
  /**
   * Appends `:ss` to the wall-clock time.
   */
  showSeconds?: boolean;

  /**
   * IANA zone the wall-clock parts are read in.
   */
  timeZone?: string;
};

/**
 * Options for {@link toDateFormValues}.
 */
export type DateFormValueOptions = {
  /**
   * `day` → `YYYY-MM-DD`, `month` → `YYYY-MM`, `year` → `YYYY`.
   */
  granularity?: CalendarGranularity;

  /**
   * IANA zone the calendar day is read in.
   */
  timeZone?: string;
};

/**
 * Normalizes a single / list / empty model into a list.
 */
function toList<T>(model: FormValueModel<T>): readonly T[] {
  if (isNil(model)) {
    return [];
  }

  return isArray(model) ? (model as readonly T[]) : [model as T];
}

/**
 * Zero-pads a date or time part (`5` → `"05"`).
 */
function pad(value: number, length = 2): string {
  return padStart(String(value), length, "0");
}

/**
 * Reads the calendar parts through the adapter so any date library works.
 */
function formatDatePart<TDate>(
  adapter: DateAdapter<TDate>,
  date: TDate,
  options: DateFormValueOptions,
): string {
  const { timeZone, granularity = "day" } = options;

  const year = pad(adapter.getYear(date, timeZone), 4);

  if (granularity === "year") {
    return year;
  }

  const month = pad(adapter.getMonth(date, timeZone) + 1);

  if (granularity === "month") {
    return `${year}-${month}`;
  }

  return `${year}-${month}-${pad(adapter.getDate(date, timeZone))}`;
}

/**
 * Reads the wall-clock parts through the adapter in the given zone.
 */
function formatTimePart<TDate>(
  adapter: DateAdapter<TDate>,
  date: TDate,
  options: TimeFormValueOptions,
): string {
  const { timeZone, showSeconds } = options;

  const time = `${pad(adapter.getHours(date, timeZone))}:${pad(adapter.getMinutes(date, timeZone))}`;

  return showSeconds
    ? `${time}:${pad(adapter.getSeconds(date, timeZone))}`
    : time;
}

/**
 * Serializes dates the way `<input type="date">` (or `month`) submits them.
 * Ranges and multiple selections yield one entry per date.
 */
export function toDateFormValues<TDate>(
  adapter: DateAdapter<TDate>,
  model: FormValueModel<TDate>,
  options: DateFormValueOptions = {},
): string[] {
  return toList(model).map((date) => {
    return formatDatePart(adapter, date, options);
  });
}

/**
 * Serializes times the way `<input type="time">` submits them (`HH:mm[:ss]`).
 * Ranges yield one entry per time.
 */
export function toTimeFormValues<TDate>(
  adapter: DateAdapter<TDate>,
  model: FormValueModel<TDate>,
  options: TimeFormValueOptions = {},
): string[] {
  return toList(model).map((date) => {
    return formatTimePart(adapter, date, options);
  });
}

/**
 * Serializes date-times the way `<input type="datetime-local">` submits them
 * (`YYYY-MM-DDTHH:mm[:ss]`). Ranges yield one entry per date-time.
 */
export function toDateTimeFormValues<TDate>(
  adapter: DateAdapter<TDate>,
  model: FormValueModel<TDate>,
  options: TimeFormValueOptions = {},
): string[] {
  return toList(model).map((date) => {
    const day = formatDatePart(adapter, date, { timeZone: options.timeZone });

    return `${day}T${formatTimePart(adapter, date, options)}`;
  });
}
