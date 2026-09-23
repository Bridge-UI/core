/**
 * date-fns adapter (`TDate = Date`). Wire via `BridgeUIProvider` / `createBridgeUI`
 * `global.dates`. Requires the optional `date-fns` peer. For IANA zones, prefer
 * Luxon or Day.js.
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
    now() {
      return new Date();
    },

    setLocale(next) {
      locale = next;
    },

    getDay(date) {
      return getDay(date);
    },

    setTimeZone(next) {
      timeZone = next;
    },

    getDate(date) {
      return getDate(date);
    },

    getYear(date) {
      return getYear(date);
    },

    getMonth(date) {
      return getMonth(date);
    },

    getHours(date) {
      return getHours(date);
    },

    isSameDay(a, b) {
      return isSameDay(a, b);
    },

    getMinutes(date) {
      return getMinutes(date);
    },

    getSeconds(date) {
      return getSeconds(date);
    },

    isSameYear(a, b) {
      return isSameYear(a, b);
    },

    startOfDay(date) {
      return startOfDay(date);
    },

    endOfMonth(date) {
      return endOfMonth(date);
    },

    isSameMonth(a, b) {
      return isSameMonth(a, b);
    },

    startOfMonth(date) {
      return startOfMonth(date);
    },

    setDate(date, day) {
      return setDate(date, day);
    },

    setYear(date, year) {
      return setYear(date, year);
    },

    setMonth(date, month) {
      return setMonth(date, month);
    },

    addDays(date, amount) {
      return addDays(date, amount);
    },

    addYears(date, amount) {
      return addYears(date, amount);
    },

    addMonths(date, amount) {
      return addMonths(date, amount);
    },

    isAfter(a, b) {
      return isAfter(startOfDay(a), startOfDay(b));
    },

    isBefore(a, b) {
      return isBefore(startOfDay(a), startOfDay(b));
    },

    setHours(date, hours) {
      return setHours(date, clamp(hours, 0, 23));
    },

    setMinutes(date, minutes) {
      return setMinutes(date, clamp(minutes, 0, 59));
    },

    setSeconds(date, seconds) {
      return setSeconds(date, clamp(seconds, 0, 59));
    },

    parseTime(value, timeZone, timeOptions) {
      return parseTimeWithDateFns({
        value,
        adapter,
        timeZone,
        timeOptions,
      });
    },

    isSameTime(a, b) {
      return (
        getHours(a) === getHours(b) &&
        getMinutes(a) === getMinutes(b) &&
        getSeconds(a) === getSeconds(b)
      );
    },

    getMonthNames() {
      const locale = resolveLocale();

      return range(12).map((month) => {
        return new Intl.DateTimeFormat(locale, { month: "long" }).format(
          new Date(2021, month, 1),
        );
      });
    },

    getWeekdayNames() {
      const locale = resolveLocale();
      const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
      const sunday = new Date(2021, 0, 3);

      return range(7).map((index) => {
        const day = new Date(sunday);

        day.setDate(sunday.getDate() + index);

        return formatter.format(day);
      });
    },

    parse(value) {
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

    getCalendarDays(view, startOfWeek, timeZone) {
      const monthStart = adapter.startOfMonth(view, timeZone);
      const weekday = adapter.getDay(monthStart, timeZone);
      const normalizedStart = ((startOfWeek % 7) + 7) % 7;
      const leading = (weekday - normalizedStart + 7) % 7;
      const gridStart = adapter.addDays(monthStart, -leading, timeZone);

      return range(42).map((index) => {
        return adapter.addDays(gridStart, index, timeZone);
      });
    },

    formatTime(date, timeZone, timeOptions) {
      if (!isValidDate(date)) {
        return "";
      }

      const locale = resolveLocale();
      const zone = resolveTimeZone(timeZone);
      const ampm = timeOptions?.ampm === true;
      const showSeconds = timeOptions?.showSeconds === true;

      return new Intl.DateTimeFormat(locale, {
        hour12: ampm,
        timeZone: zone,
        hour: "2-digit",
        minute: "2-digit",
        ...(showSeconds ? { second: "2-digit" as const } : {}),
      }).format(date);
    },

    format(date, timeZone, options) {
      if (!isValidDate(date)) {
        return "";
      }

      const locale = resolveLocale();
      const zone = resolveTimeZone(timeZone);
      const granularity = options?.granularity ?? "day";

      if (granularity === "year") {
        return new Intl.DateTimeFormat(locale, {
          timeZone: zone,
          year: "numeric",
        }).format(date);
      }

      if (granularity === "month") {
        return new Intl.DateTimeFormat(locale, {
          month: "long",
          timeZone: zone,
          year: "numeric",
        }).format(date);
      }

      if (!isNil(zone) || !isNil(locale)) {
        return new Intl.DateTimeFormat(locale, {
          timeZone: zone,
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
  const { value, adapter, timeZone, timeOptions } = input;

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
  const parsed = parse(trimmed, pattern, adapter.now(timeZone));

  if (!isValid(parsed)) {
    return null;
  }

  const base = adapter.now(timeZone);

  return setSeconds(
    setMinutes(setHours(base, getHours(parsed)), getMinutes(parsed)),
    showSeconds ? getSeconds(parsed) : 0,
  );
}
