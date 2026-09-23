/**
 * Luxon adapter (`TDate = Date`). Wire via `BridgeUIProvider` `global.dates`.
 * Requires the optional `luxon` peer. IANA zones via `DateTime.setZone`.
 */

// ** External Imports
import { clamp, isNil, isString, range } from "es-toolkit/compat";
import { DateTime, Info } from "luxon";

// ** Core Imports
import type {
  DateAdapter,
  DateAdapterTimeOptions,
} from "@bridge-ui/core/Adapters";

/**
 * Builds a Luxon-backed {@link DateAdapter} (`TDate = Date`) for Bridge calendars.
 * Locale and default IANA zone start unset until {@link DateAdapter.setLocale} /
 * {@link DateAdapter.setTimeZone}.
 */
export function createLuxonDateAdapter(): DateAdapter<Date> {
  let locale: string | undefined;
  let timeZone: string | undefined;

  const resolveLocale = () => locale;

  const resolveZone = (override?: string) => override ?? timeZone;

  const toDateTime = (date: Date, zone?: string): DateTime => {
    const locale = resolveLocale();
    const resolvedZone = resolveZone(zone);
    let value = DateTime.fromJSDate(date);

    if (!isNil(resolvedZone)) {
      value = value.setZone(resolvedZone);
    }

    if (!isNil(locale)) {
      value = value.setLocale(locale);
    }

    return value;
  };

  const fromDateTime = (value: DateTime): Date => {
    return value.toJSDate();
  };

  const isValid = (date: Date) => {
    return date instanceof Date && !Number.isNaN(date.getTime());
  };

  const adapter: DateAdapter<Date> = {
    setLocale(next) {
      locale = next;
    },

    setTimeZone(next) {
      timeZone = next;
    },

    getDate(date, timeZone) {
      return toDateTime(date, timeZone).day;
    },

    getYear(date, timeZone) {
      return toDateTime(date, timeZone).year;
    },

    getHours(date, timeZone) {
      return toDateTime(date, timeZone).hour;
    },

    isAfter(a, b, timeZone) {
      return adapter.isBefore(b, a, timeZone);
    },

    getMinutes(date, timeZone) {
      return toDateTime(date, timeZone).minute;
    },

    getSeconds(date, timeZone) {
      return toDateTime(date, timeZone).second;
    },

    getMonth(date, timeZone) {
      return toDateTime(date, timeZone).month - 1;
    },

    getDay(date, timeZone) {
      return toDateTime(date, timeZone).weekday % 7;
    },

    startOfDay(date, timeZone) {
      return fromDateTime(toDateTime(date, timeZone).startOf("day"));
    },

    setDate(date, day, timeZone) {
      return fromDateTime(toDateTime(date, timeZone).set({ day }));
    },

    setYear(date, year, timeZone) {
      return fromDateTime(toDateTime(date, timeZone).set({ year }));
    },

    startOfMonth(date, timeZone) {
      return fromDateTime(toDateTime(date, timeZone).startOf("month"));
    },

    isSameDay(a, b, timeZone) {
      return toDateTime(a, timeZone).hasSame(toDateTime(b, timeZone), "day");
    },

    isSameYear(a, b, timeZone) {
      return toDateTime(a, timeZone).hasSame(toDateTime(b, timeZone), "year");
    },

    isSameMonth(a, b, timeZone) {
      return toDateTime(a, timeZone).hasSame(toDateTime(b, timeZone), "month");
    },

    addDays(date, amount, timeZone) {
      return fromDateTime(toDateTime(date, timeZone).plus({ days: amount }));
    },

    addYears(date, amount, timeZone) {
      return fromDateTime(toDateTime(date, timeZone).plus({ years: amount }));
    },

    getMonthNames() {
      const locale = resolveLocale() ?? "en-US";

      return Info.months("long", { locale });
    },

    setMonth(date, month, timeZone) {
      return fromDateTime(toDateTime(date, timeZone).set({ month: month + 1 }));
    },

    addMonths(date, amount, timeZone) {
      return fromDateTime(toDateTime(date, timeZone).plus({ months: amount }));
    },

    endOfMonth(date, timeZone) {
      return fromDateTime(
        toDateTime(date, timeZone).endOf("month").startOf("second"),
      );
    },

    setHours(date, hours, timeZone) {
      return fromDateTime(
        toDateTime(date, timeZone).set({ hour: clamp(hours, 0, 23) }),
      );
    },

    isBefore(a, b, timeZone) {
      return (
        toDateTime(a, timeZone).startOf("day") <
        toDateTime(b, timeZone).startOf("day")
      );
    },

    setMinutes(date, minutes, timeZone) {
      return fromDateTime(
        toDateTime(date, timeZone).set({ minute: clamp(minutes, 0, 59) }),
      );
    },

    setSeconds(date, seconds, timeZone) {
      return fromDateTime(
        toDateTime(date, timeZone).set({ second: clamp(seconds, 0, 59) }),
      );
    },

    parseTime(value, timeZone, timeOptions) {
      return parseTimeWithLuxon({
        value,
        adapter,
        timeZone,
        toDateTime,
        timeOptions,
        fromDateTime,
      });
    },

    getWeekdayNames() {
      const locale = resolveLocale() ?? "en-US";
      // Luxon weekdays are Monday-first; Bridge expects Sunday → Saturday.
      const names = Info.weekdays("short", { locale });

      return [names[6]!, ...names.slice(0, 6)];
    },

    isSameTime(a, b, timeZone) {
      const left = toDateTime(a, timeZone);
      const right = toDateTime(b, timeZone);

      return (
        left.hour === right.hour &&
        left.minute === right.minute &&
        left.second === right.second
      );
    },

    now(timeZone) {
      const zone = resolveZone(timeZone);
      const locale = resolveLocale();
      let value: DateTime = DateTime.now();

      if (!isNil(zone)) {
        value = value.setZone(zone);
      }

      if (!isNil(locale)) {
        value = value.setLocale(locale);
      }

      return fromDateTime(value);
    },

    formatTime(date, timeZone, timeOptions) {
      if (!isValid(date)) {
        return "";
      }

      const ampm = timeOptions?.ampm === true;
      const showSeconds = timeOptions?.showSeconds === true;

      return toDateTime(date, timeZone).toLocaleString({
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: ampm ? "h12" : "h23",
        ...(showSeconds ? { second: "2-digit" as const } : {}),
      });
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

    parse(value, timeZone) {
      if (!isString(value) || value.trim() === "") {
        return null;
      }

      const trimmed = value.trim();
      const iso = DateTime.fromISO(trimmed, {
        locale: resolveLocale(),
        zone: resolveZone(timeZone),
      });

      if (iso.isValid) {
        return fromDateTime(iso.startOf("day"));
      }

      const parsed = DateTime.fromJSDate(new Date(trimmed), {
        zone: resolveZone(timeZone),
      });

      if (!parsed.isValid) {
        return null;
      }

      return fromDateTime(parsed.startOf("day"));
    },

    format(date, timeZone, options) {
      if (!isValid(date)) {
        return "";
      }

      const granularity = options?.granularity ?? "day";

      if (granularity === "year") {
        return toDateTime(date, timeZone).toLocaleString({ year: "numeric" });
      }

      if (granularity === "month") {
        return toDateTime(date, timeZone).toLocaleString({
          month: "long",
          year: "numeric",
        });
      }

      return toDateTime(date, timeZone).toLocaleString({
        day: "2-digit",
        year: "numeric",
        month: "2-digit",
      });
    },
  };

  return adapter;
}

function parseTimeWithLuxon(input: {
  adapter: DateAdapter<Date>;
  fromDateTime: (value: DateTime) => Date;
  timeOptions?: DateAdapterTimeOptions;
  timeZone?: string;
  toDateTime: (date: Date, timeZone?: string) => DateTime;
  value: string;
}): Date | null {
  const { value, adapter, timeZone, toDateTime, timeOptions, fromDateTime } =
    input;

  if (!isString(value) || value.trim() === "") {
    return null;
  }

  const trimmed = value.trim();
  const ampm = timeOptions?.ampm === true;
  const showSeconds = timeOptions?.showSeconds === true;
  const format = ampm
    ? showSeconds
      ? "h:mm:ss a"
      : "h:mm a"
    : showSeconds
      ? "H:mm:ss"
      : "H:mm";
  const parsed = DateTime.fromFormat(trimmed, format, { locale: "en-US" });

  if (!parsed.isValid) {
    return null;
  }

  const base = toDateTime(adapter.now(timeZone), timeZone);

  return fromDateTime(
    base.set({
      millisecond: 0,
      hour: parsed.hour,
      minute: parsed.minute,
      second: showSeconds ? parsed.second : 0,
    }),
  );
}
