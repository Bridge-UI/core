/**
 * Example date-fns date adapter for `@bridge-ui/react`.
 * Copy into your app or wire via `BridgeUIProvider` `global.dates`.
 * Not published as an npm package.
 *
 * Requires `date-fns`. Values stay as native `Date` (date-fns default).
 * For IANA zones, prefer the Luxon or Day.js samples.
 */

// ** External Imports
import {
  addDays,
  addMonths,
  addYears,
  endOfMonth,
  format as formatDate,
  getDate,
  getDay,
  getHours,
  getMinutes,
  getMonth,
  getSeconds,
  getYear,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isSameYear,
  isValid,
  parse,
  parseISO,
  setDate,
  setHours,
  setMinutes,
  setMonth,
  setSeconds,
  setYear,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { clamp, isNil, isString, range } from "es-toolkit/compat";

// ** Core Imports
import type {
  DateAdapter,
  DateAdapterContext,
  DateAdapterTimeOptions,
} from "@bridge-ui/core/Adapters";

/**
 * Options for {@link createDateFnsDateAdapter}.
 */
export type DateFnsDateAdapterOptions = {
  /**
   * Default locale when context omits `locale`.
   *
   * @default undefined
   */
  locale?: string;

  /**
   * Default IANA time zone when context omits `timeZone`.
   * Used for `format` / `formatTime` via `Intl` (date-fns itself is local).
   *
   * @default undefined
   */
  timeZone?: string;
};

/**
 * Builds a date-fns-backed {@link DateAdapter} (`TDate = Date`) for Bridge calendars.
 */
export function createDateFnsDateAdapter(
  options: DateFnsDateAdapterOptions = {},
): DateAdapter<Date> {
  const resolveLocale = (context?: DateAdapterContext) => {
    return context?.locale ?? options.locale;
  };

  const resolveTimeZone = (context?: DateAdapterContext) => {
    return context?.timeZone ?? options.timeZone;
  };

  const isValidDate = (date: Date) => {
    return date instanceof Date && isValid(date);
  };

  const adapter: DateAdapter<Date> = {
    now: () => new Date(),

    getDay: (date) => getDay(date),

    getDate: (date) => getDate(date),

    getYear: (date) => getYear(date),

    getMonth: (date) => getMonth(date),

    getHours: (date) => getHours(date),

    isSameDay: (a, b) => isSameDay(a, b),

    getMinutes: (date) => getMinutes(date),

    getSeconds: (date) => getSeconds(date),

    isSameYear: (a, b) => isSameYear(a, b),

    startOfDay: (date) => startOfDay(date),

    endOfMonth: (date) => endOfMonth(date),

    isSameMonth: (a, b) => isSameMonth(a, b),

    startOfMonth: (date) => startOfMonth(date),

    setDate: (date, day) => setDate(date, day),

    setYear: (date, year) => setYear(date, year),

    setMonth: (date, month) => setMonth(date, month),

    addDays: (date, amount) => addDays(date, amount),

    addYears: (date, amount) => addYears(date, amount),

    addMonths: (date, amount) => addMonths(date, amount),

    isAfter: (a, b) => isAfter(startOfDay(a), startOfDay(b)),

    isBefore: (a, b) => isBefore(startOfDay(a), startOfDay(b)),

    setHours: (date, hours) => setHours(date, clamp(hours, 0, 23)),

    setMinutes: (date, minutes) => setMinutes(date, clamp(minutes, 0, 59)),

    setSeconds: (date, seconds) => setSeconds(date, clamp(seconds, 0, 59)),

    parseTime: (value, context, timeOptions) => {
      return parseTimeWithDateFns({
        value,
        adapter,
        context,
        timeOptions,
      });
    },

    isSameTime: (a, b) => {
      return (
        getHours(a) === getHours(b) &&
        getMinutes(a) === getMinutes(b) &&
        getSeconds(a) === getSeconds(b)
      );
    },

    getMonthNames: (context) => {
      const locale = resolveLocale(context);

      return range(12).map((month) => {
        return new Intl.DateTimeFormat(locale, { month: "long" }).format(
          new Date(2021, month, 1),
        );
      });
    },

    getWeekdayNames: (context) => {
      const locale = resolveLocale(context);
      const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
      const sunday = new Date(2021, 0, 3);

      return range(7).map((index) => {
        const day = new Date(sunday);

        day.setDate(sunday.getDate() + index);

        return formatter.format(day);
      });
    },

    parse: (value) => {
      if (!isString(value) || value.trim() === "") {
        return null;
      }

      const trimmed = value.trim();
      const iso = parseISO(trimmed);

      if (isValid(iso) && /^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
        return startOfDay(iso);
      }

      const parsed = new Date(trimmed);

      return isValidDate(parsed) ? startOfDay(parsed) : null;
    },

    format: (date, context) => {
      if (!isValidDate(date)) {
        return "";
      }

      const locale = resolveLocale(context);
      const timeZone = resolveTimeZone(context);

      if (!isNil(timeZone) || !isNil(locale)) {
        return new Intl.DateTimeFormat(locale, {
          timeZone,
          day: "2-digit",
          year: "numeric",
          month: "2-digit",
        }).format(date);
      }

      return formatDate(date, "P");
    },

    getCalendarDays: (view, startOfWeek, context) => {
      const monthStart = adapter.startOfMonth(view, context);
      const weekday = adapter.getDay(monthStart, context);
      const normalizedStart = ((startOfWeek % 7) + 7) % 7;
      const leading = (weekday - normalizedStart + 7) % 7;
      const gridStart = adapter.addDays(monthStart, -leading, context);

      return range(42).map((index) => {
        return adapter.addDays(gridStart, index, context);
      });
    },

    formatTime: (date, context, timeOptions) => {
      if (!isValidDate(date)) {
        return "";
      }

      const locale = resolveLocale(context);
      const timeZone = resolveTimeZone(context);
      const ampm = timeOptions?.ampm === true;
      const showSeconds = timeOptions?.showSeconds === true;

      return new Intl.DateTimeFormat(locale, {
        timeZone,
        hour12: ampm,
        hour: "2-digit",
        minute: "2-digit",
        ...(showSeconds ? { second: "2-digit" as const } : {}),
      }).format(date);
    },
  };

  return adapter;
}

function parseTimeWithDateFns(input: {
  adapter: DateAdapter<Date>;
  context?: DateAdapterContext;
  timeOptions?: DateAdapterTimeOptions;
  value: string;
}): Date | null {
  const { value, adapter, context, timeOptions } = input;

  if (!isString(value) || value.trim() === "") {
    return null;
  }

  const trimmed = value.trim();
  const ampm = timeOptions?.ampm === true;
  const showSeconds = timeOptions?.showSeconds === true;
  const pattern = ampm
    ? showSeconds
      ? "h:mm:ss a"
      : "h:mm a"
    : showSeconds
      ? "H:mm:ss"
      : "H:mm";
  const parsed = parse(trimmed, pattern, adapter.now(context));

  if (!isValid(parsed)) {
    return null;
  }

  const base = adapter.now(context);

  return setSeconds(
    setMinutes(setHours(base, getHours(parsed)), getMinutes(parsed)),
    showSeconds ? getSeconds(parsed) : 0,
  );
}
