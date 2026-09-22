/**
 * date-fns adapter (`TDate = Date`). Wire via `BridgeUIProvider` `global.dates`.
 * Requires the optional `date-fns` peer. For IANA zones, prefer Luxon or Day.js.
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
  DateAdapterTimeOptions,
} from "@bridge-ui/core/Adapters";

/**
 * Builds a date-fns-backed {@link DateAdapter} (`TDate = Date`) for Bridge calendars.
 * Locale and default IANA zone start unset until {@link DateAdapter.setLocale} /
 * {@link DateAdapter.setTimeZone}.
 */
export function createDateFnsDateAdapter(): DateAdapter<Date> {
  let locale: string | undefined;
  let timeZone: string | undefined;

  const resolveLocale = () => locale;

  const resolveTimeZone = (override?: string) => override ?? timeZone;

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

    setLocale: (next) => {
      locale = next;
    },

    addYears: (date, amount) => addYears(date, amount),

    addMonths: (date, amount) => addMonths(date, amount),

    setTimeZone: (next) => {
      timeZone = next;
    },

    isAfter: (a, b) => isAfter(startOfDay(a), startOfDay(b)),

    isBefore: (a, b) => isBefore(startOfDay(a), startOfDay(b)),

    setHours: (date, hours) => setHours(date, clamp(hours, 0, 23)),

    setMinutes: (date, minutes) => setMinutes(date, clamp(minutes, 0, 59)),

    setSeconds: (date, seconds) => setSeconds(date, clamp(seconds, 0, 59)),

    isSameTime: (a, b) => {
      return (
        getHours(a) === getHours(b) &&
        getMinutes(a) === getMinutes(b) &&
        getSeconds(a) === getSeconds(b)
      );
    },

    parseTime: (value, context, timeOptions) => {
      return parseTimeWithDateFns({
        value,
        adapter,
        timeOptions,
        timeZone: context,
      });
    },

    getMonthNames: () => {
      const locale = resolveLocale();

      return range(12).map((month) => {
        return new Intl.DateTimeFormat(locale, { month: "long" }).format(
          new Date(2021, month, 1),
        );
      });
    },

    getWeekdayNames: () => {
      const locale = resolveLocale();
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

      const locale = resolveLocale();
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

    format: (date, context, options) => {
      if (!isValidDate(date)) {
        return "";
      }

      const locale = resolveLocale();
      const timeZone = resolveTimeZone(context);
      const granularity = options?.granularity ?? "day";

      if (granularity === "year") {
        return new Intl.DateTimeFormat(locale, {
          timeZone,
          year: "numeric",
        }).format(date);
      }

      if (granularity === "month") {
        return new Intl.DateTimeFormat(locale, {
          timeZone,
          month: "long",
          year: "numeric",
        }).format(date);
      }

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
  };

  return adapter;
}

function parseTimeWithDateFns(input: {
  adapter: DateAdapter<Date>;
  timeOptions?: DateAdapterTimeOptions;
  timeZone?: string;
  value: string;
}): Date | null {
  const { value, adapter, timeOptions, timeZone: context } = input;

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
